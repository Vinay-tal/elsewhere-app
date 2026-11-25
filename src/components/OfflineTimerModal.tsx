'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Play, Pause, RotateCcw, Check, Footprints, Smile } from 'lucide-react';
import { BreathCircleRing } from '@/components/ActivityArtwork';
import { getOfflineTone } from '@/lib/natureTheme';

export default function OfflineTimerModal() {
  const { activeOfflineActivity, closeOfflineTimer, completeOfflineActivity } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [reflection, setReflection] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (activeOfflineActivity) {
      setSecondsRemaining(activeOfflineActivity.durationMinutes * 60);
      setIsActive(false);
      setReflection('');
      setCompletedSteps([]);
    }
  }, [activeOfflineActivity]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOfflineTimer();
    };
    if (activeOfflineActivity) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeOfflineActivity, closeOfflineTimer]);

  if (!activeOfflineActivity) return null;

  const totalSeconds = activeOfflineActivity.durationMinutes * 60;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100)
  );

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const tone = getOfflineTone(activeOfflineActivity.category);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleFinish = () => {
    completeOfflineActivity(
      activeOfflineActivity.id,
      activeOfflineActivity.title,
      activeOfflineActivity.durationMinutes,
      reflection
    );
    closeOfflineTimer();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-timer-title"
      onClick={closeOfflineTimer}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292D29]/40 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92dvh] bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E0D8] bg-[#F6F5F0]">
          <div className="flex items-center gap-2.5">
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone.badge}`}>
              <Footprints className="h-3 w-3" />
              {activeOfflineActivity.category}
            </span>
            <span className="text-xs text-[#777B72] font-mono">
              {activeOfflineActivity.durationMinutes} min reset
            </span>
          </div>

          <button
            type="button"
            onClick={closeOfflineTimer}
            aria-label="Close activity timer"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 space-y-6">
          <div className="space-y-1.5 text-center">
            <h2
              id="offline-timer-title"
              className="font-editorial text-2xl font-medium text-[#292D29]"
            >
              {activeOfflineActivity.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed max-w-md mx-auto">
              {activeOfflineActivity.description}
            </p>
          </div>

          {/* Serene Circular Timer */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F6F5F0] border border-[#E2E0D8] space-y-5">
            <BreathCircleRing
              progressPercent={progressPercent}
              timeFormatted={timeFormatted}
              subtitle={isActive ? 'In progress' : secondsRemaining === 0 ? 'Complete' : 'Ready'}
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`min-h-[44px] flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#C5B99F]/35 text-[#5B4D34] border border-[#C5B99F] hover:bg-[#C5B99F]/50'
                    : 'bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59]'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>{secondsRemaining < totalSeconds ? 'Resume' : 'Start Timer'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsActive(false);
                  setSecondsRemaining(totalSeconds);
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E2E0D8] bg-[#FAF9F5] text-[#777B72] hover:text-[#292D29] transition-colors cursor-pointer"
                title="Reset Timer"
                aria-label="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Steps Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#777B72]">
              Guided Steps
            </h3>
            <div className="space-y-2">
              {activeOfflineActivity.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors cursor-pointer ${
                      isDone
                        ? 'border-[#71816B]/40 bg-[#71816B]/10 text-[#5B6057]'
                        : 'border-[#E2E0D8] bg-[#F6F5F0] hover:bg-[#ECEBE4]/60 text-[#292D29]'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 mt-0.5 shrink-0 items-center justify-center rounded border transition-colors ${
                        isDone
                          ? 'border-[#71816B] bg-[#71816B] text-[#FAF9F5]'
                          : 'border-[#CFCBC0]'
                      }`}
                    >
                      {isDone && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </span>
                    <span className={isDone ? 'line-through text-[#777B72]' : ''}>{step}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reflection Note */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777B72] flex items-center gap-1.5">
              <Smile className="h-3.5 w-3.5 text-[#71816B]" />
              <span>Optional Reflection</span>
            </label>
            <p className="font-editorial text-sm text-[#5B6057] italic">
              &ldquo;{activeOfflineActivity.reflectionPrompt}&rdquo;
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="A brief note on how you feel after stepping away..."
              rows={2}
              className="w-full p-3 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-base sm:text-sm text-[#292D29] placeholder-[#777B72] focus:outline-none focus:border-[#71816B]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-[#E2E0D8] bg-[#F6F5F0]">
          <span className="text-xs text-[#777B72] truncate max-w-[260px]">
            {activeOfflineActivity.benefit}
          </span>
          <button
            type="button"
            onClick={handleFinish}
            className="min-h-[44px] flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Complete &amp; Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
