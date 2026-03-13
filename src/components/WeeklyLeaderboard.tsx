import { useState } from 'react';
import { CalendarDays, CheckCircle, XCircle, Info } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useWeeklyScores, useSettings } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/leaderboard-utils';

const ALL_WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);

/**
 * Scoring rules:
 * - marks: out of 40
 * - attendance: +20 if attended, +0 if not
 * - project submission: +10 if submitted (bonus > 0), +0 if not
 * - winner:
 *     Weeks 1–11 → Top 2 get +30
 *     Weeks 12–16 → Top 1 gets +30
 * - runner-up: top 10 students after winner positions get +15
 */
function computeEnrichedScores(
  scores: Array<{ id: string; marks: number; attendance: boolean; bonus: number; weekly_score: number; students?: { name: string; league: string } }>,
  weekNumber: number
) {
  // Sort by weekly_score desc (already sorted from DB, but re-sort to be safe)
  const sorted = [...scores].sort((a, b) => b.weekly_score - a.weekly_score);

  const winnerCount = weekNumber <= 11 ? 2 : 1;
  const runnerUpEnd = winnerCount + 10; // next 10 after winners

  return sorted.map((score, idx) => {
    const rank = idx + 1;
    const attendance = score.attendance ? 20 : 0;
    const projectSubmission = score.bonus > 0 ? 10 : 0;
    const winner = rank <= winnerCount ? 30 : 0;
    const runnerUp = rank > winnerCount && rank <= runnerUpEnd ? 15 : 0;
    return {
      ...score,
      rank,
      attendanceScore: attendance,
      projectSubmissionScore: projectSubmission,
      winnerBonus: winner,
      runnerUpBonus: runnerUp,
    };
  });
}

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
  const { data: settings } = useSettings();
  const currentWeek = parseInt(settings?.current_week ?? '6');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const activeWeek = selectedWeek ?? currentWeek;
  const { data: rawScores, isLoading } = useWeeklyScores(activeWeek);

  const scores = rawScores ? computeEnrichedScores(rawScores, activeWeek) : [];

  return (
    <TooltipProvider>
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
            <p className="text-muted-foreground">Performance scores updated each week</p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
            {/* Week selector header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <CalendarDays className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Week {activeWeek} Scores</span>
                {/* Score calculation tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-1 text-xs bg-secondary border border-border px-2 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-help">
                      <Info className="w-3.5 h-3.5" />
                      Weekly Score Calculation
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[260px] text-xs leading-relaxed p-3">
                    <p className="font-semibold mb-1.5 text-foreground">Weekly Score =</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>📝 Project Score (/40)</li>
                      <li>✅ Attendance: <span className="text-foreground font-medium">+20</span></li>
                      <li>📦 Project Submission: <span className="text-foreground font-medium">+10</span></li>
                      <li>🏆 Winner (Wk 1–11 top 2, Wk 12–16 top 1): <span className="text-foreground font-medium">+30</span></li>
                      <li>🥈 Runner Up (next 10): <span className="text-foreground font-medium">+15</span></li>
                    </ul>
                    <p className="mt-1.5 text-foreground font-medium">Max ≈ 115</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={String(activeWeek)}
                onValueChange={(v) => setSelectedWeek(parseInt(v))}
              >
                <SelectTrigger className="w-36 bg-white border-border text-foreground text-sm shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-border">
                  {ALL_WEEKS.map((w) => (
                    <SelectItem key={w} value={String(w)} className="text-foreground">
                      Week {w}{w === currentWeek ? ' (Current)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent bg-secondary/30">
                    <TableHead className="text-muted-foreground w-14 font-semibold">Rank</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
                    <TableHead className="text-muted-foreground text-right font-semibold">Score (/40)</TableHead>
                    <TableHead className="text-muted-foreground text-center hidden sm:table-cell font-semibold">Session Attendance</TableHead>
                    <TableHead className="text-muted-foreground text-right hidden sm:table-cell font-semibold">Project Submission</TableHead>
                    <TableHead className="text-muted-foreground text-right hidden md:table-cell font-semibold">Winner</TableHead>
                    <TableHead className="text-muted-foreground text-right hidden md:table-cell font-semibold">Runner Up</TableHead>
                    <TableHead className="text-muted-foreground text-right font-semibold">Weekly Score</TableHead>
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
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    : scores.map((score) => (
                        <TableRow
                          key={score.id}
                          className={`border-border/30 hover:bg-secondary/40 transition-colors ${
                            score.rank <= 3 ? 'table-row-highlight' : ''
                          }`}
                        >
                          <TableCell><RankBadge rank={score.rank} /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0 border border-border/50">
                                {getInitials(score.students?.name ?? '??')}
                              </div>
                              <span className="font-medium text-foreground text-sm">
                                {score.students?.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold text-foreground">{score.marks}</span>
                            <span className="text-muted-foreground text-xs">/40</span>
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            {score.attendance ? (
                              <div className="flex items-center justify-center gap-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-emerald-600 font-medium">+20</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-xs text-muted-foreground">+0</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">
                            <span className={`text-sm font-semibold ${score.projectSubmissionScore > 0 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                              {score.projectSubmissionScore > 0 ? '+10' : '0'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            <span className={`text-sm font-bold ${score.winnerBonus > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                              {score.winnerBonus > 0 ? '+30' : '0'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            <span className={`text-sm font-semibold ${score.runnerUpBonus > 0 ? 'text-slate-600' : 'text-muted-foreground'}`}>
                              {score.runnerUpBonus > 0 ? '+15' : '0'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-primary text-base">{score.weekly_score}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
