import axios from 'axios';
import { ApiResponse, Question, SubmitAnswerPayload, SubmitAnswerResponse, User, UserProgress, ScreenTimeStatus, LeaderboardEntry } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user ID header if available
api.interceptors.request.use((config) => {
  let userId = localStorage.getItem('userId');
  if (userId) {
    // Remove extra quotes if present
    userId = userId.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '').trim();
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle break time
    if (error.response?.status === 423) {
      window.dispatchEvent(new CustomEvent('break-time'));
    }
    
    // Log all errors for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      console.warn('Unauthorized - user may not be authenticated');
    } else if (error.response?.status === 403) {
      console.error('Forbidden - access denied');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend - is the server running?');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Backend host not found - check API URL configuration');
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export async function login(username: string, age: number): Promise<User & { isNewUser?: boolean }> {
  const response = await api.post<ApiResponse<User & { isNewUser?: boolean }>>('/api/auth/login', {
    username,
    age,
  });
  return response.data.data!;
}

export async function getUserProfile(userId: string): Promise<User> {
  const response = await api.get<ApiResponse<User>>(`/api/auth/profile/${userId}`);
  return response.data.data!;
}

export async function updateUserStats(
  userId: string,
  scoreEarned: number,
  isCorrect: boolean,
  gameType: string
): Promise<{ score: number; level: number; accuracy: number; streak: number; badges: string[]; newBadges: string[] }> {
  const response = await api.post<ApiResponse<{
    score: number;
    level: number;
    accuracy: number;
    streak: number;
    badges: string[];
    newBadges: string[];
  }>>(`/api/auth/stats/${userId}`, { scoreEarned, isCorrect, gameType });
  return response.data.data!;
}

// Game APIs
export async function generateQuestion(
  gameType: string,
  difficulty?: string
): Promise<Question> {
  const params = new URLSearchParams({ gameType });
  if (difficulty) {
    params.append('difficulty', difficulty);
  }

  const response = await api.get<ApiResponse<Question>>(`/api/game/generate?${params}`);
  return response.data.data!;
}

export async function startGameSession(
  gameType: string,
  difficulty: string
): Promise<{ sessionId: string; gameType: string; difficulty: string; startTime: string }> {
  const response = await api.post<ApiResponse<{
    sessionId: string;
    gameType: string;
    difficulty: string;
    startTime: string;
  }>>('/api/game/session/start', { gameType, difficulty });
  return response.data.data!;
}

export async function submitAnswer(payload: SubmitAnswerPayload): Promise<SubmitAnswerResponse> {
  const response = await api.post<ApiResponse<SubmitAnswerResponse>>('/api/game/submit', payload);
  return response.data.data!;
}

export async function endGameSession(sessionId: string): Promise<{
  sessionId: string;
  totalTime: number;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
}> {
  const response = await api.post<ApiResponse<{
    sessionId: string;
    totalTime: number;
    score: number;
    questionsAnswered: number;
    correctAnswers: number;
  }>>(`/api/game/session/${sessionId}/end`);
  return response.data.data!;
}

export async function getSession(sessionId: string): Promise<{
  sessionId: string;
  gameType: string;
  difficulty: string;
  score: number;
  questions: any[];
  startTime: string;
  endTime?: string;
  totalTime: number;
  isActive: boolean;
}> {
  const response = await api.get<ApiResponse<any>>(`/api/game/session/${sessionId}`);
  return response.data.data!;
}

// User Progress APIs
export async function getUserProgress(userId: string): Promise<{
  user: User;
  progress: UserProgress;
  recentStats: {
    totalSessions: number;
    averageScore: number;
    bestScore: number;
    totalPlayTime: number;
  };
}> {
  const response = await api.get<ApiResponse<{
    user: User;
    progress: UserProgress;
    recentStats: {
      totalSessions: number;
      averageScore: number;
      bestScore: number;
      totalPlayTime: number;
    };
  }>>(`/api/user/progress/${userId}`);
  return response.data.data!;
}

export async function updateUserProgress(
  gameType: string,
  difficulty: string,
  isCorrect: boolean
): Promise<void> {
  await api.post('/api/user/progress', { gameType, difficulty, isCorrect });
}

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  const response = await api.get<ApiResponse<LeaderboardEntry[]>>(`/api/user/leaderboard?limit=${limit}`);
  return response.data.data!;
}

export async function getAllUsers(): Promise<{
  _id: string;
  username: string;
  age: number;
  score: number;
  level: number;
  totalGamesPlayed: number;
  lastActive: string;
}[]> {
  const response = await api.get<ApiResponse<any[]>>('/api/user/all');
  return response.data.data!;
}

// Screen Time APIs
export async function getScreenTimeStatus(userId: string): Promise<ScreenTimeStatus> {
  const response = await api.get<ApiResponse<ScreenTimeStatus>>(`/api/screentime/status/${userId}`);
  return response.data.data!;
}

export async function startScreenTimeSession(userId: string): Promise<{ sessionId: string; startTime: string }> {
  const response = await api.post<ApiResponse<{ sessionId: string; startTime: string }>>(
    `/api/screentime/start/${userId}`
  );
  return response.data.data!;
}

export async function startBreak(sessionId: string): Promise<{ breakEndsAt: string; duration: number }> {
  const response = await api.post<ApiResponse<{ breakEndsAt: string; duration: number }>>(
    `/api/screentime/break/${sessionId}`
  );
  return response.data.data!;
}

export async function skipBreak(sessionId: string, pin: string): Promise<void> {
  await api.post(`/api/screentime/skip-break/${sessionId}`, { pin });
}

export async function getScreenTimeStats(userId: string): Promise<{
  todaySeconds: number;
  sessionsToday: number;
  averageSessionSeconds: number;
  limit: number;
}> {
  const response = await api.get<ApiResponse<{
    todaySeconds: number;
    sessionsToday: number;
    averageSessionSeconds: number;
    limit: number;
  }>>(`/api/screentime/stats/${userId}`);
  return response.data.data!;
}

// AI APIs
export async function generateAIContent(prompt: string, type: string = 'text'): Promise<{ response: string; source: string }> {
  const response = await api.post<ApiResponse<{ response: string; source: string }>>('/api/ai/generate', {
    prompt,
    type,
  });
  return response.data.data!;
}

export async function generateQuestions(
  gameType: string,
  difficulty: string,
  count: number = 5
): Promise<{ questions: Question[]; count: number; gameType: string; difficulty: string }> {
  const response = await api.post<ApiResponse<any>>('/api/ai/questions', {
    gameType,
    difficulty,
    count,
  });
  return response.data.data!;
}

export async function checkAIStatus(): Promise<{
  ollama: { available: boolean; baseUrl: string; model: string };
  claude: { configured: boolean; model: string };
  primary: string;
}> {
  const response = await api.get<ApiResponse<any>>('/api/ai/status');
  return response.data.data!;
}

export default api;

