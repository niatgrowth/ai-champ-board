import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
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
  const activeWeek = selectedWeek ?? currentWeek;
  const { data: scores, isLoading } = useWeeklyLeaderboard(activeWeek);

  return (
    <section id="weekly" className="py-16 px-4">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {activeWeek ? `Week ${activeWeek} Scores` : 'Loading…'}
              </span>
            </div>
            {availableWeeks && availableWeeks.length > 0 && activeWeek && (
              <Select
                value={String(activeWeek)}
                onValueChange={(v) => setSelectedWeek(parseInt(v))}
              >
                <SelectTrigger className="w-36 bg-white border-border text-foreground text-sm shadow-sm">
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

          <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent bg-secondary/30">
                  <TableHead className="text-muted-foreground w-14 font-semibold">Rank</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
                  <TableHead className="text-muted-foreground text-right font-semibold">Score (/80)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i} className="border-border/20">
                        <TableCell><Skeleton className="h-5 w-7" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-14 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  : (scores ?? []).map((score) => (
                      <TableRow
                        key={score.mobile}
                        className={`border-border/30 hover:bg-secondary/40 transition-colors ${
                          score.rank <= 3 ? 'table-row-highlight' : ''
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
                        <TableCell className="text-right">
                          <span className="font-bold text-primary text-base">{score.score}</span>
                          <span className="text-muted-foreground text-xs">/80</span>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
