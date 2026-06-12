import { useState } from "react";
import Layout from "@/components/Layout";
import CommentsPanel from "@/components/CommentsPanel";
import HomePage from "@/pages/HomePage";
import TrendingPage from "@/pages/TrendingPage";
import SearchPage from "@/pages/SearchPage";
import SavedPage from "@/pages/SavedPage";
import ProfilePage from "@/pages/ProfilePage";
import type { NewsItem } from "@/data/news";

export default function Index() {
  const [activePage, setActivePage] = useState("home");
  const [commentsItem, setCommentsItem] = useState<NewsItem | null>(null);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

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
  };

  return (
    <>
      <Layout activePage={activePage} onNavigate={setActivePage}>
        <div className="pb-16 md:pb-0">
          {activePage === "home" && <HomePage {...sharedProps} />}
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
