import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@ApiTags('Chat & AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get()
    @ApiOperation({ summary: 'Get user chat list' })
    async getChats(@Request() req: any) {
        return this.chatService.getChats(req.user.id || req.user.sub);
    }

    @Post()
    @ApiOperation({ summary: 'Create or get a direct/group chat' })
    async createChat(@Request() req: any, @Body() body: { participants: string[], type?: string, name?: string }) {
        return this.chatService.createChat(req.user.id || req.user.sub, body);
    }

    @Get(':id/messages')
    @ApiOperation({ summary: 'Get messages for a specific chat' })
    async getMessages(@Param('id') id: string, @Query('limit') limit?: number) {
        return this.chatService.getMessages(id, limit);
    }

    @Post(':id/seen')
    @ApiOperation({ summary: 'Mark chat as seen' })
    async markAsSeen(@Request() req: any, @Param('id') id: string) {
        return this.chatService.markAsSeen(req.user.id || req.user.sub, id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/chat',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
        limits: { fileSize: 500 * 1024 * 1024 } // 500MB
    }))
    @ApiOperation({ summary: 'Upload file for chat' })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new Error('File upload failed');
        return {
            url: `${process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://femospace.onrender.com'}/uploads/chat/${file.filename}`, // Adjust for production
            fileName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        };
    }

    @Post('support')
    @ApiOperation({ summary: 'Create or get a support chat' })
    async createSupportChat(@Request() req: any) {
        return this.chatService.createSupportChat(req.user.id || req.user.sub);
    }

    @Post('group')
    @ApiOperation({ summary: 'Create a group chat' })
    async createGroup(@Request() req: any, @Body() body: { name: string, participants: string[], description?: string }) {
        return this.chatService.createChat(req.user.id || req.user.sub, {
            participants: body.participants,
            type: 'group',
            name: body.name
        });
    }

    @Post('ai')
    @ApiOperation({ summary: 'Chat with AI Assistant' })
    async chatWithAI(@Request() req: any, @Body() body: { message: string, mode?: string }) {
        return this.chatService.chatWithAI(req.user.id || req.user.sub, body.mode || 'casual', body.message);
    }
    @Put(':id/participants')
    @ApiOperation({ summary: 'Add participant to group' })
    async addParticipant(@Request() req: any, @Param('id') id: string, @Body() body: { userId: string }) {
        return this.chatService.addParticipant(id, req.user.id || req.user.sub, body.userId);
    }

    @Delete(':id/participants/:participantId')
    @ApiOperation({ summary: 'Remove participant from group' })
    async removeParticipant(@Request() req: any, @Param('id') id: string, @Param('participantId') participantId: string) {
        return this.chatService.removeParticipant(id, req.user.id || req.user.sub, participantId);
    }

    @Put(':id/leave')
    @ApiOperation({ summary: 'Leave chat' })
    async leaveChat(@Request() req: any, @Param('id') id: string) {
        return this.chatService.leaveChat(id, req.user.id || req.user.sub);
    }

    @Post('message/:id/star')
    @ApiOperation({ summary: 'Star a message' })
    async starMessage(@Request() req: any, @Param('id') id: string) {
        return this.chatService.starMessage(req.user.id || req.user.sub, id);
    }

    @Delete('message/:id')
    @ApiOperation({ summary: 'Delete a message' })
    async deleteMessage(@Request() req: any, @Param('id') id: string) {
        return this.chatService.deleteMessage(req.user.id || req.user.sub, id);
    }
}
