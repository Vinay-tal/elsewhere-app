'use client';

import React, { useState, useMemo } from 'react';
import { OFFLINE_ACTIVITIES } from '@/lib/data';
import { OfflineCategory } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  Footprints,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function DoSomethingPage() {
  const { profile, openOfflineTimer } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<number | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<OfflineCategory | 'All'>('All');

  const categories: { label: string; value: OfflineCategory | 'All' }[] = [
    { label: 'All Categories', value: 'All' },
    { label: 'Mind (Calm & Ground)', value: 'Mind' },
    { label: 'Body (Move & Decompress)', value: 'Body' },
    { label: 'Social (Connect)', value: 'Social' },
    { label: 'Create (Make Something)', value: 'Create' },
    { label: 'Unplug (Pure Presence)', value: 'Unplug' },
  ];

  const durations: { label: string; value: number | 'All' }[] = [
    { label: 'Any time', value: 'All' },
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15+ min', value: 20 },
  ];

  const filteredActivities = useMemo(() => {
    return OFFLINE_ACTIVITIES.filter((act) => {
      if (selectedCategory !== 'All' && act.category !== selectedCategory) {
        return false;
      }
      if (selectedDuration !== 'All') {
        if (selectedDuration === 20 && act.durationMinutes < 15) return false;
        if (selectedDuration !== 20 && act.durationMinutes !== selectedDuration) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDuration]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-7">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#D2F827]">
          <Footprints className="h-3.5 w-3.5" />
          <span>Real World & Offline Escapes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Do Something Offline
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light">
          When the urge to scroll hits, trade screen glow for tangible reality. Pick how much time you have.
        </p>
      </div>

      {/* Time selector pills */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#D2F827]" />
          How much time do you have?
        </span>
        <div className="flex flex-wrap gap-2">
          {durations.map((dur) => (
            <button
              key={dur.label}
              onClick={() => setSelectedDuration(dur.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedDuration === dur.value
                  ? 'bg-[#D2F827] text-black border-[#D2F827] font-semibold'
                  : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-white/20'
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              selectedCategory === cat.value
                ? 'bg-white/15 text-white border-white/30 font-medium'
                : 'bg-white/[0.02] text-neutral-400 border-white/5 hover:border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="group flex flex-col justify-between p-5 rounded-2xl bg-[#121620] border border-white/10 hover:border-[#D2F827]/40 transition-all space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D2F827]/10 text-[#D2F827] border border-[#D2F827]/25">
                  {act.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
                  <Clock className="h-3 w-3" />
                  {act.durationMinutes} min
                </span>
              </div>

              <h2 className="text-base font-bold text-white group-hover:text-[#D2F827] transition-colors leading-snug">
                {act.title}
              </h2>

              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                {act.description}
              </p>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400">
                <span className="font-semibold text-neutral-300 block mb-0.5">Scientific Benefit:</span>
                <span>{act.benefit}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                {act.steps.length} guided steps
              </span>
              <button
                onClick={() => openOfflineTimer(act)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] transition-colors"
              >
                <span>Start Micro-Action</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Offline Completed Journal */}
      {profile.completedActivities.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Your Real-World Journal ({profile.completedActivities.length})
            </h2>
            <span className="text-xs text-neutral-400">
              {profile.completedActivities.reduce((acc, a) => acc + a.durationMinutes, 0)} min total invested
            </span>
          </div>

          <div className="space-y-2.5">
            {profile.completedActivities.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-[#0E121B] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {entry.title}
                    </span>
                    <span className="text-[10px] text-[#D2F827] font-mono">
                      +{entry.durationMinutes}m
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-neutral-400 italic mt-1">
                      &quot;{entry.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-neutral-500 shrink-0">
                  <Calendar className="h-3 w-3" />
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
