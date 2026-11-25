'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { getChallengeTone } from '@/lib/natureTheme';
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
  Clock,
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
    activeSession,
  } = useApp();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    if (activeChallenge) {
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
    },
    [activeChallenge, isAnswered, recordChallengeAnswer]
  );

  const handleRetry = useCallback(() => {
    setSelectedIdx(null);
    setIsAnswered(false);
  }, []);

  useEffect(() => {
    if (!activeChallenge) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeChallengeModal();
        return;
      }

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleSave(activeChallenge.id);
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowHint((prev) => !prev);
        return;
      }

      if ((e.key === 'r' || e.key === 'R') && isAnswered) {
        e.preventDefault();
        handleRetry();
        return;
      }

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
    toggleSave,
  ]);

  if (!activeChallenge) return null;

  const isSavedState = isSaved(activeChallenge.id);
  const isCorrect = selectedIdx === activeChallenge.correctOptionIndex;
  const tone = getChallengeTone(activeChallenge.category);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-modal-title"
      onClick={closeChallengeModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292D29]/40 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92dvh] bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#E2E0D8] bg-[#F6F5F0]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone.badge}`}>
              <Trophy className="h-3 w-3" />
              {activeChallenge.category}
            </span>
            <span className="text-xs text-[#777B72]">
              {activeChallenge.topic} · {activeChallenge.difficulty} · ~{activeChallenge.timeEstimateMinutes}m
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#5B6057] bg-[#ECEBE4] px-2 py-0.5 rounded-full tabular-nums">
              <Clock className="h-3 w-3 text-[#71816B]" />
              <span>
                {String(Math.floor(sessionSeconds / 60)).padStart(2, '0')}:
                {String(sessionSeconds % 60).padStart(2, '0')} / {activeSession.targetDurationMinutes}m
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleSave(activeChallenge.id)}
              aria-label={isSavedState ? 'Remove from saved' : 'Save challenge'}
              title={isSavedState ? 'Saved to bookmarks (S)' : 'Save for later (S)'}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isSavedState
                  ? 'bg-[#71816B]/12 text-[#71816B]'
                  : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSavedState ? 'fill-[#71816B]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={closeChallengeModal}
              aria-label="Close challenge modal"
              title="Close (Esc)"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 space-y-5">
          <div className="space-y-2">
            <h2
              id="challenge-modal-title"
              className="font-editorial text-2xl font-medium text-[#292D29] leading-snug"
            >
              {activeChallenge.title}
            </h2>
            <p className="text-sm text-[#5B6057] leading-relaxed">
              {activeChallenge.prompt}
            </p>
          </div>

          {activeChallenge.instructions && (
            <div className="p-3.5 rounded-xl bg-[#ECEBE4]/75 border border-[#E2E0D8] text-xs text-[#5B6057] flex items-start gap-2.5">
              <Compass className="h-4 w-4 text-[#71816B] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-[#292D29] block">Instructions</span>
                <p className="leading-relaxed">{activeChallenge.instructions}</p>
              </div>
            </div>
          )}

          {activeChallenge.visualPattern && activeChallenge.visualPattern.length > 0 && (
            <div className="p-4 rounded-xl bg-[#ECEBE4] border border-[#E2E0D8]">
              <div className="text-[11px] uppercase font-medium tracking-wider text-[#5B6057] mb-2 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#71816B]" />
                <span>Observation Grid</span>
              </div>
              <div className="space-y-1.5 bg-[#FAF9F5] p-3.5 rounded-lg border border-[#E2E0D8] font-mono text-xs sm:text-sm text-[#292D29]">
                {activeChallenge.visualPattern.map((line, pIdx) => (
                  <div key={pIdx} className="leading-relaxed tracking-wide whitespace-pre-wrap font-medium">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChallenge.codeSnippet && (
            <div className="p-4 rounded-xl bg-[#ECEBE4] border border-[#E2E0D8] font-mono text-xs text-[#292D29] overflow-x-auto">
              <pre>{activeChallenge.codeSnippet}</pre>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8]">
            <p className="text-sm font-medium text-[#292D29] flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-[#71816B] shrink-0 mt-0.5" />
              <span>{activeChallenge.question}</span>
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5" role="group" aria-label="Answer options">
            {activeChallenge.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const numberKey = idx + 1;
              let optionStyle =
                'border-[#E2E0D8] bg-[#F6F5F0] hover:bg-[#ECEBE4]/70 hover:border-[#71816B] text-[#292D29]';

              if (isAnswered) {
                if (idx === activeChallenge.correctOptionIndex) {
                  optionStyle = 'border-[#71816B] bg-[#71816B]/14 text-[#292D29]';
                } else if (idx === selectedIdx) {
                  optionStyle = 'border-[#A67F68] bg-[#A67F68]/14 text-[#292D29]';
                } else {
                  optionStyle = 'border-[#E2E0D8] opacity-55 text-[#777B72]';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  aria-pressed={selectedIdx === idx}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-colors flex items-start gap-3 min-h-[48px] cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${
                      isAnswered && idx === activeChallenge.correctOptionIndex
                        ? 'bg-[#71816B] text-[#FAF9F5]'
                        : isAnswered && idx === selectedIdx
                        ? 'bg-[#A67F68] text-[#FAF9F5]'
                        : 'bg-[#ECEBE4] text-[#5B6057]'
                    }`}
                  >
                    {isAnswered && idx === activeChallenge.correctOptionIndex ? (
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    ) : isAnswered && idx === selectedIdx ? (
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    ) : (
                      letter
                    )}
                  </span>
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <span className="leading-snug whitespace-pre-line">{option}</span>
                    {!isAnswered && (
                      <span className="hidden sm:inline-block text-[10px] text-[#777B72] font-mono px-1.5 py-0.5 rounded bg-[#ECEBE4]">
                        {numberKey}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {!isAnswered && (
            <div className="pt-1">
              {showHint ? (
                <div className="p-3.5 rounded-xl bg-[#C5B99F]/20 border border-[#C5B99F] text-[#5B4D34] text-xs flex items-start gap-2.5">
                  <Lightbulb className="h-4 w-4 text-[#8C7A56] shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Hint</span>
                      <button
                        type="button"
                        onClick={() => setShowHint(false)}
                        className="text-[11px] underline cursor-pointer"
                      >
                        Hide hint
                      </button>
                    </div>
                    <p className="leading-relaxed">{activeChallenge.hint}</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-1.5 text-xs text-[#71816B] hover:text-[#292D29] transition-colors py-1 min-h-[36px] cursor-pointer"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Need a hint? (Press H)</span>
                </button>
              )}
            </div>
          )}

          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 animate-gentle-enter ${
                isCorrect
                  ? 'bg-[#71816B]/10 border-[#71816B]/40 text-[#292D29]'
                  : 'bg-[#ECEBE4]/80 border-[#C5B99F] text-[#292D29]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5 text-sm">
                  {isCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-[#71816B] stroke-[2.5]" />
                      <span>Clear deduction</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-[#8C7A56]" />
                      <span>Worth noting</span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleRetry}
                  title="Retry this challenge (Press R)"
                  className="flex items-center gap-1 text-xs text-[#5B6057] hover:text-[#292D29] px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E2E0D8] transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry (R)</span>
                </button>
              </div>

              <div className="leading-relaxed text-[#5B6057] whitespace-pre-line">
                {activeChallenge.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-[#E2E0D8] bg-[#F6F5F0]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#777B72]">
            <Keyboard className="h-3 w-3 hidden sm:inline" />
            <span className="font-mono">
              {!isAnswered ? '1-4 / A-D' : 'R to retry'} · S to save · Esc to close
            </span>
          </div>

          <button
            type="button"
            onClick={closeChallengeModal}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors min-h-[42px] cursor-pointer"
          >
            {isAnswered ? 'Continue' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
