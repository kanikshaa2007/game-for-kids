import { Router } from 'express';
import {
  getProgress,
  updateProgress,
  getLeaderboard,
  getAllUsers,
} from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/user/progress/:userId
 * @desc    Get user progress
 * @access  Public
 */
router.get('/progress/:userId', getProgress);

/**
 * @route   POST /api/user/progress
 * @desc    Update user progress
 * @access  Private
 */
router.post('/progress', requireAuth, updateProgress);

/**
 * @route   GET /api/user/leaderboard
 * @desc    Get leaderboard
 * @access  Public
 */
router.get('/leaderboard', requireAuth, getLeaderboard);

/**
 * @route   GET /api/user/all
 * @desc    Get all users (for parent dashboard)
 * @access  Public
 */
router.get('/all', requireAuth, getAllUsers);

export default router;
