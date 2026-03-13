import { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchStudents } from '@/hooks/useLeaderboard';
import { getLeagueColor, getLeagueLabel, getInitials } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Student } from '@/lib/supabase';

function StudentResultCard({ student, rank }: { student: Student; rank: number }) {
  const leagueColorClass = getLeagueColor(student.league);

  return (
    <div className="glass-card rounded-2xl p-5 border border-border/50 animate-scale-in">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-lg font-black text-foreground shrink-0 border border-border/50">
          {getInitials(student.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground text-lg">{student.name}</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${leagueColorClass}`}>
              {getLeagueLabel(student.league)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Rank #{rank} in {getLeagueLabel(student.league)} League</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Cumulative Score', value: student.cumulative_score, highlight: true },
              { label: 'Best Weekly', value: student.best_weekly_score, highlight: false },
              { label: 'Projects', value: student.projects_submitted, highlight: false },
              { label: 'Attended', value: student.attendance_count, highlight: false },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-secondary/60 border border-border/40">
                <div className={`text-xl font-black ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
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
            Find a Student
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Search <span className="gold-gradient">Your Rank</span>
          </h2>
          <p className="text-muted-foreground">Enter your name or mobile number to find your leaderboard position</p>
        </div>

        <div className="max-w-xl mx-auto mb-8 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by name or mobile number..."
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
                <div key={i} className="glass-card rounded-2xl p-5 border border-border/50">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <div className="grid grid-cols-4 gap-3">
                        {[0, 1, 2, 3].map((j) => <Skeleton key={j} className="h-16 rounded-xl" />)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && results && results.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Found <span className="text-foreground font-semibold">{results.length}</span> result{results.length > 1 ? 's' : ''}
              </p>
              {results.map((student, idx) => (
                <StudentResultCard key={student.id} student={student} rank={idx + 1} />
              ))}
            </>
          )}

          {!isLoading && results && results.length === 0 && query.trim().length >= 2 && (
            <div className="text-center py-12 glass-card rounded-2xl border border-border/50">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-foreground font-semibold">No students found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different name or mobile number</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
