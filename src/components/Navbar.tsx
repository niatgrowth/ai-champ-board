import { useState } from 'react';
import { Menu, X, Crown, Trophy, CalendarDays, Search, Home } from 'lucide-react';

const NAV_LINKS = [
  { href: 'https://www.niatindia.com/ai-bootcamp', label: 'Home', icon: Home, external: true },
  { href: '#champions', label: 'Champions', icon: Crown, external: false },
  { href: '#leaderboard', label: 'Leaderboard', icon: Trophy, external: false },
  { href: '#weekly', label: 'Weekly', icon: CalendarDays, external: false },
  { href: '#search', label: 'Search', icon: Search, external: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center group">
          <img src="/logo.svg" alt="NIAT Logo" className="h-10 w-auto object-contain" />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon, external }) => (
            <a
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
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
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon, external }) => (
              <a
                key={href}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
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
