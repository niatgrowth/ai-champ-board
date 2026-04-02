import { useState } from 'react';
import { Calendar, Trophy, Star } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useMonthlyScores } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/leaderboard-utils';

const MONTHS = [
  { label: 'November 2025', weeks: [1, 2, 3, 4] },
  { label: 'December 2025', weeks: [5, 6, 7, 8] },
  { label: 'January 2026', weeks: [9, 10, 11, 12] },
  { label: 'February 2026', weeks: [13, 14, 15, 16] },
];

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

export default function MonthlyLeaderboard() {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const month = MONTHS[selectedMonth];
  const { data: scores, isLoading } = useMonthlyScores(month.weeks);

  return (
    <section id="monthly" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="section-badge">
            <Calendar className="w-4 h-4 text-primary" />
            Monthly Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Monthly <span className="gold-gradient">Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">See how your weekly efforts add up to your monthly ranking.</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
          {/* Month selector header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">{month.label}</span>
              <span className="text-xs text-muted-foreground">(Weeks {month.weeks[0]}–{month.weeks[month.weeks.length - 1]})</span>
            </div>
            <Select
              value={String(selectedMonth)}
              onValueChange={(v) => setSelectedMonth(parseInt(v))}
            >
              <SelectTrigger className="w-44 bg-white border-border text-foreground text-sm shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-border">
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i)} className="text-foreground">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Top performer highlight */}
          {!isLoading && scores && scores.length > 0 && (
            <div className="px-5 py-3 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-amber-200/40 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">Top Performer of the Month:</span>
              <span className="text-sm font-bold text-foreground">{scores[0].name}</span>
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs text-muted-foreground">({scores[0].monthlyScore} pts)</span>
            </div>
          )}

          <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent bg-secondary/30">
                  <TableHead className="text-muted-foreground w-14 font-semibold">Rank</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
                  <TableHead className="text-muted-foreground text-right font-semibold">Monthly Score</TableHead>
                  <TableHead className="text-muted-foreground text-right hidden sm:table-cell font-semibold">Best Week</TableHead>
                  <TableHead className="text-muted-foreground text-right hidden sm:table-cell font-semibold">Projects</TableHead>
                  <TableHead className="text-muted-foreground text-right hidden md:table-cell font-semibold">Attendance</TableHead>
                  <TableHead className="text-muted-foreground text-right hidden md:table-cell font-semibold">Bonus Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i} className="border-border/20">
                        <TableCell><Skeleton className="h-5 w-7" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-14 ml-auto" /></TableCell>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  : scores?.map((s, idx) => (
                      <TableRow
                        key={s.studentId}
                        className={`border-border/30 hover:bg-secondary/40 transition-colors ${
                          idx < 3 ? 'table-row-highlight' : ''
                        }`}
                      >
                        <TableCell><RankBadge rank={idx + 1} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0 border border-border/50">
                              {getInitials(s.name)}
                            </div>
                            <span className="font-medium text-foreground text-sm">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary text-base">{s.monthlyScore}</span>
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <span className="font-semibold text-foreground">{s.bestWeeklyScore}</span>
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <span className="font-semibold text-foreground">{s.projectsSubmitted}</span>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <span className="font-semibold text-foreground">{s.attendanceCount}</span>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <span className="font-semibold text-foreground">{s.bonusCount}</span>
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
