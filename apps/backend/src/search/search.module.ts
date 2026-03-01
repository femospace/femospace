import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchHistory, SearchHistorySchema, TrendingSearch, TrendingSearchSchema } from './schemas/search.schema';
import { VideosModule } from '../videos/videos.module';
import { FeedModule } from '../feed/feed.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SearchHistory.name, schema: SearchHistorySchema },
            { name: TrendingSearch.name, schema: TrendingSearchSchema },
        ]),
        VideosModule,
        FeedModule,
        UsersModule,
    ],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule { }
