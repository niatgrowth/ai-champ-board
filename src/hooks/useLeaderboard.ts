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

/** Distribute students into leagues exactly as OverallLeaderboard does */
function distributeLeaguesForRank(students: Student[]): Map<string, { student: Student; globalRank: number; leagueRank: number; league: string }> {
  const sorted = [...students].sort((a, b) => b.cumulative_score - a.cumulative_score);
  const total = sorted.length;
  const platCount = Math.max(1, Math.round(total * 0.10));
  const goldCount = Math.max(1, Math.round(total * 0.20));
  const silverCount = Math.max(1, Math.round(total * 0.30));

  const slices: [string, Student[]][] = [
    ['platinum', sorted.slice(0, platCount)],
    ['gold', sorted.slice(platCount, platCount + goldCount)],
    ['silver', sorted.slice(platCount + goldCount, platCount + goldCount + silverCount)],
    ['bronze', sorted.slice(platCount + goldCount + silverCount)],
  ];

  const map = new Map<string, { student: Student; globalRank: number; leagueRank: number; league: string }>();
  let globalRank = 0;
  for (const [league, group] of slices) {
    group.forEach((s, i) => {
      globalRank++;
      map.set(s.id, { student: s, globalRank, leagueRank: i + 1, league });
    });
  }
  return map;
}

export function useMonthlyScores(weeks: number[]) {
  return useQuery({
    queryKey: ['monthly_scores', weeks],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_scores')
        .select('*, students(name)')
        .in('week_number', weeks);
      if (error) throw error;

      // Aggregate per student
      const map = new Map<string, {
        studentId: string;
        name: string;
        monthlyScore: number;
        bestWeeklyScore: number;
        projectsSubmitted: number;
        attendanceCount: number;
        bonusCount: number;
      }>();

      for (const row of data ?? []) {
        const sid = row.student_id;
        const name = (row as any).students?.name ?? 'Unknown';
        const existing = map.get(sid);
        const ws = row.weekly_score;
        const proj = row.bonus > 0 ? 1 : 0;
        const att = row.attendance ? 1 : 0;
        // bonus count = winner or runner-up appearances
        const bonusAppearance = (row.weekly_score - (row.bonus > 0 ? row.marks : 0) - (row.attendance ? 20 : 0) - (row.bonus > 0 ? 10 : 0)) > 0 ? 1 : 0;

        if (existing) {
          existing.monthlyScore += ws;
          existing.bestWeeklyScore = Math.max(existing.bestWeeklyScore, ws);
          existing.projectsSubmitted += proj;
          existing.attendanceCount += att;
          existing.bonusCount += bonusAppearance;
        } else {
          map.set(sid, {
            studentId: sid,
            name,
            monthlyScore: ws,
            bestWeeklyScore: ws,
            projectsSubmitted: proj,
            attendanceCount: att,
            bonusCount: bonusAppearance,
          });
        }
      }

      // Sort with tie-breakers
      const results = Array.from(map.values()).sort((a, b) => {
        if (b.monthlyScore !== a.monthlyScore) return b.monthlyScore - a.monthlyScore;
        if (b.bestWeeklyScore !== a.bestWeeklyScore) return b.bestWeeklyScore - a.bestWeeklyScore;
        if (b.projectsSubmitted !== a.projectsSubmitted) return b.projectsSubmitted - a.projectsSubmitted;
        if (b.attendanceCount !== a.attendanceCount) return b.attendanceCount - a.attendanceCount;
        return b.bonusCount - a.bonusCount;
      });

      return results;
    },
  });
}

export function useSearchStudents(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];

      // Fetch ALL students to compute correct global ranks
      const { data: allStudents, error: allError } = await supabase
        .from('students')
        .select('*')
        .order('cumulative_score', { ascending: false });
      if (allError) throw allError;

      const rankMap = distributeLeaguesForRank((allStudents ?? []) as Student[]);

      // Filter matching students
      const q = query.toLowerCase();
      const matched = ((allStudents ?? []) as Student[]).filter(
        (s) => s.name.toLowerCase().includes(q) || (s.mobile ?? '').includes(q)
      );

      return matched.map((s) => {
        const info = rankMap.get(s.id);
        return {
          ...s,
          globalRank: info?.globalRank ?? 0,
          leagueRank: info?.leagueRank ?? 0,
          assignedLeague: info?.league ?? s.league,
        };
      });
    },
    enabled: query.trim().length >= 2,
  });
}
