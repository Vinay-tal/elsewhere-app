'use client';

import React from 'react';
import { ContentItem, Topic } from '@/types';
import { useApp } from '@/context/AppContext';
import { Clock, Bookmark, ArrowRight, Sparkles, Heart } from 'lucide-react';

interface CompactCuriosityCardProps {
  item: ContentItem;
}

export default function CompactCuriosityCard({ item }: CompactCuriosityCardProps) {
  const { profile, toggleSave, toggleLike, openArticleModal } = useApp();

  const isSaved = profile.savedItemIds.includes(item.id);
  const isLiked = profile.likedItemIds.includes(item.id);

  const getTopicColor = (topic: Topic) => {
    switch (topic) {
      case 'Psychology':
      case 'Philosophy':
        return 'text-purple-300 bg-purple-500/10 border-purple-500/25';
      case 'Science':
      case 'Nature & Space':
        return 'text-[#D2F827] bg-[#D2F827]/10 border-[#D2F827]/25';
      case 'Technology & AI':
      case 'Programming':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25';
      default:
        return 'text-amber-300 bg-amber-500/10 border-amber-500/25';
    }
  };

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
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#111622] border border-white/[0.08] hover:border-white/20 hover:bg-[#141A28] cursor-pointer transition-all duration-200 active:scale-[0.98] shadow-sm touch-manipulation"
      aria-label={`Open discovery: ${item.title}`}
    >
      <div className="space-y-2.5">
        {/* Meta Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${getTopicColor(
                item.topic
              )}`}
            >
              {item.topic}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
              <Clock className="h-3 w-3" />
              {item.readTimeMinutes} min
            </span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isLiked ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
              title="Like"
              aria-label="Like idea"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(item.id);
              }}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isSaved ? 'text-[#D2F827] bg-[#D2F827]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
              title="Bookmark"
              aria-label="Save bookmark"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#D2F827]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D2F827] transition-colors leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Concise Description */}
        <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
          {item.summary}
        </p>
      </div>

      {/* Footer Action */}
      <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between text-xs">
        <span className="text-[11px] text-neutral-400 truncate max-w-[190px]">
          {item.recommendedReason ? (
            <span className="flex items-center gap-1 text-[#D2F827]/80">
              <Sparkles className="h-2.5 w-2.5 shrink-0" />
              {item.recommendedReason}
            </span>
          ) : (
            `Curated discovery in ${item.topic}`
          )}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openArticleModal(item);
          }}
          className="min-h-[44px] min-w-[64px] flex items-center justify-end gap-1 font-semibold text-[#D2F827] group-hover:translate-x-0.5 active:scale-95 transition-all cursor-pointer py-1.5 px-2 rounded-lg hover:bg-white/5"
          aria-label={`Read story: ${item.title}`}
        >
          <span>Read</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
