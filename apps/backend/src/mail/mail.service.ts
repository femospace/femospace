import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mail, MailDocument } from './schemas/mail.schema';
import { CreateMailDto } from './dto/create-mail.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MailService {
    constructor(
        @InjectModel(Mail.name) private mailModel: Model<MailDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async resolveRecipients(identifiers: string[]): Promise<Types.ObjectId[]> {
        const userIds: Types.ObjectId[] = [];
        for (const id of identifiers) {
            // Check if it's a numeric femoId or a femoMail string
            let user;
            if (/^\d+$/.test(id)) {
                user = await this.userModel.findOne({ femoId: parseInt(id) });
            } else {
                // Remove @femo.app or @femo.com if present, or search by full femoMail
                const cleanId = id.split('@')[0];
                user = await this.userModel.findOne({
                    $or: [
                        { femoMail: id.toLowerCase() },
                        { username: cleanId.toLowerCase() }
                    ]
                });
            }

            if (!user) {
                throw new NotFoundException(`Recipient not found: ${id}`);
            }
            userIds.push(user._id as Types.ObjectId);
        }
        return userIds;
    }

    async sendMail(fromUserId: string, dto: CreateMailDto): Promise<Mail> {
        const toUserIds = await this.resolveRecipients(dto.to);
        const ccUserIds = dto.cc ? await this.resolveRecipients(dto.cc) : [];
        const bccUserIds = dto.bcc ? await this.resolveRecipients(dto.bcc) : [];

        const mail = new this.mailModel({
            fromUserId: new Types.ObjectId(fromUserId),
            toUserIds,
            ccUserIds,
            bccUserIds,
            subject: dto.subject,
            body: dto.body,
            attachments: dto.attachments || [],
            isDraft: dto.isDraft || false,
            readBy: { [fromUserId]: true }, // Sender has read their own mail
        });

        return mail.save();
    }

    async getInbox(userId: string): Promise<Mail[]> {
        const uId = new Types.ObjectId(userId);
        return this.mailModel.find({
            $or: [
                { toUserIds: uId },
                { ccUserIds: uId },
                { bccUserIds: uId }
            ],
            isDraft: false,
            [`deletedBy.${userId}`]: { $ne: true }
        })
            .populate('fromUserId', 'firstName lastName username femoId femoMail avatarUrl')
            .sort({ createdAt: -1 })
            .exec();
    }

    async getSent(userId: string): Promise<Mail[]> {
        return this.mailModel.find({
            fromUserId: new Types.ObjectId(userId),
            isDraft: false,
            [`deletedBy.${userId}`]: { $ne: true }
        })
            .populate('toUserIds', 'firstName lastName username femoId femoMail avatarUrl')
            .sort({ createdAt: -1 })
            .exec();
    }

    async getDrafts(userId: string): Promise<Mail[]> {
        return this.mailModel.find({
            fromUserId: new Types.ObjectId(userId),
            isDraft: true,
            [`deletedBy.${userId}`]: { $ne: true }
        })
            .sort({ updatedAt: -1 })
            .exec();
    }

    async getTrash(userId: string): Promise<Mail[]> {
        return this.mailModel.find({
            [`deletedBy.${userId}`]: true
        })
            .sort({ updatedAt: -1 })
            .exec();
    }

    async markAsRead(userId: string, mailId: string): Promise<void> {
        await this.mailModel.updateOne(
            { _id: new Types.ObjectId(mailId) },
            { $set: { [`readBy.${userId}`]: true } }
        );
    }

    async deleteMail(userId: string, mailId: string): Promise<void> {
        // Soft delete for 30 days
        await this.mailModel.updateOne(
            { _id: new Types.ObjectId(mailId) },
            { $set: { [`deletedBy.${userId}`]: true } }
        );
    }

    async getMailDetails(userId: string, mailId: string): Promise<Mail> {
        const uId = new Types.ObjectId(userId);
        const mail = await this.mailModel.findOne({
            _id: new Types.ObjectId(mailId),
            $or: [
                { fromUserId: uId },
                { toUserIds: uId },
                { ccUserIds: uId },
                { bccUserIds: uId }
            ]
        })
            .populate('fromUserId', 'firstName lastName username femoId femoMail avatarUrl')
            .populate('toUserIds', 'firstName lastName username femoId femoMail avatarUrl')
            .populate('ccUserIds', 'firstName lastName username femoId femoMail avatarUrl')
            .exec();

        if (!mail) throw new NotFoundException('Mail not found');
        return mail;
    }

    async searchMail(userId: string, query: string): Promise<Mail[]> {
        const uId = new Types.ObjectId(userId);
        return this.mailModel.find({
            $or: [
                { fromUserId: uId },
                { toUserIds: uId },
                { ccUserIds: uId },
                { bccUserIds: uId }
            ],
            $and: [
                { [`deletedBy.${userId}`]: { $ne: true } },
                {
                    $or: [
                        { subject: { $regex: query, $options: 'i' } },
                        { body: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        })
            .populate('fromUserId', 'firstName lastName username femoId femoMail avatarUrl')
            .sort({ createdAt: -1 })
            .exec();
    }
}
