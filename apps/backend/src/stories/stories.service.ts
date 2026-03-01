import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Story, StoryDocument } from './schemas/story.schema';
import { StoryHighlight, StoryHighlightDocument } from './schemas/story-highlight.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class StoriesService {
    private readonly MAX_VIDEO_DURATION_SECONDS = 15;

    constructor(
        @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
        @InjectModel(StoryHighlight.name) private highlightModel: Model<StoryHighlightDocument>,
        private usersService: UsersService,
    ) { }

    async create(userId: string, dto: CreateStoryDto): Promise<StoryDocument> {
        // Ownership check
        if (dto.ownerType === 'user' && dto.ownerId !== userId) {
            throw new ForbiddenException('Cannot create story for another user');
        }

        const user = await this.usersService.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        // Automatic content analysis
        const safetyLevel = this.analyzeContent(dto);

        // UPLOAD RESTRICTION (UNDER-18)
        if (user.isUnder18 && safetyLevel === 'restricted') {
            throw new ForbiddenException('This content is not allowed for your age');
        }

        // Validate video duration if it's a video
        if (dto.media && dto.media.type === 'video') {
            const duration = dto.media.duration || 0;
            if (duration > this.MAX_VIDEO_DURATION_SECONDS) {
                throw new BadRequestException(`Video duration must not exceed ${this.MAX_VIDEO_DURATION_SECONDS} seconds. Current duration: ${duration}s`);
            }
        }

        const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

        const createdStory = new this.storyModel({
            ...dto,
            ownerId: new Types.ObjectId(dto.ownerId),
            expiresAt,
            contentSafetyLevel: safetyLevel,
        });

        return createdStory.save();
    }

    private analyzeContent(dto: CreateStoryDto): 'safe' | 'restricted' {
        // MOCK ANALYSIS
        const storyCaption = dto.aiMetadata?.caption || '';
        const tags = dto.aiMetadata?.tags || [];
        const contentStr = (storyCaption + ' ' + tags.join(' ')).toLowerCase();

        const restrictedKeywords = ['adult', 'nsfw', 'porn', 'sexy', 'violence', 'blood', 'gamble'];
        const isRestricted = restrictedKeywords.some(keyword => contentStr.includes(keyword));

        return isRestricted ? 'restricted' : 'safe';
    }

    async getFeed(requesterId: string): Promise<any[]> {
        const now = new Date();
        const user = await this.usersService.findById(requesterId);
        const isMinor = user?.isUnder18 || false;

        // 1. Get all active stories
        const filter: any = {
            expiresAt: { $gt: now },
            isArchived: false,
            audience: 'public',
        };

        // ENFORCEMENT
        if (isMinor) {
            filter.contentSafetyLevel = 'safe';
        }

        const activeStories = await this.storyModel
            .find(filter)
            .sort({ createdAt: -1 })
            .populate('ownerId', 'profile.firstName profile.lastName profile.avatarUrl username')
            .exec();

        // 2. Group by ownerId
        const grouped: Record<string, any> = activeStories.reduce((acc: Record<string, any>, story) => {
            const ownerId = story.ownerId['_id'].toString();
            if (!acc[ownerId]) {
                acc[ownerId] = {
                    owner: story.ownerId,
                    stories: [],
                    hasUnseen: true, // We'd check this against a 'seen' collection
                };
            }
            acc[ownerId].stories.push(story);
            return acc;
        }, {});

        return Object.values(grouped);
    }

    async findById(id: string, requesterId?: string): Promise<StoryDocument> {
        const story = await this.storyModel.findById(id).exec();
        if (!story) throw new NotFoundException('Story not found');

        // Safety Block Check
        if (requesterId && story.contentSafetyLevel === 'restricted') {
            const user = await this.usersService.findById(requesterId);
            if (user?.isUnder18) {
                // Hard block: behave as if it does not exist
                throw new NotFoundException('Story not found');
            }
        }

        return story;
    }

    async delete(userId: string, id: string): Promise<any> {
        const story = await this.findById(id);
        if (story.ownerId.toString() !== userId) {
            throw new ForbiddenException('Not authorized to delete this story');
        }
        return this.storyModel.findByIdAndDelete(id).exec();
    }

    async react(userId: string, id: string, emoji: string) {
        const story = await this.findById(id);
        story.interactions.reactions.push({
            userId: new Types.ObjectId(userId),
            emoji,
            createdAt: new Date(),
        });
        return story.save();
    }

    async markAsViewed(userId: string, id: string) {
        const story = await this.findById(id);
        const userObjId = new Types.ObjectId(userId);

        if (!story.interactions.viewers.includes(userObjId)) {
            story.interactions.viewers.push(userObjId);
            story.interactions.viewsCount += 1;
            await story.save();
        }
        return { success: true };
    }

    // Highlights
    async createHighlight(userId: string, title: string, coverUrl: string, storyIds: string[]) {
        const highlight = new this.highlightModel({
            ownerId: new Types.ObjectId(userId),
            title,
            coverUrl,
            storyIds: storyIds.map(id => new Types.ObjectId(id)),
        });
        return highlight.save();
    }

    async getHighlights(ownerId: string) {
        return this.highlightModel.find({ ownerId: new Types.ObjectId(ownerId), isActive: true }).exec();
    }

    async getStoriesByUserId(ownerUserId: string, requesterId?: string) {
        const now = new Date();
        let isMinorQuery = false;
        if (requesterId) {
            const requester = await this.usersService.findById(requesterId);
            isMinorQuery = requester?.isUnder18 || false;
        }

        const filter: any = {
            ownerId: new Types.ObjectId(ownerUserId),
            expiresAt: { $gt: now },
            isArchived: false
        };

        if (isMinorQuery) {
            filter.contentSafetyLevel = 'safe';
        }

        return this.storyModel
            .find(filter)
            .sort({ createdAt: -1 })
            .exec();
    }
}
