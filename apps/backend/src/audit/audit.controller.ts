import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get('logs')
    @UseGuards(JwtAuthGuard)
    getUserLogs(@Req() req: any) {
        return this.auditService.findByUser(req.user.userId);
    }
}
