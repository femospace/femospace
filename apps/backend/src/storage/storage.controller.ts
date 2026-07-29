import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('upload')
export class StorageController {
    @Post('file')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req: any, file: any, cb: any) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file: any) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://femospace.onrender.com';
        const baseUrl = API_URL;
        return {
            url: `${baseUrl}/uploads/${file.filename}`,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        };
    }

    @Get(':filename')
    seeUploadedFile(@Param('filename') filename: string, @Res() res: Response) {
        return res.sendFile(filename, { root: './uploads' });
    }
}
