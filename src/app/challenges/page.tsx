'use client';

import React, { useState, useMemo } from 'react';
import {
  getAllChallenges,
  filterChallenges,
  calculateChallengeMetrics,
} from '@/lib/challengeService';
import { ChallengeType, ChallengeDifficulty, ChallengeItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { getChallengeTone } from '@/lib/natureTheme';
import {
  Trophy,
  CheckCircle,
  Clock,
  ArrowRight,
  Bookmark,
  Search,
  X,
  Target,
  Sparkles,
  RotateCcw,
  Compass,
  Eye,
  Terminal,
  Brain,
  HelpCircle,
} from 'lucide-react';

export default function ChallengesPage() {
  const { profile, openChallengeModal, toggleSave, isSaved } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ChallengeType | 'All' | 'Saved'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allChallenges = useMemo(() => getAllChallenges(), []);

  const metrics = useMemo(() => {
    return calculateChallengeMetrics(
      profile.completedChallengeIds,
      profile.completedChallengeScores,
      allChallenges.length
    );
  }, [profile.completedChallengeIds, profile.completedChallengeScores, allChallenges.length]);

  const categoryTabs: { label: string; value: ChallengeType | 'All' | 'Saved'; icon: React.ReactNode }[] = [
    { label: 'All Challenges', value: 'All', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { label: 'Logic & Deduction', value: 'logic', icon: <Target className="h-3.5 w-3.5" /> },
    { label: 'Curiosity Quizzes', value: 'quiz', icon: <HelpCircle className="h-3.5 w-3.5" /> },
    { label: 'Riddles', value: 'riddle', icon: <Brain className="h-3.5 w-3.5" /> },
    { label: 'General Knowledge', value: 'general', icon: <Compass className="h-3.5 w-3.5" /> },
    { label: 'Code Detective', value: 'code', icon: <Terminal className="h-3.5 w-3.5" /> },
    { label: 'Memory & Observation', value: 'memory', icon: <Eye className="h-3.5 w-3.5" /> },
    {
      label: `Saved (${profile.savedItemIds.filter((id) => allChallenges.some((c) => c.id === id)).length})`,
      value: 'Saved',
      icon: <Bookmark className="h-3.5 w-3.5" />,
    },
  ];

  const difficulties: (ChallengeDifficulty | 'All')[] = ['All', 'Quick', 'Medium', 'Deep'];

  const filteredChallenges = useMemo(() => {
    const isSavedTab = selectedCategory === 'Saved';
    return filterChallenges({
      category: isSavedTab ? 'All' : selectedCategory,
      difficulty: selectedDifficulty,
      searchQuery,
      savedOnly: isSavedTab,
      savedIds: profile.savedItemIds,
    });
  }, [selectedCategory, selectedDifficulty, searchQuery, profile.savedItemIds]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E2E0D8]">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#71816B]">
          <Trophy className="h-3.5 w-3.5" />
          <span>Cognitive Library</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#292D29]">
          Challenges &amp; Mental Workouts
        </h1>
        <p className="text-sm text-[#5B6057] max-w-2xl leading-relaxed">
          Active reasoning instead of passive scrolling. Deductive logic, code puzzles, and memory exercises with calm explanations and zero streak pressure.
        </p>
      </div>

      {/* Quiet Progress Strip */}
      <div className="p-5 rounded-2xl bg-[#ECEBE4]/75 border border-[#E2E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-medium text-[#777B72] block">
            Exploration Pace
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-editorial text-xl sm:text-2xl font-medium text-[#292D29]">
              {metrics.completedCount} of {metrics.totalCount} explored
            </span>
            <span className="text-xs font-mono text-[#71816B] tabular-nums">
              {metrics.completionPercentage}%
            </span>
          </div>
          <p className="text-xs text-[#5B6057]">
            Accuracy: <strong className="font-medium text-[#292D29]">{metrics.accuracyPercentage}%</strong>
            {' · '}
            Mindful time: <strong className="font-medium text-[#292D29]">{profile.totalMindfulMinutes}m</strong>
            {' · '}
            <span className="text-[#777B72]">No penalties for retries</span>
          </p>
        </div>

        <div className="w-full sm:w-56 space-y-1.5">
          <div className="flex justify-between text-[11px] text-[#777B72]">
            <span>Progress</span>
            <span className="font-mono tabular-nums">{metrics.completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#E2E0D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#71816B] rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search & Difficulty */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777B72]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by logic, question, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] text-base sm:text-sm text-[#292D29] placeholder-[#777B72] focus:outline-none focus:border-[#71816B] transition-colors min-h-[44px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-[#777B72] hover:text-[#292D29] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#ECEBE4]/80 p-1 rounded-xl border border-[#E2E0D8] self-start sm:self-auto">
          <span className="text-[11px] text-[#777B72] px-2.5 font-medium">Pace:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-[#FAF9F5] text-[#292D29] shadow-xs border border-[#E2E0D8]'
                  : 'text-[#777B72] hover:text-[#292D29]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
        {categoryTabs.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-colors min-h-[42px] cursor-pointer ${
                isSelected
                  ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                  : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-14 px-4 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-3">
          <HelpCircle className="h-7 w-7 text-[#777B72] mx-auto" />
          <h3 className="font-editorial text-xl font-medium text-[#292D29]">
            No challenges match your filters
          </h3>
          <p className="text-xs text-[#777B72] max-w-sm mx-auto">
            {selectedCategory === 'Saved'
              ? 'You have not saved any challenges yet. Bookmark any puzzle to keep it here.'
              : 'Try clearing your search or switching categories.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge: ChallengeItem) => {
            const isCompleted = profile.completedChallengeIds.includes(challenge.id);
            const scoreData = profile.completedChallengeScores[challenge.id];
            const isCorrect = scoreData?.correct ?? false;
            const isItemSaved = isSaved(challenge.id);
            const tone = getChallengeTone(challenge.category);

            return (
              <div
                key={challenge.id}
                className={`group flex flex-col justify-between p-5 rounded-2xl border transition-colors ${
                  isCompleted
                    ? 'bg-[#ECEBE4]/55 border-[#CFCBC0]'
                    : 'bg-[#FAF9F5] border-[#E2E0D8] hover:border-[#CFCBC0]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium border ${tone.badge}`}>
                        {challenge.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] text-[#777B72] bg-[#ECEBE4]">
                        {challenge.difficulty}
                      </span>
                      <span className="text-[11px] text-[#777B72]">
                        {challenge.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isCompleted && (
                        <span
                          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            isCorrect
                              ? 'text-[#4D5A48] bg-[#71816B]/12 border-[#71816B]/25'
                              : 'text-[#63563D] bg-[#C5B99F]/30 border-[#C5B99F]'
                          }`}
                        >
                          <CheckCircle className="h-3 w-3" />
                          {isCorrect ? 'Solved' : 'Review'}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(challenge.id);
                        }}
                        aria-label={isItemSaved ? 'Remove bookmark' : 'Bookmark challenge'}
                        title={isItemSaved ? 'Saved to bookmarks' : 'Save for later'}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isItemSaved
                            ? 'bg-[#71816B]/12 text-[#71816B]'
                            : 'text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4]'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isItemSaved ? 'fill-[#71816B]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-editorial text-lg font-medium text-[#292D29] group-hover:text-[#5E6D59] transition-colors leading-snug">
                      {challenge.title}
                    </h2>
                    <p className="text-xs text-[#5B6057] mt-1.5 line-clamp-2 leading-relaxed">
                      {challenge.instructions || challenge.prompt}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E0D8] flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-[#777B72] font-mono tabular-nums">
                    <Clock className="h-3.5 w-3.5" />
                    ~{challenge.timeEstimateMinutes} min
                  </span>

                  <button
                    type="button"
                    onClick={() => openChallengeModal(challenge)}
                    className={`min-h-[40px] flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-[#ECEBE4] text-[#292D29] hover:bg-[#E2E0D8]'
                        : 'bg-[#292D29] text-[#FAF9F5] hover:bg-[#3F453F]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Review / Retry</span>
                      </>
                    ) : (
                      <>
                        <span>Start Puzzle</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
