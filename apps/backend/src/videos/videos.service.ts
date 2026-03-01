import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { LiveStream, LiveStreamDocument } from './schemas/live-stream.schema';
import { StudioScene, StudioSceneDocument, StudioSession, StudioSessionDocument } from './schemas/studio.schema';
import { UsersService } from '../users/users.service';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVideoDto, VideoQueryDto } from './dto/video.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideosService implements OnModuleInit {
    constructor(
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        @InjectModel(LiveStream.name) private liveStreamModel: Model<LiveStreamDocument>,
        @InjectModel(StudioScene.name) private studioSceneModel: Model<StudioSceneDocument>,
        @InjectModel(StudioSession.name) private studioSessionModel: Model<StudioSessionDocument>,
        private usersService: UsersService,
    ) { }

    async onModuleInit() {
        const count = await this.videoModel.countDocuments();
        if (count === 0) {
            await this.videoModel.create([
                {
                    title: 'Morning in Tokyo 🇯🇵',
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-in-the-city-center-of-tokyo-4404-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
                    creatorId: 'sys-admin',
                    type: 'reel',
                    metrics: { likes: 12400, views: 500000, shares: 1200, comments: 450 },
                    contentSafetyLevel: 'safe',
                },
                {
                    title: 'Neon Nights',
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-pov-at-a-night-market-in-an-asian-city-4405-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
                    creatorId: 'sys-admin',
                    type: 'reel',
                    metrics: { likes: 8900, views: 320000, shares: 900, comments: 310 },
                    contentSafetyLevel: 'safe',
                },
                {
                    title: 'Mountain Vibe',
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-down-a-mountain-41576-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
                    creatorId: 'sys-admin',
                    type: 'reel',
                    metrics: { likes: 5600, views: 180000, shares: 400, comments: 120 },
                    contentSafetyLevel: 'safe',
                },
                {
                    title: 'The Future of AI in 2026',
                    description: 'Exploring the next 12 months in AI and how it will transform our social spaces.',
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-curious-cat-watching-tv-at-home-41619-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
                    creatorId: 'sys-admin',
                    type: 'video',
                    metrics: { likes: 45000, views: 1200000, shares: 8900, comments: 3400 },
                    contentSafetyLevel: 'safe',
                    tags: ['ai', 'future', 'tech'],
                },
                {
                    title: 'Space Exploration Doc',
                    description: 'A deep dive into the latest Mars mission.',
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-of-the-milky-way-in-the-night-sky-41617-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
                    creatorId: 'sys-admin',
                    type: 'video',
                    metrics: { likes: 12000, views: 450000, shares: 1200, comments: 800 },
                    contentSafetyLevel: 'safe',
                    tags: ['space', 'science'],
                },
                {
                    title: '🔴 E-Sports World Finals - LIVE',
                    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-playing-with-his-dog-in-the-park-41618-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
                    creatorId: 'sys-admin',
                    type: 'live',
                    isLive: true,
                    metrics: { likes: 120000, views: 45000, shares: 23000, comments: 12000 },
                    contentSafetyLevel: 'safe',
                }
            ]);
        }
    }

    async findAll(requesterId: string, queryDto: VideoQueryDto) {
        const { type, page = 1, limit = 10, search, tags, trending } = queryDto;
        const user = await this.usersService.findById(requesterId);
        const isMinor = user?.isUnder18 || false;

        const query: any = {};
        if (type) query.type = type;
        if (isMinor) query.contentSafetyLevel = 'safe';
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        const sort: any = trending ? { 'metrics.views': -1 } : { createdAt: -1 };

        const videos = await this.videoModel
            .find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        return {
            data: videos,
            meta: {
                page,
                limit,
                hasMore: videos.length === limit,
            },
        };
    }

    async create(creatorId: string, data: CreateVideoDto) {
        const user = await this.usersService.findById(creatorId);
        if (!user) throw new NotFoundException('User not found');

        const safetyLevel = this.analyzeContent(data);

        if (user.isUnder18 && safetyLevel === 'restricted') {
            throw new ForbiddenException('This content is not allowed for your age');
        }

        const newVideo = new this.videoModel({
            ...data,
            creatorId,
            metrics: { likes: 0, views: 0, shares: 0, comments: 0 },
            contentSafetyLevel: safetyLevel,
        });
        return newVideo.save();
    }

    async startLive(userId: string, data: any) {
        const streamKey = `femo_${uuidv4().replace(/-/g, '')}`;
        const newLive = new this.liveStreamModel({
            userId,
            title: data.title,
            description: data.description,
            streamKey,
            status: 'live',
            visibility: data.visibility || 'public',
            saveAsVideo: data.saveAsVideo || true,
            startedAt: new Date(),
        });

        const videoPlaceholder = new this.videoModel({
            title: data.title,
            description: data.description,
            creatorId: userId,
            type: 'live',
            url: '', // Mock URL
            isLive: true,
            contentSafetyLevel: 'safe',
            metrics: { likes: 0, views: 0, shares: 0, comments: 0 },
        });
        await videoPlaceholder.save();

        const savedLive = await newLive.save();

        return {
            streamId: savedLive._id,
            streamKey: savedLive.streamKey,
            rtmpUrl: 'rtmp://stream.femospace.com/live',
        };
    }

    async endLive(streamId: string) {
        const stream = await this.liveStreamModel.findById(streamId);
        if (!stream) throw new NotFoundException('Stream not found');

        stream.status = 'ended';
        stream.endedAt = new Date();
        await stream.save();

        await this.videoModel.findOneAndUpdate(
            { creatorId: stream.userId, type: 'live', isLive: true },
            { isLive: false }
        );

        return { success: true };
    }

    private analyzeContent(data: any): 'safe' | 'restricted' {
        // MOCK ANALYSIS
        const title = data.title || '';
        const desc = data.description || '';
        const tags = data.tags || [];
        const contentStr = (title + ' ' + desc + ' ' + tags.join(' ')).toLowerCase();

        const restrictedKeywords = ['adult', 'nsfw', 'porn', 'sexy', 'violence', 'blood', 'gamble'];
        const isRestricted = restrictedKeywords.some(keyword => contentStr.includes(keyword));

        return isRestricted ? 'restricted' : 'safe';
    }

    async findOne(id: string, requesterId?: string) {
        const video = await this.videoModel.findById(id).exec();
        if (!video) throw new NotFoundException('Video not found');

        // Safety Block Check
        if (requesterId && video.contentSafetyLevel === 'restricted') {
            const user = await this.usersService.findById(requesterId);
            if (user?.isUnder18) {
                // Hard block: behave as if it does not exist
                throw new NotFoundException('Video not found');
            }
        }

        return video;
    }

    async like(id: string) {
        return this.videoModel.findByIdAndUpdate(
            id,
            { $inc: { 'metrics.likes': 1 } },
            { new: true },
        );
    }

    async view(id: string) {
        return this.videoModel.findByIdAndUpdate(
            id,
            { $inc: { 'metrics.views': 1 } },
            { new: true },
        );
    }

    // --- LIVE STUDIO ---

    async getStudioScenes(userId: string) {
        let scenes = await this.studioSceneModel.find({ userId }).sort({ order: 1 }).exec();

        // Ensure at least one default scene exists
        if (scenes.length === 0) {
            const defaultScene = new this.studioSceneModel({
                userId,
                name: 'Scene 1',
                order: 0,
                sources: []
            });
            await defaultScene.save();
            scenes = [defaultScene];
        }

        return scenes;
    }

    async saveStudioScenes(userId: string, scenes: any[]) {
        // Simple implementation: delete old and save new (or bulk update)
        // For production, a more careful diff/update would be better
        await this.studioSceneModel.deleteMany({ userId });

        const newScenes = scenes.map((s, index) => ({
            ...s,
            userId,
            order: index
        }));

        return this.studioSceneModel.insertMany(newScenes);
    }

    async startStudioSession(userId: string, data: any) {
        const streamKey = `femo_studio_${uuidv4().replace(/-/g, '')}`;
        const newSession = new this.studioSessionModel({
            userId,
            status: 'active',
            streamKey,
            rtmpUrl: 'rtmp://stream.femospace.com/live',
            config: data.config
        });

        // Also create a LiveStream record for the public feed
        const liveStream = new this.liveStreamModel({
            userId,
            title: data.title || 'Studio Stream',
            description: data.description || '',
            streamKey,
            status: 'live',
            visibility: data.visibility || 'public',
            saveAsVideo: data.saveAsVideo !== false,
            startedAt: new Date(),
        });
        await liveStream.save();

        const videoPlaceholder = new this.videoModel({
            title: data.title || 'Studio Stream',
            description: data.description || '',
            creatorId: userId,
            type: 'live',
            url: '',
            isLive: true,
            contentSafetyLevel: 'safe',
            metrics: { likes: 0, views: 0, shares: 0, comments: 0 },
        });
        await videoPlaceholder.save();

        return newSession.save();
    }

    async endStudioSession(sessionId: string) {
        const session = await this.studioSessionModel.findById(sessionId);
        if (!session) throw new NotFoundException('Session not found');

        session.status = 'ended';
        session.endedAt = new Date();
        await session.save();

        // End associated live stream
        await this.liveStreamModel.findOneAndUpdate(
            { streamKey: session.streamKey },
            { status: 'ended', endedAt: new Date() }
        );

        await this.videoModel.findOneAndUpdate(
            { creatorId: session.userId, type: 'live', isLive: true },
            { isLive: false }
        );

        return { success: true };
    }
}
