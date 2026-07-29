import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudioTrack, AudioTrackDocument } from './schemas/audio-track.schema';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AudioService {
  constructor(
    @InjectModel(AudioTrack.name) private audioModel: Model<AudioTrackDocument>,
  ) { }

  async uploadTrack(
    file: Express.Multer.File,
    type: 'music' | 'sfx',
    title: string,
    artist: string | undefined,
    durationSec: number,
    uploadedBy: string,
  ): Promise<AudioTrack> {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    // Compute hash for deduplication
    const hash = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    // Check if track already exists
    const existingTrack = await this.audioModel.findOne({ hash }).exec();
    if (existingTrack) {
      return existingTrack;
    }

    // Save file to disk
    const uploadDir = path.join(process.cwd(), 'uploads', 'audio');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, file.buffer);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://femospace.onrender.com';
    const baseUrl = API_URL;
    const fileUrl = `${baseUrl}/uploads/audio/${filename}`;

    const newTrack = new this.audioModel({
      type,
      title,
      artist: artist || undefined,
      durationSec,
      fileUrl,
      hash,
      uploadedBy,
      usageCount: 0,
    });

    return newTrack.save();
  }

  async searchTracks(q: string, type?: 'music' | 'sfx', limit: number = 50) {
    const query: any = {};
    if (type) query.type = type;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
      ];
    }

    return this.audioModel
      .find(query)
      .limit(limit)
      .sort({ usageCount: -1, createdAt: -1 })
      .exec();
  }

  async getTrendingTracks(type?: 'music' | 'sfx', limit: number = 20) {
    const query: any = {};
    if (type) query.type = type;

    return this.audioModel
      .find(query)
      .limit(limit)
      .sort({ usageCount: -1 })
      .exec();
  }

  async getTrack(id: string) {
    return this.audioModel.findById(id).exec();
  }

  async incrementUsage(id: string) {
    return this.audioModel.findByIdAndUpdate(id, { $inc: { usageCount: 1 } }, { new: true }).exec();
  }
}
