import { Topic } from './index';

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
  instructions: string; // Clear step-by-step instructions
  prompt: string; // The scenario or context setup
  question: string; // The specific question or query to solve
  codeSnippet?: string; // Optional code block for programming challenges
  visualPattern?: string[]; // Optional ascii or visual token pattern for memory/observation
  options: string[]; // Selectable answers
  correctOptionIndex: number;
  hint: string;
  explanation: string; // Detailed post-answer educational explanation
  difficulty: ChallengeDifficulty;
  timeEstimateMinutes: number;
}

export interface ChallengeValidationResult {
  isCorrect: boolean;
  selectedOption: string;
  correctOption: string;
  explanation: string;
}

export interface ChallengeMetrics {
  totalCount: number;
  completedCount: number;
  correctCount: number;
  accuracyPercentage: number;
  completionPercentage: number;
}
