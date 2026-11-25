'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Footprints, Moon, Clock, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MindfulPauseModal() {
  const {
    isMindfulPauseModalOpen,
    closeMindfulPauseModal,
    sessionSeconds,
    sessionCardsViewed,
    resetSessionTimer,
  } = useApp();
  const router = useRouter();

  if (!isMindfulPauseModalOpen) return null;

  const minutes = Math.floor(sessionSeconds / 60);

  const handleGoOffline = () => {
    closeMindfulPauseModal();
    router.push('/do-something');
  };

  const handleStepAway = () => {
    resetSessionTimer();
    closeMindfulPauseModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Natural stopping point"
      onClick={closeMindfulPauseModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D29]/45 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-md bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl p-6 sm:p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeMindfulPauseModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
          title="Dismiss"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECEBE4] border border-[#E2E0D8] mb-4">
          <Moon className="h-6 w-6 text-[#71816B]" />
        </div>

        <h2 className="font-editorial text-2xl font-medium tracking-tight text-[#292D29] mb-2">
          A Natural Stopping Point
        </h2>

        <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed mb-5">
          You&apos;ve spent <strong className="text-[#292D29] font-medium">{minutes} mindful minutes</strong> and explored{' '}
          <strong className="text-[#292D29] font-medium">{sessionCardsViewed || 1} ideas</strong>. Pausing gives your mind space to absorb what you read.
        </p>

        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-left mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#71816B]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#777B72] block">
                Session Time
              </span>
              <span className="text-sm font-medium text-[#292D29] font-mono tabular-nums">
                {minutes} min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#8C7A56]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#777B72] block">
                Explored
              </span>
              <span className="text-sm font-medium text-[#292D29] font-mono tabular-nums">
                {sessionCardsViewed || 1} ideas
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoOffline}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
          >
            <Footprints className="h-4 w-4" />
            <span>Try a 5-Min Offline Reset</span>
          </button>

          <button
            type="button"
            onClick={handleStepAway}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border border-[#E2E0D8] bg-[#ECEBE4]/70 text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
          >
            I&apos;m Putting My Phone Away
          </button>

          <button
            type="button"
            onClick={closeMindfulPauseModal}
            className="text-xs text-[#777B72] hover:text-[#292D29] transition-colors pt-1 cursor-pointer"
          >
            Explore one more topic
          </button>
        </div>
      </div>
    </div>
  );
}
