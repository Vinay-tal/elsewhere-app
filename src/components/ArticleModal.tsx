'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Heart, Bookmark, Clock, Share2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGentleChime, playSoftTap } from '@/lib/audio';

export default function ArticleModal() {
  const {
    activeArticle,
    closeArticleModal,
    profile,
    toggleLike,
    toggleSave,
    showToast,
    sessionSeconds,
    activeSession,
    logFindSomethingCompletion
  } = useApp();
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizHint, setShowQuizHint] = useState(false);

  useEffect(() => {
    // Reset quiz state when active article changes
    setSelectedQuizOption(null);
    setShowQuizHint(false);
  }, [activeArticle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeArticleModal();
    };
    if (activeArticle) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeArticle, closeArticleModal]);

  const handleQuizOption = (idx: number) => {
    if (selectedQuizOption !== null || !activeArticle?.quiz) return;
    setSelectedQuizOption(idx);
    const isCorrect = idx === activeArticle.quiz.correctOptionIndex;
    if (isCorrect) {
      playGentleChime(profile.soundEnabled);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      playSoftTap(profile.soundEnabled);
    }
  };

  if (!activeArticle) return null;

  const isLiked = profile.likedItemIds.includes(activeArticle.id);
  const isSaved = profile.savedItemIds.includes(activeArticle.id);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `?read=${activeArticle.id}`);
      showToast('Link copied to clipboard');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
      onClick={closeArticleModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[92dvh] bg-[#10141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/[0.08] bg-[#0D1017]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D2F827]/10 text-[#D2F827] border border-[#D2F827]/20">
              {activeArticle.topic}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock className="h-3 w-3" />
              {activeArticle.readTimeMinutes} min read
            </span>
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-neutral-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/5"
              title="Active session timer"
            >
              <Clock className="h-3 w-3 text-[#D2F827]" />
              <span>
                Session: {String(Math.floor(sessionSeconds / 60)).padStart(2, '0')}:
                {String(sessionSeconds % 60).padStart(2, '0')} / {activeSession.targetDurationMinutes}m
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLike(activeArticle.id)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
                isLiked ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Like"
              aria-label="Like article"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              onClick={() => toggleSave(activeArticle.id)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
                isSaved ? 'text-[#D2F827] bg-[#D2F827]/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Save Bookmark"
              aria-label="Save bookmark"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#D2F827]' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Copy link"
              aria-label="Share article"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={closeArticleModal}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 space-y-6 text-neutral-300">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
              {activeArticle.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
              {activeArticle.subtitle}
            </p>
          </div>

          {/* Editorial divider */}
          <div className="h-px w-16 bg-[#D2F827]" />

          {/* Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-neutral-200">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx} className="font-light">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#161B26] border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D2F827] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Core Takeaways
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
              {activeArticle.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D2F827] mt-0.5">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial Analysis (Clearly Distinguished) */}
          {activeArticle.editorialAnalysis && (
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200">
              <span className="font-bold text-purple-300 block mb-1">
                Editorial Context & Analysis
              </span>
              <p className="font-light leading-relaxed">{activeArticle.editorialAnalysis}</p>
            </div>
          )}

          {/* Optional Comprehension Quiz */}
          {activeArticle.quiz && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141A27] border border-amber-400/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  Quick Comprehension Check
                </span>
                {activeArticle.quiz.hint && selectedQuizOption === null && (
                  <button
                    onClick={() => setShowQuizHint((prev) => !prev)}
                    className="text-xs text-amber-400/80 hover:text-amber-300 transition-colors"
                  >
                    {showQuizHint ? 'Hide Hint' : 'Need a hint?'}
                  </button>
                )}
              </div>

              {showQuizHint && activeArticle.quiz.hint && (
                <p className="p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                  {activeArticle.quiz.hint}
                </p>
              )}

              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {activeArticle.quiz.question}
              </h4>

              <div className="space-y-2 pt-1">
                {activeArticle.quiz.options.map((option: string, idx: number) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === activeArticle.quiz!.correctOptionIndex;
                  const isAnswered = selectedQuizOption !== null;

                  let optClass = 'bg-[#121622] border-white/10 text-neutral-300 hover:border-white/20';
                  if (isAnswered) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      optClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    } else {
                      optClass = 'opacity-40 bg-[#10141E] border-white/5 text-neutral-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleQuizOption(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption !== null && (
                <div className="p-3 rounded-xl bg-[#0F1420] border border-white/10 text-xs text-neutral-300 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">Explanation:</span>
                  {activeArticle.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {/* Source Citation */}
          {activeArticle.sourceName && (
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-500">
              <span>Source: {activeArticle.sourceName}</span>
              <span className="flex items-center gap-1 text-neutral-400">
                Published {activeArticle.publishedDate}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.08] bg-[#0D1017]">
          <span className="text-xs text-neutral-400">
            Finished reading? Give your eyes a rest.
          </span>
          <button
            type="button"
            onClick={() => {
              logFindSomethingCompletion(
                activeArticle.id,
                activeArticle.title,
                activeArticle.readTimeMinutes,
                'Read and digested'
              );
              closeArticleModal();
            }}
            className="min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 transition-all cursor-pointer touch-manipulation"
          >
            Mark Read & Done
          </button>
        </div>
      </div>
    </div>
  );
}
