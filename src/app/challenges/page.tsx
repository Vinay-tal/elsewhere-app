'use client';

import React, { useState, useMemo } from 'react';
import {
  getAllChallenges,
  filterChallenges,
  calculateChallengeMetrics
} from '@/lib/challengeService';
import { ChallengeType, ChallengeDifficulty, ChallengeItem } from '@/types';
import { useApp } from '@/context/AppContext';
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
  HelpCircle
} from 'lucide-react';

export default function ChallengesPage() {
  const { profile, openChallengeModal, toggleSave, isSaved } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ChallengeType | 'All' | 'Saved'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allChallenges = useMemo(() => getAllChallenges(), []);

  // Compute mindful cognitive metrics
  const metrics = useMemo(() => {
    return calculateChallengeMetrics(
      profile.completedChallengeIds,
      profile.completedChallengeScores,
      allChallenges.length
    );
  }, [profile.completedChallengeIds, profile.completedChallengeScores, allChallenges.length]);

  // Categories list
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

  // Filtered challenges
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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-7">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <Trophy className="h-4 w-4" />
          <span>Interactive Cognitive Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Challenges & Mental Workouts
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl">
          Active reasoning instead of passive scrolling. Real deductive logic, beginner code, memory patterns, and immediate educational feedback without streaks or point inflation.
        </p>
      </div>

      {/* Progress & Cognition Dashboard */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141926] to-[#121620] border border-amber-400/20 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Mindful Activity Progress
          </span>
          <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
            <span>{metrics.completedCount} of {metrics.totalCount} Explored</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
              {metrics.completionPercentage}% Complete
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-light flex items-center gap-2">
            <span>Accuracy: <strong className="text-emerald-400 font-semibold">{metrics.accuracyPercentage}%</strong></span>
            <span>•</span>
            <span>Mindful Minutes: <strong className="text-white font-medium">{profile.totalMindfulMinutes}m</strong></span>
            <span>•</span>
            <span className="text-neutral-500">No penalties for retries</span>
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full sm:w-56 space-y-1.5 self-center">
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Cognitive Engagement</span>
            <span>{metrics.completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-[#D2F827] rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search Bar & Difficulty Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by logic, question, or keyword..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Difficulty Segmented Control */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <span className="text-[11px] text-neutral-400 px-2 font-medium">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDifficulty === diff
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
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
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all min-h-[42px] ${
                isSelected
                  ? 'bg-amber-400 text-black border-amber-400 font-semibold shadow-sm'
                  : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20 hover:text-white'
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
        <div className="text-center py-12 px-4 rounded-2xl bg-[#121620]/60 border border-white/10 space-y-3">
          <HelpCircle className="h-8 w-8 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No challenges match your filters</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light">
            {selectedCategory === 'Saved'
              ? 'You have not saved any challenges yet. Click the bookmark icon on any challenge to save it here for later.'
              : 'Try clearing your search query or switching to another category.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
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

            return (
              <div
                key={challenge.id}
                className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? isCorrect
                      ? 'bg-[#0E151E] border-emerald-500/30'
                      : 'bg-[#15121A] border-amber-500/30'
                    : 'bg-[#121620] border-white/10 hover:border-amber-400/30'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Category, Difficulty, & Bookmark */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-amber-300 border border-amber-400/20">
                        {challenge.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] text-neutral-400 bg-white/5">
                        {challenge.difficulty}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-light">
                        {challenge.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span
                          className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            isCorrect
                              ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                          }`}
                        >
                          <CheckCircle className="h-3 w-3" />
                          {isCorrect ? 'Solved' : 'Review'}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(challenge.id);
                        }}
                        aria-label={isItemSaved ? 'Remove bookmark' : 'Bookmark challenge'}
                        title={isItemSaved ? 'Saved to bookmarks' : 'Save for later'}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isItemSaved
                            ? 'bg-amber-400/15 border-amber-400/30 text-amber-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isItemSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Prompt Preview */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed font-light">
                      {challenge.instructions || challenge.prompt}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Duration & Action */}
                <div className="pt-4 mt-3 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <Clock className="h-3 w-3 text-neutral-500" />
                    ~{challenge.timeEstimateMinutes} min
                  </span>

                  <button
                    onClick={() => openChallengeModal(challenge)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                      isCompleted
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-amber-400 text-black hover:bg-amber-300 shadow-sm'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className="h-3 w-3" />
                        Review / Retry
                      </>
                    ) : (
                      <>
                        Play Challenge
                        <ArrowRight className="h-3 w-3" />
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
