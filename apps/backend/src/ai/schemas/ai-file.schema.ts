import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AIFileDocument = AIFile & Document;

@Schema({ timestamps: true })
export class AIFile {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId: string;

    @Prop({ required: true })
    filename: string;

    @Prop({ required: true })
    fileType: string; // mime type

    @Prop({ required: true })
    fileSize: number;

    @Prop({ required: true })
    storagePath: string; // url or path

    @Prop({ type: Object })
    processedData: any; // summary, transcription, etc.
}

export const AIFileSchema = SchemaFactory.createForClass(AIFile);
