import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class StudioSource {
    @Prop({ required: true })
    type: string; // webcam, screen, image, video, audio, browser, text, alert, chat

    @Prop({ required: true })
    name: string;

    @Prop({ type: Object, default: {} })
    settings: any; // src, volume, muted, crop, etc.

    @Prop({ type: Object, default: { x: 0, y: 0, width: 1280, height: 720, zIndex: 0, opacity: 1, rotation: 0 } })
    transform: {
        x: number;
        y: number;
        width: number;
        height: number;
        zIndex: number;
        opacity: number;
        rotation: number;
    };

    @Prop({ default: true })
    isVisible: boolean;

    @Prop({ default: false })
    isLocked: boolean;
}

export const StudioSourceSchema = SchemaFactory.createForClass(StudioSource);

@Schema({ timestamps: true })
export class StudioScene {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: [StudioSourceSchema], default: [] })
    sources: StudioSource[];

    @Prop({ default: 0 })
    order: number;
}

export type StudioSceneDocument = StudioScene & Document;
export const StudioSceneSchema = SchemaFactory.createForClass(StudioScene);

@Schema({ timestamps: true })
export class StudioSession {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, enum: ['active', 'ended'], default: 'active' })
    status: string;

    @Prop({ default: Date.now })
    startedAt: Date;

    @Prop()
    endedAt: Date;

    @Prop({ default: 0 })
    peakViewers: number;

    @Prop()
    streamKey: string;

    @Prop()
    rtmpUrl: string;

    @Prop({ type: Object })
    config: any; // Additional session config
}

export type StudioSessionDocument = StudioSession & Document;
export const StudioSessionSchema = SchemaFactory.createForClass(StudioSession);
