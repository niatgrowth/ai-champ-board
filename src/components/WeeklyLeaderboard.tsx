import { useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
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
import { useWeeklyScores, useAvailableWeeks, useSettings } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/leaderboard-utils';

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 font-black text-sm border border-yellow-400/30">1</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-500/20 text-slate-300 font-black text-sm border border-slate-400/30">2</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 font-black text-sm border border-amber-600/30">3</span>;
  return <span className="text-muted-foreground font-medium text-sm w-7 text-center inline-block">{rank}</span>;
}

export default function WeeklyLeaderboard() {
  const { data: settings } = useSettings();
  const { data: weeks } = useAvailableWeeks();
  const currentWeek = parseInt(settings?.current_week ?? '1');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const activeWeek = selectedWeek ?? currentWeek;
  const { data: scores, isLoading } = useWeeklyScores(activeWeek);

  return (
    <section id="weekly" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground text-sm font-medium mb-4">
            <CalendarDays className="w-4 h-4 text-primary" />
            Weekly Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Weekly <span className="gold-gradient">Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">Performance scores updated each week</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-border/50 animate-fade-in">
          {/* Week selector */}
          <div className="flex items-center justify-between p-5 border-b border-border/40 bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Week {activeWeek} Scores</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                Out of 40
              </span>
            </div>
            <Select
              value={String(activeWeek)}
              onValueChange={(v) => setSelectedWeek(parseInt(v))}
            >
              <SelectTrigger className="w-36 bg-secondary border-border text-foreground text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {(weeks ?? Array.from({ length: currentWeek }, (_, i) => currentWeek - i)).map((w) => (
                  <SelectItem key={w} value={String(w)} className="text-foreground">
                    Week {w} {w === currentWeek ? '(Current)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-14">Rank</TableHead>
                  <TableHead className="text-muted-foreground">Student Name</TableHead>
                  <TableHead className="text-muted-foreground text-right">Marks /40</TableHead>
                  <TableHead className="text-muted-foreground text-center hidden sm:table-cell">Attendance</TableHead>
                  <TableHead className="text-muted-foreground text-right hidden sm:table-cell">Bonus</TableHead>
                  <TableHead className="text-muted-foreground text-right">Weekly Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i} className="border-border/20">
                      <TableCell><Skeleton className="h-5 w-7" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-14 ml-auto" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                  : scores?.map((score, idx) => (
                    <TableRow
                      key={score.id}
                      className={`border-border/20 hover:bg-card/40 transition-colors ${idx < 3 ? 'table-row-highlight' : ''}`}
                    >
                      <TableCell><RankBadge rank={idx + 1} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                            {getInitials(score.students?.name ?? '??')}
                          </div>
                          <span className="font-medium text-foreground text-sm">{score.students?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-foreground">{score.marks}</span>
                        <span className="text-muted-foreground text-xs">/40</span>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        {score.attendance
                          ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                          : <XCircle className="w-4 h-4 text-destructive mx-auto" />}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                        +{score.bonus}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-primary">{score.weekly_score}</span>
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
