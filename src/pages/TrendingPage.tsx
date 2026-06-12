import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import { NEWS } from "@/data/news";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface TrendingPageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
}

const PERIODS = ["Сегодня", "Неделя", "Месяц"];

export default function TrendingPage({ onOpenComments, savedIds, onToggleSave }: TrendingPageProps) {
  const [period, setPeriod] = useState("Сегодня");

  const sorted = [...NEWS].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif-custom text-2xl font-semibold text-[hsl(var(--foreground))]">
            Популярное
          </h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-0.5">
            Самые обсуждаемые материалы
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
            <div className="flex items-center gap-1 text-[11px] text-orange-600">
              <Icon name="ArrowUp" size={11} />
              <span className="font-semibold">{item.upvotes.toLocaleString()}</span>
            </div>
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
    </div>
  );
}
