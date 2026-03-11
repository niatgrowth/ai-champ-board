import { useQuery } from '@tanstack/react-query';
import { supabase, type Student, type WeeklyScore } from '@/lib/supabase';

export function useStudents(league?: string) {
  return useQuery({
    queryKey: ['students', league],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select('*')
        .order('cumulative_score', { ascending: false });
      if (league) query = query.eq('league', league);
      const { data, error } = await query;
      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useTopChampions() {
  return useQuery({
    queryKey: ['champions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('league', 'platinum')
        .order('cumulative_score', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useWeeklyScores(weekNumber: number) {
  return useQuery({
    queryKey: ['weekly_scores', weekNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_scores')
        .select('*, students(name, league)')
        .eq('week_number', weekNumber)
        .order('weekly_score', { ascending: false });
      if (error) throw error;
      return data as (WeeklyScore & { students: { name: string; league: string } })[];
    },
  });
}

export function useAvailableWeeks() {
  return useQuery({
    queryKey: ['available_weeks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_scores')
        .select('week_number')
        .order('week_number', { ascending: false });
      if (error) throw error;
      const weeks = [...new Set((data || []).map((d) => d.week_number))];
      return weeks as number[];
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((s) => { map[s.key] = s.value; });
      return map;
    },
  });
}

export function useSearchStudents(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .or(`name.ilike.%${query}%,mobile.ilike.%${query}%`)
        .order('cumulative_score', { ascending: false });
      if (error) throw error;
      return data as Student[];
    },
    enabled: query.trim().length >= 2,
  });
}
