import { type League } from '@/lib/supabase';

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
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
