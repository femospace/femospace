import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly logger = new Logger(SupabaseService.name);
    private clientInstance: SupabaseClient | null = null;

    constructor(private readonly configService: ConfigService) {
        const url = this.configService.get<string>('SUPABASE_URL');
        const key = this.configService.get<string>('SUPABASE_ANON_KEY');

        if (url && key) {
            this.clientInstance = createClient(url, key);
            this.logger.log('💰 Supabase client initialized.');
        } else {
            this.logger.warn('⚠️ Supabase configuration missing! Check .env file.');
        }
    }

    get client(): SupabaseClient {
        if (!this.clientInstance) {
            throw new Error('Supabase client not initialized! Missing configuration.');
        }
        return this.clientInstance;
    }
}
