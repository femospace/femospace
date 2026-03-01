import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ _id: false })
class Location {
  @Prop()
  country: string;

  @Prop()
  city: string;
}

@Schema({ _id: false })
class PrivacySettings {
  @Prop({ default: 'public', enum: ['public', 'followers', 'friends', 'private'] })
  viewProfile: string;

  @Prop({ default: 'public', enum: ['public', 'followers', 'friends', 'private'] })
  sendMessage: string;

  @Prop({ default: 'public', enum: ['public', 'followers', 'friends', 'private'] })
  tagMe: string;

  @Prop({ default: 'public', enum: ['public', 'followers', 'friends', 'private'] })
  commentOnPosts: string;
}

@Schema({ _id: false })
class ProfileStats {
  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;

  @Prop({ default: 0 })
  postsCount: number;

  @Prop({ default: 0 })
  reelsCount: number;

  @Prop({ default: 0 })
  videosCount: number;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  viewsCount: number;
}

@Schema({ _id: false })
class CreatorModule {
  @Prop({ default: false })
  isMonetizationEnabled: boolean;

  @Prop({ type: [String], default: [] })
  specialties: string[];

  @Prop()
  payoutMethods: string;

  @Prop({ default: 0 })
  subscriberCount: number;
}

@Schema({ _id: false })
class BusinessModule {
  @Prop()
  category: string;

  @Prop()
  workingHours: string;

  @Prop()
  contactEmail: string;

  @Prop()
  contactPhone: string;

  @Prop()
  website: string;

  @Prop()
  address: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  locationCoords: any;
}

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  displayName: string;

  @Prop()
  bio: string;

  @Prop()
  profileImage: string;

  @Prop()
  coverImage: string;

  @Prop({ 
    required: true, 
    enum: ['personal', 'creator', 'business', 'verified', 'vip'],
    default: 'personal' 
  })
  type: string;

  @Prop({ type: [String], default: [] })
  badges: string[]; // 'verified', 'vip', 'certified_creator', 'official_business'

  @Prop({ type: Location })
  location: Location;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ type: PrivacySettings, default: () => ({}) })
  privacySettings: PrivacySettings;

  @Prop({ type: ProfileStats, default: () => ({}) })
  stats: ProfileStats;

  @Prop({ type: CreatorModule })
  creatorModule: CreatorModule;

  @Prop({ type: BusinessModule })
  businessModule: BusinessModule;

  @Prop({ default: 'standard' })
  layoutStyle: string;

  @Prop({ default: '#7C3AED' })
  themeColor: string;

  @Prop({ type: [String], default: [] })
  featuredContent: string[];

  @Prop({ type: [String], default: [] })
  pinnedPosts: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
