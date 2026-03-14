import { Users, FolderOpen } from 'lucide-react';
import { useSettings, useStudents } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroSection() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: allStudents, isLoading: studentsLoading } = useStudents();

  const isLoading = settingsLoading || studentsLoading;

  // Dynamically calculate total project submissions
  const totalProjects = allStudents
    ? allStudents.reduce((sum, s) => sum + (s.projects_submitted ?? 0), 0)
    : null;

  const totalStudents = allStudents?.length ?? null;

  const stats = [
    {
      label: 'Total Active Participants',
      value: totalStudents ?? settings?.total_students ?? '—',
      icon: Users,
      color: 'text-platinum',
      bg: 'from-blue-500/8 to-transparent',
      border: 'border-blue-300/40',
      iconBg: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Total Project Submissions',
      value: totalProjects ?? settings?.total_projects ?? '—',
      icon: FolderOpen,
      color: 'text-primary',
      bg: 'from-amber-400/8 to-transparent',
      border: 'border-amber-300/40',
      iconBg: 'bg-amber-50 border-amber-200',
    },
  ];

  return (
    <section id="home" className="relative pt-28 pb-16 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5 tracking-wider uppercase">
            AI Bootcamp Leaderboard
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
            Track the{' '}
            <span className="gold-gradient">Top Student Innovators</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Compete, build, and climb the leaderboard as you complete AI challenges every week.
          </p>
        </div>

        {/* Stat cards */}
        <div className="flex justify-center gap-4 flex-wrap animate-fade-in" style={{ animationDelay: '150ms' }}>
          {stats.map(({ label, value, icon: Icon, color, bg, border, iconBg }) => (
            <div
              key={label}
              className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${bg} border ${border} flex items-center gap-4 min-w-[220px]`}
            >
              <div className={`p-3 rounded-xl border ${iconBg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <div className={`text-3xl font-black ${color}`}>{value}</div>
                )}
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
