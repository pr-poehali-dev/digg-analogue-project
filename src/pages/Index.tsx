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
  const { news, loading, error, lastUpdated, refetch } = useNews();

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

          {activePage === "home" && <HomePage {...sharedProps} refetch={refetch} lastUpdated={lastUpdated} />}
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