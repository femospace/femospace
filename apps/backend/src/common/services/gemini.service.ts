import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // Using gemini-1.5-flash for speed and cost-effectiveness in chat
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.logger.log('✨ Gemini AI initialized.');
        } else {
            this.logger.warn('⚠️ Gemini API key missing!');
        }
    }

    async generateResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = []) {
        try {
            const chat = this.model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            this.logger.error(`Gemini Error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Specifically for video descriptions/tags/analysis
     */
    async analyzeContent(text: string, task: string) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const fullPrompt = `Task: ${task}\nContent: ${text}`;
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
    }
}
