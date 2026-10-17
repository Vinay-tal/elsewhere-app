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

  // Filter items based on topic, search, and reading duration
  const filteredItems = useMemo(() => {
    return CONTENT_ITEMS.filter((item) => {
      // Topic match
      if (selectedTopic !== 'All' && item.topic !== selectedTopic) {
        return false;
      }

      // Duration filter
      if (durationFilter === 'Quick' && item.readTimeMinutes > 3) {
        return false;
      }
      if (durationFilter === 'Deep' && item.readTimeMinutes <= 3) {
        return false;
      }

      // Search query
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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-7">
      {/* Editorial Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#8B5CF6]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Knowledge Index</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Explore by Discipline
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light">
          Deep dives and mental models across 11 disciplines. Pick a rabbit hole.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search quantum physics, stoicism, transformers, psychology..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#121620] border border-white/10 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6]/60 transition-colors min-h-[44px]"
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

      {/* Topic Filter Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
          <span>Disciplines</span>
          <span className="text-[11px]">{ALL_TOPICS.length} fields</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTopic('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              selectedTopic === 'All'
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20'
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
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                    : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20'
                }`}
              >
                {topic} {count > 0 && <span className="opacity-60 ml-0.5">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Filter Pills */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-neutral-400 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Read time:
        </span>
        <button
          onClick={() => setDurationFilter('All')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            durationFilter === 'All'
              ? 'bg-white/10 text-white border-white/20'
              : 'text-neutral-400 border-white/5 hover:text-white'
          }`}
        >
          Any length
        </button>
        <button
          onClick={() => setDurationFilter('Quick')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            durationFilter === 'Quick'
              ? 'bg-[#D2F827]/10 text-[#D2F827] border-[#D2F827]/30'
              : 'text-neutral-400 border-white/5 hover:text-white'
          }`}
        >
          Quick bites (&le; 3 min)
        </button>
        <button
          onClick={() => setDurationFilter('Deep')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            durationFilter === 'Deep'
              ? 'bg-[#8B5CF6]/10 text-purple-300 border-[#8B5CF6]/30'
              : 'text-neutral-400 border-white/5 hover:text-white'
          }`}
        >
          Deep dives (4+ min)
        </button>
      </div>

      {/* Content Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Showing {filteredItems.length} discoveries</span>
          {(selectedTopic !== 'All' || searchQuery || durationFilter !== 'All') && (
            <button
              onClick={() => {
                setSelectedTopic('All');
                setSearchQuery('');
                setDurationFilter('All');
              }}
              className="text-[#D2F827] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#121620] p-10 text-center space-y-3">
            <p className="text-sm text-neutral-300">No discoveries match your current filter.</p>
            <button
              onClick={() => {
                setSelectedTopic('All');
                setSearchQuery('');
                setDurationFilter('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
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
