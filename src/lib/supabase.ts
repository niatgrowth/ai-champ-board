import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type League = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Student {
  id: string;
  name: string;
  mobile: string | null;
  league: League;
  cumulative_score: number;
  best_weekly_score: number;
  projects_submitted: number;
  attendance_count: number;
  created_at: string;
}

export interface WeeklyScore {
  id: string;
  student_id: string;
  week_number: number;
  marks: number;
  attendance: boolean;
  bonus: number;
  weekly_score: number;
  created_at: string;
  students?: Student;
}

export interface Settings {
  key: string;
  value: string;
}
