import { useState } from "react";
import DiggNewsItem from "@/components/DiggNewsItem";
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
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #d4cfc4" }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif-custom text-[1.35rem] font-semibold" style={{ color: "#141414" }}>
              Рейтинги
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: "#999" }}>
              Самые популярные материалы
            </p>
          </div>
          <div className="flex items-center gap-0" style={{ border: "1px solid #ccc" }}>
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: period === p ? "#141414" : "transparent",
                  color: period === p ? "#ece8df" : "#888",
                  letterSpacing: "0.07em",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 py-4 animate-pulse" style={{ borderBottom: "1px solid #d4cfc4" }}>
              <div className="font-serif-custom text-[1.1rem]" style={{ color: "#ccc", minWidth: "1.5rem" }}>{i + 1}</div>
              <div className="flex-1 space-y-2">
                <div className="h-5 rounded" style={{ backgroundColor: "#d4cfc4", width: "80%" }} />
                <div className="h-4 rounded" style={{ backgroundColor: "#d4cfc4", width: "50%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {top3.map((item, i) => (
                <div
                  key={item.id}
                  className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: i === 0 ? "#e0dace" : "#e4dfd4",
                    border: "1px solid #d4cfc4",
                  }}
                  onClick={() => onOpenComments(item)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="font-serif-custom text-2xl font-bold"
                      style={{ color: i === 0 ? "#c8a060" : "#bbb" }}
                    >
                      #{i + 1}
                    </span>
                    {i === 0 && <Icon name="Crown" size={14} style={{ color: "#c8a060" }} />}
                  </div>
                  <p className="font-serif-custom text-[12px] font-semibold leading-snug line-clamp-3 mb-2" style={{ color: "#141414" }}>
                    {item.title}
                  </p>
                  <p className="text-[11px]" style={{ color: "#999" }}>{item.source}</p>
                  {item.upvotes > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 text-[11px]" style={{ color: "#c06040" }}>
                      <Icon name="Heart" size={11} />
                      {item.upvotes.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rest list */}
          <div>
            {rest.map((item, i) => (
              <DiggNewsItem
                key={item.id}
                item={item}
                index={i + 4}
                onOpenComments={onOpenComments}
                isSaved={savedIds.has(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
