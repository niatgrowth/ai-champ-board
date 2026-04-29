import { useState } from 'react';
import { Search, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchStudents } from '@/hooks/useLeaderboard';
import { getLeagueLabel, getInitials } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';

type SearchResult = {
  id: string;
  name: string;
  mobile: string | null;
  league: string;
  cumulative_score: number;
  best_weekly_score: number;
  projects_submitted: number;
  attendance_count: number;
  created_at: string;
  globalRank: number;
  leagueRank: number;
  assignedLeague: string;
};

// ── League config (mirrors OverallLeaderboard) ──────────────────────────────
const LEAGUE_CONFIG: Record<string, {
  laurelColor: string;
  titleColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  scoreColor: string;
  glowBorder: string;
  rankBg: string;
}> = {
  platinum: {
    laurelColor: 'text-blue-400',
    titleColor: 'text-blue-700',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-300',
    badgeText: 'text-blue-700',
    scoreColor: 'text-blue-600',
    glowBorder: 'border-blue-200 shadow-blue-100',
    rankBg: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  gold: {
    laurelColor: 'text-amber-400',
    titleColor: 'text-amber-700',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-300',
    badgeText: 'text-amber-700',
    scoreColor: 'text-amber-600',
    glowBorder: 'border-amber-200 shadow-amber-100',
    rankBg: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  silver: {
    laurelColor: 'text-slate-400',
    titleColor: 'text-slate-600',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-300',
    badgeText: 'text-slate-600',
    scoreColor: 'text-slate-600',
    glowBorder: 'border-slate-200 shadow-slate-100',
    rankBg: 'bg-slate-100 border-slate-300 text-slate-600',
  },
  bronze: {
    laurelColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-300',
    badgeText: 'text-amber-800',
    scoreColor: 'text-amber-700',
    glowBorder: 'border-orange-200 shadow-orange-100',
    rankBg: 'bg-orange-50 border-orange-200 text-amber-800',
  },
};

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

function StudentResultCard({ student }: { student: SearchResult }) {
  const league = student.assignedLeague || student.league;
  const cfg = LEAGUE_CONFIG[league] ?? LEAGUE_CONFIG.bronze;

  return (
    <div className={`glass-card rounded-2xl overflow-hidden border shadow-md animate-scale-in ${cfg.glowBorder}`}>
      {/* League header banner */}
      <div className={`px-5 py-3 ${cfg.badgeBg} border-b ${cfg.badgeBorder} flex items-center justify-center gap-2`}>
        <LaurelLeft className={`w-12 h-8 ${cfg.laurelColor} shrink-0`} />
        <span className={`text-sm font-black tracking-[0.16em] ${cfg.titleColor}`}>
          {getLeagueLabel(league).toUpperCase()} LEAGUE
        </span>
        <LaurelRight className={`w-12 h-8 ${cfg.laurelColor} shrink-0`} />
      </div>

      <div className="p-5">
        {/* Avatar + Name + Rank */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl ${cfg.badgeBg} flex items-center justify-center text-lg font-black ${cfg.titleColor} shrink-0 border ${cfg.badgeBorder}`}>
            {getInitials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-xl leading-tight">{student.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Trophy className={`w-3.5 h-3.5 ${cfg.scoreColor}`} />
              <span className={`text-sm font-semibold ${cfg.scoreColor}`}>
                Rank #{student.globalRank} in {getLeagueLabel(league)} League
              </span>
            </div>
          </div>
          {/* Global rank badge */}
          <div className={`shrink-0 w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center ${cfg.rankBg}`}>
            <span className="text-xs font-semibold opacity-70">Rank</span>
            <span className="text-2xl font-black leading-none">#{student.globalRank}</span>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Points', value: student.cumulative_score, highlight: true },
            { label: 'Best Weekly Score', value: student.best_weekly_score, highlight: false },
            { label: 'Projects Built', value: student.projects_submitted, highlight: false },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-secondary/60 border border-border/40">
              <div className={`text-xl font-black ${highlight ? cfg.scoreColor : 'text-foreground'}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Motivational footer */}
        <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl ${cfg.badgeBg} border ${cfg.badgeBorder}`}>
          <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.scoreColor}`} />
          <p className={`text-xs leading-relaxed ${cfg.titleColor}`}>
            Keep building AI projects and winning weekly challenges to climb the leaderboard and reach the next league.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading, isFetching } = useSearchStudents(query);

  return (
    <section id="search" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="section-badge">
            <Search className="w-4 h-4 text-primary" />
            Student Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Find Your <span className="gold-gradient">Bootcamp Ranking</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Search by your name to view your leaderboard position, league, and performance in the AI Bootcamp.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-base bg-white border-border focus-visible:ring-primary rounded-xl shadow-sm"
            />
            {(isLoading || isFetching) && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {query.trim().length > 0 && query.trim().length < 2 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">Type at least 2 characters to search</p>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4">
          {isLoading && query.trim().length >= 2 && (
            <>
              {[0, 1].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden border border-border/50">
                  <Skeleton className="h-12 w-full" />
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-5">
                      <Skeleton className="w-14 h-14 rounded-2xl" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="w-14 h-14 rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[0, 1, 2, 3].map((j) => <Skeleton key={j} className="h-16 rounded-xl" />)}
                    </div>
                    <Skeleton className="h-12 rounded-xl" />
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && results && results.length > 0 && (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-semibold">Leaderboard Position</span>
                  {results.length > 1 && (
                    <span> — {results.length} results</span>
                  )}
                </p>
              </div>
              {results.map((student) => (
                <StudentResultCard key={student.id} student={student as SearchResult} />
              ))}
            </>
          )}

          {!isLoading && results && results.length === 0 && query.trim().length >= 2 && (
            <div className="text-center py-12 glass-card rounded-2xl border border-border/50">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-foreground font-semibold">No students found</p>
              <p className="text-muted-foreground text-sm mt-1">Try searching with a different name</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
