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
  HeartHandshake
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

  // Saved items list
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">🌟 Very worthwhile</span>;
      case 'somewhat':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">👍 Somewhat worthwhile</span>;
      case 'neutral':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-500/15 text-neutral-300 border border-neutral-500/30">😐 Neutral</span>;
      case 'distracted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">📱 Got distracted</span>;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-7">
      {/* Header Profile Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#141926] to-[#0E121B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D2F827]/15 border border-[#D2F827]/30 text-[#D2F827]">
            <User className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-black/40 border border-white/20 text-white text-base font-bold"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#D2F827] text-black"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {profile.name}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-neutral-400 hover:text-white underline"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-xs text-neutral-400 font-light">
              Intentional explorer • Zero guilt metrics
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Notes</span>
          </button>

          <button
            onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
            className={`p-2 rounded-xl border transition-colors ${
              profile.soundEnabled
                ? 'border-[#D2F827]/30 text-[#D2F827] bg-[#D2F827]/5'
                : 'border-white/10 text-neutral-500 hover:text-white'
            }`}
            title={profile.soundEnabled ? 'Chime sound enabled' : 'Chime muted'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mindful Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#D2F827]" />
            Mindful Time
          </span>
          <div className="text-xl font-bold text-white font-mono">
            {profile.totalMindfulMinutes}m
          </div>
          <span className="text-[11px] text-neutral-400">Total intentional time</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-purple-400" />
            Curiosities
          </span>
          <div className="text-xl font-bold text-white font-mono">
            {profile.likedItemIds.length + profile.savedItemIds.length}
          </div>
          <span className="text-[11px] text-neutral-400">Explored & saved</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
            <Trophy className="h-3 w-3 text-amber-400" />
            Challenges
          </span>
          <div className="text-xl font-bold text-white font-mono">
            {profile.completedChallengeIds.length} / {CHALLENGE_ITEMS.length}
          </div>
          <span className="text-[11px] text-neutral-400">Puzzles solved</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1">
            <History className="h-3 w-3 text-emerald-400" />
            Sessions
          </span>
          <div className="text-xl font-bold text-white font-mono">
            {profile.sessionHistory.length}
          </div>
          <span className="text-[11px] text-neutral-400">Recorded sessions</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-4 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#D2F827] text-[#D2F827] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Curiosity Interests
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-b-2 border-[#D2F827] text-[#D2F827] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Personal History</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-neutral-300">
            {profile.sessionHistory.length + profile.completedActivities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-2.5 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-b-2 border-[#D2F827] text-[#D2F827] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Saved Bookmarks</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-neutral-300">
            {savedDiscoveries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'border-b-2 border-[#D2F827] text-[#D2F827] font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Session Goals & Cloud
        </button>
      </div>

      {/* Tab 1: Curiosity Interests */}
      {activeTab === 'overview' && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#D2F827]" />
                Selected Disciplines of Curiosity
              </h2>
              <p className="text-xs text-neutral-400 font-light">
                Toggle the fields you want the transparent recommendation engine to prioritize.
              </p>
            </div>

            <button
              onClick={openOnboardingModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition-all self-start sm:self-auto"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#D2F827]" />
              <span>Customize Onboarding</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {ALL_TOPICS.map((topic) => {
              const isSelected = profile.selectedInterests.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleInterest(topic)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#D2F827] text-black border-[#D2F827] font-semibold shadow-sm'
                      : 'bg-white/[0.02] text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isSelected ? `✓ ${topic}` : `+ ${topic}`}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Tab 2: Personal History of Completed Activities & Sessions */}
      {activeTab === 'history' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-[#D2F827]" />
                Personal Activity & Session Journal
              </h2>
              <p className="text-xs text-neutral-400 font-light">
                Your authentic record of mindful exploration and worthwhile reflections.
              </p>
            </div>

            {(profile.sessionHistory.length > 0 || profile.completedActivities.length > 0) && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {/* Recorded Sessions Section */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
              Completed Sessions ({profile.sessionHistory.length})
            </span>

            {profile.sessionHistory.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#121620] border border-white/10 text-xs text-neutral-400 font-light">
                No session reflections recorded yet. Complete your first session to see it here!
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.sessionHistory.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#D2F827]" />
                        <span className="text-xs font-bold text-white">
                          {sess.durationMinutes} min Mindful Session
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          (Target: {sess.targetDurationMinutes}m • {sess.cardsViewed} curiosities)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {getWorthwhileBadge(sess.worthwhileRating)}
                        <span className="text-[10px] text-neutral-500">
                          {new Date(sess.endedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {sess.reflectionNote && (
                      <p className="text-xs text-neutral-300 font-light pl-6 italic border-l-2 border-[#D2F827]/40 py-0.5">
                        &quot;{sess.reflectionNote}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Activities Section */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
              Completed Activities & Resets ({profile.completedActivities.length})
            </span>

            {profile.completedActivities.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#121620] border border-white/10 text-xs text-neutral-400 font-light">
                No individual activities logged yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.completedActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-[#121620] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-white">{act.title}</span>
                        {act.category && (
                          <span className="text-[10px] uppercase font-bold text-neutral-500 px-1.5 py-0.2 rounded bg-white/5">
                            {act.category}
                          </span>
                        )}
                      </div>
                      {act.notes && (
                        <p className="text-xs text-neutral-400 font-light pl-5">
                          &quot;{act.notes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-medium text-white block">
                        {act.durationMinutes}m
                      </span>
                      <span className="text-[10px] text-neutral-500">
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
            <div className="p-8 text-center rounded-2xl bg-[#121620] border border-white/10 space-y-2">
              <Bookmark className="h-6 w-6 text-neutral-500 mx-auto" />
              <p className="text-sm text-neutral-300">No saved bookmarks yet.</p>
              <p className="text-xs text-neutral-500">
                Tap the Bookmark icon on any card in Discover, Challenges, or Explore to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedDiscoveries.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#121620] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => openArticleModal(item)}
                    className="cursor-pointer space-y-1 flex-1"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D2F827]">
                      {item.topic}
                    </span>
                    <h3 className="text-sm font-bold text-white hover:text-[#D2F827] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-1 font-light">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openArticleModal(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                      title="Read"
                    >
                      <BookOpen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleSave(item.id)}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors"
                      title="Remove bookmark"
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

      {/* Tab 4: Session Goals & Supabase Cloud */}
      {activeTab === 'preferences' && (
        <section className="space-y-6">
          {/* Target Session Duration */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#D2F827]" />
              Selectable Session Duration
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Choose how long each mindful exploration session lasts before Elsewhere gently suggests pausing.
            </p>

            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSessionTargetDuration(mins)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    profile.sessionTargetDurationMinutes === mins
                      ? 'bg-[#D2F827] text-black border-[#D2F827] font-semibold'
                      : 'bg-white/[0.02] text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Daily Intention */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Optional Daily Usage Goal
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Set an intentional ceiling for daily screen time. Zero streaks, zero guilt.
            </p>

            <div className="flex gap-2 flex-wrap">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => updateProfile({ dailySessionGoalMinutes: mins })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    profile.dailySessionGoalMinutes === mins
                      ? 'bg-purple-500 text-white border-purple-500 font-semibold'
                      : 'bg-white/[0.02] text-neutral-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Supabase Integration readiness */}
          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              Supabase Backend Persistence
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Elsewhere operates fully offline with localStorage. To enable multi-device sync
              with PostgreSQL, provide your Supabase environment variables in{' '}
              <code className="text-[#D2F827] bg-black/40 px-1 py-0.5 rounded">.env.local</code>.
              The complete schema with RLS policies is ready in{' '}
              <code className="text-[#D2F827] bg-black/40 px-1 py-0.5 rounded">supabase/schema.sql</code>.
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-neutral-400 space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
