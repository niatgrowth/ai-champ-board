import { useQuery } from '@tanstack/react-query';
import {
  fetchAllSheetNames,
  fetchAllStudents,
  fetchSheetRows,
  type Student,
} from '@/lib/sheets';
import {
  assignLeagues,
  getMonthWeeks,
  getAvailableMonths,
  type RankedStudent,
  type League,
} from '@/lib/leaderboard-utils';

const STALE = 10 * 60 * 1000; // 10 minutes

export function useAllStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchAllStudents,
    staleTime: STALE,
  });
}

export function useAvailableWeeks() {
  return useQuery({
    queryKey: ['availableWeeks'],
    queryFn: async () => {
      const sheets = await fetchAllSheetNames();
      return sheets.map((s) => s.weekNumber);
    },
    staleTime: STALE,
  });
}

export function useAvailableMonths() {
  const weeks = useAvailableWeeks();
  return {
    ...weeks,
    data: weeks.data ? getAvailableMonths(weeks.data) : undefined,
  };
}

export interface WeeklyEntry {
  mobile: string;
  name: string;
  score: number;
  rank: number;
  league: League;
}

export function useWeeklyLeaderboard(weekNumber: number | undefined) {
  return useQuery({
    queryKey: ['weekly', weekNumber],
    queryFn: async (): Promise<WeeklyEntry[]> => {
      if (!weekNumber) return [];
      const sheetName = `week-${weekNumber}`;
      const rows = await fetchSheetRows(sheetName, weekNumber);

      // Group duplicates by mobile (sum)
      const map = new Map<string, { name: string; score: number }>();
      for (const r of rows) {
        const existing = map.get(r.mobile);
        if (existing) {
          existing.score += r.score;
          if (r.name) existing.name = r.name;
        } else {
          map.set(r.mobile, { name: r.name, score: r.score });
        }
      }

      const sorted = Array.from(map.entries())
        .map(([mobile, v]) => ({ mobile, ...v }))
        .sort((a, b) => b.score - a.score);

      const total = sorted.length;
      const platCount = Math.max(1, Math.round(total * 0.1));
      const goldCount = Math.max(1, Math.round(total * 0.2));
      const silverCount = Math.max(1, Math.round(total * 0.3));

      return sorted.map((s, i) => {
        let league: League;
        if (i < platCount) league = 'platinum';
        else if (i < platCount + goldCount) league = 'gold';
        else if (i < platCount + goldCount + silverCount) league = 'silver';
        else league = 'bronze';
        return { ...s, rank: i + 1, league };
      });
    },
    enabled: typeof weekNumber === 'number' && weekNumber > 0,
    staleTime: STALE,
  });
}

export function useOverallLeaderboard() {
  const { data, ...rest } = useAllStudents();
  return {
    ...rest,
    data: data ? assignLeagues(data) : undefined,
  };
}

export interface MonthlyEntry {
  mobile: string;
  name: string;
  monthScore: number;
  rank: number;
  weeksParticipated: number;
  bestWeekScore: number;
}

export function useMonthlyLeaderboard(monthNumber: number | undefined) {
  const { data: students, isLoading, error } = useAllStudents();
  const weeks = monthNumber ? getMonthWeeks(monthNumber) : [];

  const data: MonthlyEntry[] | undefined = students
    ? (() => {
        const out: MonthlyEntry[] = [];
        for (const s of students) {
          let monthScore = 0;
          let weeksParticipated = 0;
          let bestWeekScore = 0;
          for (const w of weeks) {
            const v = s.weeklyScores[w];
            if (typeof v === 'number') {
              monthScore += v;
              weeksParticipated += 1;
              if (v > bestWeekScore) bestWeekScore = v;
            }
          }
          if (weeksParticipated > 0) {
            out.push({
              mobile: s.mobile,
              name: s.name,
              monthScore,
              weeksParticipated,
              bestWeekScore,
              rank: 0,
            });
          }
        }
        out.sort((a, b) => b.monthScore - a.monthScore);
        return out.map((e, i) => ({ ...e, rank: i + 1 }));
      })()
    : undefined;

  return { data, isLoading, error };
}

export function useTopChampions() {
  const { data, ...rest } = useOverallLeaderboard();
  return {
    ...rest,
    data: data ? data.slice(0, 3) : undefined,
  };
}

export function useSearchStudents(query: string) {
  const { data: ranked, isLoading, error, isFetching } = useOverallLeaderboard();
  const q = query.trim().toLowerCase();
  const enabled = q.length >= 2;

  const data: RankedStudent[] | undefined =
    enabled && ranked
      ? ranked.filter(
          (s) =>
            s.name.toLowerCase().includes(q) || s.mobile.includes(q.replace(/\D/g, ''))
        )
      : enabled
      ? undefined
      : [];

  return { data, isLoading: enabled ? isLoading : false, isFetching, error };
}
