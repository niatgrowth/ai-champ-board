import { type League } from '@/lib/supabase';

export function getLeagueColor(league: League) {
  const colors = {
    platinum: 'text-platinum border-platinum/40 bg-platinum/10',
    gold: 'text-gold-league border-gold-league/40 bg-gold-league/10',
    silver: 'text-silver border-silver/40 bg-silver/10',
    bronze: 'text-bronze border-bronze/40 bg-bronze/10',
  };
  return colors[league] ?? colors.bronze;
}

export function getLeagueGradient(league: League) {
  const gradients = {
    platinum: 'from-platinum/20 to-transparent border-platinum/30',
    gold: 'from-gold-league/20 to-transparent border-gold-league/30',
    silver: 'from-silver/20 to-transparent border-silver/30',
    bronze: 'from-bronze/20 to-transparent border-bronze/30',
  };
  return gradients[league] ?? gradients.bronze;
}

export function getLeagueLabel(league: League) {
  const labels = {
    platinum: 'Platinum',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze',
  };
  return labels[league] ?? league;
}

export function getRankColor(rank: number) {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-slate-300';
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
