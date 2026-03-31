// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Question Types
export interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gameType: 'math' | 'letters' | 'image' | 'rhyme';
  imageUrl?: string;
  fullWord?: string;
}

export interface GenerateQuestionRequest {
  gameType: 'math' | 'letters' | 'image' | 'rhyme';
  difficulty?: 'easy' | 'medium' | 'hard';
  userId?: string;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  userAnswer: string;
  responseTime: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  points: number;
  newScore: number;
  streak: number;
}

// AI Service Types
export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export interface ClaudeRequest {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens: number;
}

export interface ClaudeResponse {
  content: { type: string; text: string }[];
}

// User Progress Types
export interface UserStats {
  accuracy: number;
  avgResponseTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  recentPerformance: boolean[]; // last 10 answers
}

export interface DifficultyAdjustment {
  currentDifficulty: 'easy' | 'medium' | 'hard';
  stats: UserStats;
}

// Screen Time Types
export interface ScreenTimeStatus {
  elapsedSeconds: number;
  limitSeconds: number;
  isBreakTime: boolean;
  breakRemainingSeconds: number;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats & { totalGames: number; score: number }) => boolean;
}

// Game Configuration
export interface GameConfig {
  screenTimeLimit: number; // 45 minutes in seconds
  breakDuration: number; // 10 minutes in seconds
  pointsPerCorrect: {
    easy: number;
    medium: number;
    hard: number;
  };
  streakBonus: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  screenTimeLimit: 45 * 60, // 45 minutes
  breakDuration: 10 * 60, // 10 minutes
  pointsPerCorrect: {
    easy: 10,
    medium: 20,
    hard: 30,
  },
  streakBonus: 5,
};
