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
import { getInitials } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Student } from '@/lib/supabase';

/** Dynamic league distribution: 10% Platinum, 20% Gold, 30% Silver, 40% Bronze */
function distributeLeagues(students: Student[]): {
  platinum: Student[];
  gold: Student[];
  silver: Student[];
  bronze: Student[];
} {
  const sorted = [...students].sort((a, b) => b.cumulative_score - a.cumulative_score);
  const total = sorted.length;

  const platCount = Math.max(1, Math.round(total * 0.10));
  const goldCount = Math.max(1, Math.round(total * 0.20));
  const silverCount = Math.max(1, Math.round(total * 0.30));

  const platinum = sorted.slice(0, platCount);
  const gold = sorted.slice(platCount, platCount + goldCount);
  const silver = sorted.slice(platCount + goldCount, platCount + goldCount + silverCount);
  const bronze = sorted.slice(platCount + goldCount + silverCount);

  return { platinum, gold, silver, bronze };
}

const LEAGUES = [
  {
    id: 'platinum' as const,
    label: 'Platinum League',
    headerClass: 'league-platinum-bg',
    scoreColor: 'text-platinum',
    percent: 'Top 10%',
    dotColor: 'bg-blue-500',
  },
  {
    id: 'gold' as const,
    label: 'Gold League',
    headerClass: 'league-gold-bg',
    scoreColor: 'text-primary',
    percent: 'Next 20%',
    dotColor: 'bg-amber-400',
  },
  {
    id: 'silver' as const,
    label: 'Silver League',
    headerClass: 'league-silver-bg',
    scoreColor: 'text-silver',
    percent: 'Next 30%',
    dotColor: 'bg-slate-400',
  },
  {
    id: 'bronze' as const,
    label: 'Bronze League',
    headerClass: 'league-bronze-bg',
    scoreColor: 'text-bronze',
    percent: 'Remaining 40%',
    dotColor: 'bg-amber-600',
  },
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

function LeagueTable({
  league,
  students,
  globalOffset,
}: {
  league: (typeof LEAGUES)[0];
  students: Student[];
  globalOffset: number;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-5 ${league.headerClass} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${league.dotColor}`} />
          <span className="text-lg font-bold text-foreground">{league.label}</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent bg-secondary/30">
                <TableHead className="text-muted-foreground w-14 font-semibold">Rank</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
                <TableHead className="text-muted-foreground text-right font-semibold">
                  Cumulative Score
                </TableHead>
                <TableHead className="text-muted-foreground text-right hidden sm:table-cell font-semibold">
                  Best Weekly
                </TableHead>
                <TableHead className="text-muted-foreground text-right hidden md:table-cell font-semibold">
                  Projects
                </TableHead>
                <TableHead className="text-muted-foreground text-right hidden md:table-cell font-semibold">
                  Attendance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, idx) => (
                <TableRow
                  key={student.id}
                  className={`border-border/30 transition-colors hover:bg-secondary/40 ${
                    idx < 3 ? 'table-row-highlight' : ''
                  }`}
                >
                  <TableCell>
                    <RankBadge rank={globalOffset + idx + 1} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0 border border-border/50">
                        {getInitials(student.name)}
                      </div>
                      <span className="font-medium text-foreground text-sm">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold ${league.scoreColor}`}>
                      {student.cumulative_score}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-foreground hidden sm:table-cell font-medium">
                    {student.best_weekly_score}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                    {student.projects_submitted}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                    {student.attendance_count}
                  </TableCell>
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
  const { data: allStudents, isLoading } = useStudents();

  const distributed = allStudents ? distributeLeagues(allStudents) : null;

  const leagueOffsets = distributed
    ? {
        platinum: 0,
        gold: distributed.platinum.length,
        silver: distributed.platinum.length + distributed.gold.length,
        bronze:
          distributed.platinum.length +
          distributed.gold.length +
          distributed.silver.length,
      }
    : null;

  return (
    <section id="leaderboard" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="section-badge">
            <Trophy className="w-4 h-4 text-primary" />
            Overall Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            League <span className="gold-gradient">Leaderboard</span>
          </h2>
          <p className="text-muted-foreground">
            Dynamic league distribution based on total participants
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {isLoading
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden">
                  <Skeleton className="h-16 w-full" />
                  <div className="p-4 flex flex-col gap-3">
                    {[0, 1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-10 w-full" />
                    ))}
                  </div>
                </div>
              ))
            : distributed &&
              leagueOffsets &&
              LEAGUES.map((league) => (
                <LeagueTable
                  key={league.id}
                  league={league}
                  students={distributed[league.id]}
                  globalOffset={leagueOffsets[league.id]}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
