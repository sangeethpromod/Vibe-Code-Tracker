import { createClient } from '@supabase/supabase-js';

// Client for server-side operations with service role
export const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Client for client-side operations (if needed)
export const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Database types
export interface Entry {
  id: string;
  created_at: string;
  type: 'win' | 'problem' | 'money' | 'avoidance';
  content: string;
  user_id?: string;
}

export interface WeeklyReport {
  id: string;
  week_start: string;
  summary: string | null;
  patterns: string | null;
  strategy: string | null;
  drop_list: string | null;
  created_at: string;
}
