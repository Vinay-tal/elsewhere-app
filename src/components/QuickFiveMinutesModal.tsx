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

  // Serendipitous items pool: all bite-sized articles + quick challenges + offline activities
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
      category: `${item.category.toUpperCase()} • ${item.topic}`,
      time: `${item.timeEstimateMinutes} min`,
      description: item.prompt,
    })),
    ...OFFLINE_ACTIVITIES.slice(0, 3).map((item) => ({
      type: 'offline' as const,
      data: item,
      title: item.title,
      category: `OFFLINE • ${item.category}`,
      time: `${item.durationMinutes} min`,
      description: item.description,
    })),
  ];

  const currentSurprise = surprisePool[surpriseIndex % surprisePool.length];

  const handleNextSurprise = () => {
    setSurpriseIndex((prev) => prev + 1);
  };

  const handleLaunchSurprise = () => {
    onClose();
    if (currentSurprise.type === 'article') {
      openArticleModal(currentSurprise.data);
    } else if (currentSurprise.type === 'challenge') {
      openChallengeModal(currentSurprise.data);
    } else {
      openOfflineTimer(currentSurprise.data);
    }
  };

  if (!isOpen) return null;

  // Curated 5-minute options
  const quickBite = CONTENT_ITEMS.find((c) => c.readTimeMinutes <= 3) || CONTENT_ITEMS[0];
  const quickChallenge = CHALLENGE_ITEMS[0];
  const quickOffline = OFFLINE_ACTIVITIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-lg bg-[#111520] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#0D1018]">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5">
            <button
              onClick={() => setMode('five-minutes')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                mode === 'five-minutes'
                  ? 'bg-[#D2F827] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ⚡ I Have 5 Minutes
            </button>
            <button
              onClick={() => {
                onClose();
                openFindSomethingModal();
              }}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all text-neutral-400 hover:text-white hover:bg-white/5"
            >
              🎲 Find Something for Me →
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {mode === 'five-minutes' ? (
            <>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Quick 5-Minute Micro-Sessions
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  Perfect when you instinctively unlock your phone between meetings, on transit, or taking a breath.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {/* 1. Quick Read */}
                <div
                  onClick={() => {
                    onClose();
                    openArticleModal(quickBite);
                  }}
                  className="group p-3.5 rounded-xl bg-[#141926] border border-white/5 hover:border-[#D2F827]/40 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <span className="font-semibold text-purple-300">{quickBite.topic}</span>
                        <span>•</span>
                        <span>{quickBite.readTimeMinutes} min read</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D2F827] transition-colors line-clamp-1">
                        {quickBite.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-[#D2F827] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 2. Quick Puzzle */}
                <div
                  onClick={() => {
                    onClose();
                    openChallengeModal(quickChallenge);
                  }}
                  className="group p-3.5 rounded-xl bg-[#141926] border border-white/5 hover:border-amber-400/40 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <span className="font-semibold text-amber-300">LOGIC PUZZLE</span>
                        <span>•</span>
                        <span>{quickChallenge.timeEstimateMinutes} min</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {quickChallenge.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 3. Offline Grounding */}
                <div
                  onClick={() => {
                    onClose();
                    openOfflineTimer(quickOffline);
                  }}
                  className="group p-3.5 rounded-xl bg-[#141926] border border-white/5 hover:border-emerald-400/40 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Footprints className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <span className="font-semibold text-emerald-300">OFFLINE RESET</span>
                        <span>•</span>
                        <span>{quickOffline.durationMinutes} min</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {quickOffline.title}
                      </h4>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Serendipity Surprise Me Card */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                    Serendipitous Pick
                  </h3>
                  <button
                    onClick={handleNextSurprise}
                    className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-purple-300 transition-colors"
                  >
                    <Shuffle className="h-3 w-3" />
                    <span>Shuffle</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  Hand-picked outside your comfort zone to broaden your mental horizons.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#151A27] border border-[#8B5CF6]/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B5CF6]/15 text-purple-300 border border-[#8B5CF6]/30">
                    {currentSurprise.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
                    <Clock className="h-3 w-3" />
                    {currentSurprise.time}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug">
                  {currentSurprise.title}
                </h4>

                <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                  {currentSurprise.description}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={handleLaunchSurprise}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 transition-all"
                  >
                    <span>Launch This Discovery</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handleNextSurprise}
                    className="p-2.5 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
                    title="Try another"
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
