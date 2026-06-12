import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { NewsItem, Comment } from "@/data/news";

interface CommentsPanelProps {
  item: NewsItem | null;
  onClose: () => void;
}

export default function CommentsPanel({ item, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>(item?.comments || []);
  const [text, setText] = useState("");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: "you",
      avatar: "Y",
      text: text.trim(),
      time: "только что",
      likes: 0,
    };
    setComments(prev => [newComment, ...prev]);
    setText("");
  };

  const toggleLike = (id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[hsl(var(--border))]">
          <div className="flex-1 pr-4">
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-1">{item.source} · {item.time}</p>
            <h3 className="font-serif-custom text-[15px] font-semibold leading-snug text-[hsl(var(--foreground))]">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[hsl(var(--muted))] transition-colors flex-shrink-0"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Comment form */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-[hsl(var(--border))]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0 text-[12px] font-semibold text-[hsl(var(--muted-foreground))]">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Поделитесь мнением..."
                rows={2}
                className="w-full text-[13px] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[hsl(var(--ring))] transition"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-4 py-1.5 text-[12px] font-medium bg-[hsl(var(--foreground))] text-white rounded transition-opacity disabled:opacity-40 hover:opacity-80"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
              <Icon name="MessageCircle" size={32} />
              <p className="text-[13px] mt-3">Пока нет комментариев</p>
              <p className="text-[12px] mt-1">Будьте первым!</p>
            </div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">
                {c.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-[hsl(var(--foreground))]">@{c.author}</span>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{c.time}</span>
                </div>
                <p className="text-[13px] text-[hsl(var(--foreground))] leading-relaxed">{c.text}</p>
                <button
                  onClick={() => toggleLike(c.id)}
                  className={`flex items-center gap-1 mt-2 text-[11px] transition-colors ${
                    likedIds.has(c.id)
                      ? "text-orange-500"
                      : "text-[hsl(var(--muted-foreground))] hover:text-orange-500"
                  }`}
                >
                  <Icon name="Heart" size={12} />
                  {c.likes + (likedIds.has(c.id) ? 1 : 0)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
