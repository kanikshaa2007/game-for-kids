import { Router } from 'express';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { screenTimeService } from '../services/screen-time.service';
import { ApiResponse } from '../types';

const router = Router();

/**
 * @route   GET /api/screentime/status/:userId
 * @desc    Get screen time status for a user
 * @access  Public
 */
router.get('/status/:userId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const status = await screenTimeService.shouldTakeBreak(userId);

    res.status(200).json({
      success: true,
      data: status,
    } as ApiResponse);
  } catch (error) {
    console.error('Get screen time status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get screen time status',
    } as ApiResponse);
  }
});

/**
 * @route   POST /api/screentime/start/:userId
 * @desc    Start a screen time session
 * @access  Public
 */
router.post('/start/:userId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const session = await screenTimeService.startSession(userId);

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        startTime: session.startTime,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Start screen time session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start screen time session',
    } as ApiResponse);
  }
});

/**
 * @route   POST /api/screentime/break/:sessionId
 * @desc    Start a break
 * @access  Public
 */
router.post('/break/:sessionId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const result = await screenTimeService.startBreak(sessionId);

    res.status(200).json({
      success: true,
      data: {
        breakEndsAt: result.breakEndsAt,
        duration: screenTimeService.getBreakDuration(),
      },
      message: 'Break time! See you in 10 minutes!',
    } as ApiResponse);
  } catch (error) {
    console.error('Start break error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start break',
    } as ApiResponse);
  }
});

/**
 * @route   POST /api/screentime/skip-break/:sessionId
 * @desc    Skip break (parent override with PIN)
 * @access  Public
 */
router.post('/skip-break/:sessionId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { pin } = req.body;

    // Simple PIN check (in production, this should be more secure)
    const PARENT_PIN = process.env.PARENT_PIN || '1234';

    if (pin !== PARENT_PIN) {
      res.status(403).json({
        success: false,
        error: 'Invalid PIN',
      } as ApiResponse);
      return;
    }

    await screenTimeService.skipBreak(sessionId);

    res.status(200).json({
      success: true,
      message: 'Break skipped. Continue playing!',
    } as ApiResponse);
  } catch (error) {
    console.error('Skip break error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to skip break',
    } as ApiResponse);
  }
});

/**
 * @route   GET /api/screentime/stats/:userId
 * @desc    Get screen time statistics
 * @access  Public
 */
router.get('/stats/:userId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const stats = await screenTimeService.getSessionStats(userId);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        limit: screenTimeService.getScreenTimeLimit(),
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get screen time stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get screen time stats',
    } as ApiResponse);
  }
});

export default router;
