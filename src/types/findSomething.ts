import { Topic, ContentItem, ChallengeItem, NewsItem, OfflineActivity } from './index';

export type AvailableDuration = 2 | 5 | 10 | 20;

export type FindSomethingMood =
  | 'curious'
  | 'entertained'
  | 'mentally_challenged'
  | 'informed'
  | 'offline';

export type ActivityCategory = 'curiosity' | 'entertainment' | 'challenge' | 'news' | 'offline';

export interface FindSomethingActivity {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: AvailableDuration;
  moods: FindSomethingMood[];
  topic: Topic;
  category: ActivityCategory;
  qualityRating: number; // 1.0 - 10.0 scale
  description: string;
  whySelectedTemplate?: string;
  
  // Specific payload types
  contentItem?: ContentItem;
  challengeItem?: ChallengeItem;
  newsItem?: NewsItem;
  offlineActivity?: OfflineActivity;
  
  // Rich interactive payload for experiences
  interactivePayload: {
    paragraphs?: string[];
    takeaways?: string[];
    steps?: string[];
    prompt?: string;
    question?: string;
    options?: string[];
    correctOptionIndex?: number;
    explanation?: string;
    hint?: string;
    codeSnippet?: string;
    sourceName?: string;
    sourceUrl?: string;
    reflectionPrompt?: string;
    benefit?: string;
  };
}

export interface RecommendationParams {
  duration: AvailableDuration;
  mood: FindSomethingMood;
  selectedInterests?: Topic[];
  likedItemIds?: string[];
  savedItemIds?: string[];
  dismissedItemIds?: string[];
  completedActivityIds?: string[];
  recentlyViewedIds?: string[];
  lastRecommendedTopic?: Topic;
}

export interface RecommendationResult {
  activity: FindSomethingActivity;
  score: number;
  reason: string;
  duration: AvailableDuration;
  mood: FindSomethingMood;
  alternativesCount: number;
  allEligibleCandidates?: FindSomethingActivity[];
}

export type FindSomethingStep =
  | 'time_selection'
  | 'mood_selection'
  | 'recommendation_ready'
  | 'active_experience'
  | 'completion';
