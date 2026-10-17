/**
 * Test Suite: Personalization and Digital Wellbeing Features in Elsewhere
 *
 * Verifies:
 * 1. Personalization & Onboarding (Interests, Updates, Storage)
 * 2. Recommendation Ranking (Interests, Saves, Likes, Repetition Suppression, Dismissals, Topic Diversity)
 * 3. Session Management & Wall-clock Timer (Limit checking, Pause/Resume, Reload simulation)
 * 4. Session Completion, Reflection & Wellbeing Principles (Worthwhile rating, History logging)
 * 5. Storage Persistence & Data Export
 */

import {
  createInitialSession,
  computeElapsedSeconds,
  pauseSession,
  resumeSession,
  setSessionTarget,
  isSessionLimitReached,
  createSessionRecord
} from '../src/lib/sessionService';
import {
  rankContentItems
} from '../src/lib/recommendation';
import {
  DEFAULT_PROFILE,
  loadUserProfile,
  saveUserProfile,
  loadActiveSession,
  saveActiveSession,
  clearActiveSession,
  exportUserData
} from '../src/lib/storage';
import { ContentItem, UserProfile, ActiveSessionState, WorthwhileRating } from '../src/types';

// Mock localStorage and window for Node.js test environment
const mockStorage: Record<string, string> = {};
(global as unknown as { window: unknown }).window = global;
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: () => null,
};

function runSuite() {
  console.log('🌱 Starting Personalization & Digital Wellbeing Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${msg}`);
      failed++;
    }
  }

  // ==========================================
  // 1. Session Management & Wall-Clock Accuracy
  // ==========================================
  console.log('Section 1: Wall-Clock Timer & Session Limits');

  const baseTime = 1700000000000; // Reference timestamp
  const initialSession = createInitialSession(15, baseTime);

  assert(initialSession.startedAt === baseTime, 'Initial session records exact wall-clock start time');
  assert(initialSession.targetDurationMinutes === 15, 'Initial session target is set to 15 minutes');
  assert(initialSession.accumulatedSeconds === 0, 'Initial session accumulated seconds starts at 0');
  assert(!initialSession.isPaused, 'Initial session starts unpaused');

  // Elapsed time calculation without relying on interval ticks
  const fiveMinLater = baseTime + 5 * 60 * 1000;
  const elapsed5m = computeElapsedSeconds(initialSession, fiveMinLater);
  assert(elapsed5m === 300, `Elapsed time at 5 minutes is exactly 300s (calculated: ${elapsed5m}s)`);
  assert(!isSessionLimitReached(initialSession, fiveMinLater), 'Session limit is not reached at 5m for 15m target');

  // Limit reached check at 15m and beyond
  const fifteenMinLater = baseTime + 15 * 60 * 1000;
  assert(isSessionLimitReached(initialSession, fifteenMinLater), 'Session limit reached at exactly 15 minutes');

  const twentyMinLater = baseTime + 20 * 60 * 1000;
  assert(isSessionLimitReached(initialSession, twentyMinLater), 'Session limit marked reached when exceeding target duration');

  // Pause and resume across tab sleeps / navigation
  const pausedSession = pauseSession(initialSession, fiveMinLater);
  assert(pausedSession.isPaused === true, 'Session successfully enters paused state');
  assert(pausedSession.accumulatedSeconds === 300, 'Paused session snapshots elapsed seconds');

  // While paused, advance time by 10 minutes - elapsed should NOT advance
  const tenMinAfterPause = fiveMinLater + 10 * 60 * 1000;
  const elapsedWhilePaused = computeElapsedSeconds(pausedSession, tenMinAfterPause);
  assert(elapsedWhilePaused === 300, 'Timer does not advance while paused despite real-world time passing');

  // Resume at new timestamp
  const resumeTime = tenMinAfterPause;
  const resumedSession = resumeSession(pausedSession, resumeTime);
  assert(!resumedSession.isPaused, 'Session resumes cleanly');
  assert(resumedSession.startedAt === resumeTime, 'Resumed session updates wall-clock anchor');

  // 2 minutes after resume, total elapsed should be 300s + 120s = 420s
  const twoMinAfterResume = resumeTime + 2 * 60 * 1000;
  const elapsedAfterResume = computeElapsedSeconds(resumedSession, twoMinAfterResume);
  assert(elapsedAfterResume === 420, `Accurate elapsed time after resume: expected 420s, got ${elapsedAfterResume}s`);

  // Changing session target on the fly
  const updatedTarget = setSessionTarget(resumedSession, 20);
  assert(updatedTarget.targetDurationMinutes === 20, 'Session target duration updated to 20 minutes');
  assert(!isSessionLimitReached(updatedTarget, twoMinAfterResume), 'Limit not reached after extending target to 20m');

  // ==========================================
  // 2. Session Completion & Reflection Logging
  // ==========================================
  console.log('\nSection 2: End-of-Session Completion & Reflection');

  const completionTime = baseTime + 16 * 60 * 1000;
  const activeForCompletion: ActiveSessionState = {
    startedAt: baseTime,
    targetDurationMinutes: 15,
    isPaused: false,
    accumulatedSeconds: 0,
    cardsViewed: 4,
    hasShownEndingModal: false
  };

  const reflectionNote = 'Read about James Webb telescope and completed logic riddle. Felt very calm.';
  const record = createSessionRecord(activeForCompletion, 'very', reflectionNote, completionTime);

  assert(record.durationMinutes === 16, `Session record logs accurate duration (16 minutes)`);
  assert(record.targetDurationMinutes === 15, 'Session record preserves target duration (15 minutes)');
  assert(record.cardsViewed === 4, 'Session record logs cards viewed (4)');
  assert(record.worthwhileRating === 'very', 'Session record stores worthwhile rating: "very"');
  assert(record.reflectionNote === reflectionNote, 'Session record stores user reflection note');
  assert(Boolean(record.startedAt && record.endedAt), 'Session record contains ISO start and end timestamps');

  // Check valid rating options
  const ratings: WorthwhileRating[] = ['very', 'somewhat', 'neutral', 'distracted'];
  ratings.forEach((r) => {
    const rec = createSessionRecord(activeForCompletion, r, undefined, completionTime);
    assert(rec.worthwhileRating === r, `Supported reflection rating option: ${r}`);
  });

  // ==========================================
  // 3. Recommendation Ranking & Personalization
  // ==========================================
  console.log('\nSection 3: Recommendation Ranking & Topic Diversity');

  // Sample items across multiple topics
  const sampleItems: ContentItem[] = [
    {
      id: 'item-space-1',
      title: 'Voyager Interstellar Message',
      summary: 'Deep space exploration probe and the Golden Record',
      category: 'curiosity',
      topic: 'space',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['space', 'astronomy', 'voyager']
    },
    {
      id: 'item-space-2',
      title: 'James Webb Deep Field',
      summary: 'First galaxies formed after the Big Bang',
      category: 'curiosity',
      topic: 'space',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['space', 'cosmology']
    },
    {
      id: 'item-space-3',
      title: 'Europa Ocean Discoveries',
      summary: 'Liquid oceans beneath Jovian moon crust',
      category: 'curiosity',
      topic: 'space',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['space', 'astronomy']
    },
    {
      id: 'item-history-1',
      title: 'The Antikythera Mechanism',
      summary: 'Ancient Greek analog computer calculating celestial positions',
      category: 'curiosity',
      topic: 'history',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['history', 'archaeology']
    },
    {
      id: 'item-psych-1',
      title: 'The Default Mode Network',
      summary: 'What happens in your brain when mind-wandering occurs',
      category: 'curiosity',
      topic: 'psychology',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['psychology', 'neuroscience']
    },
    {
      id: 'item-nature-1',
      title: 'Mycelial Underground Networks',
      summary: 'Fungal communications linking old-growth forests',
      category: 'curiosity',
      topic: 'nature',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['nature', 'biology']
    },
    {
      id: 'item-tech-1',
      title: 'How Transistors Scaled Humanity',
      summary: 'From macroscopic vacuum tubes to 2nm gates',
      category: 'curiosity',
      topic: 'technology',
      estimatedMinutes: 5,
      actionType: 'read',
      tags: ['technology', 'physics']
    }
  ];

  // Base profile with 'space' interest
  const testProfile: UserProfile = {
    ...DEFAULT_PROFILE,
    selectedInterests: ['space', 'psychology'],
    savedItemIds: ['item-history-1'], // user saved a history item -> increases history affinity
    likedItemIds: ['item-nature-1'], // user liked a nature item -> increases nature affinity
    dismissedItemIds: ['item-space-3'], // dismissed item -> should be suppressed
    completedActivities: [
      {
        id: 'comp-1',
        activityId: 'item-space-1',
        title: 'Voyager Interstellar Message',
        completedAt: new Date().toISOString(),
        durationMinutes: 5
      }
    ], // completed item -> strong repetition suppression
  };

  const rankedResult = rankContentItems(sampleItems, testProfile, 10);
  const ranked = rankedResult.items;

  // Test explicit interest boost
  const topSpaceUncompleted = ranked.find((i) => i.id === 'item-space-2');
  const dismissedSpace = ranked.find((i) => i.id === 'item-space-3');
  const completedSpace = ranked.find((i) => i.id === 'item-space-1');

  assert(Boolean(topSpaceUncompleted), 'Uncompleted space item exists in ranked results');
  assert(Boolean(completedSpace), 'Completed space item retained in pool but demoted');
  assert(
    dismissedSpace === undefined,
    'Dismissed item is completely removed from recommendation feed'
  );

  // Repetition suppression check:
  // item-space-1 is completed, so it should rank significantly lower than uncompleted item-space-2
  const uncompletedIndex = ranked.findIndex((i) => i.id === 'item-space-2');
  const completedIndex = ranked.findIndex((i) => i.id === 'item-space-1');
  assert(
    uncompletedIndex < completedIndex,
    `Uncompleted item ranks ahead of already-completed item (pos ${uncompletedIndex} vs pos ${completedIndex})`
  );

  // Topic Diversity Interleaving check:
  // Even with multiple space items, the top recommendations should not contain identical consecutive topics
  const topRecommendationsResult = rankContentItems(sampleItems, testProfile, 4);
  const topRecommendations = topRecommendationsResult.items;
  assert(topRecommendations.length === 4, 'Returns requested top count (4)');

  let hasAdjacentDuplicates = false;
  for (let i = 0; i < topRecommendations.length - 1; i++) {
    if (topRecommendations[i].topic === topRecommendations[i + 1].topic) {
      hasAdjacentDuplicates = true;
    }
  }
  assert(!hasAdjacentDuplicates, 'No two consecutive recommendations share the exact same topic (topic diversity)');

  // Diversity of topics represented
  const distinctTopics = new Set(topRecommendations.map((i) => i.topic));
  assert(distinctTopics.size >= 3, `Top 4 recommendations cover at least 3 distinct topics (covered: ${distinctTopics.size})`);

  // ==========================================
  // 4. Persistence & Storage Architecture
  // ==========================================
  console.log('\nSection 4: Persistence Architecture & Data Export');

  delete mockStorage['elsewhere_user_profile_v1'];
  delete mockStorage['elsewhere_active_session_v1'];

  const profileToSave: UserProfile = {
    ...DEFAULT_PROFILE,
    hasCompletedOnboarding: true,
    selectedInterests: ['space', 'philosophy', 'nature'],
    sessionTargetDurationMinutes: 20,
    dailySessionGoalMinutes: 45,
    sessionHistory: [record]
  };

  saveUserProfile(profileToSave);
  const loaded = loadUserProfile();

  assert(loaded.hasCompletedOnboarding === true, 'Profile onboarding state persisted');
  assert(loaded.selectedInterests.includes('philosophy'), 'Selected interests persisted');
  assert(loaded.sessionTargetDurationMinutes === 20, 'Session target duration (20m) persisted');
  assert(loaded.dailySessionGoalMinutes === 45, 'Daily usage goal (45m) persisted');
  assert(loaded.sessionHistory.length === 1, 'Session history persisted');
  assert(loaded.sessionHistory[0].reflectionNote === reflectionNote, 'Session reflection note persisted intact');

  // Active session persistence across page reloads
  saveActiveSession(activeForCompletion);
  const loadedSession = loadActiveSession();
  assert(loadedSession !== null, 'Active session successfully loaded from storage');
  assert(loadedSession?.startedAt === activeForCompletion.startedAt, 'Active session startedAt preserved across reload');
  assert(loadedSession?.cardsViewed === activeForCompletion.cardsViewed, 'Active session cardsViewed preserved across reload');

  clearActiveSession();
  assert(loadActiveSession() === null, 'clearActiveSession cleanly purges storage on session reset');

  // Data Export includes wellbeing settings and reflection history
  const exported = exportUserData(loaded);
  assert(exported.includes('# Elsewhere - Mindful Journal & Personal History'), 'Export data has valid Markdown journal title');
  assert(exported.includes('Daily Intention: 45 minutes'), 'Export data includes daily intention goal');
  assert(exported.includes(reflectionNote), 'Export data includes session reflections history and notes');

  // ==========================================
  // Summary
  // ==========================================
  console.log(`\n========================================`);
  console.log(`🏁 Personalization & Wellbeing Tests: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite();
