import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mail')
@UseGuards(JwtAuthGuard)
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send')
    async sendMail(@Request() req: any, @Body() dto: CreateMailDto) {
        return this.mailService.sendMail(req.user.id, dto);
    }

    @Get('inbox')
    async getInbox(@Request() req: any) {
        return this.mailService.getInbox(req.user.id);
    }

    @Get('sent')
    async getSent(@Request() req: any) {
        return this.mailService.getSent(req.user.id);
    }

    @Get('drafts')
    async getDrafts(@Request() req: any) {
        return this.mailService.getDrafts(req.user.id);
    }

    @Get('trash')
    async getTrash(@Request() req: any) {
        return this.mailService.getTrash(req.user.id);
    }

    @Get(':id')
    async getMailDetails(@Request() req: any, @Param('id') id: string) {
        return this.mailService.getMailDetails(req.user.id, id);
    }

    @Put(':id/read')
    async markAsRead(@Request() req: any, @Param('id') id: string) {
        return this.mailService.markAsRead(req.user.id, id);
    }

    @Get('search')
    async searchMail(@Request() req: any, @Query('q') query: string) {
        return this.mailService.searchMail(req.user.id, query);
    }

    @Delete(':id')
    async deleteMail(@Request() req: any, @Param('id') id: string) {
        return this.mailService.deleteMail(req.user.id, id);
    }
}
