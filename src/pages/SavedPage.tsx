import DiggNewsItem from "@/components/DiggNewsItem";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

interface SavedPageProps {
  onOpenComments: (item: NewsItem) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
  news: NewsItem[];
  loading: boolean;
}

export default function SavedPage({ onOpenComments, savedIds, onToggleSave, news }: SavedPageProps) {
  const saved = news.filter(n => savedIds.has(n.id));

  return (
    <div className="animate-fade-in">
      <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #d4cfc4" }}>
        <h1 className="font-serif-custom text-[1.35rem] font-semibold" style={{ color: "#141414" }}>
          Сохранённое
        </h1>
        <p className="text-[12px] mt-0.5" style={{ color: "#999" }}>
          {saved.length > 0
            ? `${saved.length} ${saved.length === 1 ? "материал" : saved.length < 5 ? "материала" : "материалов"} в списке чтения`
            : "Список чтения пуст"}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="py-20 flex flex-col items-center" style={{ color: "#bbb" }}>
          <Icon name="Bookmark" size={32} />
          <p className="text-[14px] mt-4 font-serif-custom font-semibold" style={{ color: "#999" }}>
            Список чтения пуст
          </p>
          <p className="text-[12px] mt-2 text-center max-w-xs" style={{ color: "#bbb" }}>
            Нажимайте на иконку закладки у любой новости, чтобы сохранить её здесь
          </p>
        </div>
      ) : (
        <div>
          {saved.map((item, i) => (
            <DiggNewsItem
              key={item.id}
              item={item}
              index={i + 1}
              onOpenComments={onOpenComments}
              isSaved={true}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
