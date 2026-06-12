import NewsCard from "@/components/NewsCard";
import { NEWS } from "@/data/news";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface SavedPageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
}

export default function SavedPage({ onOpenComments, savedIds, onToggleSave }: SavedPageProps) {
  const saved = NEWS.filter(n => savedIds.has(n.id));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif-custom text-2xl font-semibold text-[hsl(var(--foreground))]">
            Сохранённое
          </h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-0.5">
            {saved.length > 0 ? `${saved.length} материала для чтения` : "Список чтения пуст"}
          </p>
        </div>
        {saved.length > 0 && (
          <span className="flex items-center gap-1.5 text-[12px] text-[hsl(var(--muted-foreground))]">
            <Icon name="BookmarkCheck" size={14} />
            {saved.length} сохранено
          </span>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-[hsl(var(--muted-foreground))]">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
            <Icon name="Bookmark" size={28} />
          </div>
          <p className="text-[16px] font-medium text-[hsl(var(--foreground))]">Список чтения пуст</p>
          <p className="text-[13px] mt-2 text-center max-w-xs">
            Нажимайте на иконку закладки у любой новости, чтобы сохранить её здесь
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {saved.map(item => (
            <div key={item.id} className="bg-white border border-[hsl(var(--border))] rounded-lg p-5 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{item.source}</span>
              </div>
              <h3 className="font-serif-custom text-[14px] font-semibold text-[hsl(var(--foreground))] leading-snug mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[12px] text-[hsl(var(--muted-foreground))] line-clamp-2 mb-3">
                {item.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onOpenComments(item)}
                  className="flex items-center gap-1.5 text-[12px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  <Icon name="MessageSquare" size={13} />
                  {item.comments.length} комментариев
                </button>
                <button
                  onClick={() => onToggleSave(item.id)}
                  className="flex items-center gap-1 text-[12px] text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                >
                  <Icon name="Trash2" size={13} />
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
