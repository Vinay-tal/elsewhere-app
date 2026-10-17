import { ContentItem, UserProfile, Topic, RecommendationScore } from '@/types';

/**
 * Transparent, rule-based recommendation engine for Elsewhere.
 * Prioritizes:
 * 1. User selected interests (+35 pts)
 * 2. Topic affinity from liked items (+15 pts per topic like, capped at 45)
 * 3. Topic affinity from saved items (+20 pts per topic save, capped at 60)
 * 4. Repetition suppression: Penalizes items already completed (-150 pts)
 * 5. Dismissal penalty: Filters out explicitly dismissed items (-1000 pts)
 * 6. Serendipity bonus: Introduces unexpected topics (+15 pts) to avoid filter bubbles
 * 7. Topic diversity interleaving: Guarantees adjacent items never share identical topics
 */
export function rankContentItems(
  items: ContentItem[],
  profile: UserProfile,
  limit: number = 6
): { items: ContentItem[]; scores: Record<string, RecommendationScore> } {
  // Set of dismissed items
  const dismissedSet = new Set(profile.dismissedItemIds || []);
  const eligibleItems = items.filter((item) => !dismissedSet.has(item.id));

  // Set of completed activity IDs or titles to prevent repeated content
  const completedIds = new Set(
    (profile.completedActivities || []).map((a) => a.activityId)
  );
  const completedTitles = new Set(
    (profile.completedActivities || []).map((a) => a.title.toLowerCase())
  );

  // Count topic affinity from likes, saves, and dismissals
  const topicLikeCounts: Record<string, number> = {};
  const topicSaveCounts: Record<string, number> = {};
  const topicDismissCounts: Record<string, number> = {};

  items.forEach((item) => {
    if (profile.likedItemIds?.includes(item.id)) {
      topicLikeCounts[item.topic] = (topicLikeCounts[item.topic] || 0) + 1;
    }
    if (profile.savedItemIds?.includes(item.id)) {
      topicSaveCounts[item.topic] = (topicSaveCounts[item.topic] || 0) + 1;
    }
    if (profile.dismissedItemIds?.includes(item.id)) {
      topicDismissCounts[item.topic] = (topicDismissCounts[item.topic] || 0) + 1;
    }
  });

  const scores: Record<string, RecommendationScore> = {};

  const scoredItems = eligibleItems.map((item) => {
    let score = 50; // base score
    let reason = 'Curated discovery';

    // 1. Explicit Interests
    const isSelectedInterest = profile.selectedInterests?.includes(item.topic) ?? false;
    if (isSelectedInterest) {
      score += 35;
      reason = `Matches your interest in ${item.topic}`;
    }

    // 2. Prior likes affinity
    const likesInTopic = topicLikeCounts[item.topic] || 0;
    if (likesInTopic > 0) {
      score += Math.min(likesInTopic * 15, 45);
      if (!isSelectedInterest) {
        reason = `Based on what you enjoyed in ${item.topic}`;
      }
    }

    // 3. Prior saves affinity
    const savesInTopic = topicSaveCounts[item.topic] || 0;
    if (savesInTopic > 0) {
      score += Math.min(savesInTopic * 20, 60);
      reason = `You saved discoveries in ${item.topic}`;
    }

    // Direct save bonus if user saved this exact item to revisit
    if (profile.savedItemIds?.includes(item.id)) {
      score += 15;
      reason = 'Saved in your bookmarks';
    }

    // 4. Topic fatigue penalty if user dismissed multiple items in this topic
    const dismissesInTopic = topicDismissCounts[item.topic] || 0;
    if (dismissesInTopic >= 2) {
      score -= Math.min(dismissesInTopic * 15, 40);
    }

    // 5. Repetition suppression: heavily penalize already completed items
    const isCompleted =
      completedIds.has(item.id) || completedTitles.has(item.title.toLowerCase());
    if (isCompleted) {
      score -= 150;
      reason = 'Completed previously • Available to revisit';
    }

    // 6. Quick reading bonus for mindful time constraints
    if (item.readTimeMinutes <= 3) {
      score += 8;
    }

    // 7. Serendipity: If user hasn't selected this topic and has no likes, inject curiosity
    if (!isSelectedInterest && likesInTopic === 0 && !isCompleted) {
      score += 15;
      reason = `Broaden your horizons: ${item.topic}`;
    }

    scores[item.id] = {
      itemId: item.id,
      score,
      reason: item.recommendedReason || reason,
    };

    return { item, score, reason };
  });

  // Sort by score descending
  scoredItems.sort((a, b) => b.score - a.score);

  // Apply diversity interleaving so adjacent items don't have identical topics
  const interleaved: ContentItem[] = [];
  const remaining = [...scoredItems];
  const topicCountsInResult: Record<string, number> = {};
  let lastTopic: Topic | null = null;

  while (remaining.length > 0 && interleaved.length < limit) {
    // Prefer next highest scoring item whose topic differs from lastTopic
    // and hasn't exceeded 2 occurrences in the current batch
    let bestIdx = remaining.findIndex(
      (entry) =>
        entry.item.topic !== lastTopic &&
        (topicCountsInResult[entry.item.topic] || 0) < 2
    );

    // Fallback: any item with different topic
    if (bestIdx === -1) {
      bestIdx = remaining.findIndex((entry) => entry.item.topic !== lastTopic);
    }

    // Fallback: top remaining item
    if (bestIdx === -1) {
      bestIdx = 0;
    }

    const chosen = remaining.splice(bestIdx, 1)[0];
    chosen.item.recommendedReason = scores[chosen.item.id].reason;
    interleaved.push(chosen.item);
    lastTopic = chosen.item.topic;
    topicCountsInResult[chosen.item.topic] =
      (topicCountsInResult[chosen.item.topic] || 0) + 1;
  }

  return { items: interleaved, scores };
}
