import { useState } from "react";
import NewsCard from "@/components/NewsCard";
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
    const matchesQuery = query.trim() === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      item.source.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCategory === "Все" || item.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  const hotTags = Array.from(new Set(news.flatMap(n => [n.source, n.category]))).slice(0, 8);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif-custom text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
          Поиск
        </h1>

        {/* Search input */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по новостям, источникам..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-[hsl(var(--border))] rounded-lg text-[14px] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          {allCategories.map((cat) => (
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
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-[hsl(var(--border))] animate-pulse">
              <div className="w-10 space-y-1 pt-1">
                <div className="h-4 w-4 bg-[hsl(var(--muted))] rounded mx-auto" />
                <div className="h-3 w-6 bg-[hsl(var(--muted))] rounded mx-auto" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 w-12 bg-[hsl(var(--muted))] rounded-full" />
                  <div className="h-4 w-20 bg-[hsl(var(--muted))] rounded-full" />
                </div>
                <div className="h-4 w-full bg-[hsl(var(--muted))] rounded" />
                <div className="h-4 w-4/5 bg-[hsl(var(--muted))] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : query.trim() === "" && activeCategory === "Все" ? (
        <div className="flex flex-col items-center py-16 text-[hsl(var(--muted-foreground))]">
          <Icon name="Search" size={40} />
          <p className="text-[15px] font-medium mt-4">Начните вводить запрос</p>
          <p className="text-[13px] mt-1">Поиск по {news.length} материалам из реальных источников</p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-sm">
            {hotTags.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1.5 bg-white border border-[hsl(var(--border))] rounded-full text-[12px] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-[hsl(var(--muted-foreground))]">
          <Icon name="SearchX" size={40} />
          <p className="text-[15px] font-medium mt-4">Ничего не найдено</p>
          <p className="text-[13px] mt-1">Попробуйте другой запрос или категорию</p>
        </div>
      ) : (
        <div>
          <p className="text-[12px] text-[hsl(var(--muted-foreground))] mb-4">
            Найдено: <span className="font-semibold text-[hsl(var(--foreground))]">{results.length}</span>{" "}
            {results.length === 1 ? "материал" : results.length < 5 ? "материала" : "материалов"}
          </p>
          <div className="bg-white border border-[hsl(var(--border))] rounded-lg px-5">
            {results.map((item) => (
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
      )}
    </div>
  );
}
