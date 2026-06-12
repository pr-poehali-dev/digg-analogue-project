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

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col animate-slide-in-right"
        style={{ backgroundColor: "#ece8df", borderLeft: "1px solid #d4cfc4" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5" style={{ borderBottom: "1px solid #d4cfc4" }}>
          <div className="flex-1 pr-4">
            <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "#999" }}>
              {item.source} · {item.time}
            </p>
            <h3 className="font-serif-custom text-[14px] font-semibold leading-snug" style={{ color: "#141414" }}>
              {item.title}
            </h3>
            {item.sourceUrl && item.sourceUrl !== "#" && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] mt-2 hover:opacity-60 transition-opacity"
                style={{ color: "#888" }}
              >
                <Icon name="ExternalLink" size={11} />
                Читать оригинал
              </a>
            )}
          </div>
          <button onClick={onClose} className="hover:opacity-60 transition-opacity" style={{ color: "#888" }}>
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4" style={{ borderBottom: "1px solid #d4cfc4" }}>
          <div className="flex gap-3">
            <div
              className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-serif-custom"
              style={{ backgroundColor: "#d4cfc4", color: "#888" }}
            >
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Ваш комментарий..."
                rows={2}
                className="w-full text-[13px] px-3 py-2 resize-none focus:outline-none"
                style={{ backgroundColor: "#e4dfd4", border: "1px solid #d4cfc4", color: "#141414", fontFamily: "inherit" }}
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest disabled:opacity-40"
                  style={{ backgroundColor: "#141414", color: "#ece8df" }}
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Count */}
        <div className="px-5 py-2.5" style={{ borderBottom: "1px solid #d4cfc4" }}>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "#999" }}>
            Комментарии · {comments.length}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center py-12" style={{ color: "#bbb" }}>
              <Icon name="MessageCircle" size={28} />
              <p className="text-[12px] mt-3">Пока нет комментариев</p>
            </div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-3 px-5 py-4 animate-fade-in" style={{ borderBottom: "1px solid #e0dbd0" }}>
                <div
                  className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-serif-custom"
                  style={{ backgroundColor: "#d4cfc4", color: "#888" }}
                >
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: "#141414" }}>@{c.author}</span>
                    <span className="text-[10px]" style={{ color: "#bbb" }}>{c.time}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#333" }}>{c.text}</p>
                  <button
                    onClick={() => {
                      setLikedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(c.id)) { next.delete(c.id); } else { next.add(c.id); }
                        return next;
                      });
                    }}
                    className="flex items-center gap-1 mt-1.5 text-[10px] transition-colors"
                    style={{ color: likedIds.has(c.id) ? "#c44" : "#bbb" }}
                  >
                    <Icon name="Heart" size={11} />
                    {c.likes + (likedIds.has(c.id) ? 1 : 0)}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}