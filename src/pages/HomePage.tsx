import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import { NEWS, CATEGORIES } from "@/data/news";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface HomePageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
}

export default function HomePage({ onOpenComments, savedIds, onToggleSave }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filtered = activeCategory === "Все"
    ? NEWS
    : NEWS.filter(n => n.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="animate-fade-in">
      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Featured */}
          {featured && (
            <NewsCard
              item={featured}
              variant="featured"
              onOpenComments={onOpenComments}
              isSaved={savedIds.has(featured.id)}
              onToggleSave={onToggleSave}
            />
          )}

          {/* List */}
          <div className="bg-white border border-[hsl(var(--border))] rounded-lg">
            <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
              <h2 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Последние новости
              </h2>
            </div>
            <div className="px-5">
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
              {NEWS.filter(n => n.trending).map((item, i) => (
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
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-4">
            <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
              Сегодня
            </h3>
            <div className="space-y-3">
              {[
                { label: "Новостей", value: NEWS.length, icon: "FileText" },
                { label: "Обсуждений", value: NEWS.reduce((a, n) => a + n.comments.length, 0), icon: "MessageSquare" },
                { label: "В тренде", value: NEWS.filter(n => n.trending).length, icon: "TrendingUp" },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
                    <Icon name={stat.icon} size={13} />
                    {stat.label}
                  </div>
                  <span className="text-[14px] font-semibold text-[hsl(var(--foreground))]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-4">
            <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
              Категории
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.filter(c => c !== "Все").map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    activeCategory === cat
                      ? "bg-[hsl(var(--foreground))] text-white border-transparent"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
