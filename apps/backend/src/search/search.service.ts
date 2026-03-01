import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchHistory, TrendingSearch } from './schemas/search.schema';
import { VideosService } from '../videos/videos.service';
import { FeedService } from '../feed/feed.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SearchService implements OnModuleInit {
    constructor(
        @InjectModel(SearchHistory.name) private historyModel: Model<SearchHistory>,
        @InjectModel(TrendingSearch.name) private trendingModel: Model<TrendingSearch>,
        private videosService: VideosService,
        private feedService: FeedService,
        private usersService: UsersService,
    ) { }

    async onModuleInit() {
        const count = await this.trendingModel.countDocuments();
        if (count === 0) {
            await this.trendingModel.create([
                { query: 'AI in 2026', score: 100, status: 'hot' },
                { query: 'Tokyo night life', score: 85, status: 'rising' },
                { query: 'Femo Space update', score: 70, status: 'normal' },
                { query: 'E-sports finals', score: 95, status: 'hot' },
            ]);
        }
    }

    async globalSearch(requesterId: string, query: string, type: string = 'top') {
        // In a real app, this would use a dedicated search engine like Meilisearch/Elasticsearch
        // For now, we aggregate from services

        const results: any = {
            users: [],
            videos: [],
            reels: [],
            posts: [],
        };

        if (type === 'top' || type === 'users') {
            // Mock user search
            results.users = [
                { id: 'u1', name: 'John Doe', handle: '@johndoe', avatar: 'https://i.pravatar.cc/150?u=1', verified: true },
                { id: 'u2', name: 'Jane Smith', handle: '@janes', avatar: 'https://i.pravatar.cc/150?u=2', verified: false },
            ].filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
        }

        if (type === 'top' || type === 'videos' || type === 'reels') {
            const vids = await this.videosService.findAll(requesterId, {} as any);
            results.videos = vids.data.filter(v => v.type === 'video' && v.title.toLowerCase().includes(query.toLowerCase()));
            results.reels = vids.data.filter(v => v.type === 'reel' && v.title.toLowerCase().includes(query.toLowerCase()));
        }

        // AI Intent Mock: If query includes "cat", boost cat related results
        if (query.toLowerCase().includes('cat')) {
            results.aiNote = "AI optimized for pet content based on your intent.";
        }

        return results;
    }

    async getSuggestions(query: string) {
        const trending = await this.trendingModel.find({ query: new RegExp(query, 'i') }).limit(5).exec();
        return trending.map(t => t.query);
    }

    async getTrending() {
        return this.trendingModel.find().sort({ score: -1 }).limit(10).exec();
    }

    async saveHistory(userId: string, query: string) {
        return this.historyModel.findOneAndUpdate(
            { userId, query },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
    }
}
