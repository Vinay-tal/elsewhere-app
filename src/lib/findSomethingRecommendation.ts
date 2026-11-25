import {
  AvailableDuration,
  FindSomethingMood,
  FindSomethingActivity,
  RecommendationParams,
  RecommendationResult,
} from '../types/findSomething';
import { FIND_SOMETHING_ACTIVITIES } from './findSomethingData';

/**
 * Mood display metadata for UI styling and label presentation
 */
export const MOOD_DEFINITIONS: Record<
  FindSomethingMood,
  { label: string; tag: string; description: string; icon: string; accentColor: string }
> = {
  curious: {
    label: 'Curious',
    tag: 'DEEP CURIOSITY',
    description: 'Learn something mind-expanding about science, nature, or human psychology.',
    icon: '💡',
    accentColor: '#71816B',
  },
  entertained: {
    label: 'Entertained',
    tag: 'WIT & PARADOXES',
    description: 'Engaging, witty thought experiments, quirky history, and fascinating trivia.',
    icon: '✨',
    accentColor: '#8C7A56',
  },
  mentally_challenged: {
    label: 'Mentally Challenged',
    tag: 'LOGIC & PUZZLES',
    description: 'Active problem-solving, brain teasers, and inductive reasoning challenges.',
    icon: '🧩',
    accentColor: '#647678',
  },
  informed: {
    label: 'Informed',
    tag: 'SOBER NEWS',
    description: 'Clear, non-sensational systemic reporting on global affairs and technologies.',
    icon: '🌍',
    accentColor: '#A67F68',
  },
  offline: {
    label: 'Ready to Do Something Offline',
    tag: 'OFFLINE RESET',
    description: 'Real-world guided breathwork, posture decompression, or analog reflection.',
    icon: '🌿',
    accentColor: '#5E6D59',
  },
};

/**
 * Duration display metadata
 */
export const DURATION_OPTIONS: { duration: AvailableDuration; label: string; badge: string }[] = [
  { duration: 2, label: '2 Minutes', badge: 'Micro-Reset' },
  { duration: 5, label: '5 Minutes', badge: 'Quick Break' },
  { duration: 10, label: '10 Minutes', badge: 'Intentional Pause' },
  { duration: 20, label: '20 Minutes', badge: 'Deep Refresh' },
];

/**
 * Generate human-readable, transparent reasoning for why an activity was selected
 */
export function generateRecommendationReason(
  activity: FindSomethingActivity,
  duration: AvailableDuration,
  mood: FindSomethingMood,
  hasInterestMatch: boolean
): string {
  if (activity.whySelectedTemplate) {
    return activity.whySelectedTemplate;
  }

  const moodMeta = MOOD_DEFINITIONS[mood];
  const moodName = moodMeta.label;

  if (mood === 'offline') {
    return `Selected for an intentional ${duration}-minute offline reset to decompress your nervous system and pull you away from screen glare.`;
  }

  if (mood === 'mentally_challenged') {
    return `Chosen to deliver a crisp ${duration}-minute cognitive challenge and give your brain a genuine focus workout.`;
  }

  if (hasInterestMatch) {
    return `Curated for your ${duration}-minute break in ${moodName} mode. Matches your interest in ${activity.topic} with a ${activity.qualityRating}/10 rating.`;
  }

  return `Handpicked ${duration}-minute exploration in ${activity.topic} to expand your mental horizons while feeling ${moodName.toLowerCase()}.`;
}

/**
 * Core modular recommendation function for "Find Something for Me".
 * Pure function with no React hooks—usable in server, client, or test scripts.
 */
export function recommendActivity(params: RecommendationParams): RecommendationResult {
  const {
    duration,
    mood,
    selectedInterests = [],
    likedItemIds = [],
    savedItemIds = [],
    dismissedItemIds = [],
    completedActivityIds = [],
    recentlyViewedIds = [],
    lastRecommendedTopic,
  } = params;

  const dataset = FIND_SOMETHING_ACTIVITIES;

  // Filter out permanently dismissed items
  const dismissedSet = new Set(dismissedItemIds);
  const eligibleItems = dataset.filter((item) => !dismissedSet.has(item.id));

  // If all items were dismissed, fall back to entire dataset
  const pool = eligibleItems.length > 0 ? eligibleItems : dataset;

  const scoredList = pool.map((item) => {
    let score = 50; // base score

    // 1. Duration fit (critical constraint)
    if (item.durationMinutes === duration) {
      score += 60; // exact match
    } else if (item.durationMinutes < duration) {
      // Shorter activities fit comfortably within available time
      score += 35 - (duration - item.durationMinutes) * 1.5;
    } else {
      // Over available duration: heavy penalty to respect user's time limit
      score -= 150;
    }

    // 2. Mood alignment
    const isDirectMoodMatch = item.moods.includes(mood);
    if (isDirectMoodMatch) {
      score += 55;
    } else {
      score -= 85;
    }

    // 3. User-selected interests match
    const isInterestMatch = selectedInterests.includes(item.topic);
    if (isInterestMatch) {
      score += 30;
    }

    // 4. Saved items affinity
    if (savedItemIds.includes(item.id)) {
      score += 20;
    }

    // 5. Liked items affinity
    if (likedItemIds.includes(item.id)) {
      score += 15;
    }

    // 6. Content quality rating boost
    score += item.qualityRating * 3;

    // 7. Repetition prevention
    if (completedActivityIds.includes(item.id)) {
      score -= 75; // prioritize uncompleted activities
    }
    if (recentlyViewedIds.includes(item.id)) {
      score -= 80; // avoid immediate consecutive repeats
    }

    // 8. Topic diversity penalty if same as last served
    if (lastRecommendedTopic && item.topic === lastRecommendedTopic) {
      score -= 20;
    }

    const hasInterest = isInterestMatch || likedItemIds.includes(item.id) || savedItemIds.includes(item.id);
    const reason = generateRecommendationReason(item, duration, mood, hasInterest);

    return {
      activity: item,
      score,
      reason,
      hasInterestMatch: isInterestMatch,
    };
  });

  // Sort candidates by score descending
  scoredList.sort((a, b) => b.score - a.score);

  // Pick top candidate
  const topCandidate = scoredList[0] || {
    activity: dataset[0],
    score: 50,
    reason: `Featured discovery in ${dataset[0].topic}.`,
  };

  const allEligible = scoredList
    .filter((entry) => entry.activity.durationMinutes <= duration || scoredList.length <= 1)
    .map((e) => e.activity);

  return {
    activity: topCandidate.activity,
    score: topCandidate.score,
    reason: topCandidate.reason,
    duration,
    mood,
    alternativesCount: Math.max(allEligible.length - 1, 0),
    allEligibleCandidates: allEligible.length > 0 ? allEligible : pool,
  };
}
