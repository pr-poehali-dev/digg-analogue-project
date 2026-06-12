import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import { CATEGORIES } from "@/data/news";
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

function SkeletonCard() {
  return (
    <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-14 bg-[hsl(var(--muted))] rounded-full" />
        <div className="h-5 w-20 bg-[hsl(var(--muted))] rounded-full" />
      </div>
      <div className="h-6 w-full bg-[hsl(var(--muted))] rounded mb-2" />
      <div className="h-6 w-3/4 bg-[hsl(var(--muted))] rounded mb-4" />
      <div className="h-4 w-full bg-[hsl(var(--muted))] rounded mb-1" />
      <div className="h-4 w-2/3 bg-[hsl(var(--muted))] rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-4 py-4 border-b border-[hsl(var(--border))] last:border-0 animate-pulse">
      <div className="w-10 flex flex-col items-center gap-1 pt-1">
        <div className="h-4 w-4 bg-[hsl(var(--muted))] rounded" />
        <div className="h-3 w-6 bg-[hsl(var(--muted))] rounded" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 w-12 bg-[hsl(var(--muted))] rounded-full" />
          <div className="h-4 w-20 bg-[hsl(var(--muted))] rounded-full" />
        </div>
        <div className="h-4 w-full bg-[hsl(var(--muted))] rounded" />
        <div className="h-4 w-4/5 bg-[hsl(var(--muted))] rounded" />
        <div className="h-3 w-1/2 bg-[hsl(var(--muted))] rounded" />
      </div>
    </div>
  );
}

export default function HomePage({ onOpenComments, savedIds, onToggleSave, news, loading, refetch, lastUpdated }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState("Все");

  const allCategories = ["Все", ...Array.from(new Set(news.map(n => n.category))).sort()];
  const cats = allCategories.length > 1 ? allCategories : CATEGORIES;

  const filtered = activeCategory === "Все"
    ? news
    : news.filter(n => n.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const trendingItems = news.filter(n => n.trending).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Top bar: categories + refresh */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[hsl(var(--foreground))] text-white"
                  : "bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          title={lastUpdated ? `Обновлено: ${lastUpdated.toLocaleTimeString('ru')}` : "Обновить"}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-white border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] transition-all disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={12} className={loading ? "animate-spin" : ""} />
          {lastUpdated ? lastUpdated.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) : "Обновить"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <>
              <SkeletonCard />
              <div className="bg-white border border-[hsl(var(--border))] rounded-lg px-5">
                {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            </>
          ) : (
            <>
              {featured && (
                <NewsCard
                  item={featured}
                  variant="featured"
                  onOpenComments={onOpenComments}
                  isSaved={savedIds.has(featured.id)}
                  onToggleSave={onToggleSave}
                />
              )}
              <div className="bg-white border border-[hsl(var(--border))] rounded-lg">
                <div className="px-5 py-3 border-b border-[hsl(var(--border))] flex items-center justify-between">
                  <h2 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                    Последние новости
                  </h2>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{rest.length} материалов</span>
                </div>
                <div className="px-5">
                  {rest.length === 0 && (
                    <p className="py-6 text-[13px] text-center text-[hsl(var(--muted-foreground))]">
                      Нет новостей в этой категории
                    </p>
                  )}
                  {rest.map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      onOpenComments={onOpenComments}
                      isSaved={savedIds.has(item.id)}
                      onToggleSave={onToggleSave}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Trending */}
          <div className="bg-white border border-[hsl(var(--border))] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[hsl(var(--border))] flex items-center gap-2">
              <Icon name="Flame" size={14} className="text-orange-500" />
              <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                В тренде
              </h3>
            </div>
            <div className="p-2">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 p-2 animate-pulse">
                    <div className="w-6 h-5 bg-[hsl(var(--muted))] rounded flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-[hsl(var(--muted))] rounded w-full" />
                      <div className="h-3.5 bg-[hsl(var(--muted))] rounded w-3/4" />
                      <div className="h-3 bg-[hsl(var(--muted))] rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : trendingItems.length > 0 ? (
                trendingItems.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => onOpenComments(item)}
                    className="w-full flex items-start gap-3 p-2 rounded hover:bg-[hsl(var(--muted))] transition-colors text-left group"
                  >
                    <span className="text-[20px] font-bold text-[hsl(var(--border))] leading-none mt-0.5 w-6 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[12px] font-medium text-[hsl(var(--foreground))] leading-snug group-hover:text-[hsl(var(--muted-foreground))] transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{item.source}</p>
                    </div>
                  </button>
                ))
              ) : (
                news.slice(0, 3).map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => onOpenComments(item)}
                    className="w-full flex items-start gap-3 p-2 rounded hover:bg-[hsl(var(--muted))] transition-colors text-left group"
                  >
                    <span className="text-[20px] font-bold text-[hsl(var(--border))] leading-none mt-0.5 w-6 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[12px] font-medium text-[hsl(var(--foreground))] leading-snug group-hover:text-[hsl(var(--muted-foreground))] transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{item.source}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-4">
            <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
              Сегодня
            </h3>
            <div className="space-y-3">
              {[
                { label: "Новостей", value: news.length, icon: "FileText" },
                { label: "Источников", value: new Set(news.map(n => n.source)).size, icon: "Globe" },
                { label: "Категорий", value: new Set(news.map(n => n.category)).size, icon: "Tag" },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
                    <Icon name={stat.icon} size={13} />
                    {stat.label}
                  </div>
                  <span className="text-[14px] font-semibold text-[hsl(var(--foreground))]">
                    {loading ? "—" : stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          {!loading && (
            <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-4">
              <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
                Источники
              </h3>
              <div className="space-y-1.5">
                {Array.from(new Set(news.map(n => n.source))).slice(0, 6).map(src => {
                  const count = news.filter(n => n.source === src).length;
                  return (
                    <div key={src} className="flex items-center justify-between">
                      <span className="text-[12px] text-[hsl(var(--foreground))]">{src}</span>
                      <span className="text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
