import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Scale,
  BookOpen,
  Library,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/council', label: 'Decision Council', icon: Scale, exact: false },
  { to: '/journal', label: 'Decision Journal', icon: BookOpen, exact: false },
  { to: '/library', label: 'Library', icon: Library, exact: false },
];

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex items-center gap-2 rounded-lg transition-all duration-200',
        compact
          ? 'p-2 text-muted-foreground hover:text-foreground hover:bg-accent'
          : 'px-3 py-2 w-full text-xs font-medium text-white/50 hover:text-white hover:bg-white/5',
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-3.5 h-3.5">
        <Sun
          className={cn(
            'w-3.5 h-3.5 absolute inset-0 transition-all duration-300',
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100',
          )}
        />
        <Moon
          className={cn(
            'w-3.5 h-3.5 absolute inset-0 transition-all duration-300',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0',
          )}
        />
      </div>
      {!compact && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-white/10 bg-[#1a1a2e] text-white/80 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src="https://files.taskade.com/staging/space-files/1a0faa0f-1dbc-4a57-9917-99ef4adff008/original/cortex_icon_dark.png"
              alt="Cortex"
              className="w-7 h-7 rounded-lg object-cover hidden dark:block"
            />
            <img
              src="https://files.taskade.com/staging/space-files/475e7a8f-e27e-42ee-ab55-82e85e4088e0/original/cortex_icon_light.png"
              alt="Cortex"
              className="w-7 h-7 rounded-lg object-cover block dark:hidden"
            />
            <span className="font-bold text-sm tracking-wide text-white">CORTEX</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-white/60 hover:text-white hover:bg-white/5',
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-card/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="https://files.taskade.com/staging/space-files/1a0faa0f-1dbc-4a57-9917-99ef4adff008/original/cortex_icon_dark.png"
                alt="Cortex"
                className="w-5 h-5 rounded object-cover hidden dark:block"
              />
              <img
                src="https://files.taskade.com/staging/space-files/475e7a8f-e27e-42ee-ab55-82e85e4088e0/original/cortex_icon_light.png"
                alt="Cortex"
                className="w-5 h-5 rounded object-cover block dark:hidden"
              />
              <span className="font-bold text-sm text-foreground">CORTEX</span>
            </div>
          </div>
          <ThemeToggle compact />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
