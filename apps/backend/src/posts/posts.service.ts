import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Reaction, ReactionDocument } from './schemas/reaction.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
        private usersService: UsersService,
    ) { }

    async create(userId: string, createPostDto: CreatePostDto): Promise<PostDocument> {
        // Authorization check
        if (createPostDto.ownerType === 'user' && createPostDto.ownerId !== userId) {
            throw new ForbiddenException('Cannot post as another user');
        }

        const user = await this.usersService.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        // Run automatic content analysis
        const safetyLevel = this.analyzeContent(createPostDto);

        // UPLOAD RESTRICTION (UNDER-18)
        if (user.isUnder18 && safetyLevel === 'restricted') {
            throw new ForbiddenException('This content is not allowed for your age');
        }

        const createdPost = new this.postModel({
            ...createPostDto,
            ownerId: new Types.ObjectId(createPostDto.ownerId),
            contentSafetyLevel: safetyLevel,
        });

        return createdPost.save();
    }

    private analyzeContent(dto: CreatePostDto): 'safe' | 'restricted' {
        // MOCK ANALYSIS LOGIC
        // In reality, this would use an AI model or external API (AWS Rekognition / Google Vision)
        const contentStr = (dto.content || '').toLowerCase() + (dto.hashtags || []).join(' ').toLowerCase();

        const restrictedKeywords = ['adult', 'nsfw', 'porn', 'sexy', 'violence', 'blood', 'gamble'];
        const isRestricted = restrictedKeywords.some(keyword => contentStr.includes(keyword));

        return isRestricted ? 'restricted' : 'safe';
    }

    async findAll(query: any = {}): Promise<PostDocument[]> {
        return this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .exec();
    }

    async findById(id: string, requesterId?: string): Promise<PostDocument> {
        const post = await this.postModel.findById(id).exec();
        if (!post) throw new NotFoundException('Post not found');

        // Safety Block Check
        if (requesterId && post.contentSafetyLevel === 'restricted') {
            const user = await this.usersService.findById(requesterId);
            if (user?.isUnder18) {
                // Hard block: behave as if it does not exist
                throw new NotFoundException('Post not found');
            }
        }

        return post;
    }

    async delete(userId: string, id: string): Promise<any> {
        const post = await this.findById(id);
        // Ownership check
        if (post.ownerId.toString() !== userId) {
            throw new ForbiddenException('Not authorized to delete this post');
        }
        return this.postModel.findByIdAndDelete(id).exec();
    }

    async react(userId: string, postId: string, type: string) {
        // Find existing reaction
        const existing = await this.reactionModel.findOne({ postId: new Types.ObjectId(postId), userId: new Types.ObjectId(userId) });

        if (existing) {
            if (existing.type === type) {
                // Remove reaction if same type (toggle)
                await existing.deleteOne();
                await this.updatePostStats(postId, 'likes', -1);
                return { removed: true };
            } else {
                // Update reaction type
                existing.type = type;
                await existing.save();
                return { updated: true, type };
            }
        } else {
            // New reaction
            const reaction = new this.reactionModel({ postId, userId, type });
            await reaction.save();
            await this.updatePostStats(postId, 'likes', 1);
            return { added: true, type };
        }
    }

    async addComment(userId: string, postId: string, content: string, parentId?: string) {
        const comment = new this.commentModel({
            postId: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId),
            content,
            parentId: parentId ? new Types.ObjectId(parentId) : undefined,
        });
        const savedComment = await comment.save();
        await this.updatePostStats(postId, 'comments', 1);
        return savedComment;
    }

    async savePost(userId: string, postId: string) {
        await this.updatePostStats(postId, 'saves', 1);
        return { success: true, message: 'Post saved' };
    }

    async reportPost(userId: string, postId: string, reason: string) {
        // In a real app, save to a Reports collection
        return { success: true, message: 'Report received' };
    }

    async getFeed(requesterId: string, page: number = 1, limit: number = 10) {
        const user = await this.usersService.findById(requesterId);
        const isMinor = user?.isUnder18 || false;

        const filter: any = {
            visibility: 'public',
            status: 'published'
        };

        // ENFORCEMENT: Filter restricted content at database query level
        if (isMinor) {
            filter.contentSafetyLevel = 'safe';
        }

        return this.postModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'ownerId',
                select: 'profile username roles',
                model: 'User'
            })
            .exec();
    }

    async getPostsByUserId(ownerUserId: string, requesterId?: string) {
        let isMinorQuery = false;
        if (requesterId) {
            const requester = await this.usersService.findById(requesterId);
            isMinorQuery = requester?.isUnder18 || false;
        }

        const filter: any = {
            ownerId: new Types.ObjectId(ownerUserId),
            status: 'published'
        };

        if (isMinorQuery) {
            filter.contentSafetyLevel = 'safe';
        }

        return this.postModel
            .find(filter)
            .sort({ createdAt: -1 })
            .populate({
                path: 'ownerId',
                select: 'profile username roles',
                model: 'User'
            })
            .exec();
    }

    async getPostCount(userId: string): Promise<number> {
        return this.postModel.countDocuments({
            ownerId: new Types.ObjectId(userId),
            status: 'published'
        }).exec();
    }

    async voteOnPoll(userId: string, postId: string, optionIndex: number): Promise<PostDocument> {
        const post = await this.findById(postId);

        // Check if post is a poll
        if (post.type !== 'poll' || !post.pollOptions || post.pollOptions.length === 0) {
            throw new ForbiddenException('This post is not a poll');
        }

        // Check if option index is valid
        if (optionIndex < 0 || optionIndex >= post.pollOptions.length) {
            throw new ForbiddenException('Invalid poll option');
        }

        const userIdObj = new Types.ObjectId(userId);

        // Check if user already voted by checking voterIds in all options
        for (let i = 0; i < post.pollOptions.length; i++) {
            const option = post.pollOptions[i];
            const voterIndex = option.voterIds.findIndex(id => id.toString() === userId);
            if (voterIndex !== -1) {
                // Remove old vote
                option.voterIds.splice(voterIndex, 1);
                option.votes = Math.max(0, option.votes - 1);
            }
        }

        // Add new vote
        post.pollOptions[optionIndex].votes += 1;
        post.pollOptions[optionIndex].voterIds.push(userIdObj);

        return post.save();
    }

    private async updatePostStats(postId: string, field: string, increment: number) {
        await this.postModel.findByIdAndUpdate(postId, {
            $inc: { [`stats.${field}`]: increment }
        });
    }
}
