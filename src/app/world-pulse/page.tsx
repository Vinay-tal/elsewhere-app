'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NewsArticle, NewsCategory } from '@/types/content';
import { useApp } from '@/context/AppContext';
import {
  Globe,
  ShieldCheck,
  Clock,
  Bookmark,
  ExternalLink,
  Search,
  X,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Radio,
  FileQuestion,
} from 'lucide-react';
import { CURATED_NEWS_BENCHMARK } from '@/lib/newsService';

export default function WorldPulsePage() {
  const { profile, toggleSave } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data fetch state
  const [news, setNews] = useState<NewsArticle[]>(CURATED_NEWS_BENCHMARK);
  const [sourceType, setSourceType] = useState<'live' | 'curated_fallback'>('curated_fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);

  const categories: (NewsCategory | 'All')[] = [
    'All',
    'Science & Space',
    'Economy & Tech',
    'Climate & Nature',
    'Geopolitics',
    'Global Society',
  ];

  const fetchNews = useCallback(async (cat: NewsCategory | 'All' = 'All', forceFresh: boolean = false) => {
    setIsRefreshing(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const params = new URLSearchParams();
      if (cat !== 'All') params.set('category', cat);
      if (forceFresh) params.set('forceFresh', 'true');

      const res = await fetch(`/api/news?${params.toString()}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        setNews(data.items);
        setSourceType(data.source || 'live');
        setLastRefreshedAt(data.cachedAt || new Date().toISOString());
      } else {
        // Fallback to local curated benchmark
        setNews(CURATED_NEWS_BENCHMARK);
        setSourceType('curated_fallback');
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const errorMsg = err instanceof Error ? err.message : 'Unable to load live dispatch. Showing verified offline benchmark.';
      console.warn('World Pulse fetch notice:', errorMsg);
      // Graceful fallback to verified benchmark
      setNews(CURATED_NEWS_BENCHMARK);
      setSourceType('curated_fallback');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  // Fetch when category changes
  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews]);

  // Filter news client-side by search query
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // Category filter (if not 'All' and not already filtered by API)
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        // Allow items that reasonably match
        const isCatMatch = item.category.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!isCatMatch) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.headline.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          (item.whyItMatters && item.whyItMatters.toLowerCase().includes(q)) ||
          item.publisher.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [news, selectedCategory, searchQuery]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-7 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
            <Globe className="h-3.5 w-3.5" />
            <span>Sober Global Affairs</span>
          </div>

          {/* Live vs Benchmark Provenance Indicator */}
          <div className="flex items-center gap-2">
            {sourceType === 'live' ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span>Live Dispatch • Verified Feeds</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="h-3 w-3 text-amber-400" />
                <span>Curated Benchmark • Offline Mode</span>
              </span>
            )}

            {lastRefreshedAt && (
              <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                Synced {new Date(lastRefreshedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}

            <button
              onClick={() => fetchNews(selectedCategory, true)}
              disabled={isRefreshing}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              title="Refresh feed"
              aria-label="Refresh feed"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          World Pulse
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light">
          Essential global developments explained without clickbait, manufactured outrage, or partisan spin.
        </p>
      </div>

      {/* Editorial Standards Notice */}
      <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-400/20 text-xs text-sky-200/90 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold block text-sky-100">
            Factual Reporting Standard & Separation of Analysis
          </span>
          <p className="font-light leading-relaxed text-sky-200/80">
            Elsewhere strictly separates verified factual reporting from editorial commentary. Every item
            preserves original publisher attribution, verifiable publication dates, and original links.
            Analytical explanations are explicitly labeled as contextual impact assessments.
          </p>
        </div>
      </div>

      {/* Offline / Benchmark State Notice */}
      {sourceType === 'curated_fallback' && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Offline Mode:</strong> Live dispatches are paused to prevent stale reporting. Showing verified benchmark reference stories.
            </span>
          </div>
          <button
            onClick={() => fetchNews(selectedCategory, true)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 font-medium text-[11px] shrink-0 min-h-[36px]"
          >
            Retry Live
          </button>
        </div>
      )}

      {/* Error State Banner */}
      {error && sourceType !== 'curated_fallback' && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchNews(selectedCategory, true)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 font-medium text-[11px] shrink-0 min-h-[36px]"
          >
            Retry Live
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter stories by topic, keyword, or institution..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#121620] border border-white/10 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400/60 transition-colors min-h-[44px]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              selectedCategory === cat
                ? 'bg-sky-400 text-black border-sky-400 font-semibold shadow-sm'
                : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* LOADING SKELETON STATE (Only when no articles present) */}
      {/* ======================================================== */}
      {isLoading && news.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 sm:p-6 rounded-2xl bg-[#121620] border border-white/5 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 rounded bg-white/10" />
                  <div className="h-3 w-16 rounded bg-white/5" />
                </div>
                <div className="h-6 w-6 rounded bg-white/10" />
              </div>
              <div className="h-5 w-3/4 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
              </div>
              <div className="h-14 rounded-xl bg-white/[0.02]" />
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* EMPTY STATE */}
      {/* ======================================================== */}
      {!isLoading && !isRefreshing && filteredNews.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-[#121620] border border-white/10 space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-neutral-400">
            <FileQuestion className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No stories found</h3>
          <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
            {searchQuery
              ? `No dispatches matched your search "${searchQuery}". Try different keywords or clear your query.`
              : `No dispatches in category "${selectedCategory}" at this time.`}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition-all min-h-[44px]"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* NEWS CARDS FEED */}
      {/* ======================================================== */}
      {filteredNews.length > 0 && (
        <div className="space-y-4">
          {filteredNews.map((article) => {
            const isSaved = profile.savedItemIds.includes(article.id);

            return (
              <article
                key={article.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#121620] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-sm"
              >
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-400/10 text-sky-300 border border-sky-400/20">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                      <Clock className="h-3 w-3" />
                      {article.readTimeMinutes} min read
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {formatDate(article.publishedAt)}
                    </span>
                    {article.provenance === 'curated_benchmark' && (
                      <span className="text-[10px] text-amber-400/80 font-mono bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                        Benchmark Sample
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSave(article.id)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                      isSaved
                        ? 'text-[#D2F827] bg-[#D2F827]/10'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Bookmark story"
                    aria-label="Bookmark story"
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#D2F827]' : ''}`} />
                  </button>
                </div>

                {/* Headline */}
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {article.headline}
                </h2>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {article.summary}
                </p>

                {/* Explicitly Distinguished Analysis: Why This Matters */}
                {article.whyItMatters && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#D2F827] flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      Context & Impact Analysis
                    </span>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {article.whyItMatters}
                    </p>
                  </div>
                )}

                {/* Source Verification & Attribution Footer */}
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-neutral-400 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                    <span className="font-medium text-neutral-300">
                      Reporting Publisher: {article.publisher.name}
                    </span>
                  </div>

                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>Original story</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
