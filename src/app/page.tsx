'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CONTENT_ITEMS, CHALLENGE_ITEMS, NEWS_ITEMS, OFFLINE_ACTIVITIES } from '@/lib/data';
import { rankContentItems } from '@/lib/recommendation';
import FeaturedHeroCard from '@/components/FeaturedHeroCard';
import CompactCuriosityCard from '@/components/CompactCuriosityCard';
import SectionHeader from '@/components/SectionHeader';
import StoppingPointBanner from '@/components/StoppingPointBanner';
import QuickFiveMinutesModal from '@/components/QuickFiveMinutesModal';
import {
  Sparkles,
  Trophy,
  Globe,
  Footprints,
  ArrowRight,
  Compass,
  Clock,
  ShieldCheck,
  Zap,
  Shuffle,
  Bookmark,
} from 'lucide-react';

export default function HomePage() {
  const {
    profile,
    openChallengeModal,
    openOfflineTimer,
    toggleSave,
    openFindSomethingModal,
    openOnboardingModal
  } = useApp();
  const [feedLimit, setFeedLimit] = useState<number>(5);
  const [greeting, setGreeting] = useState('Welcome');
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickModalMode, setQuickModalMode] = useState<'five-minutes' | 'surprise-me'>('five-minutes');

  // Dynamic greeting based on client local hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Rank content through transparent recommendation engine
  const { items: rankedItems } = useMemo(() => {
    return rankContentItems(CONTENT_ITEMS, profile, feedLimit);
  }, [profile, feedLimit]);

  // Featured discovery is the top ranked item
  const featuredItem = rankedItems[0];
  const compactItems = rankedItems.slice(1);

  // Quick challenges for the home feed
  const homeChallenges = useMemo(() => {
    return CHALLENGE_ITEMS.slice(0, 2);
  }, []);

  // World pulse items for the home feed
  const homeNews = useMemo(() => {
    return NEWS_ITEMS.slice(0, 2);
  }, []);

  // Do something offline activities for the home feed
  const homeOffline = useMemo(() => {
    return OFFLINE_ACTIVITIES.slice(0, 2);
  }, []);

  const handleLoadMore = () => {
    setFeedLimit((prev) => prev + 3);
  };

  const hasMore = feedLimit < CONTENT_ITEMS.length;

  // Render real content directly using initial profile defaults so mobile devices never see a frozen skeleton

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-10">
      {/* 1. Editorial Header Greeting & Intent */}
      <section className="space-y-2 pt-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#D2F827]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D2F827] animate-ping" />
          <span>Curated for {profile.name}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400 font-mono text-[11px]">
            Goal: {profile.dailySessionGoalMinutes}m
          </span>
          <span className="text-neutral-500">•</span>
          <button
            onClick={openOnboardingModal}
            className="text-[11px] text-neutral-400 hover:text-white underline transition-colors"
          >
            Edit Interests
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {greeting}. What are you curious about today?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl leading-relaxed">
          A finite collection of ideas, challenges, and offline prompts. Designed to replace mindless scrolling with genuine fulfillment.
        </p>
      </section>

      {/* 2. Prominent "I have 5 minutes" & "Find something for me" Entry Point */}
      <section className="relative rounded-2xl border border-white/10 bg-gradient-to-r from-[#171D2D] via-[#121622] to-[#151220] p-4 sm:p-5 shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D2F827] flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              Micro-Break Mode
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Have a quick minute? Replace scrolling with something good.
            </h2>
            <p className="text-xs text-neutral-400 font-light">
              Choose an instantaneous curiosity or let Elsewhere surprise you.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            <button
              onClick={() => {
                setQuickModalMode('five-minutes');
                setQuickModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 shadow-sm transition-all"
            >
              <Zap className="h-3.5 w-3.5 fill-black" />
              <span>I have 5 minutes</span>
            </button>

            <button
              id="home-find-something-btn"
              onClick={() => openFindSomethingModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#8B5CF6]/20 text-purple-200 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/30 active:scale-95 transition-all cursor-pointer"
            >
              <Shuffle className="h-3.5 w-3.5 text-purple-300" />
              <span>Find for me</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Discovery (Hero Card) */}
      {featuredItem && (
        <section className="space-y-3">
          <SectionHeader
            icon={<Compass className="h-4 w-4" />}
            title="Featured Discovery"
            subtitle="Today's deep dive into high-signal human knowledge"
          />
          <FeaturedHeroCard item={featuredItem} />
        </section>
      )}

      {/* 4. Curiosity Feed (Compact Content Cards) */}
      <section className="space-y-4">
        <SectionHeader
          icon={<Sparkles className="h-4 w-4" />}
          title={`Curiosity Feed (${compactItems.length + 1} curated)`}
          subtitle="Explore mental models, science, history, and psychology"
          viewAllHref="/explore"
          viewAllLabel="Explore 11 disciplines"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {compactItems.map((item) => (
            <CompactCuriosityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 5. World Pulse Section (Factual News) */}
      <section className="space-y-4">
        <SectionHeader
          icon={<Globe className="h-4 w-4 text-sky-400" />}
          title="World Pulse"
          subtitle="Sober global affairs explained simply without rage-bait"
          viewAllHref="/world-pulse"
          viewAllLabel="All global news"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homeNews.map((news) => {
            const isSaved = profile.savedItemIds.includes(news.id);

            return (
              <article
                key={news.id}
                className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#121620] border border-white/10 hover:border-sky-400/40 transition-all duration-200 space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-400/10 text-sky-300 border border-sky-400/20">
                      {news.category}
                    </span>
                    <button
                      onClick={() => toggleSave(news.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved ? 'text-[#D2F827] bg-[#D2F827]/10' : 'text-neutral-500 hover:text-white'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#D2F827]' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug line-clamp-2">
                    {news.headline}
                  </h3>

                  <p className="text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400">
                    <strong className="text-neutral-300 font-medium block">Why it matters:</strong>
                    <span className="line-clamp-2">{news.whyItMatters}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="h-3 w-3 text-sky-400" />
                    {news.source.split(' ')[0]} • Factual
                  </span>
                  <Link
                    href="/world-pulse"
                    className="flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>Read Brief</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. Quick Challenges Section */}
      <section className="space-y-4">
        <SectionHeader
          icon={<Trophy className="h-4 w-4 text-amber-400" />}
          title="Quick Challenges"
          subtitle="Interactive logic puzzles, riddles, and cognitive tests"
          viewAllHref="/challenges"
          viewAllLabel="View all challenges"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homeChallenges.map((challenge) => {
            const isSolved = profile.completedChallengeIds.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                className={`group flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isSolved
                    ? 'bg-[#0E151E] border-emerald-500/20'
                    : 'bg-[#121620] border-white/10 hover:border-amber-400/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {challenge.category}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {challenge.timeEstimateMinutes} min • {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                    {challenge.prompt}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    {isSolved ? '✓ Solved' : 'Interactive validation'}
                  </span>
                  <button
                    onClick={() => openChallengeModal(challenge)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSolved
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-amber-400 text-black hover:bg-amber-300 active:scale-95'
                    }`}
                  >
                    <span>{isSolved ? 'Review' : 'Solve Challenge'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Do Something Section (Offline Activities) */}
      <section className="space-y-4">
        <SectionHeader
          icon={<Footprints className="h-4 w-4 text-[#D2F827]" />}
          title="Do Something Offline"
          subtitle="Escape the digital loop with evidence-based micro-actions"
          viewAllHref="/do-something"
          viewAllLabel="All offline activities"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homeOffline.map((act) => (
            <div
              key={act.id}
              className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#121620] border border-white/10 hover:border-[#D2F827]/40 transition-all duration-200 space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D2F827]/10 text-[#D2F827] border border-[#D2F827]/25">
                    {act.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
                    <Clock className="h-3 w-3" />
                    {act.durationMinutes} min
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D2F827] transition-colors leading-snug">
                  {act.title}
                </h3>

                <p className="text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                  {act.description}
                </p>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400">
                  <strong className="text-neutral-300 font-medium block">Benefit:</strong>
                  <span className="line-clamp-1">{act.benefit}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  {act.steps.length} guided steps
                </span>
                <button
                  onClick={() => openOfflineTimer(act)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#D2F827] text-black hover:bg-[#BDF010] active:scale-95 transition-all"
                >
                  <span>Start Micro-Action</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Intentional Stopping Point Checkpoint */}
      <StoppingPointBanner onLoadMore={handleLoadMore} hasMore={hasMore} />

      {/* 9. Quick 5 Minutes / Surprise Me Modal */}
      <QuickFiveMinutesModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        initialMode={quickModalMode}
      />
    </div>
  );
}
