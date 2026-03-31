import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { screenTimeService } from '../services/screen-time.service';

/**
 * Middleware to check if user is on break
 */
export async function checkScreenTime(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?._id?.toString() || req.headers['x-user-id'] as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const status = await screenTimeService.shouldTakeBreak(userId);

    // Add screen time info to request for controllers to use
    req.screenTime = status;

    // If on break, block the request (except for certain endpoints)
    if (status.isOnBreak && !req.path.includes('parent')) {
      res.status(423).json({
        success: false,
        error: 'Break time',
        data: {
          breakRemainingSeconds: status.breakRemainingSeconds,
          message: 'Time for a break! Come back soon!',
        },
      });
      return;
    }

    next();
  } catch (error) {
    console.error('checkScreenTime middleware error:', error);
    next(error);
  }
}

/**
 * Middleware to update session time
 */
export async function updateSessionTime(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?._id?.toString() || req.headers['x-user-id'] as string;

    if (userId) {
      const session = await screenTimeService.getActiveSession(userId);
      if (session) {
        const elapsedSeconds = Math.floor(
          (new Date().getTime() - session.startTime.getTime()) / 1000
        );
        await screenTimeService.updateSessionTime(session._id.toString(), elapsedSeconds);
      }
    }

    next();
  } catch (error) {
    console.error('updateSessionTime middleware error:', error);
    next(error);
  }
}

// Extend AuthRequest to include screenTime
declare module 'express' {
  interface Request {
    screenTime?: {
      shouldBreak: boolean;
      elapsedSeconds: number;
      remainingSeconds: number;
      isOnBreak: boolean;
      breakRemainingSeconds: number;
    };
  }
}
