import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vydfnkyjetndpxblhklt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZGZua3lqZXRuZHB4Ymxoa2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzQ1MjQsImV4cCI6MjA4Nzg1MDUyNH0.fABjyhQYwKsfFSTimDkSxaWLQs-9Wc2955rtuXags0A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
