import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { mockDb } from '../config/mock-db';

export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Middleware to validate user exists from username in request
 */
export async function validateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({
        success: false,
        error: 'Username is required',
      });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('validateUser middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Middleware to ensure user is authenticated via session/cookie
 * For this simple implementation, we'll use userId from request
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }
    // Sanitize userId: remove extra quotes and whitespace
    userId = userId.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '').trim();
    
    let user: any = null;
    
    try {
      // Try MongoDB first
      user = await User.findById(userId);
    } catch (dbError) {
      // Fall back to mock database
      console.warn('?? Using mock database for auth:', userId);
      user = mockDb.findUserById(userId);
    }
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid user',
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('requireAuth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}


