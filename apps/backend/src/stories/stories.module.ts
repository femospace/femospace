import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story, StorySchema } from './schemas/story.schema';
import { StoryHighlight, StoryHighlightSchema } from './schemas/story-highlight.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Story.name, schema: StorySchema },
            { name: StoryHighlight.name, schema: StoryHighlightSchema },
        ]),
        UsersModule,
    ],
    controllers: [StoriesController],
    providers: [StoriesService],
    exports: [StoriesService],
})
export class StoriesModule { }
