'use client';

import React from 'react';
import { ContentItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { Clock, Heart, Bookmark, EyeOff, BookOpen } from 'lucide-react';
import { getTopicTone } from '@/lib/natureTheme';
import { BotanicalMotif } from '@/components/ActivityArtwork';

interface FeaturedHeroCardProps {
  item: ContentItem;
}

export default function FeaturedHeroCard({ item }: FeaturedHeroCardProps) {
  const { profile, toggleLike, toggleSave, dismissItem, openArticleModal } = useApp();

  const isLiked = profile.likedItemIds.includes(item.id);
  const isSaved = profile.savedItemIds.includes(item.id);
  const tone = getTopicTone(item.topic);

  return (
    <article className="group relative rounded-2xl border border-[#E2E0D8] bg-[#ECEBE4]/75 transition-colors duration-200 hover:border-[#CFCBC0] overflow-hidden">
      <div className="p-6 sm:p-8 space-y-5">
        {/* Top Meta & Dismiss */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#71816B] text-[#FAF9F5]">
              Featured Reading
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tone.badge}`}>
              {item.topic}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[#777B72] font-mono tabular-nums">
              <Clock className="h-3 w-3" />
              {item.readTimeMinutes} min read
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <BotanicalMotif className="hidden sm:block h-12 w-12 opacity-90" />
            <button
              type="button"
              onClick={() => dismissItem(item.id)}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#777B72] hover:text-[#292D29] hover:bg-[#E2E0D8]/60 transition-colors cursor-pointer"
              title="Dismiss from feed"
              aria-label="Dismiss from feed"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title & Excerpt */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => openArticleModal(item)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openArticleModal(item);
            }
          }}
          className="cursor-pointer space-y-2.5 max-w-2xl"
        >
          <h3 className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#292D29] group-hover:text-[#4D5A48] transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-sm sm:text-base text-[#5B6057] leading-relaxed">
            {item.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-[#777B72] line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        </div>

        {/* Takeaway Note */}
        {item.takeaways && item.takeaways.length > 0 && (
          <div
            onClick={() => openArticleModal(item)}
            className={`p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] border-l-2 ${tone.accentBorder} cursor-pointer text-xs sm:text-sm text-[#5B6057] leading-relaxed`}
          >
            <span className="font-editorial italic">&ldquo;{item.takeaways[0]}&rdquo;</span>
          </div>
        )}

        {item.recommendedReason && (
          <p className="text-xs text-[#777B72]">{item.recommendedReason}</p>
        )}
      </div>

      {/* Quiet Footer Actions */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#E2E0D8] bg-[#FAF9F5]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(item.id);
            }}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
              isLiked
                ? 'text-[#715241] bg-[#A67F68]/12 border border-[#A67F68]/30'
                : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]/70 border border-transparent'
            }`}
            title="Like this idea"
            aria-label="Like this idea"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-[#A67F68] text-[#A67F68]' : ''}`} />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(item.id);
            }}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
              isSaved
                ? 'text-[#4D5A48] bg-[#71816B]/12 border border-[#71816B]/30'
                : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]/70 border border-transparent'
            }`}
            title="Save bookmark"
            aria-label="Save bookmark"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#71816B] text-[#71816B]' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openArticleModal(item);
          }}
          className="min-h-[44px] flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer touch-manipulation"
          aria-label={`Read Story: ${item.title}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Read Story</span>
        </button>
      </div>
    </article>
  );
}
