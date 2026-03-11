import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://azudlfggsvebertpbstu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dWRsZmdnc3ZlYmVydHBic3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjg3NjUsImV4cCI6MjA4ODgwNDc2NX0.g9YoweMj-wOMRcD8kTiPdKxU4rRIblDixI_70TBoDlY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
