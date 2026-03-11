import { Trophy, Crown, Medal } from 'lucide-react';
import { useTopChampions } from '@/hooks/useLeaderboard';
import { getInitials } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';

const RANK_CONFIG = [
  {
    rank: 2,
    icon: Medal,
    iconColor: 'text-slate-300',
    ringColor: 'ring-slate-300/40',
    bg: 'from-slate-400/20 to-transparent',
    border: 'border-slate-400/30',
    avatarBg: 'bg-slate-500/30',
    avatarText: 'text-slate-200',
    height: 'h-auto',
    order: 'order-1 md:order-none',
    scale: '',
  },
  {
    rank: 1,
    icon: Crown,
    iconColor: 'text-yellow-400',
    ringColor: 'ring-yellow-400/50',
    bg: 'from-yellow-500/20 to-transparent',
    border: 'border-yellow-400/40',
    avatarBg: 'bg-yellow-500/20',
    avatarText: 'text-yellow-300',
    height: 'h-auto',
    order: 'order-first md:order-none',
    scale: 'md:scale-105',
  },
  {
    rank: 3,
    icon: Trophy,
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-600/40',
    bg: 'from-amber-700/20 to-transparent',
    border: 'border-amber-600/30',
    avatarBg: 'bg-amber-700/20',
    avatarText: 'text-amber-400',
    height: 'h-auto',
    order: 'order-2 md:order-none',
    scale: '',
  },
];

export default function ChampionsSection() {
  const { data: champions, isLoading } = useTopChampions();

  if (isLoading) {
    return (
      <section id="champions" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  // Reorder: index 0→rank1 (center), index 1→rank2 (left), index 2→rank3 (right)
  const ordered = [
    { student: champions?.[1], config: RANK_CONFIG[0] },
    { student: champions?.[0], config: RANK_CONFIG[1] },
    { student: champions?.[2], config: RANK_CONFIG[2] },
  ];

  return (
    <section id="champions" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            AI Champions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Platinum League <span className="gold-gradient">Top 3</span>
          </h2>
          <p className="text-muted-foreground">The highest-performing innovators this season</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-end justify-center">
          {ordered.map(({ student, config }, i) => {
            const Icon = config.icon;
            if (!student) return null;
            return (
              <div
                key={student.id}
                className={`flex-1 max-w-xs w-full animate-fade-in ${config.scale}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Podium step indicator */}
                <div className="text-center mb-2">
                  <span className={`text-5xl font-black ${config.iconColor} opacity-20`}>
                    #{config.rank}
                  </span>
                </div>

                <div
                  className={`glass-card rounded-2xl p-6 bg-gradient-to-b ${config.bg} border ${config.border} ring-1 ${config.ringColor} relative overflow-hidden`}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                  {/* Rank badge */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.border} bg-card/50`}>
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                      <span className={`text-sm font-bold ${config.iconColor}`}>Rank #{config.rank}</span>
                    </div>
                    <div className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted/50 border border-border">
                      Platinum
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-20 h-20 rounded-full ${config.avatarBg} border-2 ${config.border} flex items-center justify-center mb-4 ring-2 ${config.ringColor} animate-pulse-gold`}
                    >
                      <span className={`text-2xl font-black ${config.avatarText}`}>
                        {getInitials(student.name)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-1">{student.name}</h3>

                    {/* Score */}
                    <div className="mt-4 w-full">
                      <div className="text-center p-3 rounded-xl bg-card/40 border border-border/50">
                        <div className={`text-3xl font-black ${config.iconColor}`}>
                          {student.cumulative_score}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Cumulative Score</div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 mt-3 w-full text-xs">
                      <div className="text-center p-2 rounded-lg bg-muted/40">
                        <div className="font-semibold text-foreground">{student.projects_submitted}</div>
                        <div className="text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/40">
                        <div className="font-semibold text-foreground">{student.attendance_count}</div>
                        <div className="text-muted-foreground">Attended</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
