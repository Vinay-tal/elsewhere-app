'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { WorthwhileRating } from '@/types';
import { useRouter } from 'next/navigation';
import {
  Moon,
  Clock,
  Sparkles,
  Footprints,
  Smartphone,
  CheckCircle,
  PlusCircle,
  HeartHandshake,
} from 'lucide-react';
import { HorizonDividerArt } from '@/components/ActivityArtwork';

export default function EndOfSessionModal() {
  const {
    isEndOfSessionModalOpen,
    closeEndOfSessionModal,
    activeSession,
    sessionSeconds,
    endSessionWithReflection,
    setSessionTargetDuration,
  } = useApp();

  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState<WorthwhileRating>('very');
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [hasExited, setHasExited] = useState<boolean>(false);

  if (!isEndOfSessionModalOpen) return null;

  const elapsedMinutes = Math.max(1, Math.round(sessionSeconds / 60));
  const cardsCount = activeSession.cardsViewed || 1;

  const handlePhoneAway = () => {
    endSessionWithReflection(selectedRating, reflectionNote);
    setHasExited(true);
  };

  const handleGoOffline = () => {
    endSessionWithReflection(selectedRating, reflectionNote);
    closeEndOfSessionModal();
    router.push('/do-something');
  };

  const handleAddFiveMinutes = () => {
    const nextTarget = activeSession.targetDurationMinutes + 5;
    setSessionTargetDuration(nextTarget);
    closeEndOfSessionModal();
  };

  const handleCloseAfterExit = () => {
    setHasExited(false);
    closeEndOfSessionModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-session-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292D29]/45 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-lg bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {hasExited ? (
          <div className="py-6 space-y-5 animate-gentle-enter">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#71816B]/12 border border-[#71816B]/30 text-[#71816B]">
              <CheckCircle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-editorial text-2xl font-medium text-[#292D29]">
                Session Completed Peacefully
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6057] max-w-sm mx-auto leading-relaxed">
                Your reflection is saved. Put your device aside and enjoy the rest of your day.
              </p>
            </div>

            <HorizonDividerArt />

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCloseAfterExit}
                className="w-full min-h-[44px] py-2.5 rounded-xl text-xs font-medium bg-[#ECEBE4] text-[#292D29] hover:bg-[#E2E0D8] transition-colors cursor-pointer"
              >
                Close Elsewhere
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECEBE4] border border-[#E2E0D8] text-[#71816B]">
              <Moon className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase font-medium tracking-wider text-[#71816B]">
                Intentional Boundary Reached
              </span>
              <h2
                id="end-session-modal-title"
                className="font-editorial text-2xl font-medium tracking-tight text-[#292D29]"
              >
                A Natural Stopping Point
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                You reached your intended limit of{' '}
                <strong className="text-[#292D29] font-medium">
                  {activeSession.targetDurationMinutes} minutes
                </strong>
                .
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-left">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#71816B]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#777B72] block">
                    Time Invested
                  </span>
                  <span className="text-sm font-medium text-[#292D29] font-mono tabular-nums">
                    {elapsedMinutes} min
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-[#8C7A56]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#777B72] block">
                    Explored
                  </span>
                  <span className="text-sm font-medium text-[#292D29] font-mono tabular-nums">
                    {cardsCount} ideas
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-left space-y-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#292D29] flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-[#71816B]" />
                  Did this session feel worthwhile?
                </span>
                <p className="text-[11px] text-[#777B72]">
                  A quiet check-in to keep screen time purposeful:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Very worthwhile', value: 'very' as WorthwhileRating },
                  { label: 'Somewhat worthwhile', value: 'somewhat' as WorthwhileRating },
                  { label: 'Neutral', value: 'neutral' as WorthwhileRating },
                  { label: 'Got distracted', value: 'distracted' as WorthwhileRating },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedRating(item.value)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                      selectedRating === item.value
                        ? 'bg-[#71816B] border-[#71816B] text-[#FAF9F5]'
                        : 'bg-[#FAF9F5] border-[#E2E0D8] text-[#5B6057] hover:border-[#71816B]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="Optional takeaway: one thought you'll remember..."
                className="w-full px-3 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E2E0D8] text-base sm:text-xs text-[#292D29] placeholder-[#777B72] focus:outline-none focus:border-[#71816B] min-h-[44px]"
              />
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handlePhoneAway}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors min-h-[48px] cursor-pointer"
              >
                <Smartphone className="h-4 w-4" />
                <span>I&apos;m Putting My Phone Away</span>
              </button>

              <button
                type="button"
                onClick={handleGoOffline}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border border-[#E2E0D8] bg-[#ECEBE4]/70 text-[#292D29] hover:bg-[#ECEBE4] transition-colors min-h-[44px] cursor-pointer"
              >
                <Footprints className="h-4 w-4 text-[#71816B]" />
                <span>Try a 5-Min Offline Micro-Action</span>
              </button>

              <button
                type="button"
                onClick={handleAddFiveMinutes}
                className="flex items-center justify-center gap-1.5 mx-auto text-xs text-[#777B72] hover:text-[#292D29] transition-colors py-1.5 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add 5 more minutes to finish reading</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
