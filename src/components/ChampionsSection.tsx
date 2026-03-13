import { Crown } from 'lucide-react';
import { useTopChampions } from '@/hooks/useLeaderboard';
import { getInitials } from '@/lib/leaderboard-utils';
import { Skeleton } from '@/components/ui/skeleton';

const PODIUM = [
  {
    rank: 2,
    label: 'Rank #2',
    podiumHeight: 'h-20',
    podiumBg: 'bg-gradient-to-b from-slate-300 to-slate-400',
    cardBorder: 'border-slate-300/60',
    cardBg: 'from-slate-50 to-white',
    avatarBg: 'bg-slate-100 border-slate-300',
    avatarText: 'text-slate-600',
    rankColor: 'text-slate-500',
    rankBg: 'bg-slate-100 border-slate-200',
    crownColor: 'text-slate-400',
    order: 'order-1 md:order-none',
  },
  {
    rank: 1,
    label: 'Rank #1',
    podiumHeight: 'h-32',
    podiumBg: 'bg-gradient-to-b from-yellow-400 to-amber-500',
    cardBorder: 'border-yellow-400/70',
    cardBg: 'from-yellow-50 to-white',
    avatarBg: 'bg-yellow-50 border-yellow-300',
    avatarText: 'text-yellow-700',
    rankColor: 'text-amber-600',
    rankBg: 'bg-yellow-50 border-yellow-200',
    crownColor: 'text-yellow-500',
    order: 'order-first md:order-none',
  },
  {
    rank: 3,
    label: 'Rank #3',
    podiumHeight: 'h-14',
    podiumBg: 'bg-gradient-to-b from-amber-600 to-amber-700',
    cardBorder: 'border-amber-500/50',
    cardBg: 'from-amber-50 to-white',
    avatarBg: 'bg-amber-50 border-amber-300',
    avatarText: 'text-amber-700',
    rankColor: 'text-amber-600',
    rankBg: 'bg-amber-50 border-amber-200',
    crownColor: 'text-amber-600',
    order: 'order-2 md:order-none',
  },
];

export default function ChampionsSection() {
  const { data: champions, isLoading } = useTopChampions();

  // Podium order: Rank2 (left), Rank1 (center), Rank3 (right)
  const ordered = [
    { student: champions?.[1], config: PODIUM[0] }, // rank 2
    { student: champions?.[0], config: PODIUM[1] }, // rank 1
    { student: champions?.[2], config: PODIUM[2] }, // rank 3
  ];

  return (
    <section id="champions" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="section-badge">
            <Crown className="w-4 h-4 text-primary" />
            AI Champions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Top <span className="gold-gradient">3 Champions</span>
          </h2>
          <p className="text-muted-foreground">The highest-performing innovators this season</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col md:flex-row items-end justify-center gap-6">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 w-full max-w-xs rounded-2xl" />)}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6">
            {ordered.map(({ student, config }, i) => {
              if (!student) return null;
              return (
                <div
                  key={student.id}
                  className={`flex-1 max-w-[280px] w-full flex flex-col items-center animate-fade-in ${config.order}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Card */}
                  <div
                    className={`w-full glass-card rounded-2xl p-6 bg-gradient-to-b ${config.cardBg} border ${config.cardBorder} shadow-lg text-center`}
                  >
                    {/* Rank tag */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold mb-4 ${config.rankBg} ${config.rankColor}`}>
                      <Crown className={`w-3.5 h-3.5 ${config.crownColor}`} />
                      {config.label}
                    </div>

                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-full border-2 ${config.avatarBg} flex items-center justify-center mx-auto mb-3`}>
                      <span className={`text-xl font-black ${config.avatarText}`}>
                        {getInitials(student.name)}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-foreground mb-3 leading-tight">{student.name}</h3>

                    {/* Score */}
                    <div className={`text-3xl font-black ${config.rankColor}`}>
                      {student.cumulative_score}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">Cumulative Score</div>
                  </div>

                  {/* Podium step */}
                  <div
                    className={`w-full rounded-b-xl ${config.podiumHeight} ${config.podiumBg} flex items-center justify-center`}
                  >
                    <span className="text-white font-black text-2xl opacity-70">#{config.rank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
