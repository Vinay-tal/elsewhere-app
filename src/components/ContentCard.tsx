'use client';

import React from 'react';
import { ContentItem, Topic } from '@/types';
import { useApp } from '@/context/AppContext';
import { Clock, Heart, Bookmark, EyeOff, Sparkles, BookOpen } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  featured?: boolean;
}

export default function ContentCard({ item, featured = false }: ContentCardProps) {
  const { profile, toggleLike, toggleSave, dismissItem, openArticleModal } = useApp();

  const isLiked = profile.likedItemIds.includes(item.id);
  const isSaved = profile.savedItemIds.includes(item.id);

  // Dynamic topic accent colors
  const getTopicColor = (topic: Topic) => {
    switch (topic) {
      case 'Psychology':
      case 'Philosophy':
        return 'text-purple-300 bg-purple-500/10 border-purple-500/20';
      case 'Science':
      case 'Nature & Space':
        return 'text-[#D2F827] bg-[#D2F827]/10 border-[#D2F827]/25';
      case 'Technology & AI':
      case 'Programming':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20';
      case 'History':
      case 'World Affairs':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      case 'Business & Economics':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-neutral-300 bg-white/5 border-white/10';
    }
  };

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden ${
        featured
          ? 'bg-gradient-to-b from-[#141926] to-[#0E121B] border-[#D2F827]/30 shadow-xl'
          : 'bg-[#10141D] border-white/[0.08] hover:border-white/20'
      }`}
    >
      <div className="p-5 sm:p-6 space-y-3.5">
        {/* Top Meta Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTopicColor(
                item.topic
              )}`}
            >
              {item.topic}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Clock className="h-3 w-3" />
              {item.readTimeMinutes} min
            </span>
            {featured && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#D2F827] text-black">
                Featured
              </span>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => dismissItem(item.id)}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors"
            title="Dismiss from feed"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div
          onClick={() => openArticleModal(item)}
          className="cursor-pointer space-y-1.5"
        >
          <h3
            className={`font-bold tracking-tight text-white group-hover:text-[#D2F827] transition-colors leading-snug ${
              featured ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
            }`}
          >
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 font-light leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Summary Snippet */}
        <p
          onClick={() => openArticleModal(item)}
          className="text-xs text-neutral-300/90 line-clamp-3 leading-relaxed cursor-pointer font-light"
        >
          {item.summary}
        </p>

        {/* Transparent Recommendation Reason */}
        {item.recommendedReason && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 pt-1 border-t border-white/[0.04]">
            <Sparkles className="h-3 w-3 text-[#D2F827] shrink-0" />
            <span className="truncate">{item.recommendedReason}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0A0D14]/60">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleLike(item.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isLiked
                ? 'text-rose-400 bg-rose-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title="Like this idea"
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
            <span className="text-[11px]">Like</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(item.id);
            }}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
              isSaved
                ? 'text-[#D2F827] bg-[#D2F827]/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title="Bookmark"
            aria-label="Save bookmark"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#D2F827]' : ''}`} />
            <span className="text-xs">Save</span>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openArticleModal(item);
          }}
          className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#D2F827] hover:bg-[#BDF010] active:scale-95 transition-all cursor-pointer touch-manipulation"
          aria-label={`Read ${item.title}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Read</span>
        </button>
      </div>
    </article>
  );
}
