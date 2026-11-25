'use client';

import React from 'react';
import { ContentItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { Clock, Heart, Bookmark, EyeOff, BookOpen } from 'lucide-react';
import { getTopicTone } from '@/lib/natureTheme';

interface ContentCardProps {
  item: ContentItem;
  featured?: boolean;
}

export default function ContentCard({ item, featured = false }: ContentCardProps) {
  const { profile, toggleLike, toggleSave, dismissItem, openArticleModal } = useApp();

  const isLiked = profile.likedItemIds.includes(item.id);
  const isSaved = profile.savedItemIds.includes(item.id);
  const tone = getTopicTone(item.topic);

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border transition-colors duration-200 overflow-hidden ${
        featured
          ? 'bg-[#ECEBE4]/80 border-[#C5B99F]'
          : 'bg-[#FAF9F5] border-[#E2E0D8] hover:border-[#CFCBC0]'
      }`}
    >
      <div className="p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tone.badge}`}>
              {item.topic}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#777B72] font-mono tabular-nums">
              <Clock className="h-3 w-3" />
              {item.readTimeMinutes} min
            </span>
          </div>

          <button
            type="button"
            onClick={() => dismissItem(item.id)}
            className="p-1.5 rounded-lg text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
            title="Dismiss from feed"
            aria-label="Dismiss from feed"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </div>

        <div
          onClick={() => openArticleModal(item)}
          className="cursor-pointer space-y-1.5"
        >
          <h3 className="font-editorial text-lg sm:text-xl font-medium tracking-tight text-[#292D29] group-hover:text-[#5E6D59] transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5B6057] line-clamp-2 leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        <p
          onClick={() => openArticleModal(item)}
          className="text-xs text-[#777B72] line-clamp-3 leading-relaxed cursor-pointer"
        >
          {item.summary}
        </p>

        {item.recommendedReason && (
          <div className="text-[11px] text-[#777B72] pt-2 border-t border-[#E2E0D8]">
            {item.recommendedReason}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E0D8] bg-[#F6F5F0]/70">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleLike(item.id)}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              isLiked
                ? 'text-[#715241] bg-[#A67F68]/12'
                : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
            }`}
            title="Like this idea"
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-[#A67F68] text-[#A67F68]' : ''}`} />
            <span>Like</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(item.id);
            }}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer touch-manipulation ${
              isSaved
                ? 'text-[#4D5A48] bg-[#71816B]/12'
                : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
            }`}
            title="Bookmark"
            aria-label="Save bookmark"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#71816B] text-[#71816B]' : ''}`} />
            <span>Save</span>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openArticleModal(item);
          }}
          className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#FAF9F5] bg-[#71816B] hover:bg-[#5E6D59] transition-colors cursor-pointer touch-manipulation"
          aria-label={`Read ${item.title}`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Read</span>
        </button>
      </div>
    </article>
  );
}
