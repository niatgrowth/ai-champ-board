import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ChampionsSection from '@/components/ChampionsSection';
import OverallLeaderboard from '@/components/OverallLeaderboard';
import WeeklyLeaderboard from '@/components/WeeklyLeaderboard';
import SearchSection from '@/components/SearchSection';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        
        <ChampionsSection />
        <OverallLeaderboard />
        <WeeklyLeaderboard />
        <SearchSection />
      </main>
      <footer className="border-t border-border py-8 px-4 text-center bg-white/60">
        <p className="text-muted-foreground text-sm">
          AI Bootcamp - Powered By <span className="text-yellow-500 font-bold">NIAT India</span>
        </p>
      </footer>
    </div>
  );
}
