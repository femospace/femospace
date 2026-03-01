import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { CreateAIConversationDto } from './dto/create-conversation.dto';
import { SendAIMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Adjust path if needed

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
    constructor(private readonly aiService: AIService) { }

    @Post('conversations')
    async createConversation(@Req() req: any, @Body() createDto: CreateAIConversationDto) {
        const userId = req.user.userId || req.user.id;
        return this.aiService.createConversation(userId, createDto);
    }

    @Get('conversations')
    async getUserConversations(@Req() req: any) {
        const userId = req.user.userId || req.user.id;
        return this.aiService.getUserConversations(userId);
    }

    @Get('conversations/:id/messages')
    async getConversationMessages(@Param('id') id: string) {
        return this.aiService.getMessages(id);
    }

    @Post('message')
    async sendMessage(@Req() req: any, @Body() sendDto: SendAIMessageDto) {
        const userId = req.user.userId || req.user.id;
        return this.aiService.sendMessage(userId, sendDto);
    }

    @Delete('conversations/:id')
    async deleteConversation(@Req() req: any, @Param('id') id: string) {
        const userId = req.user.userId || req.user.id;
        return this.aiService.deleteConversation(userId, id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/ai',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadFile(@Req() req: any, @UploadedFile() file: any) {
        const userId = req.user.userId || req.user.id;
        // Process file (e.g. read content, summarize)
        // mock return
        return {
            url: `http://localhost:3000/uploads/ai/${file.filename}`,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        };
    }
}
