'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, Footprints, Moon, Clock, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MindfulPauseModal() {
  const { isMindfulPauseModalOpen, closeMindfulPauseModal, sessionSeconds, sessionCardsViewed, resetSessionTimer } = useApp();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-md bg-[#10141E] border border-white/15 rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle close button */}
        <button
          onClick={closeMindfulPauseModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Calm Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D2F827]/10 border border-[#D2F827]/25 mb-4">
          <Moon className="h-7 w-7 text-[#D2F827]" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">
          A Natural Stopping Point
        </h2>

        {/* Message */}
        <p className="text-sm text-neutral-300 leading-relaxed font-light mb-5">
          You&apos;ve spent <strong className="text-white font-medium">{minutes} mindful minutes</strong> and explored{' '}
          <strong className="text-white font-medium">{sessionCardsViewed || 1} ideas</strong>.
          <br />
          Taking a pause allows your brain&apos;s Default Mode Network to process and retain what you just learned.
        </p>

        {/* Session Stats snapshot */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-left mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D2F827]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Session Time</span>
              <span className="text-sm font-semibold text-white">{minutes} min</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#8B5CF6]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">Curiosities</span>
              <span className="text-sm font-semibold text-white">{sessionCardsViewed || 1} explored</span>
            </div>
          </div>
        </div>

        {/* Action Choices */}
        <div className="space-y-2.5">
          <button
            onClick={handleGoOffline}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors"
          >
            <Footprints className="h-4 w-4" />
            Try a 5-Min Offline Micro-Action
          </button>

          <button
            onClick={handleStepAway}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            I&apos;m Putting My Phone Away
          </button>

          <button
            onClick={closeMindfulPauseModal}
            className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors pt-1"
          >
            Explore 1 more topic
          </button>
        </div>
      </div>
    </div>
  );
}
