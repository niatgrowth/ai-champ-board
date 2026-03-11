import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStudents } from '@/hooks/useLeaderboard';
import { getLeagueColor, getLeagueLabel, getInitials } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { League } from '@/lib/supabase';

const LEAGUES: { id: League; label: string; colorClass: string; headerBg: string }[] = [
  { id: 'platinum', label: 'Platinum League', colorClass: 'text-platinum border-platinum/40', headerBg: 'from-cyan-400/15 to-transparent' },
  { id: 'gold', label: 'Gold League', colorClass: 'text-gold-league border-gold-league/40', headerBg: 'from-yellow-500/15 to-transparent' },
  { id: 'silver', label: 'Silver League', colorClass: 'text-silver border-silver/40', headerBg: 'from-slate-400/15 to-transparent' },
  { id: 'bronze', label: 'Bronze League', colorClass: 'text-bronze border-bronze/40', headerBg: 'from-amber-700/15 to-transparent' },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 font-black text-sm border border-yellow-400/30">1</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-500/20 text-slate-300 font-black text-sm border border-slate-400/30">2</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 font-black text-sm border border-amber-600/30">3</span>;
  return <span className="text-muted-foreground font-medium text-sm w-7 text-center inline-block">{rank}</span>;
}

function LeagueTable({ league }: { league: typeof LEAGUES[0] }) {
  const { data: students, isLoading } = useStudents(league.id);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/50 animate-fade-in">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-5 bg-gradient-to-r ${league.headerBg} hover:bg-card/30 transition-colors`}
      >
        <div className="flex items-center gap-3">
          <Trophy className={`w-5 h-5 ${league.colorClass.split(' ')[0]}`} />
          <span className={`text-lg font-bold ${league.colorClass.split(' ')[0]}`}>{league.label}</span>
          {students && (
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {students.length} students
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="text-muted-foreground w-14">Rank</TableHead>
                <TableHead className="text-muted-foreground">Student Name</TableHead>
                <TableHead className="text-muted-foreground text-right">Cumulative</TableHead>
                <TableHead className="text-muted-foreground text-right hidden sm:table-cell">Best Week</TableHead>
                <TableHead className="text-muted-foreground text-right hidden md:table-cell">Projects</TableHead>
                <TableHead className="text-muted-foreground text-right hidden md:table-cell">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/20">
                    <TableCell><Skeleton className="h-5 w-7" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                  </TableRow>
                ))
                : students?.map((student, idx) => (
                  <TableRow
                    key={student.id}
                    className={`border-border/20 transition-colors hover:bg-card/40 ${idx < 3 ? 'table-row-highlight' : ''}`}
                  >
                    <TableCell><RankBadge rank={idx + 1} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <span className="font-medium text-foreground text-sm">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${league.colorClass.split(' ')[0]}`}>{student.cumulative_score}</span>
                    </TableCell>
                    <TableCell className="text-right text-foreground hidden sm:table-cell">{student.best_weekly_score}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden md:table-cell">{student.projects_submitted}</TableCell>
                    <TableCell className="text-right text-muted-foreground hidden md:table-cell">{student.attendance_count}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function OverallLeaderboard() {
  return (
    <section id="leaderboard" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 text-primary" />
            Overall Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            League <span className="gold-gradient">Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">Sorted by cumulative score across all 4 leagues</p>
        </div>

        <div className="flex flex-col gap-6">
          {LEAGUES.map((league) => (
            <LeagueTable key={league.id} league={league} />
          ))}
        </div>
      </div>
    </section>
  );
}
