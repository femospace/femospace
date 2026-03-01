import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SearchHistoryDocument = SearchHistory & Document;

@Schema({ timestamps: true })
export class SearchHistory {
    @Prop({ required: true, index: true })
    userId: string;

    @Prop({ required: true })
    query: string;

    @Prop({ default: 1 })
    count: number;
}

export const SearchHistorySchema = SchemaFactory.createForClass(SearchHistory);

@Schema({ timestamps: true })
export class TrendingSearch {
    @Prop({ required: true, unique: true })
    query: string;

    @Prop({ default: 1 })
    score: number;

    @Prop({ enum: ['rising', 'hot', 'normal'], default: 'normal' })
    status: string;
}

export const TrendingSearchSchema = SchemaFactory.createForClass(TrendingSearch);
