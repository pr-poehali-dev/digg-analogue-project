import { useState } from "react";
import DiggNewsItem from "@/components/DiggNewsItem";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface SearchPageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
  news: NewsItem[];
  loading: boolean;
}

export default function SearchPage({ onOpenComments, savedIds, onToggleSave, news, loading }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  const allCategories = ["Все", ...Array.from(new Set(news.map(n => n.category))).sort()];

  const results = news.filter(item => {
    const q = query.toLowerCase().trim();
    const matchQ = q === "" ||
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q);
    const matchC = activeCategory === "Все" || item.category === activeCategory;
    return matchQ && matchC;
  });

  const hotTags = Array.from(new Set(news.flatMap(n => [n.source, n.category]))).slice(0, 10);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #d4cfc4" }}>
        <h1 className="font-serif-custom text-[1.35rem] font-semibold mb-4" style={{ color: "#141414" }}>
          Поиск
        </h1>

        {/* Input */}
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#aaa" }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по новостям, источникам..."
            autoFocus
            className="w-full pl-9 pr-9 py-2.5 text-[13px] focus:outline-none"
            style={{
              backgroundColor: "#e4dfd4",
              border: "1px solid #d4cfc4",
              color: "#141414",
              fontFamily: "inherit",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity"
              style={{ color: "#aaa" }}
            >
              <Icon name="X" size={13} />
            </button>
          )}
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
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-4 animate-pulse" style={{ borderBottom: "1px solid #d4cfc4" }}>
              <div style={{ color: "#ccc", minWidth: "1.5rem" }} className="font-serif-custom">{i + 1}</div>
              <div className="flex-1 space-y-2">
                <div className="h-5 rounded" style={{ backgroundColor: "#d4cfc4", width: "75%" }} />
                <div className="h-3 rounded" style={{ backgroundColor: "#d4cfc4", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : query.trim() === "" && activeCategory === "Все" ? (
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: "#999" }}>
            Популярные запросы
          </p>
          <div className="flex flex-wrap gap-2">
            {hotTags.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-[11px] px-3 py-1.5 transition-opacity hover:opacity-70"
                style={{ border: "1px solid #ccc", color: "#555", backgroundColor: "#e4dfd4" }}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid #d4cfc4" }}>
            <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: "#999" }}>
              Все материалы · {news.length}
            </p>
            {news.slice(0, 5).map((item, i) => (
              <DiggNewsItem
                key={item.id}
                item={item}
                index={i + 1}
                onOpenComments={onOpenComments}
                isSaved={savedIds.has(item.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 text-center" style={{ color: "#bbb" }}>
          <Icon name="SearchX" size={32} />
          <p className="text-[13px] mt-4" style={{ color: "#999" }}>Ничего не найдено</p>
          <p className="text-[11px] mt-1">Попробуйте изменить запрос или категорию</p>
        </div>
      ) : (
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "#999" }}>
            Найдено · {results.length}
          </p>
          {results.map((item, i) => (
            <DiggNewsItem
              key={item.id}
              item={item}
              index={i + 1}
              onOpenComments={onOpenComments}
              isSaved={savedIds.has(item.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
