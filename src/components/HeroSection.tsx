import { Users, FolderOpen, Calendar } from 'lucide-react';
import { useSettings } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroSection() {
  const { data: settings, isLoading } = useSettings();

  const stats = [
    {
      label: 'Total Students',
      value: settings?.total_students ?? '—',
      icon: Users,
      color: 'text-platinum',
      bg: 'from-cyan-400/10 to-transparent border-cyan-400/20',
    },
    {
      label: 'Total Projects',
      value: settings?.total_projects ?? '—',
      icon: FolderOpen,
      color: 'text-primary',
      bg: 'from-primary/10 to-transparent border-primary/20',
    },
    {
      label: 'Current Week',
      value: settings?.current_week ? `Week ${settings.current_week}` : '—',
      icon: Calendar,
      color: 'text-bronze',
      bg: 'from-amber-500/10 to-transparent border-amber-500/20',
    },
  ];

  return (
    <section id="home" className="relative pt-24 pb-16 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Brand */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-lg glow-gold">
              <span className="text-primary-foreground font-black text-sm">N</span>
            </div>
            <span className="text-xl font-bold tracking-wide text-foreground">
              NIAT <span className="text-primary">India</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight">
            AI Bootcamp{' '}
            <span className="gold-gradient">Leaderboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Track the top innovators building AI projects every week.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${bg} flex items-center gap-4`}
            >
              <div className={`p-3 rounded-xl bg-card/60 border border-border/50`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mb-1" />
                ) : (
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                )}
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
