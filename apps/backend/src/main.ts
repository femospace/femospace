import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as fs from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Ensure upload directories exist
  const uploadDirs = ['./uploads', './uploads/chat', './uploads/avatars', './uploads/posts'];
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.use(cookieParser());
  app.use(helmet({
    crossOriginResourcePolicy: false, // Allow local images to be loaded
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS for frontend
  const allowedOrigins = [
    'https://femospace.space',
    'https://www.femospace.space',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3001',
  ];
  if (process.env.FRONTEND_URL) {
    // Support comma-separated list of additional origins in env
    process.env.FRONTEND_URL.split(',').forEach(origin => {
      const trimmed = origin.trim();
      if (trimmed && !allowedOrigins.includes(trimmed)) {
        allowedOrigins.push(trimmed);
      }
    });
  }
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
