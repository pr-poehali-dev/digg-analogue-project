import { useState } from "react";
import DiggNewsItem from "@/components/DiggNewsItem";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
  news: NewsItem[];
  loading: boolean;
  refetch: () => void;
  lastUpdated: Date | null;
}

const CATEGORIES_MAP: Record<string, string> = {
  AI: "ИИ", Hardware: "Железо", Space: "Космос", OS: "ОС",
  Browsers: "Браузеры", Quantum: "Квантум", Robotics: "Роботы",
  Tech: "Технологии", Startups: "Стартапы", Security: "Безопасность", EV: "Электромобили",
};

function SkeletonItem({ index }: { index: number }) {
  return (
    <div className="py-5 animate-pulse" style={{ borderBottom: "1px solid #d4cfc4" }}>
      <div className="flex gap-4">
        <span className="font-serif-custom text-[1.1rem]" style={{ color: "#ccc", minWidth: "1.5rem" }}>{index}</span>
        <div className="flex-1 space-y-2">
          <div className="h-5 rounded" style={{ backgroundColor: "#d4cfc4", width: "85%" }} />
          <div className="h-5 rounded" style={{ backgroundColor: "#d4cfc4", width: "55%" }} />
          <div className="h-3 rounded mt-1" style={{ backgroundColor: "#d4cfc4", width: "40%" }} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onOpenComments, savedIds, onToggleSave, news, loading, refetch, lastUpdated }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState("Все");

  const allCategories = ["Все", ...Array.from(new Set(news.map(n => n.category))).sort()];

  const filtered = activeCategory === "Все" ? news : news.filter(n => n.category === activeCategory);
  const topStory = filtered[0];
  const mainList = filtered.slice(1);
  const trendingItems = news.slice(0, 5);
  const sources = Array.from(new Set(news.map(n => n.source))).slice(0, 6);

  const todayDate = new Date().toLocaleDateString("ru-RU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-10">

        {/* ── MAIN COLUMN ── */}
        <div>
          {/* Page header */}
          <div className="mb-5 pb-4" style={{ borderBottom: "1px solid #d4cfc4" }}>
            <h1 className="font-serif-custom text-[1.35rem] font-semibold" style={{ color: "#141414" }}>
              Главные новости
            </h1>
            <p className="text-[13px] capitalize mt-0.5" style={{ color: "#c06040" }}>
              {todayDate}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "#999" }}>
                  ПОСТОВ: <b style={{ color: "#555" }}>{loading ? "—" : news.length}</b>
                </span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "#999" }}>
                  ИСТОЧНИКОВ: <b style={{ color: "#555" }}>{loading ? "—" : sources.length}</b>
                </span>
                {lastUpdated && (
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "#999" }}>
                    ОБНОВЛЕНО: <b style={{ color: "#555" }}>
                      {lastUpdated.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                    </b>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="text-[10px] font-medium px-3 py-1"
                  style={{ backgroundColor: "#141414", color: "#ece8df", letterSpacing: "0.06em" }}
                >
                  СЕГОДНЯ
                </button>
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="flex items-center gap-1 text-[10px] font-medium px-3 py-1 transition-opacity hover:opacity-70 disabled:opacity-40"
                  style={{ border: "1px solid #ccc", color: "#888", letterSpacing: "0.06em" }}
                >
                  <Icon name="RefreshCw" size={10} className={loading ? "animate-spin" : ""} />
                  7 ДНЕЙ НАЗАД
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 text-[10px] px-2.5 py-1 transition-all"
                  style={{
                    backgroundColor: activeCategory === cat ? "#141414" : "transparent",
                    color: activeCategory === cat ? "#ece8df" : "#888",
                    border: "1px solid " + (activeCategory === cat ? "#141414" : "#ccc"),
                    borderRadius: "999px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {cat === "Все" ? "Все" : (CATEGORIES_MAP[cat] || cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Top story / loading banner */}
          {loading ? (
            <div
              className="mb-5 p-4"
              style={{ backgroundColor: "#e4dfd4", border: "1px solid #d4cfc4" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: "#999" }}>
                  ☕ В PULSE новый день. Сейчас собираются свежие истории.
                </span>
                <span className="text-[11px] font-mono" style={{ color: "#bbb" }}>загрузка...</span>
              </div>
              <div className="mt-2 progress-dots" />
            </div>
          ) : topStory ? (
            <div
              className="mb-5 p-4 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#e4dfd4", border: "1px solid #d4cfc4" }}
              onClick={() => onOpenComments(topStory)}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span style={{ fontSize: "13px" }}>🔥</span>
                <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "#999" }}>
                  На случай, если вы это пропустили
                </span>
              </div>
              <p className="font-serif-custom text-[1rem] font-semibold leading-snug" style={{ color: "#141414" }}>
                {topStory.title}
              </p>
              {topStory.excerpt && (
                <p className="text-[12px] mt-1.5 line-clamp-2" style={{ color: "#666" }}>
                  {topStory.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px]" style={{ color: "#999" }}>{topStory.source}</span>
                <span className="text-[11px]" style={{ color: "#999" }}>{topStory.time}</span>
                <span className="tag-pill">{CATEGORIES_MAP[topStory.category] || topStory.category}</span>
              </div>
            </div>
          ) : null}

          {/* News list */}
          <div>
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonItem key={i} index={i + 1} />)
              : mainList.map((item, i) => (
                  <DiggNewsItem
                    key={item.id}
                    item={item}
                    index={i + 2}
                    onOpenComments={onOpenComments}
                    isSaved={savedIds.has(item.id)}
                    onToggleSave={onToggleSave}
                  />
                ))
            }
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:block space-y-7">
          {/* Trending */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: "#999" }}>
              Недавние звёзды
            </h3>
            <div className="space-y-4">
              {trendingItems.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono" style={{ color: "#aaa" }}>{item.source}</span>
                    <span style={{ color: "#ccc", fontSize: "9px" }}>·</span>
                    <span className="text-[10px]" style={{ color: "#aaa" }}>{item.time}</span>
                  </div>
                  <div
                    className="flex items-start gap-2.5 p-2.5 cursor-pointer hover:opacity-75 transition-opacity"
                    style={{ backgroundColor: "#e4dfd4", border: "1px solid #d4cfc4" }}
                    onClick={() => onOpenComments(item)}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-[12px] font-bold font-serif-custom"
                      style={{ backgroundColor: "#d0cbbf", color: "#777" }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold leading-snug line-clamp-2 font-serif-custom" style={{ color: "#141414" }}>
                        {item.title}
                      </p>
                      {item.upvotes > 0 && (
                        <p className="text-[10px] mt-1" style={{ color: "#aaa" }}>
                          {item.upvotes.toLocaleString()} звёзд
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#999" }}>
              Источники
            </h3>
            {sources.map(src => (
              <div
                key={src}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid #d4cfc4" }}
              >
                <span className="text-[11px]" style={{ color: "#444" }}>{src}</span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5"
                  style={{ backgroundColor: "#d4cfc4", color: "#666" }}
                >
                  {news.filter(n => n.source === src).length}
                </span>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#999" }}>
              Категории
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {allCategories.filter(c => c !== "Все").map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="text-[10px] px-2 py-1 transition-all"
                  style={{
                    backgroundColor: activeCategory === cat ? "#141414" : "transparent",
                    color: activeCategory === cat ? "#ece8df" : "#888",
                    border: "1px solid " + (activeCategory === cat ? "#141414" : "#ccc"),
                    borderRadius: "999px",
                  }}
                >
                  {CATEGORIES_MAP[cat] || cat}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
