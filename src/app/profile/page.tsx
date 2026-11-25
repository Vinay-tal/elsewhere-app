'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ALL_TOPICS, CONTENT_ITEMS, CHALLENGE_ITEMS } from '@/lib/data';
import { exportUserData } from '@/lib/storage';
import {
  User,
  Bookmark,
  Trophy,
  Clock,
  Sparkles,
  Download,
  Database,
  Trash2,
  BookOpen,
  Volume2,
  VolumeX,
  History,
  Compass,
  SlidersHorizontal,
  CheckCircle,
  HeartHandshake,
} from 'lucide-react';

export default function ProfilePage() {
  const {
    profile,
    updateProfile,
    toggleInterest,
    toggleSave,
    openArticleModal,
    openOnboardingModal,
    setSessionTargetDuration,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'saved' | 'preferences'>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  const savedDiscoveries = CONTENT_ITEMS.filter((item) =>
    profile.savedItemIds.includes(item.id)
  );

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateProfile({ name: tempName.trim() });
    }
    setIsEditingName(false);
    showToast('Name updated');
  };

  const handleExportData = () => {
    const md = exportUserData(profile);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elsewhere-journal-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Journal exported as Markdown');
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all session and activity history?')) {
      updateProfile({ sessionHistory: [], completedActivities: [] });
      showToast('Activity history cleared');
    }
  };

  const getWorthwhileBadge = (rating?: string) => {
    switch (rating) {
      case 'very':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#71816B]/12 text-[#4D5A48] border border-[#71816B]/25">
            Very worthwhile
          </span>
        );
      case 'somewhat':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#647678]/12 text-[#475658] border border-[#647678]/25">
            Somewhat worthwhile
          </span>
        );
      case 'neutral':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECEBE4] text-[#5B6057] border border-[#E2E0D8]">
            Neutral
          </span>
        );
      case 'distracted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#C5B99F]/30 text-[#5B4D34] border border-[#C5B99F]">
            Got distracted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#ECEBE4]/75 border border-[#E2E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] text-[#71816B]">
            <User className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#CFCBC0] text-[#292D29] text-base font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#71816B] text-[#FAF9F5] cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <h1 className="font-editorial text-2xl font-medium tracking-tight text-[#292D29]">
                  {profile.name}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-[#777B72] hover:text-[#292D29] underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-xs text-[#5B6057]">
              Personal notebook · No streaks or guilt metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportData}
            className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-[#E2E0D8] bg-[#FAF9F5] text-[#292D29] hover:border-[#71816B] transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#71816B]" />
            <span>Export Notes</span>
          </button>

          <button
            type="button"
            onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
              profile.soundEnabled
                ? 'border-[#71816B] text-[#4D5A48] bg-[#71816B]/10'
                : 'border-[#E2E0D8] bg-[#FAF9F5] text-[#777B72] hover:text-[#292D29]'
            }`}
            title={profile.soundEnabled ? 'Chime sound enabled' : 'Chime muted'}
            aria-label={profile.soundEnabled ? 'Mute gentle chimes' : 'Enable gentle chimes'}
          >
            {profile.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Subtle Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#E2E0D8] rounded-2xl bg-[#FAF9F5] divide-y sm:divide-y-0 sm:divide-x divide-[#E2E0D8] overflow-hidden">
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-[#777B72] flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#71816B]" />
            Mindful Time
          </span>
          <div className="text-xl font-medium text-[#292D29] font-mono tabular-nums">
            {profile.totalMindfulMinutes}m
          </div>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-[#777B72] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#71816B]" />
            Curiosities
          </span>
          <div className="text-xl font-medium text-[#292D29] font-mono tabular-nums">
            {profile.likedItemIds.length + profile.savedItemIds.length}
          </div>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-[#777B72] flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#8C7A56]" />
            Challenges
          </span>
          <div className="text-xl font-medium text-[#292D29] font-mono tabular-nums">
            {profile.completedChallengeIds.length} / {CHALLENGE_ITEMS.length}
          </div>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-[11px] font-medium text-[#777B72] flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-[#71816B]" />
            Sessions
          </span>
          <div className="text-xl font-medium text-[#292D29] font-mono tabular-nums">
            {profile.sessionHistory.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E0D8] gap-6 text-xs sm:text-sm font-medium overflow-x-auto scrollbar-none">
        {(
          [
            { id: 'overview', label: 'Curiosity Interests' },
            {
              id: 'history',
              label: `Personal History (${profile.sessionHistory.length + profile.completedActivities.length})`,
            },
            { id: 'saved', label: `Saved (${savedDiscoveries.length})` },
            { id: 'preferences', label: 'Session Goals & Sync' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-b-2 border-[#71816B] text-[#292D29] font-semibold'
                : 'text-[#777B72] hover:text-[#292D29]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Interests */}
      {activeTab === 'overview' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="font-editorial text-xl font-medium text-[#292D29] flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#71816B]" />
                <span>Selected Disciplines</span>
              </h2>
              <p className="text-xs text-[#5B6057]">
                Choose the subjects Elsewhere prioritizes in your Discover feed.
              </p>
            </div>

            <button
              type="button"
              onClick={openOnboardingModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#ECEBE4] text-[#292D29] hover:bg-[#E2E0D8] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#71816B]" />
              <span>Run Setup Guide</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {ALL_TOPICS.map((topic) => {
              const isSelected = profile.selectedInterests.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleInterest(topic)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                      : 'bg-[#FAF9F5] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                  }`}
                >
                  {isSelected ? `✓ ${topic}` : `+ ${topic}`}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Tab 2: Personal History */}
      {activeTab === 'history' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-editorial text-xl font-medium text-[#292D29] flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-[#71816B]" />
                <span>Session &amp; Activity Journal</span>
              </h2>
              <p className="text-xs text-[#5B6057]">
                Your record of mindful readings, reflections, and offline breaks.
              </p>
            </div>

            {(profile.sessionHistory.length > 0 || profile.completedActivities.length > 0) && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-xs text-[#777B72] hover:text-[#292D29] underline cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#777B72] font-medium block">
              Completed Sessions ({profile.sessionHistory.length})
            </span>

            {profile.sessionHistory.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] text-xs text-[#777B72]">
                No session reflections recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.sessionHistory.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#71816B]" />
                        <span className="text-xs font-semibold text-[#292D29]">
                          {sess.durationMinutes} min Mindful Session
                        </span>
                        <span className="text-[11px] text-[#777B72]">
                          (Target {sess.targetDurationMinutes}m · {sess.cardsViewed} explored)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getWorthwhileBadge(sess.worthwhileRating)}
                        <span className="text-[11px] text-[#777B72] font-mono">
                          {new Date(sess.endedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {sess.reflectionNote && (
                      <p className="font-editorial text-sm text-[#5B6057] pl-4 italic border-l-2 border-[#71816B]">
                        &ldquo;{sess.reflectionNote}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs uppercase tracking-wider text-[#777B72] font-medium block">
              Completed Activities &amp; Resets ({profile.completedActivities.length})
            </span>

            {profile.completedActivities.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] text-xs text-[#777B72]">
                No individual activities logged yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.completedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-[#71816B]" />
                        <span className="text-xs font-medium text-[#292D29]">{act.title}</span>
                        {act.category && (
                          <span className="text-[10px] uppercase text-[#777B72] px-2 py-0.5 rounded bg-[#ECEBE4]">
                            {act.category}
                          </span>
                        )}
                      </div>
                      {act.notes && (
                        <p className="font-editorial text-xs text-[#5B6057] pl-5 italic">
                          &ldquo;{act.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-medium text-[#292D29] block">
                        {act.durationMinutes}m
                      </span>
                      <span className="text-[11px] text-[#777B72] font-mono">
                        {new Date(act.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab 3: Saved Bookmarks */}
      {activeTab === 'saved' && (
        <section className="space-y-3">
          {savedDiscoveries.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-2">
              <Bookmark className="h-6 w-6 text-[#777B72] mx-auto" />
              <p className="text-sm text-[#292D29]">No saved bookmarks yet.</p>
              <p className="text-xs text-[#777B72]">
                Tap Bookmark on any reading or challenge to keep it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedDiscoveries.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] hover:border-[#CFCBC0] transition-colors flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => openArticleModal(item)}
                    className="cursor-pointer space-y-1 flex-1"
                  >
                    <span className="text-[11px] font-medium text-[#71816B]">{item.topic}</span>
                    <h3 className="font-editorial text-base font-medium text-[#292D29] hover:text-[#5E6D59] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#777B72] line-clamp-1">{item.summary}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openArticleModal(item)}
                      className="p-2 rounded-lg bg-[#ECEBE4] hover:bg-[#E2E0D8] text-[#292D29] transition-colors cursor-pointer"
                      title="Read"
                      aria-label={`Read ${item.title}`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      className="p-2 rounded-lg hover:bg-[#ECEBE4] text-[#777B72] hover:text-[#292D29] transition-colors cursor-pointer"
                      title="Remove bookmark"
                      aria-label={`Remove ${item.title} from bookmarks`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 4: Preferences & Cloud */}
      {activeTab === 'preferences' && (
        <section className="space-y-5">
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-3">
            <h3 className="text-sm font-semibold text-[#292D29] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#71816B]" />
              Session Duration Limit
            </h3>
            <p className="text-xs text-[#5B6057]">
              Choose how long each session lasts before Elsewhere gently invites you to pause.
            </p>

            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSessionTargetDuration(mins)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    profile.sessionTargetDurationMinutes === mins
                      ? 'bg-[#71816B] text-[#FAF9F5] border-[#71816B]'
                      : 'bg-[#F6F5F0] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-3">
            <h3 className="text-sm font-semibold text-[#292D29] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#8C7A56]" />
              Daily Intention
            </h3>
            <p className="text-xs text-[#5B6057]">
              Set a calm daily ceiling for screen-based curiosity. Zero streaks, zero guilt.
            </p>

            <div className="flex gap-2 flex-wrap">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => updateProfile({ dailySessionGoalMinutes: mins })}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    profile.dailySessionGoalMinutes === mins
                      ? 'bg-[#292D29] text-[#FAF9F5] border-[#292D29]'
                      : 'bg-[#F6F5F0] text-[#5B6057] border-[#E2E0D8] hover:border-[#71816B]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#ECEBE4]/65 border border-[#E2E0D8] space-y-3">
            <h3 className="text-sm font-semibold text-[#292D29] flex items-center gap-2">
              <Database className="h-4 w-4 text-[#71816B]" />
              Optional Supabase Persistence
            </h3>
            <p className="text-xs text-[#5B6057] leading-relaxed">
              Elsewhere works offline using browser storage. For multi-device PostgreSQL sync, configure your Supabase variables in{' '}
              <code className="text-[#292D29] bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-[#E2E0D8]">
                .env.local
              </code>
              . The schema with RLS policies is located at{' '}
              <code className="text-[#292D29] bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-[#E2E0D8]">
                supabase/schema.sql
              </code>
              .
            </p>

            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] font-mono text-[11px] text-[#5B6057] space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
