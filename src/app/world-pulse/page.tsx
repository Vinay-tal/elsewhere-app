'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NewsArticle, NewsCategory } from '@/types/content';
import { useApp } from '@/context/AppContext';
import { getNewsTone } from '@/lib/natureTheme';
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
  Radio,
  FileQuestion,
} from 'lucide-react';
import { CURATED_NEWS_BENCHMARK } from '@/lib/newsService';

export default function WorldPulsePage() {
  const { profile, toggleSave } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

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
        setNews(CURATED_NEWS_BENCHMARK);
        setSourceType('curated_fallback');
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unable to load live dispatch. Showing verified offline benchmark.';
      console.warn('World Pulse fetch notice:', errorMsg);
      setNews(CURATED_NEWS_BENCHMARK);
      setSourceType('curated_fallback');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews]);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 space-y-8 animate-gentle-enter">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E2E0D8]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#71816B]">
            <Globe className="h-3.5 w-3.5" />
            <span>Calm Global Affairs</span>
          </div>

          <div className="flex items-center gap-2">
            {sourceType === 'live' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#71816B]/12 text-[#4D5A48] border border-[#71816B]/25">
                <Radio className="h-3 w-3 text-[#71816B]" />
                <span>Live Dispatch</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#C5B99F]/30 text-[#5B4D34] border border-[#C5B99F]">
                <ShieldCheck className="h-3 w-3 text-[#8C7A56]" />
                <span>Curated Benchmark</span>
              </span>
            )}

            {lastRefreshedAt && (
              <span className="text-[11px] text-[#777B72] font-mono hidden sm:inline tabular-nums">
                {new Date(lastRefreshedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}

            <button
              type="button"
              onClick={() => fetchNews(selectedCategory, true)}
              disabled={isRefreshing}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
              title="Refresh feed"
              aria-label="Refresh feed"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#71816B]' : ''}`} />
            </button>
          </div>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#292D29]">
          World Pulse
        </h1>
        <p className="text-sm text-[#5B6057] max-w-xl leading-relaxed">
          Essential global developments explained calmly, without sensationalism or outrage.
        </p>
      </div>

      {/* Editorial Standard Notice */}
      <div className="p-4 rounded-xl bg-[#ECEBE4]/70 border border-[#E2E0D8] text-xs text-[#5B6057] flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-[#71816B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold block text-[#292D29]">
            Factual Reporting &amp; Separated Analysis
          </span>
          <p className="leading-relaxed">
            Elsewhere separates factual reporting from contextual commentary. Every story keeps original publisher attribution, publication dates, and source links.
          </p>
        </div>
      </div>

      {sourceType === 'curated_fallback' && (
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#C5B99F] flex items-center justify-between text-xs text-[#5B4D34] gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#8C7A56] shrink-0" />
            <span>
              <strong>Offline Benchmark:</strong> Showing verified reference dispatches while live feeds are paused.
            </span>
          </div>
          <button
            type="button"
            onClick={() => fetchNews(selectedCategory, true)}
            className="px-3 py-1.5 rounded-lg bg-[#ECEBE4] text-[#292D29] hover:bg-[#E2E0D8] font-medium text-xs shrink-0 min-h-[36px] cursor-pointer"
          >
            Retry Live
          </button>
        </div>
      )}

      {error && sourceType !== 'curated_fallback' && (
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#C5B99F] flex items-center justify-between text-xs text-[#5B4D34] gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#8C7A56] shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchNews(selectedCategory, true)}
            className="px-3 py-1.5 rounded-lg bg-[#ECEBE4] text-[#292D29] hover:bg-[#E2E0D8] font-medium text-xs shrink-0 min-h-[36px] cursor-pointer"
          >
            Retry Live
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777B72]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter stories by topic, keyword, or publisher..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] text-base sm:text-sm text-[#292D29] placeholder-[#777B72] focus:outline-none focus:border-[#71816B] transition-colors min-h-[44px]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-[#777B72] hover:text-[#292D29] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && news.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-3 animate-pulse">
              <div className="h-4 w-28 rounded bg-[#ECEBE4]" />
              <div className="h-6 w-3/4 rounded bg-[#ECEBE4]" />
              <div className="h-4 w-full rounded bg-[#ECEBE4]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isRefreshing && filteredNews.length === 0 && (
        <div className="p-10 text-center rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-3">
          <FileQuestion className="h-7 w-7 text-[#777B72] mx-auto" />
          <h3 className="font-editorial text-xl font-medium text-[#292D29]">No stories found</h3>
          <p className="text-xs text-[#777B72] max-w-sm mx-auto">
            {searchQuery
              ? `No dispatches matched "${searchQuery}". Try another keyword or clear your filter.`
              : `No dispatches in "${selectedCategory}" right now.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] min-h-[44px] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {filteredNews.length > 0 && (
        <div className="divide-y divide-[#E2E0D8] border-t border-b border-[#E2E0D8]">
          {filteredNews.map((article) => {
            const isSaved = profile.savedItemIds.includes(article.id);
            const tone = getNewsTone(article.category);

            return (
              <article key={article.id} className="py-6 sm:py-7 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone.badge}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#777B72] font-mono tabular-nums">
                      <Clock className="h-3 w-3" />
                      {article.readTimeMinutes} min read
                    </span>
                    <span className="text-xs text-[#777B72]">
                      {formatDate(article.publishedAt)}
                    </span>
                    {article.provenance === 'curated_benchmark' && (
                      <span className="text-[11px] text-[#63563D] bg-[#C5B99F]/25 px-2 py-0.5 rounded border border-[#C5B99F]">
                        Benchmark Sample
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSave(article.id)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                      isSaved
                        ? 'text-[#71816B] bg-[#71816B]/12'
                        : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
                    }`}
                    title="Bookmark story"
                    aria-label="Bookmark story"
                  >
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#71816B]' : ''}`} />
                  </button>
                </div>

                <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#292D29] leading-snug">
                  {article.headline}
                </h2>

                <p className="text-sm text-[#5B6057] leading-relaxed">
                  {article.summary}
                </p>

                {article.whyItMatters && (
                  <div className="p-4 rounded-xl bg-[#ECEBE4]/65 border border-[#E2E0D8] border-l-2 border-l-[#71816B] space-y-1">
                    <span className="text-[11px] uppercase tracking-wider font-medium text-[#4D5A48] block">
                      Context &amp; Impact Analysis
                    </span>
                    <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                      {article.whyItMatters}
                    </p>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between text-xs text-[#777B72] flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#71816B]" />
                    <span className="font-medium text-[#5B6057]">
                      Publisher: {article.publisher.name}
                    </span>
                  </div>

                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#71816B] hover:text-[#292D29] transition-colors"
                  >
                    <span>Original story</span>
                    <ExternalLink className="h-3.5 w-3.5" />
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
