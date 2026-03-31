import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import UserProgress from '../models/UserProgress';
import GameSession from '../models/GameSession';
import { ApiResponse } from '../types';

/**
 * Get user progress across all game types
 */
export async function getProgress(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?._id?.toString() || req.params.userId;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID required',
      } as ApiResponse);
      return;
    }

    const [user, progress, sessionStats] = await Promise.all([
      User.findById(userId).select('username score level accuracy totalGamesPlayed streak badges'),
      UserProgress.findOne({ userId }),
      getRecentSessionStats(userId),
    ]);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          username: user.username,
          score: user.score,
          level: user.level,
          accuracy: user.accuracy,
          totalGamesPlayed: user.totalGamesPlayed,
          streak: user.streak,
          badges: user.badges,
        },
        progress: progress || {
          math: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } },
          letters: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } },
          image: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } },
          rhyme: { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } },
        },
        recentStats: sessionStats,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get progress',
    } as ApiResponse);
  }
}

/**
 * Update user progress (bulk update from frontend)
 */
export async function updateProgress(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?._id?.toString();
    const { gameType, difficulty, isCorrect } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      } as ApiResponse);
      return;
    }

    if (!gameType || !['math', 'letters', 'image', 'rhyme'].includes(gameType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid game type',
      } as ApiResponse);
      return;
    }

    // Get or create progress
    let progress = await UserProgress.findOne({ userId });

    if (!progress) {
      progress = await UserProgress.create({ userId });
    }

    const subject = gameType as keyof typeof progress;
    const difficultyLevel = (difficulty || 'easy') as keyof typeof progress.math;

    if (progress[subject] && progress[subject][difficultyLevel]) {
      progress[subject][difficultyLevel].total += 1;
      if (isCorrect) {
        progress[subject][difficultyLevel].correct += 1;
      }
    }

    await progress.save();

    res.status(200).json({
      success: true,
      data: progress,
      message: 'Progress updated!',
    } as ApiResponse);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress',
    } as ApiResponse);
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const leaderboard = await User.find()
      .select('username score level totalGamesPlayed accuracy')
      .sort({ score: -1, accuracy: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: leaderboard.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.score,
        level: user.level,
        totalGamesPlayed: user.totalGamesPlayed,
        accuracy: user.accuracy,
      })),
    } as ApiResponse);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get leaderboard',
    } as ApiResponse);
  }
}

/**
 * Get recent session stats
 */
async function getRecentSessionStats(userId: string): Promise<{
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalPlayTime: number;
}> {
  const recentSessions = await GameSession.find({ userId })
    .sort({ startTime: -1 })
    .limit(10);

  if (recentSessions.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      bestScore: 0,
      totalPlayTime: 0,
    };
  }

  const totalScore = recentSessions.reduce((sum, s) => sum + s.score, 0);
  const bestScore = Math.max(...recentSessions.map((s) => s.score));
  const totalPlayTime = recentSessions.reduce((sum, s) => sum + (s.totalTime || 0), 0);

  return {
    totalSessions: recentSessions.length,
    averageScore: Math.round(totalScore / recentSessions.length),
    bestScore,
    totalPlayTime,
  };
}

/**
 * Get all users (for parent dashboard)
 */
export async function getAllUsers(
  _req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const users = await User.find()
      .select('username age score level totalGamesPlayed lastActive')
      .sort({ lastActive: -1 });

    res.status(200).json({
      success: true,
      data: users.map((user) => ({
        _id: user._id,
        username: user.username,
        age: user.age,
        score: user.score,
        level: user.level,
        totalGamesPlayed: user.totalGamesPlayed,
        lastActive: user.lastActive,
      })),
    } as ApiResponse);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
    } as ApiResponse);
  }
}
