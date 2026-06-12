import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface TrendingPageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
  news: NewsItem[];
  loading: boolean;
}

const PERIODS = ["Сегодня", "Неделя", "Месяц"];

export default function TrendingPage({ onOpenComments, savedIds, onToggleSave, news, loading }: TrendingPageProps) {
  const [period, setPeriod] = useState("Сегодня");

  const sorted = [...news].sort((a, b) => b.upvotes - a.upvotes);

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-7 w-36 bg-[hsl(var(--muted))] rounded animate-pulse" />
            <div className="h-4 w-52 bg-[hsl(var(--muted))] rounded animate-pulse" />
          </div>
          <div className="h-9 w-48 bg-[hsl(var(--muted))] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[hsl(var(--border))] rounded-lg p-4 animate-pulse space-y-2">
              <div className="h-6 w-8 bg-[hsl(var(--muted))] rounded" />
              <div className="h-4 w-full bg-[hsl(var(--muted))] rounded" />
              <div className="h-4 w-3/4 bg-[hsl(var(--muted))] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif-custom text-2xl font-semibold text-[hsl(var(--foreground))]">
            Популярное
          </h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-0.5">
            {news.length} материалов из реальных источников
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-[hsl(var(--border))] rounded-lg p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
                period === p
                  ? "bg-[hsl(var(--foreground))] text-white"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-[hsl(var(--muted-foreground))]">
          <Icon name="TrendingUp" size={36} />
          <p className="text-[14px] mt-3">Загружаем рейтинг...</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {sorted.slice(0, 3).map((item, i) => (
              <div
                key={item.id}
                className={`bg-white border border-[hsl(var(--border))] rounded-lg p-4 cursor-pointer hover-lift ${
                  i === 0 ? "border-orange-200 bg-orange-50/30" : ""
                }`}
                onClick={() => onOpenComments(item)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl font-bold ${
                    i === 0 ? "text-orange-400" : i === 1 ? "text-gray-400" : "text-amber-600"
                  }`}>
                    #{i + 1}
                  </span>
                  {i === 0 && <Icon name="Crown" size={16} className="text-orange-400" />}
                </div>
                <p className="text-[12px] font-semibold text-[hsl(var(--foreground))] leading-snug line-clamp-3 mb-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-1">{item.source}</p>
                {item.upvotes > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-orange-600">
                    <Icon name="ArrowUp" size={11} />
                    <span className="font-semibold">{item.upvotes.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Full list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sorted.slice(3).map((item, i) => (
              <div key={item.id} className="relative">
                <span className="absolute -left-1 top-4 text-[11px] font-bold text-[hsl(var(--border))] w-6 text-center z-10">
                  #{i + 4}
                </span>
                <div className="ml-5">
                  <NewsCard
                    item={item}
                    onOpenComments={onOpenComments}
                    isSaved={savedIds.has(item.id)}
                    onToggleSave={onToggleSave}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
