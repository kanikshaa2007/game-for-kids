/**
 * Error handling utilities for the game platform
 */

export class GameError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export const ErrorCodes = {
  // Auth errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_USERNAME: 'INVALID_USERNAME',
  AUTH_FAILED: 'AUTH_FAILED',

  // Game errors
  QUESTION_GENERATION_FAILED: 'QUESTION_GENERATION_FAILED',
  INVALID_ANSWER: 'INVALID_ANSWER',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',

  // Screen time errors
  SCREEN_TIME_EXCEEDED: 'SCREEN_TIME_EXCEEDED',
  INVALID_PIN: 'INVALID_PIN',

  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',

  // AI errors
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',

  // General errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.USER_NOT_FOUND]: 'User not found. Please create an account first.',
  [ErrorCodes.INVALID_USERNAME]: 'Username must be between 3 and 20 characters.',
  [ErrorCodes.AUTH_FAILED]: 'Authentication failed. Please try again.',
  [ErrorCodes.QUESTION_GENERATION_FAILED]: 'Failed to generate question. Please try again.',
  [ErrorCodes.INVALID_ANSWER]: 'Invalid answer format.',
  [ErrorCodes.SESSION_NOT_FOUND]: 'Game session not found.',
  [ErrorCodes.SCREEN_TIME_EXCEEDED]: 'Screen time limit exceeded. Time for a break!',
  [ErrorCodes.INVALID_PIN]: 'Invalid PIN. Please try again.',
  [ErrorCodes.DATABASE_ERROR]: 'Database error. Please try again later.',
  [ErrorCodes.CONNECTION_ERROR]: 'Connection error. Please check your internet.',
  [ErrorCodes.AI_SERVICE_UNAVAILABLE]: 'AI service unavailable. Using fallback questions.',
  [ErrorCodes.AI_GENERATION_FAILED]: 'Failed to generate AI question. Using fallback.',
  [ErrorCodes.INVALID_REQUEST]: 'Invalid request. Please check your input.',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error. Please try again later.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof GameError) {
    return ErrorMessages[error.code] || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export function handleApiError(error: unknown): { code: string; message: string; statusCode: number } {
  if (error instanceof GameError) {
    return {
      code: error.code,
      message: ErrorMessages[error.code] || error.message,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      code: ErrorCodes.INTERNAL_ERROR,
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: ErrorCodes.INTERNAL_ERROR,
    message: ErrorMessages[ErrorCodes.INTERNAL_ERROR],
    statusCode: 500,
  };
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
