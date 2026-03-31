import { GameConfig, BadgeInfo, GameType } from '@/types';

export const GAME_CONFIG: GameConfig = {
  screenTimeLimit: 45 * 60, // 45 minutes
  breakDuration: 10 * 60, // 10 minutes
  pointsPerCorrect: {
    easy: 10,
    medium: 20,
    hard: 30,
  },
  streakBonus: 5,
};

export const GAME_TYPES: { id: GameType; name: string; description: string; icon: string; color: string }[] = [
  {
    id: 'math',
    name: 'Math Magic',
    description: 'Solve fun math problems!',
    icon: '🔢',
    color: 'from-pink-400 to-pink-500',
  },
  {
    id: 'letters',
    name: 'Letter Land',
    description: 'Fill in the missing letters!',
    icon: '🔤',
    color: 'from-blue-400 to-blue-500',
  },
  {
    id: 'image',
    name: 'Picture Puzzle',
    description: 'Guess what the picture is!',
    icon: '🖼️',
    color: 'from-green-400 to-green-500',
  },
  {
    id: 'rhyme',
    name: 'Rhyme Time',
    description: 'Find the rhyming words!',
    icon: '🎵',
    color: 'from-purple-400 to-purple-500',
  },
];

export const DIFFICULTIES: { id: 'easy' | 'medium' | 'hard'; name: string; stars: number; color: string }[] = [
  { id: 'easy', name: 'Easy', stars: 1, color: 'text-green-500' },
  { id: 'medium', name: 'Medium', stars: 2, color: 'text-yellow-500' },
  { id: 'hard', name: 'Hard', stars: 3, color: 'text-red-500' },
];

export const BADGES: BadgeInfo[] = [
  { id: 'first_game', name: 'First Steps', description: 'Play your first game', icon: '🌟', unlocked: false },
  { id: '10_games', name: 'Getting Started', description: 'Play 10 games', icon: '🎮', unlocked: false },
  { id: '50_games', name: 'Dedicated Learner', description: 'Play 50 games', icon: '🏆', unlocked: false },
  { id: '100_games', name: 'Learning Champion', description: 'Play 100 games', icon: '👑', unlocked: false },
  { id: 'score_100', name: 'Score Starter', description: 'Reach 100 points', icon: '💯', unlocked: false },
  { id: 'score_500', name: 'Score Seeker', description: 'Reach 500 points', icon: '🎯', unlocked: false },
  { id: 'score_1000', name: 'Score Master', description: 'Reach 1000 points', icon: '💎', unlocked: false },
  { id: 'streak_5', name: 'Hot Streak', description: 'Get 5 correct in a row', icon: '🔥', unlocked: false },
  { id: 'streak_10', name: 'On Fire', description: 'Get 10 correct in a row', icon: '⚡', unlocked: false },
  { id: 'accuracy_80', name: 'Sharp Shooter', description: 'Achieve 80% accuracy', icon: '🎪', unlocked: false },
  { id: 'accuracy_90', name: 'Perfect Aim', description: 'Achieve 90% accuracy', icon: '🎭', unlocked: false },
  { id: 'accuracy_100', name: 'Flawless', description: 'Achieve 100% accuracy', icon: '✨', unlocked: false },
];

export const AVATARS: string[] = [
  '🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🐵', '🦊', '🦋', '🦄',
  '🐝', '🐞', '🌟', '🌈', '🎈', '🎨', '🎪', '🎭', '🎯', '🎲',
];

export const PARENT_PIN = '1234'; // In production, this should be configurable

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  PROFILE: (userId: string) => `/api/auth/profile/${userId}`,
  STATS: (userId: string) => `/api/auth/stats/${userId}`,

  // Game
  GENERATE_QUESTION: '/api/game/generate',
  START_SESSION: '/api/game/session/start',
  SUBMIT_ANSWER: '/api/game/submit',
  END_SESSION: (sessionId: string) => `/api/game/session/${sessionId}/end`,
  GET_SESSION: (sessionId: string) => `/api/game/session/${sessionId}`,

  // User
  PROGRESS: (userId: string) => `/api/user/progress/${userId}`,
  UPDATE_PROGRESS: '/api/user/progress',
  LEADERBOARD: '/api/user/leaderboard',
  ALL_USERS: '/api/user/all',

  // AI
  GENERATE: '/api/ai/generate',
  QUESTIONS: '/api/ai/questions',
  AI_STATUS: '/api/ai/status',

  // Screen Time
  SCREEN_TIME_STATUS: (userId: string) => `/api/screentime/status/${userId}`,
  START: (userId: string) => `/api/screentime/start/${userId}`,
  BREAK: (sessionId: string) => `/api/screentime/break/${sessionId}`,
  SKIP_BREAK: (sessionId: string) => `/api/screentime/skip-break/${sessionId}`,
  SCREEN_TIME_STATS: (userId: string) => `/api/screentime/stats/${userId}`,
};

// Fun messages for correct/wrong answers
export const CORRECT_MESSAGES = [
  '🎉 Amazing!',
  '⭐ Great job!',
  '🌟 Super!',
  '🎊 Fantastic!',
  '💪 Awesome!',
  '🚀 You got it!',
  '🎈 Brilliant!',
  '✨ Perfect!',
  '🏆 Winner!',
  '🌈 Excellent!',
];

export const ENCOURAGEMENT_MESSAGES = [
  'Keep trying! 💪',
  'You can do it! 🌟',
  'Almost there! 🎯',
  "Don't give up! 🚀",
  'Try again! 🎪',
  'Believe in yourself! ✨',
  'Learning is fun! 📚',
  'You are smart! 🧠',
];
