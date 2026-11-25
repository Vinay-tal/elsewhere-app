'use client';

import React from 'react';
import { ContentItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { Clock, Bookmark, ArrowRight, Heart } from 'lucide-react';
import { getTopicTone } from '@/lib/natureTheme';

interface CompactCuriosityCardProps {
  item: ContentItem;
}

export default function CompactCuriosityCard({ item }: CompactCuriosityCardProps) {
  const { profile, toggleSave, toggleLike, openArticleModal } = useApp();

  const isSaved = profile.savedItemIds.includes(item.id);
  const isLiked = profile.likedItemIds.includes(item.id);
  const tone = getTopicTone(item.topic);

  return (
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
      className={`group relative flex flex-col justify-between p-5 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] border-l-2 ${tone.accentBorder} hover:border-[#CFCBC0] hover:bg-[#FFFFFF] cursor-pointer transition-colors duration-200 touch-manipulation`}
      aria-label={`Open discovery: ${item.title}`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${tone.badge}`}>
              {item.topic}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#777B72] font-mono tabular-nums">
              <Clock className="h-3 w-3" />
              {item.readTimeMinutes}m
            </span>
          </div>

          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                isLiked
                  ? 'text-[#A67F68] bg-[#A67F68]/10'
                  : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]/70'
              }`}
              title="Like"
              aria-label="Like idea"
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-[#A67F68]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(item.id);
              }}
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                isSaved
                  ? 'text-[#71816B] bg-[#71816B]/10'
                  : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]/70'
              }`}
              title="Bookmark"
              aria-label="Save bookmark"
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#71816B]' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="font-editorial text-lg font-medium text-[#292D29] group-hover:text-[#5E6D59] transition-colors leading-snug line-clamp-2">
          {item.title}
        </h3>

        <p className="text-xs text-[#5B6057] line-clamp-2 leading-relaxed">
          {item.summary}
        </p>
      </div>

      <div className="pt-3 mt-4 border-t border-[#E2E0D8] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#777B72] truncate max-w-[200px]">
          {item.recommendedReason || `Curated in ${item.topic}`}
        </span>

        <span className="inline-flex items-center gap-1 font-medium text-[#71816B] group-hover:translate-x-0.5 transition-transform">
          <span>Read</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
