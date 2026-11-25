'use client';

import React, { useState, useMemo } from 'react';
import { OFFLINE_ACTIVITIES } from '@/lib/data';
import { OfflineCategory } from '@/types';
import { useApp } from '@/context/AppContext';
import { getOfflineTone } from '@/lib/natureTheme';
import { Footprints, Clock, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';

export default function DoSomethingPage() {
  const { profile, openOfflineTimer } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<number | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<OfflineCategory | 'All'>('All');

  const categories: { label: string; value: OfflineCategory | 'All' }[] = [
    { label: 'All Categories', value: 'All' },
    { label: 'Mind · Ground', value: 'Mind' },
    { label: 'Body · Move', value: 'Body' },
    { label: 'Social · Connect', value: 'Social' },
    { label: 'Create · Make', value: 'Create' },
    { label: 'Unplug · Presence', value: 'Unplug' },
  ];

  const durations: { label: string; value: number | 'All' }[] = [
    { label: 'Any time', value: 'All' },
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15+ min', value: 20 },
  ];

  const filteredActivities = useMemo(() => {
    return OFFLINE_ACTIVITIES.filter((act) => {
      if (selectedCategory !== 'All' && act.category !== selectedCategory) return false;
      if (selectedDuration !== 'All') {
        if (selectedDuration === 20 && act.durationMinutes < 15) return false;
        if (selectedDuration !== 20 && act.durationMinutes !== selectedDuration) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDuration]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E2E0D8]">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#71816B]">
          <Footprints className="h-3.5 w-3.5" />
          <span>Screen-Free Prompts</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium tracking-tight text-[#292D29]">
          Do Something Offline
        </h1>
        <p className="text-sm text-[#5B6057] max-w-xl leading-relaxed">
          When the urge to scroll hits, trade the screen for something tangible. Choose how much time you have.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#5B6057] flex items-center gap-1.5 mr-1">
            <Clock className="h-3.5 w-3.5 text-[#71816B]" />
            Available time:
          </span>
          {durations.map((dur) => (
            <button
              key={dur.label}
              type="button"
              onClick={() => setSelectedDuration(dur.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                selectedDuration === dur.value
                  ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                  : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-[#ECEBE4] text-[#292D29] border-[#CFCBC0]'
                  : 'bg-transparent text-[#777B72] border-transparent hover:text-[#292D29]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((act) => {
          const tone = getOfflineTone(act.category);
          return (
            <div
              key={act.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] hover:border-[#CFCBC0] transition-colors space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tone.badge}`}>
                    {act.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#777B72] font-mono tabular-nums">
                    <Clock className="h-3.5 w-3.5" />
                    {act.durationMinutes} min
                  </span>
                </div>

                <h2 className="font-editorial text-xl font-medium text-[#292D29] leading-snug">
                  {act.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#5B6057] leading-relaxed">
                  {act.description}
                </p>

                <div className="p-3.5 rounded-xl bg-[#ECEBE4]/65 border border-[#E2E0D8] text-xs text-[#5B6057]">
                  <span className="font-medium text-[#292D29] block mb-0.5">Why it helps</span>
                  <span>{act.benefit}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E0D8] flex items-center justify-between">
                <span className="text-xs text-[#777B72]">
                  {act.steps.length} guided steps
                </span>
                <button
                  type="button"
                  onClick={() => openOfflineTimer(act)}
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                >
                  <span>Start Micro-Action</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-World Journal */}
      {profile.completedActivities.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-[#E2E0D8]">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-xl font-medium text-[#292D29] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#71816B]" />
              <span>Your Offline Journal ({profile.completedActivities.length})</span>
            </h2>
            <span className="text-xs font-mono text-[#777B72] tabular-nums">
              {profile.completedActivities.reduce((acc, a) => acc + a.durationMinutes, 0)}m away from screens
            </span>
          </div>

          <div className="space-y-2.5">
            {profile.completedActivities.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-[#ECEBE4]/60 border border-[#E2E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#292D29]">{entry.title}</span>
                    <span className="text-xs text-[#71816B] font-mono">+{entry.durationMinutes}m</span>
                  </div>
                  {entry.notes && (
                    <p className="font-editorial text-sm text-[#5B6057] italic mt-1">
                      &ldquo;{entry.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#777B72] shrink-0 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{entry.completedAt.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
