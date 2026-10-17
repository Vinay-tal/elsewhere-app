'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AvailableDuration,
  FindSomethingMood,
  FindSomethingActivity,
  FindSomethingStep,
  RecommendationResult,
} from '@/types/findSomething';
import {
  recommendActivity,
  MOOD_DEFINITIONS,
  DURATION_OPTIONS,
} from '@/lib/findSomethingRecommendation';
import {
  X,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  CheckCircle2,
  Play,
  Pause,
  Check,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playGentleChime, playSoftTap } from '@/lib/audio';

export default function FindSomethingModal() {
  const {
    isFindSomethingModalOpen,
    closeFindSomethingModal,
    findSomethingInitialDuration,
    findSomethingInitialMood,
    profile,
    logFindSomethingCompletion,
  } = useApp();

  // Wizard state
  const [step, setStep] = useState<FindSomethingStep>('time_selection');
  const [selectedDuration, setSelectedDuration] = useState<AvailableDuration>(5);
  const [selectedMood, setSelectedMood] = useState<FindSomethingMood>('curious');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Recommendation result
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [alternativeIndex, setAlternativeIndex] = useState(0);

  // Active Experience State
  const [activeSecondsElapsed, setActiveSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [checkedTakeaways, setCheckedTakeaways] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  
  // Challenge State
  const [selectedChallengeOption, setSelectedChallengeOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Completion / Reflection State
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Grounded');
  const [reflectionNote, setReflectionNote] = useState<string>('');

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isFindSomethingModalOpen) {
      if (findSomethingInitialDuration && [2, 5, 10, 20].includes(findSomethingInitialDuration)) {
        setSelectedDuration(findSomethingInitialDuration as AvailableDuration);
      } else {
        setSelectedDuration(5);
      }

      if (findSomethingInitialMood && Object.keys(MOOD_DEFINITIONS).includes(findSomethingInitialMood)) {
        setSelectedMood(findSomethingInitialMood as FindSomethingMood);
        setStep('recommendation_ready');
      } else {
        setStep('time_selection');
      }

      // Reset activity runner states
      setActiveSecondsElapsed(0);
      setIsTimerRunning(true);
      setCheckedTakeaways({});
      setCheckedSteps({});
      setSelectedChallengeOption(null);
      setShowHint(false);
      setSelectedFeeling('Grounded');
      setReflectionNote('');
      setAlternativeIndex(0);
    }
  }, [isFindSomethingModalOpen, findSomethingInitialDuration, findSomethingInitialMood]);

  // Compute recommendation whenever duration, mood, or candidate pool changes
  const computedRec = useMemo(() => {
    if (!isFindSomethingModalOpen) return null;
    return recommendActivity({
      duration: selectedDuration,
      mood: selectedMood,
      selectedInterests: profile.selectedInterests,
      likedItemIds: profile.likedItemIds,
      savedItemIds: profile.savedItemIds,
      dismissedItemIds: profile.dismissedItemIds,
      completedActivityIds: profile.completedActivities.map((a) => a.activityId),
      recentlyViewedIds,
    });
  }, [
    isFindSomethingModalOpen,
    selectedDuration,
    selectedMood,
    profile.selectedInterests,
    profile.likedItemIds,
    profile.savedItemIds,
    profile.dismissedItemIds,
    profile.completedActivities,
    recentlyViewedIds,
  ]);

  useEffect(() => {
    if (computedRec) {
      setRecommendation(computedRec);
    }
  }, [computedRec]);

  // Determine current active activity (supports candidate shuffling)
  const currentActivity: FindSomethingActivity | null = useMemo(() => {
    if (!recommendation) return null;
    const candidates = recommendation.allEligibleCandidates;
    if (candidates && candidates.length > 0) {
      return candidates[alternativeIndex % candidates.length];
    }
    return recommendation.activity;
  }, [recommendation, alternativeIndex]);

  // Active activity timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 'active_experience' && isTimerRunning) {
      interval = setInterval(() => {
        setActiveSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, isTimerRunning]);

  // Actions
  const handleSelectDuration = (duration: AvailableDuration) => {
    setSelectedDuration(duration);
    playSoftTap(profile.soundEnabled);
    setStep('mood_selection');
  };

  const handleSelectMood = (mood: FindSomethingMood) => {
    setSelectedMood(mood);
    playSoftTap(profile.soundEnabled);
    setStep('recommendation_ready');
  };

  const handleShuffleAlternative = () => {
    playSoftTap(profile.soundEnabled);
    setAlternativeIndex((prev) => prev + 1);
  };

  const handleStartActivity = () => {
    if (!currentActivity) return;
    playSoftTap(profile.soundEnabled);
    setRecentlyViewedIds((prev) => [...prev, currentActivity.id]);
    setActiveSecondsElapsed(0);
    setIsTimerRunning(true);
    setCheckedTakeaways({});
    setCheckedSteps({});
    setSelectedChallengeOption(null);
    setShowHint(false);
    setStep('active_experience');
  };

  const handleSelectChallengeAnswer = (optionIdx: number) => {
    if (selectedChallengeOption !== null || !currentActivity) return;
    setSelectedChallengeOption(optionIdx);
    const correctIdx = currentActivity.interactivePayload.correctOptionIndex ?? 0;
    const isCorrect = optionIdx === correctIdx;

    if (isCorrect) {
      playGentleChime(profile.soundEnabled);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      playSoftTap(profile.soundEnabled);
    }
  };

  const handleFinishActivity = () => {
    playGentleChime(profile.soundEnabled);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
    } catch {}
    setStep('completion');
  };

  const handleCompleteAndStop = () => {
    if (!currentActivity) {
      closeFindSomethingModal();
      return;
    }
    const duration = currentActivity.durationMinutes;
    const fullNote = `${selectedFeeling}: ${reflectionNote}`.trim();
    logFindSomethingCompletion(currentActivity.id, currentActivity.title, duration, fullNote);
    playGentleChime(profile.soundEnabled);
    closeFindSomethingModal();
  };

  const handleExploreAnother = () => {
    if (currentActivity) {
      logFindSomethingCompletion(
        currentActivity.id,
        currentActivity.title,
        currentActivity.durationMinutes,
        `${selectedFeeling}: ${reflectionNote}`.trim()
      );
    }
    setStep('time_selection');
    setAlternativeIndex((prev) => prev + 1);
  };

  if (!isFindSomethingModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeFindSomethingModal}
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92vh] bg-[#0E121B] border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#090C12] shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D2F827]/10 text-[#D2F827] border border-[#D2F827]/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Find Something for Me
              </h2>
              <p className="text-[10px] text-neutral-400 font-light">
                {step === 'time_selection' && 'Step 1 of 2: Available Time'}
                {step === 'mood_selection' && 'Step 2 of 2: Current Headspace'}
                {step === 'recommendation_ready' && 'Your Immediate Discovery'}
                {step === 'active_experience' && 'In-Progress Micro-Session'}
                {step === 'completion' && 'Session Complete'}
              </p>
            </div>
          </div>

          <button
            onClick={closeFindSomethingModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* ======================================================== */}
          {/* STEP 1: TIME SELECTION */}
          {/* ======================================================== */}
          {step === 'time_selection' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  How much time do you have right now?
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Instead of getting sucked into an endless scroll, choose a boundary that fits your moment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedDuration === opt.duration;
                  return (
                    <button
                      key={opt.duration}
                      onClick={() => handleSelectDuration(opt.duration)}
                      className={`group p-4 rounded-xl text-left border transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#182133] border-[#D2F827] shadow-[0_0_15px_rgba(210,248,39,0.15)]'
                          : 'bg-[#121622] border-white/10 hover:border-white/25 hover:bg-[#151B2A]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                          <Clock className={`h-3.5 w-3.5 ${isSelected ? 'text-[#D2F827]' : 'text-neutral-400'}`} />
                          {opt.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 font-medium">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light">
                        {opt.duration === 2 && 'Lightning puzzle or breath reset'}
                        {opt.duration === 5 && 'Concise curiosity or mind puzzle'}
                        {opt.duration === 10 && 'Intentional dive or micro-walk'}
                        {opt.duration === 20 && 'Deep focus immersion or audit'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: MOOD SELECTION */}
          {/* ======================================================== */}
          {step === 'mood_selection' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('time_selection')}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Time</span>
                </button>
                <span className="text-[11px] font-mono text-[#D2F827] bg-[#D2F827]/10 px-2 py-0.5 rounded-md border border-[#D2F827]/20">
                  {selectedDuration} min available
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  What is your headspace right now?
                </h3>
                <p className="text-xs text-neutral-400 font-light">
                  Pick what feels most rewarding to you in this moment.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(Object.keys(MOOD_DEFINITIONS) as FindSomethingMood[]).map((moodKey) => {
                  const mood = MOOD_DEFINITIONS[moodKey];
                  const isSelected = selectedMood === moodKey;
                  return (
                    <button
                      key={moodKey}
                      onClick={() => handleSelectMood(moodKey)}
                      className={`w-full group p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#182133] border-white/30'
                          : 'bg-[#121622] border-white/5 hover:border-white/20 hover:bg-[#151B2A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{mood.icon}</span>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#D2F827] transition-colors">
                              {mood.label}
                            </h4>
                            <span
                              className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                              style={{
                                color: mood.accentColor,
                                backgroundColor: `${mood.accentColor}18`,
                              }}
                            >
                              {mood.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 font-light line-clamp-1">
                            {mood.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3 & 4: RECOMMENDATION CARD & START BUTTON */}
          {/* ======================================================== */}
          {step === 'recommendation_ready' && currentActivity && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Back / Navigation Bar */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <button
                  onClick={() => setStep('mood_selection')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Mood / Time</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#D2F827] bg-[#D2F827]/10 px-2 py-0.5 rounded border border-[#D2F827]/20">
                    {selectedDuration} min
                  </span>
                  <span className="text-[11px] text-neutral-400 capitalize">
                    {MOOD_DEFINITIONS[selectedMood].label}
                  </span>
                </div>
              </div>

              {/* The Single Recommended Activity Card */}
              <div className="relative p-5 sm:p-6 rounded-2xl bg-[#141A27] border border-white/15 shadow-xl space-y-4">
                {/* Header Tag & Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
                      {currentActivity.topic}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      {currentActivity.category}
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-white font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    <Clock className="h-3.5 w-3.5 text-[#D2F827]" />
                    <span>{currentActivity.durationMinutes} min</span>
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {currentActivity.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {currentActivity.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {currentActivity.description}
                </p>

                {/* Transparent Reason Callout Box */}
                <div className="p-3.5 rounded-xl bg-[#0F1420] border border-[#D2F827]/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D2F827]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Why this was selected for you</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
                    {recommendation?.reason || 'Curated to provide an immediate high-value cognitive reset.'}
                  </p>
                </div>

                {/* Primary Start CTA & Shuffle Alternative */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    onClick={handleStartActivity}
                    className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 transition-all shadow-lg shadow-[#D2F827]/10"
                  >
                    <span>Start Activity ({currentActivity.durationMinutes} min)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {recommendation && recommendation.alternativesCount > 0 && (
                    <button
                      onClick={handleShuffleAlternative}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xs"
                      title="See another option for this time and mood"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      <span>Try Another</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: ACTUAL ACTIVITY EXPERIENCE */}
          {/* ======================================================== */}
          {step === 'active_experience' && currentActivity && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Active Header & Live Timer */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121622] border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#D2F827] animate-ping" />
                  <span className="text-xs font-bold text-white">Active Session</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D2F827]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {Math.floor(activeSecondsElapsed / 60)
                        .toString()
                        .padStart(2, '0')}
                      :{(activeSecondsElapsed % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-neutral-500 font-normal">
                      / {currentActivity.durationMinutes}m
                    </span>
                  </div>

                  <button
                    onClick={() => setIsTimerRunning((prev) => !prev)}
                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={isTimerRunning ? 'Pause' : 'Resume'}
                  >
                    {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Activity Title Banner */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                  <span className="uppercase text-[#D2F827] font-bold">{currentActivity.topic}</span>
                  <span>•</span>
                  <span>{currentActivity.durationMinutes} min activity</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {currentActivity.title}
                </h3>
              </div>

              {/* ---------------------------------------------------- */}
              {/* A. READING / CURIOSITY / ENTERTAINMENT / NEWS */}
              {/* ---------------------------------------------------- */}
              {['curiosity', 'entertainment', 'news'].includes(currentActivity.category) && (
                <div className="space-y-4 text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
                  {currentActivity.interactivePayload.paragraphs?.map((p, idx) => (
                    <p key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/5">
                      {p}
                    </p>
                  ))}

                  {/* Key Takeaways with Interactive Checkboxes */}
                  {currentActivity.interactivePayload.takeaways && (
                    <div className="p-4 rounded-xl bg-[#121824] border border-[#D2F827]/20 space-y-2.5">
                      <h4 className="text-xs font-bold text-[#D2F827] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Key Takeaways (Tap to absorb)
                      </h4>
                      <div className="space-y-2">
                        {currentActivity.interactivePayload.takeaways.map((t, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setCheckedTakeaways((prev) => ({ ...prev, [idx]: !prev[idx] }));
                              playSoftTap(profile.soundEnabled);
                            }}
                            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                              checkedTakeaways[idx]
                                ? 'bg-[#D2F827]/10 text-white'
                                : 'text-neutral-300 hover:bg-white/5'
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                checkedTakeaways[idx]
                                  ? 'bg-[#D2F827] border-[#D2F827] text-black'
                                  : 'border-white/20'
                              }`}
                            >
                              {checkedTakeaways[idx] && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reflection Prompt */}
                  {currentActivity.interactivePayload.reflectionPrompt && (
                    <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200">
                      <span className="font-bold text-purple-300">Take a moment to reflect: </span>
                      {currentActivity.interactivePayload.reflectionPrompt}
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* B. CHALLENGE / MENTAL PUZZLE */}
              {/* ---------------------------------------------------- */}
              {currentActivity.category === 'challenge' && (
                <div className="space-y-4">
                  {/* Prompt */}
                  <div className="p-4 rounded-xl bg-[#141A26] border border-white/10 text-xs sm:text-sm text-neutral-200 font-light leading-relaxed whitespace-pre-line">
                    {currentActivity.interactivePayload.prompt}
                  </div>

                  {/* Question */}
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {currentActivity.interactivePayload.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2">
                    {currentActivity.interactivePayload.options?.map((option, idx) => {
                      const isSelected = selectedChallengeOption === idx;
                      const correctIdx = currentActivity.interactivePayload.correctOptionIndex ?? 0;
                      const isAnswered = selectedChallengeOption !== null;
                      const isThisCorrect = idx === correctIdx;

                      let btnStyle = 'bg-[#121622] border-white/10 text-neutral-300 hover:border-white/30';
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm';
                        } else if (isSelected && !isThisCorrect) {
                          btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        } else {
                          btnStyle = 'opacity-40 bg-[#10141E] border-white/5 text-neutral-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleSelectChallengeAnswer(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-mono">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hint Toggle */}
                  {currentActivity.interactivePayload.hint && selectedChallengeOption === null && (
                    <div className="pt-1">
                      <button
                        onClick={() => setShowHint((prev) => !prev)}
                        className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
                      </button>
                      {showHint && (
                        <p className="mt-2 p-3 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                          {currentActivity.interactivePayload.hint}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Explanation after answering */}
                  {selectedChallengeOption !== null && (
                    <div className="p-4 rounded-xl bg-[#111726] border border-white/15 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Sparkles className="h-3.5 w-3.5 text-[#D2F827]" />
                        <span>Why this works</span>
                      </div>
                      <p className="text-xs text-neutral-300 font-light leading-relaxed whitespace-pre-line">
                        {currentActivity.interactivePayload.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* C. OFFLINE / PHYSICAL ACTIVITY */}
              {/* ---------------------------------------------------- */}
              {currentActivity.category === 'offline' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-300">Real-World Reset: </span>
                    <span>{currentActivity.interactivePayload.benefit}</span>
                  </div>

                  {/* Step-by-Step Interactive Checklist */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Guided Steps (Follow along in your room)
                    </h4>
                    {currentActivity.interactivePayload.steps?.map((stepText, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
                          playSoftTap(profile.soundEnabled);
                        }}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          checkedSteps[idx]
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                            : 'bg-[#121622] border-white/10 text-neutral-300 hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            checkedSteps[idx]
                              ? 'bg-emerald-400 border-emerald-400 text-black'
                              : 'border-white/25'
                          }`}
                        >
                          {checkedSteps[idx] && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-light leading-relaxed">{stepText}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reflection Question */}
                  {currentActivity.interactivePayload.reflectionPrompt && (
                    <div className="p-3.5 rounded-xl bg-[#121622] border border-white/10 text-xs text-neutral-300">
                      <span className="font-bold text-white">After completing: </span>
                      {currentActivity.interactivePayload.reflectionPrompt}
                    </div>
                  )}
                </div>
              )}

              {/* Complete Activity Action Bar */}
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={handleFinishActivity}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 transition-all shadow-lg"
                >
                  <span>Wrap Up & Mark Complete</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 6: COMPLETION & REFLECTION SCREEN */}
          {/* ======================================================== */}
          {step === 'completion' && currentActivity && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Celebratory Banner */}
              <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-[#182133] to-[#101420] border border-[#D2F827]/30 space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D2F827]/20 text-[#D2F827] border border-[#D2F827]/40 mb-1">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Intentional Choice Complete!
                </h3>
                <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto leading-relaxed">
                  You replaced what could have been a mindless scroll with {currentActivity.durationMinutes} minutes of genuine curiosity.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D2F827] bg-[#D2F827]/10 px-3 py-1 rounded-full border border-[#D2F827]/20">
                    +{currentActivity.durationMinutes} Mindful Minutes Added
                  </span>
                </div>
              </div>

              {/* Brief Reflection (Mood / Feeling) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  How do you feel after this break?
                </h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {['Grounded', 'Enlightened', 'Focused', 'Energized', 'Calm'].map((feel) => (
                    <button
                      key={feel}
                      onClick={() => {
                        setSelectedFeeling(feel);
                        playSoftTap(profile.soundEnabled);
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-medium border text-center transition-all ${
                        selectedFeeling === feel
                          ? 'bg-[#D2F827] text-black border-[#D2F827] font-bold shadow-sm'
                          : 'bg-[#121622] text-neutral-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {feel}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    placeholder="Optional: One thought to remember from this..."
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#121622] border border-white/10 text-base sm:text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D2F827] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Action Buttons: Stop vs Explore Another */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCompleteAndStop}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 transition-all shadow-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Stop & Step Away (Recommended)</span>
                </button>

                <button
                  onClick={handleExploreAnother}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xs"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Explore One Different Activity</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
