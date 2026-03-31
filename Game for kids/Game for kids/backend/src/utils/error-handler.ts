import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const ErrorCodes = {
  // Auth
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_USERNAME: 'INVALID_USERNAME',
  AUTH_FAILED: 'AUTH_FAILED',

  // Game
  QUESTION_GENERATION_FAILED: 'QUESTION_GENERATION_FAILED',
  INVALID_ANSWER: 'INVALID_ANSWER',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',

  // Screen time
  SCREEN_TIME_EXCEEDED: 'SCREEN_TIME_EXCEEDED',
  INVALID_PIN: 'INVALID_PIN',

  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',

  // AI
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',

  // General
  INVALID_REQUEST: 'INVALID_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.INVALID_USERNAME]: 'Invalid username format',
  [ErrorCodes.AUTH_FAILED]: 'Authentication failed',
  [ErrorCodes.QUESTION_GENERATION_FAILED]: 'Failed to generate question',
  [ErrorCodes.INVALID_ANSWER]: 'Invalid answer format',
  [ErrorCodes.SESSION_NOT_FOUND]: 'Game session not found',
  [ErrorCodes.SCREEN_TIME_EXCEEDED]: 'Screen time limit exceeded',
  [ErrorCodes.INVALID_PIN]: 'Invalid PIN',
  [ErrorCodes.DATABASE_ERROR]: 'Database error',
  [ErrorCodes.CONNECTION_ERROR]: 'Connection error',
  [ErrorCodes.AI_SERVICE_UNAVAILABLE]: 'AI service unavailable',
  [ErrorCodes.AI_GENERATION_FAILED]: 'AI generation failed',
  [ErrorCodes.INVALID_REQUEST]: 'Invalid request',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error',
};

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production'
        ? ErrorMessages[ErrorCodes.INTERNAL_ERROR]
        : err.message,
    },
  });
}

export function validateUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
}

export function validateAge(age: number): boolean {
  return age >= 5 && age <= 10;
}

export function validatePin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}
