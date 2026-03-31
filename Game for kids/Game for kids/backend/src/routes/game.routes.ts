import { Router } from 'express';
import {
  generateQuestion,
  startSession,
  submitAnswer,
  endSession,
  getSession,
} from '../controllers/game.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { checkScreenTime } from '../middleware/screen-time.middleware';

const router = Router();

// All game routes require authentication
router.use(requireAuth);
router.use(checkScreenTime);

/**
 * @route   GET /api/game/generate
 * @desc    Generate a new question
 * @access  Private
 * @query   gameType - math | letters | image | rhyme
 * @query   difficulty - easy | medium | hard
 */
router.get('/generate', generateQuestion);

/**
 * @route   POST /api/game/session/start
 * @desc    Start a new game session
 * @access  Private
 * @body    gameType, difficulty
 */
router.post('/session/start', startSession);

/**
 * @route   POST /api/game/submit
 * @desc    Submit an answer
 * @access  Private
 * @body    sessionId, question, userAnswer, responseTime, difficulty
 */
router.post('/submit', submitAnswer);

/**
 * @route   POST /api/game/session/:sessionId/end
 * @desc    End a game session
 * @access  Private
 */
router.post('/session/:sessionId/end', endSession);

/**
 * @route   GET /api/game/session/:sessionId
 * @desc    Get session info
 * @access  Private
 */
router.get('/session/:sessionId', getSession);

export default router;
