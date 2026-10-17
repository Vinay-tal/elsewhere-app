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
  HeartHandshake
} from 'lucide-react';

export default function EndOfSessionModal() {
  const {
    isEndOfSessionModalOpen,
    closeEndOfSessionModal,
    activeSession,
    sessionSeconds,
    endSessionWithReflection,
    setSessionTargetDuration
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
    // Extend session target by 5 minutes
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative flex flex-col w-full max-w-lg bg-[#10141D] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {hasExited ? (
          /* Friction-Free Peaceful Exit Confirmation */
          <div className="py-6 space-y-4 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Session Completed Peacefully
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                Your reflection has been recorded. Put your phone face-down and enjoy the rest of your day.
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={handleCloseAfterExit}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Close Elsewhere
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Calm Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D2F827]/10 border border-[#D2F827]/30 text-[#D2F827]">
              <Moon className="h-7 w-7" />
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D2F827]">
                Intentional Boundary Reached
              </span>
              <h2
                id="end-session-modal-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-white"
              >
                A Natural Stopping Point
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                You reached your intended session limit of{' '}
                <strong className="text-white font-medium">
                  {activeSession.targetDurationMinutes} minutes
                </strong>
                .
              </p>
            </div>

            {/* Quick Session Stats */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-left">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#D2F827]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                    Time Invested
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    {elapsedMinutes} min
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">
                    Curiosities Explored
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    {cardsCount} ideas
                  </span>
                </div>
              </div>
            </div>

            {/* Reflection: Did this session feel worthwhile? */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-left space-y-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />
                  Did this session feel worthwhile?
                </span>
                <p className="text-[11px] text-neutral-400 font-light">
                  A quick honest check-in to keep your phone usage purposeful:
                </p>
              </div>

              {/* 4 Reflection Options */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🌟 Very worthwhile', value: 'very' as WorthwhileRating },
                  { label: '👍 Somewhat worthwhile', value: 'somewhat' as WorthwhileRating },
                  { label: '😐 Neutral', value: 'neutral' as WorthwhileRating },
                  { label: '📱 Got distracted', value: 'distracted' as WorthwhileRating },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedRating(item.value)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                      selectedRating === item.value
                        ? 'bg-[#D2F827]/15 border-[#D2F827]/60 text-white font-semibold'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Optional brief reflection note */}
              <input
                type="text"
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="Optional takeaway: one thought or idea you’ll remember..."
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-base sm:text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D2F827]/50 min-h-[44px]"
              />
            </div>

            {/* Action Choices */}
            <div className="space-y-2 pt-1">
              {/* Primary Exit: Friction-Free Put Phone Down */}
              <button
                onClick={handlePhoneAway}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors shadow-lg shadow-[#D2F827]/10 min-h-[48px]"
              >
                <Smartphone className="h-4 w-4" />
                I’m Putting My Phone Away
              </button>

              {/* Secondary Option: 5-Min Offline Reset */}
              <button
                onClick={handleGoOffline}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors min-h-[44px]"
              >
                <Footprints className="h-4 w-4 text-emerald-400" />
                Try a 5-Min Offline Micro-Action
              </button>

              {/* Optional Extension */}
              <button
                onClick={handleAddFiveMinutes}
                className="flex items-center justify-center gap-1.5 mx-auto text-xs text-neutral-400 hover:text-[#D2F827] transition-colors py-1.5"
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
