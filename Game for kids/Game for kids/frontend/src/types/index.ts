// User Types
export interface User {
  _id: string;
  userId?: string;
  username: string;
  age: number;
  score: number;
  level: number;
  accuracy: number;
  totalGamesPlayed: number;
  streak: number;
  badges: string[];
  lastActive?: string;
}

export interface UserProgress {
  math: SubjectProgress;
  letters: SubjectProgress;
  image: SubjectProgress;
  rhyme: SubjectProgress;
}

export interface SubjectProgress {
  easy: { correct: number; total: number };
  medium: { correct: number; total: number };
  hard: { correct: number; total: number };
}

// Game Types
export type GameType = 'math' | 'letters' | 'image' | 'rhyme';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  gameType: GameType;
  imageUrl?: string;
  fullWord?: string; // For letters game
}

export interface GameSession {
  sessionId: string;
  gameType: GameType;
  difficulty: Difficulty;
  score: number;
  questions: QuestionRecord[];
  startTime: string;
  endTime?: string;
  totalTime: number;
  isActive: boolean;
}

export interface QuestionRecord {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTime: number;
  difficulty: Difficulty;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubmitAnswerPayload {
  sessionId: string;
  question: {
    question: string;
    correctAnswer: string;
  };
  userAnswer: string;
  responseTime: number;
  difficulty: Difficulty;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  points: number;
  newScore: number;
  streak: number;
}

// Screen Time Types
export interface ScreenTimeStatus {
  shouldBreak: boolean;
  elapsedSeconds: number;
  remainingSeconds: number;
  isOnBreak: boolean;
  breakRemainingSeconds: number;
}

// Badge Types
export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// Game Config
export interface GameConfig {
  screenTimeLimit: number; // seconds
  breakDuration: number; // seconds
  pointsPerCorrect: {
    easy: number;
    medium: number;
    hard: number;
  };
  streakBonus: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: number;
  totalGamesPlayed: number;
  accuracy: number;
}

// Context State Types
export interface GameState {
  isPlaying: boolean;
  currentQuestion: Question | null;
  sessionId: string | null;
  score: number;
  streak: number;
  questionNumber: number;
  isAnswering: boolean;
}

export interface ScreenTimeState {
  elapsedSeconds: number;
  remainingSeconds: number;
  isOnBreak: boolean;
  breakRemainingSeconds: number;
  shouldShowBreakModal: boolean;
}
