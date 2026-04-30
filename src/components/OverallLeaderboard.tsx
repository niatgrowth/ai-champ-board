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
import { useOverallLeaderboard } from '@/hooks/useLeaderboard';
import { getInitials, type RankedStudent } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';

const LEAGUES = [
  {
    id: 'platinum' as const,
    label: 'PLATINUM LEAGUE',
    headerClass: 'league-platinum-bg',
    scoreColor: 'text-platinum',
    laurelColor: 'text-blue-400',
    titleColor: 'text-blue-700',
    glowClass: 'hover:shadow-blue-100',
  },
  {
    id: 'gold' as const,
    label: 'GOLD LEAGUE',
    headerClass: 'league-gold-bg',
    scoreColor: 'text-primary',
    laurelColor: 'text-amber-400',
    titleColor: 'text-amber-700',
    glowClass: 'hover:shadow-amber-100',
  },
  {
    id: 'silver' as const,
    label: 'SILVER LEAGUE',
    headerClass: 'league-silver-bg',
    scoreColor: 'text-silver',
    laurelColor: 'text-slate-400',
    titleColor: 'text-slate-600',
    glowClass: 'hover:shadow-slate-100',
  },
  {
    id: 'bronze' as const,
    label: 'BRONZE LEAGUE',
    headerClass: 'league-bronze-bg',
    scoreColor: 'text-bronze',
    laurelColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    glowClass: 'hover:shadow-orange-100',
  },
];

function LaurelLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.85">
        <path d="M54 18 Q40 16 26 20 Q14 24 6 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="46" cy="12" rx="7" ry="3.5" transform="rotate(-25 46 12)" fill="currentColor" opacity="0.7"/>
        <ellipse cx="38" cy="9" rx="6.5" ry="3" transform="rotate(-35 38 9)" fill="currentColor" opacity="0.65"/>
        <ellipse cx="30" cy="8" rx="6" ry="3" transform="rotate(-20 30 8)" fill="currentColor" opacity="0.6"/>
        <ellipse cx="22" cy="10" rx="5.5" ry="2.5" transform="rotate(-10 22 10)" fill="currentColor" opacity="0.55"/>
        <ellipse cx="15" cy="14" rx="5" ry="2.5" transform="rotate(5 15 14)" fill="currentColor" opacity="0.5"/>
        <ellipse cx="44" cy="24" rx="6.5" ry="3" transform="rotate(20 44 24)" fill="currentColor" opacity="0.65"/>
        <ellipse cx="36" cy="27" rx="6" ry="2.8" transform="rotate(30 36 27)" fill="currentColor" opacity="0.6"/>
        <ellipse cx="28" cy="28" rx="5.5" ry="2.5" transform="rotate(15 28 28)" fill="currentColor" opacity="0.55"/>
        <ellipse cx="20" cy="26" rx="5" ry="2.3" transform="rotate(5 20 26)" fill="currentColor" opacity="0.5"/>
        <circle cx="10" cy="18" r="2.2" fill="currentColor" opacity="0.8"/>
        <circle cx="7" cy="16" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="7" cy="20" r="1.5" fill="currentColor" opacity="0.6"/>
      </g>
    </svg>
  );
}

function LaurelRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
      <g opacity="0.85">
        <path d="M54 18 Q40 16 26 20 Q14 24 6 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="46" cy="12" rx="7" ry="3.5" transform="rotate(-25 46 12)" fill="currentColor" opacity="0.7"/>
        <ellipse cx="38" cy="9" rx="6.5" ry="3" transform="rotate(-35 38 9)" fill="currentColor" opacity="0.65"/>
        <ellipse cx="30" cy="8" rx="6" ry="3" transform="rotate(-20 30 8)" fill="currentColor" opacity="0.6"/>
        <ellipse cx="22" cy="10" rx="5.5" ry="2.5" transform="rotate(-10 22 10)" fill="currentColor" opacity="0.55"/>
        <ellipse cx="15" cy="14" rx="5" ry="2.5" transform="rotate(5 15 14)" fill="currentColor" opacity="0.5"/>
        <ellipse cx="44" cy="24" rx="6.5" ry="3" transform="rotate(20 44 24)" fill="currentColor" opacity="0.65"/>
        <ellipse cx="36" cy="27" rx="6" ry="2.8" transform="rotate(30 36 27)" fill="currentColor" opacity="0.6"/>
        <ellipse cx="28" cy="28" rx="5.5" ry="2.5" transform="rotate(15 28 28)" fill="currentColor" opacity="0.55"/>
        <ellipse cx="20" cy="26" rx="5" ry="2.3" transform="rotate(5 20 26)" fill="currentColor" opacity="0.5"/>
        <circle cx="10" cy="18" r="2.2" fill="currentColor" opacity="0.8"/>
        <circle cx="7" cy="16" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="7" cy="20" r="1.5" fill="currentColor" opacity="0.6"/>
      </g>
    </svg>
  );
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

function LeagueTable({
  league,
  students,
}: {
  league: (typeof LEAGUES)[0];
  students: RankedStudent[];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`glass-card rounded-2xl overflow-hidden animate-fade-in shadow-md transition-shadow hover:shadow-lg ${league.glowClass}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-5 ${league.headerClass} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 flex items-center justify-center gap-2">
            <LaurelLeft className={`w-14 h-9 ${league.laurelColor} shrink-0`} />
            <span className={`text-base font-black tracking-[0.18em] ${league.titleColor} select-none`}>
              {league.label}
            </span>
            <LaurelRight className={`w-14 h-9 ${league.laurelColor} shrink-0`} />
          </div>
          <div className="ml-3 shrink-0">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent bg-secondary/30">
                <TableHead className="text-muted-foreground w-14 font-semibold">Rank</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Student Name</TableHead>
                <TableHead className="text-muted-foreground text-center font-semibold">Winner Up</TableHead>
                <TableHead className="text-muted-foreground text-center font-semibold">Runner Up</TableHead>
                <TableHead className="text-muted-foreground text-right font-semibold">
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, idx) => (
                <TableRow
                  key={student.mobile}
                  className={`border-border/30 transition-all duration-200 cursor-default
                    hover:bg-secondary/50 hover:shadow-sm hover:scale-[1.002]
                    ${idx < 3 ? 'table-row-highlight' : ''}
                  `}
                >
                  <TableCell>
                    <RankBadge rank={student.rank} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0 border border-border/50">
                        {getInitials(student.name)}
                      </div>
                      <span className="font-medium text-foreground text-sm">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground text-sm font-medium">
                      {student.totalWinnerUp}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-muted-foreground text-sm font-medium">
                      {student.totalRunnerUp}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-bold ${league.scoreColor}`}>
                      {student.totalScore}
                    </span>
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
  const { data: ranked, isLoading } = useOverallLeaderboard();

  const grouped = ranked
    ? {
        platinum: ranked.filter((s) => s.league === 'platinum'),
        gold: ranked.filter((s) => s.league === 'gold'),
        silver: ranked.filter((s) => s.league === 'silver'),
        bronze: ranked.filter((s) => s.league === 'bronze'),
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            AI Bootcamp <span className="gold-gradient">Champions Board</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Track the top builders, creators, and innovators of AI bootcamp.<br />
            Earn points through projects and weekly challenges to climb the leagues.
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
            : grouped &&
              LEAGUES.map((league) => (
                <LeagueTable
                  key={league.id}
                  league={league}
                  students={grouped[league.id]}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
