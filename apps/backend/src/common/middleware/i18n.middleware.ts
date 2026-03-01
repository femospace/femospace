import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * I18N MIDDLEWARE
 * Detects and sets the user's preferred language for each request
 * Priority: User Profile > Accept-Language Header > Default (en)
 */

// Extend Express Request to include language
declare global {
    namespace Express {
        interface Request {
            language?: string;
        }
    }
}

@Injectable()
export class I18nMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        let detectedLanguage = 'en'; // Default fallback

        // Priority 1: User's saved preference (if authenticated)
        const user = req.user as any;
        if (user?.preferences?.languageCode) {
            detectedLanguage = user.preferences.languageCode;
        }
        // Priority 2: Accept-Language header from browser
        else if (req.headers['accept-language']) {
            const acceptLanguage = req.headers['accept-language'];
            // Parse the first language from Accept-Language header
            // Example: "en-US,en;q=0.9,es;q=0.8" -> "en"
            const primaryLanguage = acceptLanguage.split(',')[0].split('-')[0].split(';')[0];
            detectedLanguage = primaryLanguage || 'en';
        }

        // Attach language to request object
        req.language = detectedLanguage;

        // Set Content-Language response header
        res.setHeader('Content-Language', detectedLanguage);

        next();
    }
}
