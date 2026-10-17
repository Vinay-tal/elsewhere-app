'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Play, Pause, RotateCcw, Check, Sparkles, Footprints, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

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
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D2F827', '#10B981', '#38BDF8'],
      });
    } catch {}
    closeOfflineTimer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92vh] bg-[#0E121B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#0A0D14]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D2F827]/10 text-[#D2F827] border border-[#D2F827]/20">
              <Footprints className="h-3 w-3" />
              {activeOfflineActivity.category}
            </span>
            <span className="text-xs text-neutral-400">
              {activeOfflineActivity.durationMinutes} min activity
            </span>
          </div>

          <button
            onClick={closeOfflineTimer}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 space-y-6 text-neutral-200">
          <div>
            <h2 className="text-xl font-bold text-white mb-1.5">
              {activeOfflineActivity.title}
            </h2>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              {activeOfflineActivity.description}
            </p>
          </div>

          {/* Interactive Timer Display */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#141924] border border-white/10 shadow-inner">
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[#D2F827] mb-2">
              {timeFormatted}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-[#D2F827] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-[#D2F827] text-black hover:bg-[#BDF010]'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    {secondsRemaining < totalSeconds ? 'Resume' : 'Start Timer'}
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsActive(false);
                  setSecondsRemaining(totalSeconds);
                }}
                className="p-2 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Steps Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Guidance Steps (Check as you go)
            </h3>
            <div className="space-y-2">
              {activeOfflineActivity.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-neutral-300'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-neutral-200'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 mt-0.5 shrink-0 items-center justify-center rounded border transition-colors ${
                        isDone
                          ? 'border-emerald-400 bg-emerald-400 text-black'
                          : 'border-white/20'
                      }`}
                    >
                      {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                    <span className={isDone ? 'line-through text-neutral-500' : ''}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reflection Note */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Smile className="h-3.5 w-3.5 text-[#D2F827]" />
              Mindful Reflection (Optional)
            </label>
            <p className="text-xs text-neutral-400 italic">
              &quot;{activeOfflineActivity.reflectionPrompt}&quot;
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Jot down a quick thought or sensation before stepping away..."
              rows={2}
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D2F827]/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.08] bg-[#0A0D14]">
          <span className="text-xs text-neutral-400">
            {activeOfflineActivity.benefit}
          </span>
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Complete & Save
          </button>
        </div>
      </div>
    </div>
  );
}
