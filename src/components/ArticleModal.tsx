'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Heart, Bookmark, Clock, Share2, CheckCircle2 } from 'lucide-react';
import { playGentleChime, playSoftTap } from '@/lib/audio';
import { getTopicTone } from '@/lib/natureTheme';

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
    logFindSomethingCompletion,
  } = useApp();
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizHint, setShowQuizHint] = useState(false);

  useEffect(() => {
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
    } else {
      playSoftTap(profile.soundEnabled);
    }
  };

  if (!activeArticle) return null;

  const isLiked = profile.likedItemIds.includes(activeArticle.id);
  const isSaved = profile.savedItemIds.includes(activeArticle.id);
  const tone = getTopicTone(activeArticle.topic);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292D29]/40 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[92dvh] bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Reading Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#E2E0D8] bg-[#F6F5F0]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${tone.badge}`}>
              {activeArticle.topic}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#777B72] font-mono tabular-nums">
              <Clock className="h-3 w-3" />
              {activeArticle.readTimeMinutes} min read
            </span>
            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5B6057] bg-[#ECEBE4] px-2.5 py-0.5 rounded-full tabular-nums"
              title="Active session timer"
            >
              <span>
                {String(Math.floor(sessionSeconds / 60)).padStart(2, '0')}:
                {String(sessionSeconds % 60).padStart(2, '0')} / {activeSession.targetDurationMinutes}m
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleLike(activeArticle.id)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isLiked
                  ? 'text-[#A67F68] bg-[#A67F68]/12'
                  : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
              }`}
              title="Like"
              aria-label="Like article"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-[#A67F68]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => toggleSave(activeArticle.id)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isSaved
                  ? 'text-[#71816B] bg-[#71816B]/12'
                  : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
              }`}
              title="Save Bookmark"
              aria-label="Save bookmark"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#71816B]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
              title="Copy link"
              aria-label="Share article"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeArticleModal}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Distraction-Free Reading Body */}
        <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-10 sm:py-8 space-y-6">
          <header className="space-y-2.5">
            <h1
              id="article-modal-title"
              className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#292D29] leading-snug"
            >
              {activeArticle.title}
            </h1>
            <p className="text-sm sm:text-base text-[#5B6057] leading-relaxed">
              {activeArticle.subtitle}
            </p>
          </header>

          <div className="h-px w-14 bg-[#71816B]" />

          <div className="space-y-4 text-[15px] sm:text-base leading-[1.78] text-[#292D29]/90">
            {activeArticle.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Core Takeaways */}
          <div className="p-5 rounded-xl bg-[#ECEBE4]/75 border border-[#E2E0D8] space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#4D5A48] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#71816B]" />
              <span>Core Takeaways</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#292D29]/90 leading-relaxed">
              {activeArticle.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#71816B] shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {activeArticle.editorialAnalysis && (
            <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] border-l-2 border-l-[#C5B99F] text-xs sm:text-sm text-[#5B6057]">
              <span className="font-semibold text-[#292D29] block mb-1">
                Editorial Context
              </span>
              <p className="leading-relaxed">{activeArticle.editorialAnalysis}</p>
            </div>
          )}

          {/* Comprehension Check */}
          {activeArticle.quiz && (
            <div className="p-5 rounded-2xl bg-[#F6F5F0] border border-[#E2E0D8] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-medium tracking-wider text-[#5B4D34] bg-[#C5B99F]/30 px-2.5 py-0.5 rounded-full border border-[#C5B99F]">
                  Comprehension Check
                </span>
                {activeArticle.quiz.hint && selectedQuizOption === null && (
                  <button
                    type="button"
                    onClick={() => setShowQuizHint((prev) => !prev)}
                    className="text-xs text-[#71816B] hover:text-[#292D29] underline cursor-pointer"
                  >
                    {showQuizHint ? 'Hide Hint' : 'Need a hint?'}
                  </button>
                )}
              </div>

              {showQuizHint && activeArticle.quiz.hint && (
                <p className="p-3 rounded-lg bg-[#C5B99F]/20 border border-[#C5B99F] text-xs text-[#5B4D34]">
                  {activeArticle.quiz.hint}
                </p>
              )}

              <h3 className="text-sm font-medium text-[#292D29] leading-snug">
                {activeArticle.quiz.question}
              </h3>

              <div className="space-y-2 pt-1">
                {activeArticle.quiz.options.map((option: string, idx: number) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === activeArticle.quiz!.correctOptionIndex;
                  const isAnswered = selectedQuizOption !== null;

                  let optClass =
                    'bg-[#FAF9F5] border-[#E2E0D8] text-[#292D29] hover:border-[#71816B]';
                  if (isAnswered) {
                    if (isCorrect) {
                      optClass = 'bg-[#71816B]/14 border-[#71816B] text-[#292D29]';
                    } else if (isSelected) {
                      optClass = 'bg-[#A67F68]/14 border-[#A67F68] text-[#292D29]';
                    } else {
                      optClass = 'opacity-50 bg-[#F6F5F0] border-[#E2E0D8] text-[#777B72]';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleQuizOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optClass}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-[#71816B] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption !== null && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                  <span className="font-semibold text-[#292D29] block mb-1">Note:</span>
                  {activeArticle.quiz.explanation}
                </div>
              )}
            </div>
          )}

          {activeArticle.sourceName && (
            <div className="pt-3 border-t border-[#E2E0D8] flex items-center justify-between text-xs text-[#777B72]">
              <span>Source: {activeArticle.sourceName}</span>
              <span>Published {activeArticle.publishedDate}</span>
            </div>
          )}
        </div>

        {/* Quiet Completion Footer */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-[#E2E0D8] bg-[#F6F5F0]">
          <span className="text-xs text-[#777B72] hidden sm:inline">
            Finished reading? Rest your eyes for a moment.
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
            className="ml-auto min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer touch-manipulation"
          >
            Mark Read &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
}
