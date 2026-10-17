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
    profile
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
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92vh] bg-[#10141D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0D1017]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D2F827]/15 border border-[#D2F827]/30 text-[#D2F827]">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#D2F827] block">
                Welcome to Elsewhere
              </span>
              <span className="text-[11px] text-neutral-400">
                Step {step} of 2 • Curiosity over mindless scrolling
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1">
              <span
                className={`h-2 w-6 rounded-full transition-all ${
                  step === 1 ? 'bg-[#D2F827]' : 'bg-white/20'
                }`}
              />
              <span
                className={`h-2 w-6 rounded-full transition-all ${
                  step === 2 ? 'bg-[#D2F827]' : 'bg-white/20'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={closeOnboardingModal}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-neutral-200">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h2
                  id="onboarding-modal-title"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight"
                >
                  What sparks your genuine curiosity?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Elsewhere uses your selections to rank discoveries and challenges. No black-box algorithms or engagement traps—just topics you care about.
                </p>
              </div>

              {/* Topic Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Select 2 or more disciplines:</span>
                  <span className="font-mono text-[#D2F827]">
                    {selectedTopics.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left min-h-[48px] ${
                          isSelected
                            ? 'bg-[#D2F827]/15 border-[#D2F827]/50 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-1">{topic}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#D2F827] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-neutral-400 font-light">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  You can change or add interests at any time in your Profile settings.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <h2
                  id="onboarding-modal-title"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight"
                >
                  Set your intentional boundaries
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Unlike social apps that profit by maximizing your screen time, Elsewhere helps you finish your curiosity session and step away feeling fulfilled.
                </p>
              </div>

              {/* Session Duration */}
              <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#D2F827]" />
                    Target Session Duration
                  </span>
                  <span className="text-xs text-neutral-400">
                    Natural stopping point
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  How long would you like each visit to be before a gentle reflection prompt appears?
                </p>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setTargetSessionDuration(d)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        targetSessionDuration === d
                          ? 'bg-[#D2F827] text-black border-[#D2F827]'
                          : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Daily Usage Goal */}
              <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    Optional Daily Intention
                  </span>
                  <span className="text-xs text-neutral-400 font-light">
                    Zero shame • No guilt
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  Total mindful exploration across all sessions today:
                </p>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {dailyGoals.map((g) => (
                    <button
                      key={g}
                      onClick={() => setDailyGoal(g)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        dailyGoal === g
                          ? 'bg-purple-500 text-white border-purple-500'
                          : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20'
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#0D1017]">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={closeOnboardingModal}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Skip for now
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={selectedTopics.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors disabled:opacity-40"
            >
              <span>Next: Set Limits</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors shadow-lg shadow-[#D2F827]/10"
            >
              <span>Begin Mindful Exploration</span>
              <Check className="h-4 w-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
