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
import { getChallengeTone, getNewsTone, getOfflineTone } from '@/lib/natureTheme';
import {
  Sparkles,
  Trophy,
  Globe,
  Footprints,
  ArrowRight,
  Compass,
  Clock,
  Shuffle,
  Bookmark,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const {
    profile,
    openChallengeModal,
    openOfflineTimer,
    toggleSave,
    openFindSomethingModal,
    openOnboardingModal,
  } = useApp();
  const [feedLimit, setFeedLimit] = useState<number>(5);
  const [greeting, setGreeting] = useState('Welcome');
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickModalMode, setQuickModalMode] = useState<'five-minutes' | 'surprise-me'>('five-minutes');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const { items: rankedItems } = useMemo(() => {
    return rankContentItems(CONTENT_ITEMS, profile, feedLimit);
  }, [profile, feedLimit]);

  const featuredItem = rankedItems[0];
  const compactItems = rankedItems.slice(1);

  const homeChallenges = useMemo(() => CHALLENGE_ITEMS.slice(0, 2), []);
  const homeNews = useMemo(() => NEWS_ITEMS.slice(0, 2), []);
  const homeOffline = useMemo(() => OFFLINE_ACTIVITIES.slice(0, 2), []);

  const handleLoadMore = () => setFeedLimit((prev) => prev + 3);
  const hasMore = feedLimit < CONTENT_ITEMS.length;

  const hasProgress =
    profile.totalMindfulMinutes > 0 ||
    profile.completedChallengeIds.length > 0 ||
    profile.completedActivities.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-14">
      {/* 1. Warm Editorial Welcome & Quiet Entry */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[#E2E0D8]">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#777B72]">
            <span className="inline-flex items-center gap-1.5 text-[#4D5A48] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#71816B]" aria-hidden="true" />
              Curated for {profile.name}
            </span>
            <span>·</span>
            <span className="font-mono text-[11px] tabular-nums">
              {profile.dailySessionGoalMinutes}m daily intention
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={openOnboardingModal}
              className="underline decoration-[#CFCBC0] underline-offset-4 hover:text-[#292D29] transition-colors cursor-pointer"
            >
              Edit interests
            </button>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-[#292D29] leading-[1.14]">
            {greeting}. Take a quiet moment for something worthwhile.
          </h1>

          <p className="text-sm sm:text-base text-[#5B6057] max-w-xl leading-relaxed">
            Elsewhere is a calm space to read thoughtful essays, exercise your reasoning, catch sober global news, or step away from your screen altogether.
          </p>
        </div>

        {/* Gentle Entry Actions (No flashy gradient hero) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#ECEBE4]/75 border border-[#E2E0D8] p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-medium text-[#71816B]">
              Short Break
            </span>
            <p className="text-sm font-medium text-[#292D29]">
              Replace an automatic scroll with one intentional choice.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => {
                setQuickModalMode('five-minutes');
                setQuickModalOpen(true);
              }}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              <span>I have 5 minutes</span>
            </button>

            <button
              id="home-find-something-btn"
              type="button"
              onClick={() => openFindSomethingModal()}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#FAF9F5] text-[#292D29] border border-[#E2E0D8] hover:border-[#71816B] transition-colors cursor-pointer"
            >
              <Shuffle className="h-4 w-4 text-[#71816B]" />
              <span>Guide me</span>
            </button>
          </div>
        </div>
      </section>

      {/* Subtle Recent Activity Reflection Line (Only when user has activity) */}
      {hasProgress && (
        <section
          aria-label="Recent mindful activity"
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#ECEBE4]/55 border border-[#E2E0D8] text-xs text-[#5B6057]"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-medium text-[#292D29]">Your pace so far:</span>
            <span className="font-mono tabular-nums">{profile.totalMindfulMinutes}m intentional time</span>
            <span>·</span>
            <span>{profile.completedChallengeIds.length} puzzles explored</span>
            <span>·</span>
            <span>{profile.completedActivities.length} offline resets</span>
          </div>
          <Link
            href="/profile"
            className="text-xs font-medium text-[#71816B] hover:text-[#292D29] transition-colors"
          >
            View notebook →
          </Link>
        </section>
      )}

      {/* 2. Category Pathways */}
      <section aria-label="Activity categories" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            href: '/explore',
            label: 'Disciplines',
            desc: '11 fields of reading',
            icon: Search,
            accent: 'border-l-[#71816B]',
          },
          {
            href: '/challenges',
            label: 'Challenges',
            desc: 'Logic, riddles & code',
            icon: Trophy,
            accent: 'border-l-[#C5B99F]',
          },
          {
            href: '/world-pulse',
            label: 'World Pulse',
            desc: 'Calm global briefs',
            icon: Globe,
            accent: 'border-l-[#647678]',
          },
          {
            href: '/do-something',
            label: 'Offline Resets',
            desc: 'Screen-free prompts',
            icon: Footprints,
            accent: 'border-l-[#A67F68]',
          },
        ].map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group flex items-start gap-3 p-4 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] border-l-2 ${cat.accent} hover:border-[#CFCBC0] hover:bg-[#FFFFFF] transition-colors`}
            >
              <Icon className="h-4 w-4 text-[#71816B] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="block text-sm font-medium text-[#292D29] group-hover:text-[#5E6D59] transition-colors">
                  {cat.label}
                </span>
                <span className="block text-xs text-[#777B72] truncate">{cat.desc}</span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* 3. Featured Discovery */}
      {featuredItem && (
        <section className="space-y-4">
          <SectionHeader
            icon={<Compass className="h-4 w-4" />}
            title="Featured Discovery"
            subtitle="A thoughtful starting point for today"
          />
          <FeaturedHeroCard item={featuredItem} />
        </section>
      )}

      {/* 4. Curiosity Readings */}
      <section className="space-y-5">
        <SectionHeader
          icon={<Sparkles className="h-4 w-4" />}
          title={`Curiosity Library (${compactItems.length + 1} curated)`}
          subtitle="Short reads across psychology, science, philosophy, and history"
          viewAllHref="/explore"
          viewAllLabel="Explore all 11 disciplines"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {compactItems.map((item) => (
            <CompactCuriosityCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 5. World Pulse (Editorial Dispatch Strips — Distinct from Reading Cards) */}
      <section className="space-y-5">
        <SectionHeader
          icon={<Globe className="h-4 w-4" />}
          title="World Pulse"
          subtitle="Clear global reporting without clickbait or outrage"
          viewAllHref="/world-pulse"
          viewAllLabel="All dispatches"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {homeNews.map((news) => {
            const isSaved = profile.savedItemIds.includes(news.id);
            const tone = getNewsTone(news.category);

            return (
              <article
                key={news.id}
                className="flex flex-col justify-between pb-5 border-b border-[#E2E0D8] space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${tone.badge}`}>
                      {news.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSave(news.id)}
                      className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        isSaved
                          ? 'text-[#71816B] bg-[#71816B]/10'
                          : 'text-[#777B72] hover:text-[#292D29]'
                      }`}
                      title="Bookmark"
                      aria-label="Bookmark story"
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#71816B]' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-editorial text-lg font-medium text-[#292D29] leading-snug line-clamp-2">
                    {news.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5B6057] line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>

                  <p className="pl-3 border-l-2 border-[#C5B99F] text-xs text-[#777B72] line-clamp-2">
                    <strong className="font-medium text-[#5B6057]">Context: </strong>
                    {news.whyItMatters}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#777B72]">
                  <span>{news.source.split(' ')[0]} · Factual brief</span>
                  <Link
                    href="/world-pulse"
                    className="inline-flex items-center gap-1 font-medium text-[#71816B] hover:text-[#292D29] transition-colors"
                  >
                    <span>Read brief</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 6. Quick Challenges (Warm Sand Cognitive Prompts) */}
      <section className="space-y-5">
        <SectionHeader
          icon={<Trophy className="h-4 w-4" />}
          title="Cognitive Challenges"
          subtitle="Active puzzles and riddles to sharpen attention"
          viewAllHref="/challenges"
          viewAllLabel="View all challenges"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homeChallenges.map((challenge) => {
            const isSolved = profile.completedChallengeIds.includes(challenge.id);
            const tone = getChallengeTone(challenge.category);

            return (
              <div
                key={challenge.id}
                className="flex flex-col justify-between p-5 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium border ${tone.badge}`}>
                      {challenge.category}
                    </span>
                    <span className="text-[11px] text-[#777B72] font-mono tabular-nums">
                      {challenge.timeEstimateMinutes}m · {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-medium text-[#292D29] leading-snug">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-[#5B6057] line-clamp-2 leading-relaxed">
                    {challenge.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E0D8] flex items-center justify-between">
                  <span className="text-xs text-[#777B72]">
                    {isSolved ? 'Explored' : 'Interactive prompt'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openChallengeModal(challenge)}
                    className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSolved
                        ? 'bg-[#ECEBE4] text-[#292D29] hover:bg-[#E2E0D8]'
                        : 'bg-[#292D29] text-[#FAF9F5] hover:bg-[#3F453F]'
                    }`}
                  >
                    <span>{isSolved ? 'Review' : 'Solve'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Do Something Offline (Soft Beige Sanctuary Strips) */}
      <section className="space-y-5">
        <SectionHeader
          icon={<Footprints className="h-4 w-4" />}
          title="Do Something Offline"
          subtitle="Quiet physical and sensory resets away from screens"
          viewAllHref="/do-something"
          viewAllLabel="All offline activities"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homeOffline.map((act) => {
            const tone = getOfflineTone(act.category);
            return (
              <div
                key={act.id}
                className="flex flex-col justify-between p-5 rounded-xl bg-[#ECEBE4]/65 border border-[#E2E0D8] space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium border ${tone.badge}`}>
                      {act.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#777B72] font-mono tabular-nums">
                      <Clock className="h-3 w-3" />
                      {act.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-medium text-[#292D29] leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs text-[#5B6057] line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E0D8] flex items-center justify-between">
                  <span className="text-xs text-[#777B72]">
                    {act.steps.length} guided steps
                  </span>
                  <button
                    type="button"
                    onClick={() => openOfflineTimer(act)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-[#71816B] text-[#FAF9F5] hover:bg-[#5E6D59] transition-colors cursor-pointer"
                  >
                    <span>Begin</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Intentional Stopping Point */}
      <StoppingPointBanner onLoadMore={handleLoadMore} hasMore={hasMore} />

      <QuickFiveMinutesModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        initialMode={quickModalMode}
      />
    </div>
  );
}
