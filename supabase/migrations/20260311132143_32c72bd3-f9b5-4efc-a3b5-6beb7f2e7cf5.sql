
-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT,
  league TEXT NOT NULL CHECK (league IN ('platinum', 'gold', 'silver', 'bronze')),
  cumulative_score INTEGER NOT NULL DEFAULT 0,
  best_weekly_score INTEGER NOT NULL DEFAULT 0,
  projects_submitted INTEGER NOT NULL DEFAULT 0,
  attendance_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly_scores table
CREATE TABLE public.weekly_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  marks INTEGER NOT NULL DEFAULT 0,
  attendance BOOLEAN NOT NULL DEFAULT false,
  bonus INTEGER NOT NULL DEFAULT 0,
  weekly_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, week_number)
);

-- Create settings table
CREATE TABLE public.settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (leaderboard is publicly viewable)
CREATE POLICY "Students are publicly viewable" ON public.students FOR SELECT USING (true);
CREATE POLICY "Weekly scores are publicly viewable" ON public.weekly_scores FOR SELECT USING (true);
CREATE POLICY "Settings are publicly viewable" ON public.settings FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_students_league ON public.students(league);
CREATE INDEX idx_students_cumulative_score ON public.students(cumulative_score DESC);
CREATE INDEX idx_weekly_scores_week ON public.weekly_scores(week_number);
CREATE INDEX idx_weekly_scores_student ON public.weekly_scores(student_id);
