import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AudioTrackDocument = AudioTrack & Document;

@Schema({ timestamps: true })
export class AudioTrack {
  @Prop({ enum: ['music', 'sfx'], required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  artist?: string;

  @Prop({ required: true })
  durationSec: number;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true, index: true })
  hash: string; // MD5 or SHA256 hash of file for deduplication

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy: Types.ObjectId;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AudioTrackSchema = SchemaFactory.createForClass(AudioTrack);
AudioTrackSchema.index({ hash: 1 }, { unique: true });
AudioTrackSchema.index({ type: 1 });
AudioTrackSchema.index({ createdAt: -1 });
