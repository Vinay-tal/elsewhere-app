'use client';

import React from 'react';
import { ContentItem, Topic } from '@/types';
import { useApp } from '@/context/AppContext';
import { Clock, Heart, Bookmark, EyeOff, Sparkles, BookOpen, Quote } from 'lucide-react';

interface FeaturedHeroCardProps {
  item: ContentItem;
}

export default function FeaturedHeroCard({ item }: FeaturedHeroCardProps) {
  const { profile, toggleLike, toggleSave, dismissItem, openArticleModal } = useApp();

  const isLiked = profile.likedItemIds.includes(item.id);
  const isSaved = profile.savedItemIds.includes(item.id);

  const getTopicColor = (topic: Topic) => {
    switch (topic) {
      case 'Psychology':
      case 'Philosophy':
        return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
      case 'Science':
      case 'Nature & Space':
        return 'text-[#D2F827] bg-[#D2F827]/10 border-[#D2F827]/30';
      case 'Technology & AI':
      case 'Programming':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <article className="group relative rounded-3xl border border-[#D2F827]/30 bg-gradient-to-b from-[#141A29] via-[#101420] to-[#0D1018] shadow-2xl overflow-hidden transition-all duration-300 hover:border-[#D2F827]/50">
      {/* Subtle glowing ambient gradient behind card */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#D2F827]/10 blur-3xl pointer-events-none" />

      <div className="p-6 sm:p-8 space-y-4 relative z-10">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#D2F827] text-black">
              Featured Discovery
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTopicColor(
                item.topic
              )}`}
            >
              {item.topic}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
              <Clock className="h-3 w-3" />
              {item.readTimeMinutes} min read
            </span>
          </div>

          <button
            onClick={() => dismissItem(item.id)}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors"
            title="Dismiss from feed"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Headline & Subtitle */}
        <div
          onClick={() => openArticleModal(item)}
          className="cursor-pointer space-y-2"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white group-hover:text-[#D2F827] transition-colors leading-tight">
            {item.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Essence Excerpt */}
        <p
          onClick={() => openArticleModal(item)}
          className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed cursor-pointer font-light"
        >
          {item.summary}
        </p>

        {/* Key Takeaway Chip */}
        {item.takeaways && item.takeaways.length > 0 && (
          <div
            onClick={() => openArticleModal(item)}
            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer flex items-start gap-2.5 text-xs text-neutral-300"
          >
            <Quote className="h-4 w-4 text-[#D2F827] shrink-0 mt-0.5" />
            <span className="italic font-light">
              &quot;{item.takeaways[0]}&quot;
            </span>
          </div>
        )}

        {/* Transparent Recommendation Reason */}
        {item.recommendedReason && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-1">
            <Sparkles className="h-3.5 w-3.5 text-[#D2F827] shrink-0" />
            <span>{item.recommendedReason}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#0A0D14]/80">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(item.id);
            }}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer touch-manipulation ${
              isLiked
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
            title="Like this idea"
            aria-label="Like this idea"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-400' : ''}`} />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(item.id);
            }}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer touch-manipulation ${
              isSaved
                ? 'text-[#D2F827] bg-[#D2F827]/10 border border-[#D2F827]/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
            title="Save bookmark"
            aria-label="Save bookmark"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#D2F827]' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openArticleModal(item);
          }}
          className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 shadow-md transition-all cursor-pointer touch-manipulation"
          aria-label={`Read Story: ${item.title}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Read Story</span>
        </button>
      </div>
    </article>
  );
}
