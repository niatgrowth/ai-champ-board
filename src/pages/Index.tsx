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
        <HeroSection />
        <ChampionsSection />
        <OverallLeaderboard />
        <WeeklyLeaderboard />
        <SearchSection />
      </main>
      <footer className="border-t border-border/30 py-8 px-4 text-center">
        <p className="text-muted-foreground text-sm">
          © 2024 <span className="text-primary font-semibold">NIAT India</span> — AI Bootcamp Leaderboard. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
