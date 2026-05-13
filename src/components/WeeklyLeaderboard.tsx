import { useState } from 'react';
import { CalendarDays, Trophy, Star, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWeeklyLeaderboard, useAvailableWeeks } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { getInitials } from '@/lib/leaderboard-utils';

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 text-yellow-600 font-black text-sm border border-yellow-300">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-black text-sm border border-slate-300">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-600 font-black text-sm border border-amber-300">
        3
      </span>
    );
  return (
    <span className="text-muted-foreground font-medium text-sm w-7 text-center inline-block">
      {rank}
    </span>
  );
}

export default function WeeklyLeaderboard() {
  const { data: availableWeeks } = useAvailableWeeks();
  const currentWeek = availableWeeks && availableWeeks.length > 0
    ? Math.max(...availableWeeks)
    : undefined;

  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const activeWeek = selectedWeek ?? currentWeek;
  const { data: scores, isLoading } = useWeeklyLeaderboard(activeWeek);

  const filteredScores = scores?.filter((score) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      score.name.toLowerCase().includes(query) ||
      (score.mobile && String(score.mobile).toLowerCase().includes(query))
    );
  }) ?? [];

  const topPerformers = scores && scores.length > 0
    ? scores.filter((s) => s.score === scores[0].score)
    : [];

  const topPerformerNames = Array.from(new Set(topPerformers.map(s => s.name))).join(', ');

  return (
    <section id="weekly" className="py-10 md:py-16 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="section-badge">
            <CalendarDays className="w-4 h-4 text-primary" />
            Weekly Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Weekly <span className="gold-gradient">Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">Track your weekly score, performance, and progress in real-time.</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {activeWeek ? `Week ${activeWeek} Scores` : 'Loading…'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or mobile..."
                  className="pl-9 bg-white border-border text-sm shadow-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {availableWeeks && availableWeeks.length > 0 && activeWeek && (
                <Select
                  value={String(activeWeek)}
                  onValueChange={(v) => setSelectedWeek(parseInt(v))}
                >
                  <SelectTrigger className="w-full sm:w-36 bg-white border-border text-foreground text-sm shadow-sm shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    {availableWeeks.map((w) => (
                      <SelectItem key={w} value={String(w)} className="text-foreground">
                        Week {w}{w === currentWeek ? ' (Current)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {!isLoading && scores && scores.length > 0 && (
            <div className="px-4 py-3 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-amber-200/40 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-600 shrink-0" />
                <span className="text-sm font-semibold text-yellow-700">Top Performer:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <span className="text-sm font-bold text-foreground">{topPerformerNames}</span>
                <Star className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                <span className="text-xs text-muted-foreground shrink-0">({scores[0].score} Points)</span>
              </div>
            </div>
          )}

          <Table wrapperClassName="max-h-96 scrollbar-thin">
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
              <TableRow className="border-border/40 hover:bg-transparent bg-secondary/30">
                  <TableHead className="text-muted-foreground w-12 sm:w-14 font-semibold">Rank</TableHead>
                  <TableHead className="text-muted-foreground font-semibold whitespace-nowrap min-w-[140px]">Student Name</TableHead>
                  <TableHead className="text-muted-foreground text-center font-semibold whitespace-nowrap min-w-[100px]">State</TableHead>
                  <TableHead className="text-muted-foreground text-right font-semibold whitespace-nowrap">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i} className="border-border/20">
                      <TableCell><Skeleton className="h-5 w-7" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-14 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                  : filteredScores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : filteredScores.map((score) => (
                    <TableRow
                      key={score.mobile}
                      className={`border-border/30 hover:bg-secondary/40 transition-colors ${score.rank <= 3 ? 'table-row-highlight' : ''
                        }`}
                    >
                      <TableCell><RankBadge rank={score.rank} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0 border border-border/50">
                            {getInitials(score.name)}
                          </div>
                          <span className="font-medium text-foreground text-sm">
                            {score.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground text-sm font-medium">{score.state || '-'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-primary text-base">{score.score}</span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
        </div>
      </div>
    </section>
  );
}
