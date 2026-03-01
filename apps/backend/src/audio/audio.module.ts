import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AudioTrack, AudioTrackSchema } from './schemas/audio-track.schema';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AudioTrack.name, schema: AudioTrackSchema },
    ]),
  ],
  controllers: [AudioController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}
