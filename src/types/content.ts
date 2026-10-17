import { Topic, ContentDifficulty, NewsCategory } from './index';

export type { NewsCategory, Topic, ContentDifficulty };

/**
 * Educational discovery quiz model for active comprehension
 */
export interface DiscoveryQuiz {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
}

/**
 * Editorial educational discovery content structure
 */
export interface CuriosityDiscovery {
  id: string;
  title: string;
  subtitle: string;
  topic: Topic;
  summary: string;
  readTimeMinutes: number;
  source: {
    name: string;
    url?: string;
    citation?: string;
  };
  bodyContent: string[]; // Clean paragraph blocks
  takeaways: string[];
  tags: string[];
  difficulty: ContentDifficulty;
  publishedDate: string;
  quiz?: DiscoveryQuiz; // Optional interactive comprehension quiz
  editorialAnalysis?: string; // Clearly distinguished editorial context
  recommendedReason?: string;
}

/**
 * Verified news article model for World Pulse
 */
export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  whyItMatters: string | null; // Clearly separated as contextual/editorial analysis
  publisher: {
    name: string;
    url?: string;
  };
  sourceUrl: string; // Preserved original article URL
  publishedAt: string; // Exact ISO or formatted date
  category: NewsCategory;
  readTimeMinutes: number;
  provenance: 'api_live' | 'curated_benchmark' | 'cached';
  isLive: boolean;
  thumbnailUrl?: string;
}

/**
 * API response structure for World Pulse news
 */
export interface NewsApiResponse {
  success: boolean;
  items: NewsArticle[];
  source: 'live' | 'curated_fallback';
  cachedAt?: string;
  error?: string;
  totalCount: number;
}
