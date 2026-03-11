import { useState } from 'react';
import { Menu, X, Crown, Trophy, CalendarDays, Search } from 'lucide-react';

const NAV_LINKS = [
  { href: '#home', label: 'Home', icon: null },
  { href: '#champions', label: 'Champions', icon: Crown },
  { href: '#leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '#weekly', label: 'Weekly', icon: CalendarDays },
  { href: '#search', label: 'Search', icon: Search },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-md glow-gold">
            <span className="text-primary-foreground font-black text-xs">N</span>
          </div>
          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
            NIAT <span className="text-primary">India</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-medium"
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-medium"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
