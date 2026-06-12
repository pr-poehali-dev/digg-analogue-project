import { useState } from "react";
import Layout from "@/components/Layout";
import CommentsPanel from "@/components/CommentsPanel";
import HomePage from "@/pages/HomePage";
import TrendingPage from "@/pages/TrendingPage";
import SearchPage from "@/pages/SearchPage";
import SavedPage from "@/pages/SavedPage";
import ProfilePage from "@/pages/ProfilePage";
import { useNews } from "@/hooks/useNews";
import type { NewsItem } from "@/data/news";
import Icon from "@/components/ui/icon";

export default function Index() {
  const [activePage, setActivePage] = useState("home");
  const [commentsItem, setCommentsItem] = useState<NewsItem | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const {
    news, loading, error, lastUpdated, refetch,
    liveEnabled, toggleLive, newCount, dismissNew,
    nextScanIn, formatCountdown,
  } = useNews();

  const handleToggleSave = (id: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sharedProps = {
    onOpenComments: (item: NewsItem) => setCommentsItem(item),
    savedIds,
    onToggleSave: handleToggleSave,
    news,
    loading,
  };

  return (
    <>
      <Layout activePage={activePage} onNavigate={setActivePage}>
        <div className="pb-16 md:pb-0">
          {/* Error banner */}
          {error && (
            <div
              className="mb-4 flex items-center gap-2 px-4 py-2.5 text-[11px]"
              style={{ backgroundColor: "#efe8d8", border: "1px solid #d4cfc4", color: "#886040" }}
            >
              <Icon name="AlertCircle" size={13} />
              {error}
            </div>
          )}

          {/* New items toast — появляется когда live mode поймал новые */}
          {newCount > 0 && (
            <div
              className="mb-4 flex items-center justify-between px-4 py-2.5 text-[11px] animate-fade-in cursor-pointer"
              style={{ backgroundColor: "#141414", color: "#ece8df" }}
              onClick={() => { dismissNew(); refetch(); }}
            >
              <span>↑ Появилось {newCount} новых материалов — нажмите, чтобы загрузить</span>
              <button
                onClick={e => { e.stopPropagation(); dismissNew(); }}
                className="opacity-60 hover:opacity-100 transition-opacity ml-4"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {activePage === "home" && (
            <HomePage
              {...sharedProps}
              refetch={refetch}
              lastUpdated={lastUpdated}
              liveEnabled={liveEnabled}
              toggleLive={toggleLive}
              nextScanIn={nextScanIn}
              formatCountdown={formatCountdown}
            />
          )}
          {activePage === "trending" && <TrendingPage {...sharedProps} />}
          {activePage === "search" && <SearchPage {...sharedProps} />}
          {activePage === "saved" && <SavedPage {...sharedProps} />}
          {activePage === "profile" && <ProfilePage savedIds={savedIds} />}
        </div>
      </Layout>

      <CommentsPanel
        item={commentsItem}
        onClose={() => setCommentsItem(null)}
      />
    </>
  );
}
