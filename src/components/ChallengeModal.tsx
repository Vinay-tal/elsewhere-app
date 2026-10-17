'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import confetti from 'canvas-confetti';
import {
  X,
  HelpCircle,
  Check,
  AlertCircle,
  Lightbulb,
  Trophy,
  RotateCcw,
  Bookmark,
  Compass,
  Eye,
  Keyboard,
  Clock
} from 'lucide-react';

export default function ChallengeModal() {
  const {
    activeChallenge,
    closeChallengeModal,
    profile,
    recordChallengeAnswer,
    toggleSave,
    isSaved,
    sessionSeconds,
    activeSession
  } = useApp();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    if (activeChallenge) {
      // Check if previously completed
      const prior = profile.completedChallengeScores[activeChallenge.id];
      if (prior) {
        setSelectedIdx(prior.selected);
        setIsAnswered(true);
      } else {
        setSelectedIdx(null);
        setShowHint(false);
        setIsAnswered(false);
      }
    }
  }, [activeChallenge, profile.completedChallengeScores]);

  const handleSelectOption = useCallback(
    (idx: number) => {
      if (!activeChallenge || isAnswered) return;
      setSelectedIdx(idx);
      setIsAnswered(true);

      const isCorrect = idx === activeChallenge.correctOptionIndex;
      recordChallengeAnswer(activeChallenge.id, idx, isCorrect);

      if (isCorrect) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#D2F827', '#8B5CF6', '#FFFFFF'],
          });
        } catch {
          // confetti fallback
        }
      }
    },
    [activeChallenge, isAnswered, recordChallengeAnswer]
  );

  const handleRetry = useCallback(() => {
    setSelectedIdx(null);
    setIsAnswered(false);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    if (!activeChallenge) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeChallengeModal();
        return;
      }

      // Shortcut: S to toggle save
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleSave(activeChallenge.id);
        return;
      }

      // Shortcut: H to toggle hint
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowHint((prev) => !prev);
        return;
      }

      // Shortcut: R to retry
      if ((e.key === 'r' || e.key === 'R') && isAnswered) {
        e.preventDefault();
        handleRetry();
        return;
      }

      // Shortcut: Options 1-4 or A-D
      if (!isAnswered) {
        let optionToPick: number | null = null;
        if (e.key === '1' || e.key.toLowerCase() === 'a') optionToPick = 0;
        else if (e.key === '2' || e.key.toLowerCase() === 'b') optionToPick = 1;
        else if (e.key === '3' || e.key.toLowerCase() === 'c') optionToPick = 2;
        else if (e.key === '4' || e.key.toLowerCase() === 'd') optionToPick = 3;

        if (optionToPick !== null && optionToPick < activeChallenge.options.length) {
          e.preventDefault();
          handleSelectOption(optionToPick);
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeChallenge,
    closeChallengeModal,
    handleRetry,
    handleSelectOption,
    isAnswered,
    toggleSave
  ]);

  if (!activeChallenge) return null;

  const isSavedState = isSaved(activeChallenge.id);
  const isCorrect = selectedIdx === activeChallenge.correctOptionIndex;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92dvh] bg-[#10141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.08] bg-[#0D1017]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <Trophy className="h-3 w-3" />
              {activeChallenge.category.toUpperCase()}
            </span>
            <span className="text-xs text-neutral-400">
              {activeChallenge.topic} • {activeChallenge.difficulty} • ~{activeChallenge.timeEstimateMinutes}m
            </span>
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-neutral-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/5"
              title="Active session timer"
            >
              <Clock className="h-3 w-3 text-[#D2F827]" />
              <span>
                {String(Math.floor(sessionSeconds / 60)).padStart(2, '0')}:
                {String(sessionSeconds % 60).padStart(2, '0')} / {activeSession.targetDurationMinutes}m
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSave(activeChallenge.id)}
              aria-label={isSavedState ? 'Remove from saved' : 'Save challenge'}
              title={isSavedState ? 'Saved to bookmarks (S)' : 'Save for later (S)'}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border transition-all ${
                isSavedState
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSavedState ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={closeChallengeModal}
              aria-label="Close challenge modal"
              title="Close (Esc)"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Challenge Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 space-y-5 text-neutral-200">
          <div>
            <h2
              id="challenge-modal-title"
              className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight"
            >
              {activeChallenge.title}
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-light">
              {activeChallenge.prompt}
            </p>
          </div>

          {/* Instructions Callout */}
          {activeChallenge.instructions && (
            <div className="px-3.5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-start gap-2.5">
              <Compass className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-blue-300 block">Instructions:</span>
                <p className="text-neutral-300 leading-relaxed font-light">
                  {activeChallenge.instructions}
                </p>
              </div>
            </div>
          )}

          {/* Optional Visual Pattern for Memory & Observation */}
          {activeChallenge.visualPattern && activeChallenge.visualPattern.length > 0 && (
            <div className="p-4 rounded-xl bg-[#080B10] border border-amber-400/25 shadow-inner text-amber-300">
              <div className="text-[11px] uppercase font-bold tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>Observation Grid</span>
              </div>
              <div className="space-y-1.5 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs sm:text-sm">
                {activeChallenge.visualPattern.map((line, pIdx) => (
                  <div key={pIdx} className="leading-relaxed tracking-wide whitespace-pre-wrap font-semibold">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Code Snippet for Programming */}
          {activeChallenge.codeSnippet && (
            <div className="p-3.5 rounded-xl bg-[#090C12] border border-white/10 font-mono text-xs text-[#D2F827] overflow-x-auto">
              <pre>{activeChallenge.codeSnippet}</pre>
            </div>
          )}

          {/* The Specific Question */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <p className="text-sm font-medium text-white flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-[#D2F827] shrink-0 mt-0.5" />
              <span>{activeChallenge.question}</span>
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5" role="group" aria-label="Answer options">
            {activeChallenge.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const numberKey = idx + 1;
              let optionStyle =
                'border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-neutral-200';

              if (isAnswered) {
                if (idx === activeChallenge.correctOptionIndex) {
                  optionStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200';
                } else if (idx === selectedIdx) {
                  optionStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-200';
                } else {
                  optionStyle = 'border-white/5 opacity-40 text-neutral-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  aria-pressed={selectedIdx === idx}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${optionStyle}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                      isAnswered && idx === activeChallenge.correctOptionIndex
                        ? 'bg-emerald-500 text-black'
                        : isAnswered && idx === selectedIdx
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/10 text-neutral-300'
                    }`}
                  >
                    {isAnswered && idx === activeChallenge.correctOptionIndex ? (
                      <Check className="h-4 w-4 stroke-[3]" />
                    ) : isAnswered && idx === selectedIdx ? (
                      <X className="h-4 w-4 stroke-[3]" />
                    ) : (
                      letter
                    )}
                  </span>
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <span className="leading-snug whitespace-pre-line">{option}</span>
                    {!isAnswered && (
                      <span className="hidden sm:inline-block text-[10px] text-neutral-500 font-mono px-1.5 py-0.5 rounded bg-white/5">
                        {numberKey}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hint Section */}
          {!isAnswered && (
            <div className="pt-1">
              {showHint ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold block text-amber-300">Helpful Hint:</span>
                      <button
                        onClick={() => setShowHint(false)}
                        className="text-[11px] text-amber-300/60 hover:text-amber-200 underline"
                      >
                        Hide hint
                      </button>
                    </div>
                    <span className="leading-relaxed font-light">{activeChallenge.hint}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-300 transition-colors py-1 min-h-[36px]"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Need a hint? (Press H)</span>
                </button>
              )}
            </div>
          )}

          {/* Educational Feedback & Explanation after Answer */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2.5 animate-in fade-in duration-300 ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                  : 'bg-rose-950/20 border-rose-500/20 text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-sm">
                  {isCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
                      Correct deduction!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400 stroke-[2.5]" />
                      Not quite, but here’s why:
                    </>
                  )}
                </span>
                <button
                  onClick={handleRetry}
                  title="Retry this challenge (Press R)"
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry (R)</span>
                </button>
              </div>

              <div className="leading-relaxed font-light text-neutral-300 whitespace-pre-line space-y-1">
                {activeChallenge.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Accessibility Shortcuts */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-white/[0.08] bg-[#0D1017]">
          {/* Keyboard Shortcuts Hint */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Keyboard className="h-3 w-3 text-neutral-500 hidden sm:inline" />
            <span className="hidden sm:inline">Shortcuts:</span>
            <span className="font-mono text-neutral-300">
              {!isAnswered ? '1-4 / A-D' : 'R to retry'} • S to bookmark • Esc to close
            </span>
          </div>

          <button
            onClick={closeChallengeModal}
            className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors min-h-[40px]"
          >
            {isAnswered ? 'Continue' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
