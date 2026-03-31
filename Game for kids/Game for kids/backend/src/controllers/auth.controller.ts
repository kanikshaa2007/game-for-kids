import { Request, Response } from 'express';
import User from '../models/User';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth.middleware';

import { mockDb } from '../config/mock-db';

/**
 * Login or create user with just username
 * Simple authentication for kids - no passwords needed
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, age } = req.body;

    if (!username || username.trim().length < 2) {
      res.status(400).json({
        success: false,
        error: 'Username must be at least 2 characters',
      } as ApiResponse);
      return;
    }

    if (!age || age < 4 || age > 12) {
      res.status(400).json({
        success: false,
        error: 'Age must be between 4 and 12',
      } as ApiResponse);
      return;
    }

    let user: any = null;
    let isNewUser = false;

    try {
      // Try MongoDB first
      user = await User.findOne({ username: username.trim() });

      if (user) {
        if (age && user.age !== age) {
          user.age = age;
          await user.save();
        }
      } else {
        user = await User.create({
          username: username.trim(),
          age,
          score: 0,
          level: 1,
          accuracy: 0,
          totalGamesPlayed: 0,
          streak: 0,
          badges: [],
        });
        isNewUser = true;
      }
    } catch (dbError) {
      // Fall back to mock database
      console.warn('?? Using mock database:', dbError);
      user = mockDb.findUserByUsername(username.trim());
      
      if (user) {
        if (age && user.age !== age) {
          mockDb.updateUser(user._id, { age });
          user.age = age;
        }
      } else {
        user = mockDb.createUser(username.trim(), age);
        isNewUser = true;
      }
    }

    const statusCode = isNewUser ? 201 : 200;
    res.status(statusCode).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        age: user.age,
        score: user.score,
        level: user.level,
        badges: user.badges || [],
        isNewUser,
      },
      message: isNewUser ? 'Welcome to the learning adventure! (Demo Mode - Data not saved)' : 'Welcome back!',
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    } as ApiResponse);
  }
}

/**
 * Get user profile
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-__v');

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
        _id: user._id,
        username: user.username,
        age: user.age,
        score: user.score,
        level: user.level,
        accuracy: user.accuracy,
        totalGamesPlayed: user.totalGamesPlayed,
        streak: user.streak,
        badges: user.badges,
        lastActive: user.lastActive,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
    } as ApiResponse);
  }
}

/**
 * Update user stats after game
 */
export async function updateStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const { scoreEarned, isCorrect } = req.body;

    // SECURITY FIX: Verify user can only update their own stats
    if (!req.user || req.user._id.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: 'You can only update your own stats'
      } as ApiResponse);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      } as ApiResponse);
      return;
    }

    // Update score
    if (scoreEarned) {
      user.score += scoreEarned;
    }

    // Update games played
    user.totalGamesPlayed += 1;

    // Update accuracy
    const totalAnswers = user.totalGamesPlayed;
    const correctAnswers = isCorrect
      ? Math.ceil((user.accuracy / 100) * (totalAnswers - 1)) + 1
      : Math.ceil((user.accuracy / 100) * (totalAnswers - 1));

    user.accuracy = Math.round((correctAnswers / totalAnswers) * 100);

    // Update streak
    if (isCorrect) {
      user.streak += 1;
    } else {
      user.streak = 0;
    }

    // Check for badge unlocks
    const newBadges = await checkBadgeUnlocks(user);
    if (newBadges.length > 0) {
      user.badges = [...new Set([...user.badges, ...newBadges])];
    }

    // Update level based on score
    user.level = Math.floor(user.score / 100) + 1;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        score: user.score,
        level: user.level,
        accuracy: user.accuracy,
        streak: user.streak,
        badges: user.badges,
        newBadges,
      },
      message: newBadges.length > 0 ? `🎉 New badges unlocked: ${newBadges.join(', ')}` : 'Stats updated!',
    } as ApiResponse);
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update stats',
    } as ApiResponse);
  }
}

/**
 * Check and unlock badges based on user achievements
 */
async function checkBadgeUnlocks(user: typeof User.prototype): Promise<string[]> {
  const newBadges: string[] = [];

  const badges = [
    { id: 'first_game', name: 'First Steps', condition: () => user.totalGamesPlayed >= 1 },
    { id: '10_games', name: 'Getting Started', condition: () => user.totalGamesPlayed >= 10 },
    { id: '50_games', name: 'Dedicated Learner', condition: () => user.totalGamesPlayed >= 50 },
    { id: '100_games', name: 'Learning Champion', condition: () => user.totalGamesPlayed >= 100 },
    { id: 'score_100', name: 'Score Starter', condition: () => user.score >= 100 },
    { id: 'score_500', name: 'Score Seeker', condition: () => user.score >= 500 },
    { id: 'score_1000', name: 'Score Master', condition: () => user.score >= 1000 },
    { id: 'streak_5', name: 'Hot Streak', condition: () => user.streak >= 5 },
    { id: 'streak_10', name: 'On Fire', condition: () => user.streak >= 10 },
    { id: 'accuracy_80', name: 'Sharp Shooter', condition: () => user.accuracy >= 80 },
    { id: 'accuracy_90', name: 'Perfect Aim', condition: () => user.accuracy >= 90 },
    { id: 'accuracy_100', name: 'Flawless', condition: () => user.accuracy >= 100 },
  ];

  for (const badge of badges) {
    if (!user.badges.includes(badge.id) && badge.condition()) {
      newBadges.push(badge.id);
    }
  }

  return newBadges;
}






