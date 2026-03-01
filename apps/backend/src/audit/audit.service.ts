import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    ) { }

    async log(data: {
        userId?: string;
        action: string;
        category: string;
        metadata?: any;
        status?: string;
        ipAddress?: string;
        userAgent?: string;
    }) {
        const log = new this.auditLogModel(data);
        return log.save();
    }

    async findByUser(userId: string) {
        return this.auditLogModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();
    }
}
