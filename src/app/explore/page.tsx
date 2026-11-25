'use client';

import React, { useState, useMemo } from 'react';
import { ALL_TOPICS, CONTENT_ITEMS } from '@/lib/data';
import { Topic } from '@/types';
import ContentCard from '@/components/ContentCard';
import { Search, Sparkles, X, Clock } from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'All'>('All');
  const [durationFilter, setDurationFilter] = useState<'All' | 'Quick' | 'Deep'>('All');

  const filteredItems = useMemo(() => {
    return CONTENT_ITEMS.filter((item) => {
      if (selectedTopic !== 'All' && item.topic !== selectedTopic) {
        return false;
      }
      if (durationFilter === 'Quick' && item.readTimeMinutes > 3) {
        return false;
      }
      if (durationFilter === 'Deep' && item.readTimeMinutes <= 3) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchesTopic = item.topic.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesTags && !matchesTopic) {
          return false;
        }
      }
      return true;
    });
  }, [selectedTopic, durationFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E2E0D8]">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#71816B]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Knowledge Index</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#292D29]">
          Explore by Discipline
        </h1>
        <p className="text-sm text-[#5B6057] max-w-xl leading-relaxed">
          Calm readings and mental models across 11 fields. Follow whatever holds your genuine attention.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777B72]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search quantum physics, stoicism, psychology, design..."
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

      {/* Topic Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#777B72]">
          <span className="font-medium text-[#5B6057]">Disciplines</span>
          <span>{ALL_TOPICS.length} fields</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTopic('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              selectedTopic === 'All'
                ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
            }`}
          >
            All Topics ({CONTENT_ITEMS.length})
          </button>
          {ALL_TOPICS.map((topic) => {
            const count = CONTENT_ITEMS.filter((i) => i.topic === topic).length;
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                    : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                }`}
              >
                {topic} {count > 0 && <span className="opacity-70 ml-0.5">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#777B72] flex items-center gap-1.5 mr-1">
          <Clock className="h-3.5 w-3.5" />
          Reading length:
        </span>
        {(
          [
            { id: 'All', label: 'Any length' },
            { id: 'Quick', label: 'Short (≤ 3 min)' },
            { id: 'Deep', label: 'Longer (4+ min)' },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDurationFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              durationFilter === opt.id
                ? 'bg-[#ECEBE4] text-[#292D29] border-[#CFCBC0]'
                : 'text-[#777B72] border-transparent hover:text-[#292D29]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs text-[#777B72]">
          <span>Showing {filteredItems.length} readings</span>
          {(selectedTopic !== 'All' || searchQuery || durationFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedTopic('All');
                setSearchQuery('');
                setDurationFilter('All');
              }}
              className="text-[#71816B] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E0D8] bg-[#FAF9F5] p-12 text-center space-y-3">
            <p className="text-sm text-[#5B6057]">No readings match your current filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedTopic('All');
                setSearchQuery('');
                setDurationFilter('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
