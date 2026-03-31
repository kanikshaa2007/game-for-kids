import { Router } from 'express';
import {
  generate,
  generateQuestions,
  checkStatus,
} from '../controllers/ai.controller';

const router = Router();

/**
 * @route   POST /api/ai/generate
 * @desc    Generate content using AI
 * @access  Public
 * @body    prompt, type
 */
router.post('/generate', generate);

/**
 * @route   POST /api/ai/questions
 * @desc    Generate questions for a game type
 * @access  Public
 * @body    gameType, difficulty, count
 */
router.post('/questions', generateQuestions);

/**
 * @route   GET /api/ai/status
 * @desc    Check AI service status
 * @access  Public
 */
router.get('/status', checkStatus);

export default router;
