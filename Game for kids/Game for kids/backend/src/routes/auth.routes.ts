import { Router } from 'express';
import { login, getProfile, updateStats } from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login or create user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile/:userId
 * @desc    Get user profile
 * @access  Public
 */
router.get('/profile/:userId', getProfile);

/**
 * @route   POST /api/auth/stats/:userId
 * @desc    Update user stats
 * @access  Public
 */
router.post('/stats/:userId', updateStats);

export default router;
