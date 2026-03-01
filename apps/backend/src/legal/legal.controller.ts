import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { LegalService } from './legal.service';
import { Request } from 'express';

@Controller('legal')
export class LegalController {
    constructor(private readonly legalService: LegalService) { }

    @Get('terms')
    async getTerms(@Query('lang') lang: string = 'en') {
        return this.legalService.getLatestDocument('terms', lang);
    }

    @Get('privacy')
    async getPrivacy(@Query('lang') lang: string = 'en') {
        return this.legalService.getLatestDocument('privacy', lang);
    }

    @Post('accept')
    async acceptLegal(@Body() body: any, @Req() req: Request) {
        // Extract IP and Device from request
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const device = req.headers['user-agent'] || 'unknown';

        return this.legalService.acceptLegal({
            ...body,
            ip: Array.isArray(ip) ? ip[0] : ip,
            device,
        });
    }
}
