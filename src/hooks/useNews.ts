import { useState, useEffect, useRef, useCallback } from "react";
import type { NewsItem } from "@/data/news";
import { NEWS as FALLBACK_NEWS } from "@/data/news";

const RSS_URL = "https://functions.poehali.dev/344b9b97-d965-4b8d-abf9-e1feed09935b";
const LIVE_INTERVAL_MS = 5 * 60 * 1000; // 5 минут

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [liveEnabled, setLiveEnabled] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [nextScanIn, setNextScanIn] = useState<number>(LIVE_INTERVAL_MS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevIdsRef = useRef<Set<number>>(new Set());

  const fetchNews = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(RSS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.news && data.news.length > 0) {
        const incoming: NewsItem[] = data.news;
        const incomingIds = new Set(incoming.map((n: NewsItem) => n.id));

        if (silent && prevIdsRef.current.size > 0) {
          const added = incoming.filter(n => !prevIdsRef.current.has(n.id)).length;
          if (added > 0) setNewCount(c => c + added);
        }

        prevIdsRef.current = incomingIds;
        setNews(incoming);
        setLastUpdated(new Date());
      }
    } catch {
      setError("Не удалось загрузить свежие новости. Показываем кешированные.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  // Live mode: auto-refresh + countdown
  useEffect(() => {
    if (!liveEnabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      setNextScanIn(LIVE_INTERVAL_MS);
      return;
    }

    setNextScanIn(LIVE_INTERVAL_MS);

    intervalRef.current = setInterval(() => {
      fetchNews(true);
      setNextScanIn(LIVE_INTERVAL_MS);
    }, LIVE_INTERVAL_MS);

    countdownRef.current = setInterval(() => {
      setNextScanIn(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [liveEnabled, fetchNews]);

  const toggleLive = () => {
    setLiveEnabled(v => !v);
    setNewCount(0);
  };

  const dismissNew = () => setNewCount(0);

  const formatCountdown = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return {
    news,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchNews(false),
    liveEnabled,
    toggleLive,
    newCount,
    dismissNew,
    nextScanIn,
    formatCountdown,
  };
}
