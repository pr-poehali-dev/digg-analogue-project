import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { NewsItem } from "@/data/news";

interface NewsCardProps {
  item: NewsItem;
  onOpenComments: (item: NewsItem) => void;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  variant?: "default" | "featured";
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-violet-50 text-violet-700",
  Hardware: "bg-blue-50 text-blue-700",
  Space: "bg-indigo-50 text-indigo-700",
  OS: "bg-green-50 text-green-700",
  Browsers: "bg-orange-50 text-orange-700",
  Quantum: "bg-pink-50 text-pink-700",
  Robotics: "bg-amber-50 text-amber-700",
};

export default function NewsCard({ item, onOpenComments, isSaved, onToggleSave, variant = "default" }: NewsCardProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [votes, setVotes] = useState(item.upvotes);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvoted(!upvoted);
    setVotes(v => upvoted ? v - 1 : v + 1);
  };

  const formatVotes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const catColor = CATEGORY_COLORS[item.category] || "bg-gray-50 text-gray-600";

  if (variant === "featured") {
    return (
      <article className="group bg-white border border-[hsl(var(--border))] rounded-lg overflow-hidden hover-lift cursor-pointer animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {item.trending && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                <Icon name="Flame" size={10} /> В тренде
              </span>
            )}
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${catColor}`}>
              {item.category}
            </span>
            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{item.time}</span>
          </div>

          <h2 className="font-serif-custom text-xl font-semibold text-[hsl(var(--foreground))] leading-snug mb-2 group-hover:text-[hsl(var(--muted-foreground))] transition-colors">
            {item.title}
          </h2>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2 mb-4">
            {item.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium transition-all ${
                  upvoted
                    ? "bg-orange-500 text-white"
                    : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Icon name="ArrowUp" size={13} />
                {formatVotes(votes)}
              </button>
              <button
                onClick={() => onOpenComments(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] transition-colors"
              >
                <Icon name="MessageSquare" size={13} />
                {item.comments.length}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {item.source} · {item.readTime} мин.
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleSave(item.id); }}
                className={`p-1.5 rounded transition-colors ${
                  isSaved ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <Icon name={isSaved ? "BookmarkCheck" : "Bookmark"} size={14} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex gap-4 py-4 border-b border-[hsl(var(--border))] last:border-0 animate-fade-in">
      {/* Vote column */}
      <div className="flex flex-col items-center pt-0.5">
        <button
          onClick={handleUpvote}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
            upvoted ? "text-orange-500" : "text-[hsl(var(--muted-foreground))] hover:text-orange-500"
          }`}
        >
          <Icon name="ChevronUp" size={18} />
          <span className="text-[11px] font-semibold leading-none">{formatVotes(votes)}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catColor}`}>
            {item.category}
          </span>
          {item.trending && (
            <span className="text-[10px] text-orange-500 font-medium flex items-center gap-0.5">
              <Icon name="Flame" size={9} /> Тренд
            </span>
          )}
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{item.source}</span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">·</span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{item.time}</span>
        </div>

        <h3 className="text-[14px] font-semibold text-[hsl(var(--foreground))] leading-snug mb-1 group-hover:text-[hsl(var(--muted-foreground))] transition-colors cursor-pointer line-clamp-2">
          {item.title}
        </h3>
        <p className="text-[12px] text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2 hidden sm:block mb-2">
          {item.excerpt}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenComments(item)}
            className="flex items-center gap-1 text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <Icon name="MessageSquare" size={12} />
            {item.comments.length} комментариев
          </button>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{item.readTime} мин. чтения</span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(item.id); }}
            className={`flex items-center gap-1 text-[11px] transition-colors ${
              isSaved
                ? "text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            <Icon name={isSaved ? "BookmarkCheck" : "Bookmark"} size={12} />
            {isSaved ? "Сохранено" : "Сохранить"}
          </button>
        </div>
      </div>
    </article>
  );
}
