import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
        @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    ) { }

    async follow(followerUserId: string, targetUsername: string): Promise<any> {
        const targetProfile = await this.findByUsername(targetUsername);
        const followingId = targetProfile.userId;

        if (followerUserId === followingId.toString()) {
            throw new ConflictException('You cannot follow yourself');
        }

        const existingFollow = await this.followModel.findOne({
            followerId: followerUserId,
            followingId: followingId
        });

        if (existingFollow) {
            throw new ConflictException('Already following this user');
        }

        const newFollow = new this.followModel({
            followerId: followerUserId,
            followingId: followingId,
        });

        await newFollow.save();

        // Update stats
        await this.profileModel.updateOne({ userId: followerUserId }, { $inc: { 'stats.followingCount': 1 } });
        await this.profileModel.updateOne({ userId: followingId }, { $inc: { 'stats.followersCount': 1 } });

        return { message: `Successfully followed ${targetUsername}` };
    }

    async unfollow(followerUserId: string, targetUsername: string): Promise<any> {
        const targetProfile = await this.findByUsername(targetUsername);
        const followingId = targetProfile.userId;

        const result = await this.followModel.findOneAndDelete({
            followerId: followerUserId,
            followingId: followingId
        });

        if (!result) {
            throw new ConflictException('You are not following this user');
        }

        // Update stats
        await this.profileModel.updateOne({ userId: followerUserId }, { $inc: { 'stats.followingCount': -1 } });
        await this.profileModel.updateOne({ userId: followingId }, { $inc: { 'stats.followersCount': -1 } });

        return { message: `Successfully unfollowed ${targetUsername}` };
    }

    async create(userId: string, createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
        const existingProfile = await this.profileModel.findOne({
            $or: [{ userId }, { username: createProfileDto.username }]
        });

        if (existingProfile) {
            throw new ConflictException('Profile already exists for this user or username is taken');
        }

        const newProfile = new this.profileModel({
            userId,
            ...createProfileDto,
        });

        return newProfile.save();
    }

    async findByUsername(username: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findOne({ username }).exec();
        if (!profile) {
            throw new NotFoundException(`Profile with username ${username} not found`);
        }
        return profile;
    }

    async findByUserId(userId: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findOne({ userId }).exec();
        if (!profile) {
            throw new NotFoundException(`Profile for user ID ${userId} not found`);
        }
        return profile;
    }

    async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileDocument> {
        const profile = await this.profileModel.findOneAndUpdate(
            { userId },
            { $set: updateProfileDto },
            { new: true }
        ).exec();

        if (!profile) {
            throw new NotFoundException(`Profile for user ID ${userId} not found`);
        }

        return profile;
    }

    async getSuggestions(userId: string): Promise<ProfileDocument[]> {
        // Basic suggestion logic: random profiles or profiles with similar interests/location
        // For now, return some random profiles
        return this.profileModel.find({ userId: { $ne: userId } }).limit(5).exec();
    }

    async search(query: string): Promise<ProfileDocument[]> {
        return this.profileModel.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { displayName: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } },
            ],
        }).limit(20).exec();
    }

    async verify(username: string, badgeType: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findOneAndUpdate(
            { username },
            { $addToSet: { badges: badgeType }, $set: { type: this.getTypeFromBadge(badgeType) } },
            { new: true }
        ).exec();

        if (!profile) {
            throw new NotFoundException(`Profile with username ${username} not found`);
        }

        return profile;
    }

    async generateBio(userId: string, keywords: string[]): Promise<string> {
        // AI Logic would go here (e.g., calling OpenAI or a local LLM)
        const profile = await this.findByUserId(userId);
        return `Passionate ${profile.type} from ${profile.location?.city || 'the world'}. Interested in ${keywords.join(', ')}. Join my journey on FEMO SPACE! 🚀`;
    }

    async getProfileStrength(userId: string): Promise<{ score: number, suggestions: string[] }> {
        const profile = await this.findByUserId(userId);
        let score = 0;
        const suggestions: string[] = [];

        if (profile.bio) score += 20; else suggestions.push('Add a bio to your profile');
        if (profile.profileImage) score += 20; else suggestions.push('Upload a profile picture');
        if (profile.coverImage) score += 20; else suggestions.push('Add a cover photo');
        if (profile.location?.country) score += 20; else suggestions.push('Select your location');
        if (profile.featuredContent?.length > 0) score += 20; else suggestions.push('Feature some content on your profile');

        return { score, suggestions };
    }

    private getTypeFromBadge(badge: string): string {
        switch (badge) {
            case 'verified': return 'verified';
            case 'vip': return 'vip';
            case 'certified_creator': return 'creator';
            case 'official_business': return 'business';
            default: return 'personal';
        }
    }
}
