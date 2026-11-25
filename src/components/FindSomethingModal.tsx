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
import { playGentleChime, playSoftTap } from '@/lib/audio';
import { BotanicalMotif } from '@/components/ActivityArtwork';

export default function FindSomethingModal() {
  const {
    isFindSomethingModalOpen,
    closeFindSomethingModal,
    findSomethingInitialDuration,
    findSomethingInitialMood,
    profile,
    logFindSomethingCompletion,
  } = useApp();

  const [step, setStep] = useState<FindSomethingStep>('time_selection');
  const [selectedDuration, setSelectedDuration] = useState<AvailableDuration>(5);
  const [selectedMood, setSelectedMood] = useState<FindSomethingMood>('curious');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [alternativeIndex, setAlternativeIndex] = useState(0);

  const [activeSecondsElapsed, setActiveSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [checkedTakeaways, setCheckedTakeaways] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const [selectedChallengeOption, setSelectedChallengeOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const [selectedFeeling, setSelectedFeeling] = useState<string>('Grounded');
  const [reflectionNote, setReflectionNote] = useState<string>('');

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFindSomethingModal();
    };
    if (isFindSomethingModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFindSomethingModalOpen, closeFindSomethingModal]);

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

  const currentActivity: FindSomethingActivity | null = useMemo(() => {
    if (!recommendation) return null;
    const candidates = recommendation.allEligibleCandidates;
    if (candidates && candidates.length > 0) {
      return candidates[alternativeIndex % candidates.length];
    }
    return recommendation.activity;
  }, [recommendation, alternativeIndex]);

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
    } else {
      playSoftTap(profile.soundEnabled);
    }
  };

  const handleFinishActivity = () => {
    playGentleChime(profile.soundEnabled);
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
      role="dialog"
      aria-modal="true"
      aria-label="Find something for me"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292D29]/45 backdrop-blur-xs animate-gentle-enter"
      onClick={closeFindSomethingModal}
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92dvh] bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E0D8] bg-[#F6F5F0] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECEBE4] text-[#71816B] border border-[#E2E0D8]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#292D29] tracking-tight">
                Find Something for Me
              </h2>
              <p className="text-[11px] text-[#777B72]">
                {step === 'time_selection' && 'Step 1 of 2 · Available time'}
                {step === 'mood_selection' && 'Step 2 of 2 · Current headspace'}
                {step === 'recommendation_ready' && 'Curated suggestion'}
                {step === 'active_experience' && 'Session in progress'}
                {step === 'completion' && 'Session complete'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeFindSomethingModal}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* STEP 1: TIME SELECTION */}
          {step === 'time_selection' && (
            <div className="space-y-4 animate-gentle-enter">
              <div className="space-y-1.5">
                <h3 className="font-editorial text-2xl font-medium text-[#292D29]">
                  How much time do you have right now?
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                  Choose a calm boundary that fits your moment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedDuration === opt.duration;
                  return (
                    <button
                      key={opt.duration}
                      type="button"
                      onClick={() => handleSelectDuration(opt.duration)}
                      className={`group p-4 rounded-xl text-left border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#ECEBE4] border-[#71816B]'
                          : 'bg-[#F6F5F0] border-[#E2E0D8] hover:border-[#71816B]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#292D29]">
                          <Clock className={`h-3.5 w-3.5 ${isSelected ? 'text-[#71816B]' : 'text-[#777B72]'}`} />
                          {opt.label}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#777B72] border border-[#E2E0D8]">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#5B6057]">
                        {opt.duration === 2 && 'Quick puzzle or breath reset'}
                        {opt.duration === 5 && 'Concise reading or puzzle'}
                        {opt.duration === 10 && 'Intentional dive or walk'}
                        {opt.duration === 20 && 'Unrushed focus session'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: MOOD SELECTION */}
          {step === 'mood_selection' && (
            <div className="space-y-4 animate-gentle-enter">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('time_selection')}
                  className="flex items-center gap-1 text-xs text-[#777B72] hover:text-[#292D29] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to time</span>
                </button>
                <span className="text-[11px] font-mono text-[#4D5A48] bg-[#71816B]/12 px-2.5 py-0.5 rounded-full border border-[#71816B]/25">
                  {selectedDuration} min available
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-medium text-[#292D29]">
                  What is your headspace right now?
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6057]">
                  Select whatever feels most restorative or engaging.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(Object.keys(MOOD_DEFINITIONS) as FindSomethingMood[]).map((moodKey) => {
                  const mood = MOOD_DEFINITIONS[moodKey];
                  const isSelected = selectedMood === moodKey;
                  return (
                    <button
                      key={moodKey}
                      type="button"
                      onClick={() => handleSelectMood(moodKey)}
                      className={`w-full group p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#ECEBE4] border-[#71816B]'
                          : 'bg-[#F6F5F0] border-[#E2E0D8] hover:border-[#71816B]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{mood.icon}</span>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-medium text-[#292D29] group-hover:text-[#5E6D59] transition-colors">
                              {mood.label}
                            </h4>
                            <span
                              className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                              style={{
                                color: mood.accentColor,
                                backgroundColor: `${mood.accentColor}1A`,
                              }}
                            >
                              {mood.tag}
                            </span>
                          </div>
                          <p className="text-xs text-[#777B72] line-clamp-1">
                            {mood.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#777B72] group-hover:text-[#292D29] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: RECOMMENDATION READY */}
          {step === 'recommendation_ready' && currentActivity && (
            <div className="space-y-4 animate-gentle-enter">
              <div className="flex items-center justify-between text-xs text-[#777B72]">
                <button
                  type="button"
                  onClick={() => setStep('mood_selection')}
                  className="flex items-center gap-1 hover:text-[#292D29] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change mood or time</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#4D5A48] bg-[#71816B]/12 px-2 py-0.5 rounded-full">
                    {selectedDuration} min
                  </span>
                  <span>{MOOD_DEFINITIONS[selectedMood].label}</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#F6F5F0] border border-[#E2E0D8] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECEBE4] text-[#292D29] border border-[#E2E0D8]">
                      {currentActivity.topic}
                    </span>
                    <span className="text-[11px] uppercase text-[#777B72]">
                      {currentActivity.category}
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-[#292D29] font-mono bg-[#FAF9F5] px-2.5 py-1 rounded-full border border-[#E2E0D8]">
                    <Clock className="h-3.5 w-3.5 text-[#71816B]" />
                    <span>{currentActivity.durationMinutes} min</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-editorial text-2xl font-medium text-[#292D29] leading-snug">
                    {currentActivity.title}
                  </h3>
                  <p className="text-sm text-[#5B6057] leading-relaxed">
                    {currentActivity.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#777B72] leading-relaxed">
                  {currentActivity.description}
                </p>

                <div className="p-4 rounded-xl bg-[#ECEBE4]/70 border border-[#E2E0D8] space-y-1">
                  <span className="text-[11px] font-semibold text-[#4D5A48] block">
                    Why this fits right now
                  </span>
                  <p className="text-xs text-[#5B6057] leading-relaxed">
                    {recommendation?.reason || 'Selected for a calm, worthwhile pause.'}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleStartActivity}
                    className="w-full flex-1 min-h-[46px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                  >
                    <span>Start Activity ({currentActivity.durationMinutes} min)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {recommendation && recommendation.alternativesCount > 0 && (
                    <button
                      type="button"
                      onClick={handleShuffleAlternative}
                      className="w-full sm:w-auto min-h-[46px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-[#E2E0D8] bg-[#FAF9F5] text-[#5B6057] hover:text-[#292D29] hover:border-[#71816B] transition-colors text-xs cursor-pointer"
                      title="See another option"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      <span>Try Another</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACTIVE EXPERIENCE */}
          {step === 'active_experience' && currentActivity && (
            <div className="space-y-5 animate-gentle-enter">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ECEBE4]/70 border border-[#E2E0D8]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#71816B]" />
                  <span className="text-xs font-medium text-[#292D29]">In Progress</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#292D29] tabular-nums">
                    <Clock className="h-3.5 w-3.5 text-[#71816B]" />
                    <span>
                      {Math.floor(activeSecondsElapsed / 60)
                        .toString()
                        .padStart(2, '0')}
                      :{(activeSecondsElapsed % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#777B72]">
                      / {currentActivity.durationMinutes}m
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTimerRunning((prev) => !prev)}
                    className="p-1.5 rounded-lg text-[#5B6057] hover:text-[#292D29] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    title={isTimerRunning ? 'Pause' : 'Resume'}
                    aria-label={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                  >
                    {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-[#777B72] font-mono">
                  <span className="uppercase text-[#71816B] font-medium">{currentActivity.topic}</span>
                  <span>·</span>
                  <span>{currentActivity.durationMinutes} min</span>
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#292D29]">
                  {currentActivity.title}
                </h3>
              </div>

              {['curiosity', 'entertainment', 'news'].includes(currentActivity.category) && (
                <div className="space-y-4 text-sm text-[#292D29]/90 leading-[1.75]">
                  {currentActivity.interactivePayload.paragraphs?.map((p, idx) => (
                    <p key={idx} className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8]">
                      {p}
                    </p>
                  ))}

                  {currentActivity.interactivePayload.takeaways && (
                    <div className="p-4 rounded-xl bg-[#ECEBE4]/65 border border-[#E2E0D8] space-y-2.5">
                      <h4 className="text-xs font-semibold text-[#4D5A48] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#71816B]" />
                        <span>Key Takeaways (Tap to note)</span>
                      </h4>
                      <div className="space-y-2">
                        {currentActivity.interactivePayload.takeaways.map((t, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCheckedTakeaways((prev) => ({ ...prev, [idx]: !prev[idx] }));
                              playSoftTap(profile.soundEnabled);
                            }}
                            className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                              checkedTakeaways[idx]
                                ? 'bg-[#71816B]/12 text-[#292D29]'
                                : 'text-[#5B6057] hover:bg-[#FAF9F5]'
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                checkedTakeaways[idx]
                                  ? 'bg-[#71816B] border-[#71816B] text-[#FAF9F5]'
                                  : 'border-[#CFCBC0]'
                              }`}
                            >
                              {checkedTakeaways[idx] && <Check className="h-3 w-3 stroke-[2.5]" />}
                            </span>
                            <span className="text-xs sm:text-sm leading-relaxed">{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentActivity.interactivePayload.reflectionPrompt && (
                    <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] border-l-2 border-l-[#C5B99F] text-xs sm:text-sm text-[#5B6057]">
                      <span className="font-semibold text-[#292D29]">Reflection: </span>
                      {currentActivity.interactivePayload.reflectionPrompt}
                    </div>
                  )}
                </div>
              )}

              {currentActivity.category === 'challenge' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-sm text-[#292D29] leading-relaxed whitespace-pre-line">
                    {currentActivity.interactivePayload.prompt}
                  </div>

                  <h4 className="text-sm font-medium text-[#292D29]">
                    {currentActivity.interactivePayload.question}
                  </h4>

                  <div className="space-y-2">
                    {currentActivity.interactivePayload.options?.map((option, idx) => {
                      const isSelected = selectedChallengeOption === idx;
                      const correctIdx = currentActivity.interactivePayload.correctOptionIndex ?? 0;
                      const isAnswered = selectedChallengeOption !== null;
                      const isThisCorrect = idx === correctIdx;

                      let btnStyle =
                        'bg-[#F6F5F0] border-[#E2E0D8] text-[#292D29] hover:border-[#71816B]';
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle = 'bg-[#71816B]/14 border-[#71816B] text-[#292D29]';
                        } else if (isSelected && !isThisCorrect) {
                          btnStyle = 'bg-[#A67F68]/14 border-[#A67F68] text-[#292D29]';
                        } else {
                          btnStyle = 'opacity-50 bg-[#F6F5F0] border-[#E2E0D8] text-[#777B72]';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectChallengeAnswer(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-colors flex items-start gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#ECEBE4] text-[10px] font-mono text-[#5B6057]">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-[#71816B] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {currentActivity.interactivePayload.hint && selectedChallengeOption === null && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowHint((prev) => !prev)}
                        className="flex items-center gap-1.5 text-xs text-[#71816B] hover:text-[#292D29] transition-colors cursor-pointer"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
                      </button>
                      {showHint && (
                        <p className="mt-2 p-3 rounded-lg bg-[#C5B99F]/20 border border-[#C5B99F] text-xs text-[#5B4D34]">
                          {currentActivity.interactivePayload.hint}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedChallengeOption !== null && (
                    <div className="p-4 rounded-xl bg-[#ECEBE4]/75 border border-[#E2E0D8] space-y-1.5 animate-gentle-enter">
                      <span className="text-xs font-semibold text-[#292D29] block">
                        Explanation
                      </span>
                      <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed whitespace-pre-line">
                        {currentActivity.interactivePayload.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentActivity.category === 'offline' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#ECEBE4]/75 border border-[#E2E0D8] text-xs sm:text-sm text-[#5B6057]">
                    <span className="font-semibold text-[#4D5A48]">Real-World Reset: </span>
                    <span>{currentActivity.interactivePayload.benefit}</span>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-[#777B72] uppercase tracking-wider">
                      Guided Steps
                    </h4>
                    {currentActivity.interactivePayload.steps?.map((stepText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
                          playSoftTap(profile.soundEnabled);
                        }}
                        className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                          checkedSteps[idx]
                            ? 'bg-[#71816B]/12 border-[#71816B]/40 text-[#292D29]'
                            : 'bg-[#F6F5F0] border-[#E2E0D8] text-[#5B6057] hover:border-[#71816B]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            checkedSteps[idx]
                              ? 'bg-[#71816B] border-[#71816B] text-[#FAF9F5]'
                              : 'border-[#CFCBC0]'
                          }`}
                        >
                          {checkedSteps[idx] && <Check className="h-3 w-3 stroke-[2.5]" />}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{stepText}</span>
                      </button>
                    ))}
                  </div>

                  {currentActivity.interactivePayload.reflectionPrompt && (
                    <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-xs sm:text-sm text-[#5B6057]">
                      <span className="font-semibold text-[#292D29]">After completing: </span>
                      {currentActivity.interactivePayload.reflectionPrompt}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-[#E2E0D8]">
                <button
                  type="button"
                  onClick={handleFinishActivity}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                >
                  <span>Wrap Up &amp; Mark Complete</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETION & REFLECTION */}
          {step === 'completion' && currentActivity && (
            <div className="space-y-5 animate-gentle-enter">
              <div className="text-center p-6 rounded-2xl bg-[#ECEBE4]/75 border border-[#E2E0D8] space-y-3">
                <BotanicalMotif className="h-14 w-14 mx-auto" />
                <h3 className="font-editorial text-2xl font-medium text-[#292D29]">
                  Session Complete
                </h3>
                <p className="text-xs sm:text-sm text-[#5B6057] max-w-sm mx-auto leading-relaxed">
                  You spent {currentActivity.durationMinutes} minutes with something intentional instead of an endless feed.
                </p>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#4D5A48] bg-[#71816B]/14 px-3 py-1 rounded-full">
                    +{currentActivity.durationMinutes} mindful minutes logged
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#5B6057] uppercase tracking-wider">
                  How do you feel right now?
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {['Grounded', 'Enlightened', 'Focused', 'Energized', 'Calm'].map((feel) => (
                    <button
                      key={feel}
                      type="button"
                      onClick={() => {
                        setSelectedFeeling(feel);
                        playSoftTap(profile.soundEnabled);
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                        selectedFeeling === feel
                          ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                          : 'bg-[#F6F5F0] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                      }`}
                    >
                      {feel}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Optional: one thought to carry with you..."
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] text-base sm:text-xs text-[#292D29] placeholder:text-[#777B72] focus:outline-none focus:border-[#71816B] min-h-[44px]"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCompleteAndStop}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Stop &amp; Step Away</span>
                </button>

                <button
                  type="button"
                  onClick={handleExploreAnother}
                  className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#E2E0D8] bg-[#F6F5F0] text-[#5B6057] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors text-xs cursor-pointer"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Explore One More Activity</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
