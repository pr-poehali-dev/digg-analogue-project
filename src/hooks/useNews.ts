import { useState, useEffect } from "react";
import type { NewsItem } from "@/data/news";
import { NEWS as FALLBACK_NEWS } from "@/data/news";

const RSS_URL = "https://functions.poehali.dev/344b9b97-d965-4b8d-abf9-e1feed09935b";

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(RSS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.news && data.news.length > 0) {
        setNews(data.news);
        setLastUpdated(new Date());
      }
    } catch (e) {
      setError("Не удалось загрузить свежие новости. Показываем кешированные.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { news, loading, error, lastUpdated, refetch: fetchNews };
}
