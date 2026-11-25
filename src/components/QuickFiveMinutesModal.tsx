'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CONTENT_ITEMS, CHALLENGE_ITEMS, OFFLINE_ACTIVITIES } from '@/lib/data';
import { X, Sparkles, Clock, ArrowRight, Trophy, Footprints, BookOpen, Shuffle } from 'lucide-react';

interface QuickFiveMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'five-minutes' | 'surprise-me';
}

export default function QuickFiveMinutesModal({
  isOpen,
  onClose,
  initialMode = 'five-minutes',
}: QuickFiveMinutesModalProps) {
  const { openArticleModal, openChallengeModal, openOfflineTimer, openFindSomethingModal } = useApp();
  const [mode, setMode] = useState<'five-minutes' | 'surprise-me'>(initialMode);
  const [surpriseIndex, setSurpriseIndex] = useState(0);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const surprisePool = [
    ...CONTENT_ITEMS.filter((c) => c.readTimeMinutes <= 3).map((item) => ({
      type: 'article' as const,
      data: item,
      title: item.title,
      category: item.topic,
      time: `${item.readTimeMinutes} min`,
      description: item.summary,
    })),
    ...CHALLENGE_ITEMS.map((item) => ({
      type: 'challenge' as const,
      data: item,
      title: item.title,
      category: `${item.category.toUpperCase()} · ${item.topic}`,
      time: `${item.timeEstimateMinutes} min`,
      description: item.prompt,
    })),
    ...OFFLINE_ACTIVITIES.slice(0, 3).map((item) => ({
      type: 'offline' as const,
      data: item,
      title: item.title,
      category: `OFFLINE · ${item.category}`,
      time: `${item.durationMinutes} min`,
      description: item.description,
    })),
  ];

  const currentSurprise = surprisePool[surpriseIndex % surprisePool.length];

  const handleNextSurprise = () => setSurpriseIndex((prev) => prev + 1);

  const handleLaunchSurprise = () => {
    onClose();
    if (currentSurprise.type === 'article') openArticleModal(currentSurprise.data);
    else if (currentSurprise.type === 'challenge') openChallengeModal(currentSurprise.data);
    else openOfflineTimer(currentSurprise.data);
  };

  if (!isOpen) return null;

  const quickBite = CONTENT_ITEMS.find((c) => c.readTimeMinutes <= 3) || CONTENT_ITEMS[0];
  const quickChallenge = CHALLENGE_ITEMS[0];
  const quickOffline = OFFLINE_ACTIVITIES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="5-minute mindful options"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D29]/45 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-lg bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-[#E2E0D8] bg-[#F6F5F0]">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#ECEBE4] border border-[#E2E0D8]">
            <button
              type="button"
              onClick={() => setMode('five-minutes')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                mode === 'five-minutes'
                  ? 'bg-[#71816B] text-[#FAF9F5]'
                  : 'text-[#5B6057] hover:text-[#292D29]'
              }`}
            >
              5-Min Options
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                openFindSomethingModal();
              }}
              className="px-3 py-1 rounded-lg text-xs font-medium text-[#5B6057] hover:text-[#292D29] transition-colors cursor-pointer"
            >
              Guide Me →
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {mode === 'five-minutes' ? (
            <>
              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-medium text-[#292D29]">
                  Quiet 5-Minute Breaks
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6057]">
                  Three steady choices for a brief pause between tasks or on transit.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openArticleModal(quickBite);
                  }}
                  className="w-full text-left group p-3.5 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] hover:border-[#71816B] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECEBE4] text-[#71816B]">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#777B72]">
                        <span className="font-medium text-[#4D5A48]">{quickBite.topic}</span>
                        <span>·</span>
                        <span>{quickBite.readTimeMinutes} min read</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#292D29] truncate">
                        {quickBite.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#777B72] group-hover:text-[#71816B] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openChallengeModal(quickChallenge);
                  }}
                  className="w-full text-left group p-3.5 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] hover:border-[#71816B] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECEBE4] text-[#8C7A56]">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#777B72]">
                        <span className="font-medium text-[#5B4D34]">Logic Puzzle</span>
                        <span>·</span>
                        <span>{quickChallenge.timeEstimateMinutes} min</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#292D29] truncate">
                        {quickChallenge.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#777B72] group-hover:text-[#71816B] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openOfflineTimer(quickOffline);
                  }}
                  className="w-full text-left group p-3.5 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] hover:border-[#71816B] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECEBE4] text-[#71816B]">
                      <Footprints className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#777B72]">
                        <span className="font-medium text-[#4D5A48]">Offline Reset</span>
                        <span>·</span>
                        <span>{quickOffline.durationMinutes} min</span>
                      </div>
                      <h4 className="text-sm font-medium text-[#292D29] truncate">
                        {quickOffline.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#777B72] group-hover:text-[#71816B] shrink-0" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-medium text-[#292D29] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#71816B]" />
                    <span>Serendipitous Pick</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleNextSurprise}
                    className="flex items-center gap-1 text-xs text-[#71816B] hover:text-[#292D29] cursor-pointer"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    <span>Shuffle</span>
                  </button>
                </div>
                <p className="text-xs text-[#5B6057]">
                  A calm discovery outside your usual selections.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F6F5F0] border border-[#E2E0D8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#ECEBE4] text-[#5B6057] border border-[#E2E0D8]">
                    {currentSurprise.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#777B72] font-mono">
                    <Clock className="h-3 w-3" />
                    {currentSurprise.time}
                  </span>
                </div>

                <h4 className="font-editorial text-lg font-medium text-[#292D29] leading-snug">
                  {currentSurprise.title}
                </h4>

                <p className="text-xs text-[#5B6057] leading-relaxed line-clamp-3">
                  {currentSurprise.description}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLaunchSurprise}
                    className="flex-1 min-h-[42px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                  >
                    <span>Begin</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSurprise}
                    className="min-h-[42px] p-2.5 rounded-xl border border-[#E2E0D8] bg-[#FAF9F5] text-[#5B6057] hover:text-[#292D29] transition-colors cursor-pointer"
                    title="Try another"
                    aria-label="Try another"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
