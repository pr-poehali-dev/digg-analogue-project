import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { NewsItem } from "@/data/news";

interface DiggNewsItemProps {
  item: NewsItem;
  index: number;
  onOpenComments: (item: NewsItem) => void;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

export default function DiggNewsItem({ item, index, onOpenComments, isSaved, onToggleSave }: DiggNewsItemProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [votes, setVotes] = useState(item.upvotes);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvoted(!upvoted);
    setVotes(v => upvoted ? v - 1 : v + 1);
  };

  const formatVotes = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)} тыс.`;
    return String(n);
  };

  return (
    <div className="py-5 animate-fade-in" style={{ borderBottom: "1px solid #d4cfc4" }}>
      <div className="flex gap-4">
        {/* Number */}
        <div className="flex-shrink-0 pt-0.5">
          <span className="news-num text-[1.1rem]">{index}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            className="font-serif-custom text-[1.05rem] font-semibold leading-snug cursor-pointer mb-1.5 transition-colors hover:opacity-70"
            style={{ color: "#141414" }}
            onClick={() => item.sourceUrl && item.sourceUrl !== "#" ? window.open(item.sourceUrl, "_blank") : onOpenComments(item)}
          >
            {item.title}
          </h3>

          {/* Excerpt */}
          {item.excerpt && (
            <p className="text-[13px] leading-relaxed mb-2 line-clamp-2" style={{ color: "#555" }}>
              {item.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {/* Time */}
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#999" }}>
              <Icon name="Clock" size={11} />
              {item.readTime} м.
            </span>

            {/* Votes */}
            <button
              onClick={handleUpvote}
              className="flex items-center gap-1 text-[11px] transition-colors"
              style={{ color: upvoted ? "#e55" : "#999" }}
            >
              <Icon name="Heart" size={11} />
              {votes > 0 ? formatVotes(votes) : ""}
            </button>

            {/* Comments */}
            <button
              onClick={() => onOpenComments(item)}
              className="flex items-center gap-1 text-[11px] transition-colors hover:opacity-60"
              style={{ color: "#999" }}
            >
              <Icon name="MessageSquare" size={11} />
              {item.comments.length > 0 ? item.comments.length : ""}
            </button>

            {/* Source */}
            <span className="text-[11px] font-medium" style={{ color: "#777" }}>
              {item.source}
            </span>

            {/* Category tag */}
            <span className="tag-pill">{item.category}</span>

            {item.trending && (
              <span className="tag-pill" style={{ color: "#c44", borderColor: "#f0c0b0" }}>
                🔥 тренд
              </span>
            )}

            {/* Save */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(item.id); }}
              className="flex items-center gap-1 text-[11px] transition-colors ml-auto"
              style={{ color: isSaved ? "#141414" : "#bbb" }}
            >
              <Icon name={isSaved ? "BookmarkCheck" : "Bookmark"} size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
