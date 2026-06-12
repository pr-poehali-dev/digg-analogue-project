import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  searchQuery?: string;
  onSearch?: (q: string) => void;
}

export default function Layout({ children, activePage, onNavigate, searchQuery = "", onSearch }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная", icon: "Rss" },
    { id: "trending", label: "Популярное", icon: "TrendingUp" },
    { id: "search", label: "Поиск", icon: "Search" },
    { id: "saved", label: "Сохранённое", icon: "Bookmark" },
    { id: "profile", label: "Профиль", icon: "User" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[hsl(var(--border))]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 bg-[hsl(var(--foreground))] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-tight">P</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[hsl(var(--foreground))]">
              PULSE
            </span>
            <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-light ml-0.5 hidden sm:block">
              tech news
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-medium transition-colors
                  ${activePage === item.id
                    ? "bg-[hsl(var(--foreground))] text-white"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                  }
                `}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("search")}
              className="md:hidden p-2 rounded hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <Icon name="Search" size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={18} />
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="hidden md:flex w-8 h-8 rounded-full bg-[hsl(var(--muted))] items-center justify-center hover:bg-[hsl(var(--border))] transition-colors"
            >
              <Icon name="User" size={14} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[hsl(var(--border))] bg-white animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-colors text-left
                  ${activePage === item.id
                    ? "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                  }
                `}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--border))] z-40">
        <div className="flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors
                ${activePage === item.id
                  ? "text-[hsl(var(--foreground))]"
                  : "text-[hsl(var(--muted-foreground))]"
                }
              `}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
