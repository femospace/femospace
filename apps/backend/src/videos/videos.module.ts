import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Video, VideoSchema } from './schemas/video.schema';
import { LiveStream, LiveStreamSchema } from './schemas/live-stream.schema';
import { StudioScene, StudioSceneSchema, StudioSession, StudioSessionSchema } from './schemas/studio.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Video.name, schema: VideoSchema },
            { name: LiveStream.name, schema: LiveStreamSchema },
            { name: StudioScene.name, schema: StudioSceneSchema },
            { name: StudioSession.name, schema: StudioSessionSchema },
        ]),
        UsersModule,
    ],
    controllers: [VideosController],
    providers: [VideosService],
    exports: [VideosService],
})
export class VideosModule { }
