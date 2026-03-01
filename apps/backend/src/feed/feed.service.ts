import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class FeedService {

    // In a real app, inject @InjectModel(Post.name) private postModel: Model<PostDocument>
    private mockPosts: Record<string, any>[] = [
        {
            id: '1',
            type: 'image',
            source: 'following',
            owner: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah', verified: false },
            content: { text: 'Weekend vibes! 🌴 #Summer2025', media: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
            metrics: { likes: 245, comments: 12, shares: 3 },
            createdAt: new Date()
        },
        {
            id: '2',
            type: 'live',
            source: 'suggested',
            owner: { name: 'Gaming Central', avatar: 'https://i.pravatar.cc/150?u=game', verified: true },
            content: { text: '🔴 LIVE: E-Sports Championship Finals!', thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80' },
            metrics: { likes: 12000, comments: 4500, shares: 800, views: '1.2M' },
            isLive: true,
            createdAt: new Date()
        }
    ];

    async create(userId: string, createPostDto: CreatePostDto) {
        const newPost = {
            id: Date.now().toString(),
            authorId: userId,
            ...createPostDto,
            createdAt: new Date(),
            metrics: { likes: 0, comments: 0, shares: 0 }
        };
        this.mockPosts.push(newPost);
        return newPost;
    }

    async findAll(cursor?: string, limit: number = 20) {
        // In real app: use cursor-based pagination with database
        return {
            data: this.mockPosts.slice(0, limit),
            meta: {
                nextCursor: null,
                hasMore: false
            }
        };
    }

    async findOne(id: string) {
        return this.mockPosts.find(p => p.id === id);
    }

    async likePost(userId: string, postId: string) {
        const post = await this.findOne(postId);
        if (post) {
            post.metrics.likes++;
            return { status: 'liked', likes: post.metrics.likes };
        }
        return null;
    }
}
