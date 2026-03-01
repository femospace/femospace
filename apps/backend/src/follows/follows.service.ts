import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follows, FollowsDocument } from './schemas/follows.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follows.name) private followsModel: Model<FollowsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async follow(followerId: string, followingId: string): Promise<Follows> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const follow = await this.followsModel.findOneAndUpdate(
      { followerId: new Types.ObjectId(followerId), followingId: new Types.ObjectId(followingId) },
      { followerId: new Types.ObjectId(followerId), followingId: new Types.ObjectId(followingId) },
      { upsert: true, new: true },
    );

    return follow;
  }

  async unfollow(followerId: string, followingId: string): Promise<boolean> {
    const result = await this.followsModel.deleteOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    return result.deletedCount > 0;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followsModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    return !!follow;
  }

  async getFollowStats(userId: string) {
    const followersCount = await this.followsModel.countDocuments({
      followingId: new Types.ObjectId(userId),
    });

    const followingCount = await this.followsModel.countDocuments({
      followerId: new Types.ObjectId(userId),
    });

    return { followersCount, followingCount };
  }

  async getFollowers(userId: string, limit: number = 50, skip: number = 0) {
    return this.followsModel
      .find({ followingId: new Types.ObjectId(userId) })
      .populate('followerId', 'username avatarUrl')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
  }

  async getFollowing(userId: string, limit: number = 50, skip: number = 0) {
    return this.followsModel
      .find({ followerId: new Types.ObjectId(userId) })
      .populate('followingId', 'username avatarUrl')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
  }
}
