export type Topic =
  | 'Science'
  | 'Technology & AI'
  | 'Psychology'
  | 'History'
  | 'World Affairs'
  | 'Business & Economics'
  | 'Nature & Space'
  | 'Philosophy'
  | 'Arts & Culture'
  | 'Programming'
  | 'General Knowledge';

export type ContentDifficulty = 'Bite-sized' | 'Deep Dive' | 'Mind Bender';

export interface DiscoveryQuiz {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  subtitle: string;
  topic: Topic;
  readTimeMinutes: number;
  summary: string;
  content: string[]; // array of paragraphs for clean reading
  takeaways: string[];
  sourceName?: string;
  sourceUrl?: string;
  publishedDate: string;
  tags: string[];
  difficulty: ContentDifficulty;
  recommendedReason?: string;
  quiz?: DiscoveryQuiz; // Optional comprehension quiz
  editorialAnalysis?: string; // Clearly distinguished editorial context
}

export type ChallengeType =
  | 'quiz'
  | 'logic'
  | 'code'
  | 'riddle'
  | 'general'
  | 'memory'
  | 'word';
export type ChallengeDifficulty = 'Quick' | 'Medium' | 'Deep';

export interface ChallengeItem {
  id: string;
  title: string;
  category: ChallengeType;
  topic: Topic;
  instructions?: string;
  prompt: string;
  question: string;
  codeSnippet?: string;
  visualPattern?: string[];
  options: string[];
  correctOptionIndex: number;
  hint: string;
  explanation: string;
  difficulty: ChallengeDifficulty;
  timeEstimateMinutes: number;
}

export type NewsCategory =
  | 'Geopolitics'
  | 'Science & Space'
  | 'Economy & Tech'
  | 'Climate & Nature'
  | 'Global Society';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  whyItMatters: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: NewsCategory;
  verified: boolean;
}

export type OfflineCategory = 'Mind' | 'Body' | 'Social' | 'Create' | 'Unplug';

export interface OfflineActivity {
  id: string;
  title: string;
  category: OfflineCategory;
  durationMinutes: number;
  description: string;
  steps: string[];
  reflectionPrompt: string;
  benefit: string;
}

export type ActivityType = 'curiosity' | 'challenge' | 'offline' | 'find-something' | 'session';
export type WorthwhileRating = 'very' | 'somewhat' | 'neutral' | 'distracted';

export interface ActivityCompletion {
  id: string;
  activityId: string;
  title: string;
  category?: ActivityType;
  completedAt: string;
  durationMinutes: number;
  notes?: string;
  worthwhileRating?: WorthwhileRating;
}

export interface SessionRecord {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  targetDurationMinutes: number;
  cardsViewed: number;
  worthwhileRating?: WorthwhileRating;
  reflectionNote?: string;
}

export interface ActiveSessionState {
  startedAt: number; // Wall-clock timestamp (Date.now())
  targetDurationMinutes: number;
  isPaused: boolean;
  pausedAt?: number;
  accumulatedSeconds: number;
  cardsViewed: number;
  hasShownEndingModal?: boolean;
}

export interface UserProfile {
  name: string;
  hasCompletedOnboarding: boolean;
  sessionTargetDurationMinutes: number;
  selectedInterests: Topic[];
  dailySessionGoalMinutes: number;
  likedItemIds: string[];
  savedItemIds: string[];
  dismissedItemIds: string[];
  completedChallengeIds: string[];
  completedChallengeScores: Record<string, { selected: number; correct: boolean }>;
  completedActivities: ActivityCompletion[];
  sessionHistory: SessionRecord[];
  totalMindfulMinutes: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export interface RecommendationScore {
  itemId: string;
  score: number;
  reason: string;
}

export * from './findSomething';
export * from './content';
export * from './challenge';
