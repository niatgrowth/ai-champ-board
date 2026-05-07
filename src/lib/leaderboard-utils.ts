import type { Student } from '@/lib/sheets';

export type League = 'platinum' | 'gold' | 'silver' | 'bronze' | 'none';

export interface RankedStudent extends Student {
  rank: number;
  league: League;
}

/**
 * Assign leagues by percentile:
 *  - Top 10% → Platinum
 *  - 11–30% → Gold
 *  - 31–60% → Silver
 *  - 61–100% → Bronze (rest)
 *
 * Per spec: top 10% Platinum, next 20% Gold, next 30% Silver, next 40% Bronze.
 */
export function assignLeagues(students: Student[]): RankedStudent[] {
  const sorted = [...students].sort((a, b) => b.totalScore - a.totalScore);
  const total = sorted.length;
  if (total === 0) return [];

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
}

// ── UI helpers (kept from previous version; used by components) ──────────────

export function getLeagueColor(league: League | string) {
  const colors: Record<string, string> = {
    platinum: 'text-platinum border-platinum/50 bg-blue-50',
    gold: 'text-primary border-primary/50 bg-amber-50',
    silver: 'text-silver border-silver/50 bg-slate-100',
    bronze: 'text-bronze border-bronze/50 bg-amber-50',
  };
  return colors[league] ?? colors.bronze;
}

export function getLeagueGradient(league: League | string) {
  const gradients: Record<string, string> = {
    platinum: 'from-blue-50 to-white border-blue-200',
    gold: 'from-amber-50 to-white border-amber-200',
    silver: 'from-slate-100 to-white border-slate-200',
    bronze: 'from-orange-50 to-white border-orange-200',
  };
  return gradients[league] ?? gradients.bronze;
}

export function getLeagueLabel(league: League | string) {
  const labels: Record<string, string> = {
    platinum: 'Platinum',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze',
  };
  return labels[league] ?? String(league);
}

export function getRankColor(rank: number) {
  if (rank === 1) return 'text-yellow-500';
  if (rank === 2) return 'text-slate-500';
  if (rank === 3) return 'text-amber-600';
  return 'text-muted-foreground';
}

export function getInitials(name: string) {
  if (!name) return '??';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
