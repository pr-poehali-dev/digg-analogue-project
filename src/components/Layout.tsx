import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const navItems = [
    { id: "home", label: "ИСТОРИИ" },
    { id: "trending", label: "РЕЙТИНГИ" },
    { id: "search", label: "ПОИСК" },
    { id: "saved", label: "СОХРАНЁННОЕ" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ece8df" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#ece8df", borderBottom: "1px solid #d4cfc4" }}>
        <div className="max-w-6xl mx-auto px-5 h-12 flex items-center gap-6">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="digg-title text-[1.5rem] tracking-tight" style={{ color: "#141414" }}>
              PULSE
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#141414", color: "#ece8df", letterSpacing: "0.04em" }}
            >
              / Технологии
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="transition-colors"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: activePage === item.id ? "#141414" : "#999",
                  borderBottom: activePage === item.id ? "1px solid #141414" : "1px solid transparent",
                  paddingBottom: "1px",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => onNavigate("search")}
              className="hidden md:flex items-center gap-1.5 transition-colors"
              style={{ fontSize: "11px", color: "#999", letterSpacing: "0.04em" }}
            >
              <Icon name="Search" size={12} />
              <span className="font-mono">CTRL + K</span>
            </button>
            <span
              style={{ width: "1px", height: "14px", backgroundColor: "#d4cfc4" }}
              className="hidden md:block"
            />
            <button
              onClick={() => onNavigate("profile")}
              className="text-[11px] font-medium tracking-widest px-3 py-1.5 transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#141414", color: "#ece8df" }}
            >
              ПРОФИЛЬ
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-5 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ backgroundColor: "#ece8df", borderTop: "1px solid #d4cfc4" }}
      >
        <div className="flex">
          {[
            { id: "home", label: "Истории", icon: "Rss" },
            { id: "trending", label: "Рейтинг", icon: "TrendingUp" },
            { id: "search", label: "Поиск", icon: "Search" },
            { id: "saved", label: "Сохранено", icon: "Bookmark" },
            { id: "profile", label: "Профиль", icon: "User" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors"
              style={{ color: activePage === item.id ? "#141414" : "#aaa" }}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
