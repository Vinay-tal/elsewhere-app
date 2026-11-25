'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ALL_TOPICS } from '@/lib/data';
import { Topic } from '@/types';
import { Compass, Sparkles, Clock, Check, ArrowRight, ShieldCheck, X } from 'lucide-react';

export default function OnboardingModal() {
  const {
    isOnboardingModalOpen,
    closeOnboardingModal,
    completeOnboarding,
    profile,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(
    profile.selectedInterests && profile.selectedInterests.length > 0
      ? profile.selectedInterests
      : ['Psychology', 'Science', 'Technology & AI', 'Philosophy']
  );
  const [targetSessionDuration, setTargetSessionDuration] = useState<number>(
    profile.sessionTargetDurationMinutes || 15
  );
  const [dailyGoal, setDailyGoal] = useState<number>(
    profile.dailySessionGoalMinutes || 20
  );

  if (!isOnboardingModalOpen) return null;

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleFinish = () => {
    if (selectedTopics.length === 0) return;
    completeOnboarding(selectedTopics, targetSessionDuration, dailyGoal);
  };

  const durations = [5, 10, 15, 20, 30];
  const dailyGoals = [15, 30, 45, 60];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      onClick={closeOnboardingModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#292D29]/45 backdrop-blur-xs animate-gentle-enter"
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92dvh] bg-[#FAF9F5] border border-[#E2E0D8] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0D8] bg-[#F6F5F0]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECEBE4] border border-[#E2E0D8] text-[#71816B]">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#4D5A48] block">
                Welcome to Elsewhere
              </span>
              <span className="text-[11px] text-[#777B72]">
                Step {step} of 2 · Curiosity over scrolling
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1">
              <span
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step === 1 ? 'bg-[#71816B]' : 'bg-[#E2E0D8]'
                }`}
              />
              <span
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step === 2 ? 'bg-[#71816B]' : 'bg-[#E2E0D8]'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={closeOnboardingModal}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#777B72] hover:text-[#292D29] hover:bg-[#ECEBE4] transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <h2
                  id="onboarding-modal-title"
                  className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#292D29] leading-snug"
                >
                  What sparks your curiosity?
                </h2>
                <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                  Elsewhere uses your chosen topics to organize readings and puzzles—no engagement traps, just fields you enjoy.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#777B72]">
                  <span>Select 2 or more disciplines:</span>
                  <span className="font-mono text-[#4D5A48] font-medium">
                    {selectedTopics.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-colors text-left min-h-[48px] cursor-pointer ${
                          isSelected
                            ? 'bg-[#71816B]/14 border-[#71816B] text-[#292D29]'
                            : 'bg-[#F6F5F0] border-[#E2E0D8] text-[#5B6057] hover:border-[#71816B]'
                        }`}
                      >
                        <span className="truncate pr-1">{topic}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#71816B] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#ECEBE4]/65 border border-[#E2E0D8] flex items-start gap-2.5 text-xs text-[#5B6057]">
                <ShieldCheck className="h-4 w-4 text-[#71816B] shrink-0 mt-0.5" />
                <span>You can adjust these anytime in your Profile notebook.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <h2
                  id="onboarding-modal-title"
                  className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#292D29] leading-snug"
                >
                  Set gentle boundaries
                </h2>
                <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                  Choose when Elsewhere should invite you to pause, reflect, and return to your day.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#292D29] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#71816B]" />
                    Session Duration
                  </span>
                  <span className="text-xs text-[#777B72]">Natural pause point</span>
                </div>
                <p className="text-xs text-[#5B6057]">
                  How long should each visit last before a calm pause prompt appears?
                </p>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {durations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTargetSessionDuration(d)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        targetSessionDuration === d
                          ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                          : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F5F0] border border-[#E2E0D8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#292D29] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#8C7A56]" />
                    Optional Daily Intention
                  </span>
                  <span className="text-xs text-[#777B72]">Zero guilt</span>
                </div>
                <p className="text-xs text-[#5B6057]">
                  Gentle daily ceiling across all visits:
                </p>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {dailyGoals.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setDailyGoal(g)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        dailyGoal === g
                          ? 'bg-[#292D29] text-[#FAF9F5] border-[#292D29]'
                          : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                      }`}
                    >
                      {g} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E0D8] bg-[#F6F5F0]">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#5B6057] hover:text-[#292D29] transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={closeOnboardingModal}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#777B72] hover:text-[#292D29] transition-colors cursor-pointer"
            >
              Skip for now
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={selectedTopics.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Next: Set Limits</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
            >
              <span>Begin Exploring</span>
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
