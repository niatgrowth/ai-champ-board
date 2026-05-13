import { useQuery } from '@tanstack/react-query';
import {
  fetchAllSheetNames,
  fetchAllStudents,
  fetchSheetRows,
  type Student,
} from '@/lib/sheets';
import {
  assignLeagues,
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

export interface WeeklyEntry {
  mobile: string;
  name: string;
  score: number;
  state: string;
  rank: number;
  league: League;
}

export function useWeeklyLeaderboard(weekNumber: number | undefined) {
  return useQuery({
    queryKey: ['weekly', weekNumber],
    queryFn: async (): Promise<WeeklyEntry[]> => {
      if (!weekNumber) return [];
      
      // Resolve the actual sheet name from metadata
      const sheets = await fetchAllSheetNames();
      const sheet = sheets.find((s) => s.weekNumber === weekNumber);
      
      if (!sheet) {
        console.warn(`No sheet found for week ${weekNumber}. Available:`, sheets);
        return [];
      }
      
      const rows = await fetchSheetRows(sheet.sheetName, weekNumber);

      // Group duplicates by mobile (sum)
      const map = new Map<string, { name: string; finalScore: number; state: string }>();
      for (const r of rows) {
        const existing = map.get(r.mobile);
        if (existing) {
          existing.finalScore += r.finalScore;
          if (r.name) existing.name = r.name;
          if (r.state) existing.state = r.state;
        } else {
          map.set(r.mobile, { 
            name: r.name, 
            finalScore: r.finalScore,
            state: r.state || ''
          });
        }
      }

      const sorted = Array.from(map.entries())
        .map(([mobile, v]) => {
          return { mobile, name: v.name, state: v.state, score: v.finalScore };
        })
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
      ? ranked.filter((s) => {
          const nameMatch = s.name.toLowerCase().includes(q);
          const digits = query.replace(/\D/g, '');
          // If query has digits, check if it matches the mobile (last 10 digits)
          // We check if the student's mobile contains the query digits, 
          // or if the query digits (last 10) contain the student's mobile.
          const searchDigits = digits.length > 10 ? digits.slice(-10) : digits;
          const phoneMatch = digits.length >= 3 && s.mobile.includes(searchDigits);
          
          return nameMatch || phoneMatch;
        })
      : enabled
      ? undefined
      : [];

  return { data, isLoading: enabled ? isLoading : false, isFetching, error };
}
