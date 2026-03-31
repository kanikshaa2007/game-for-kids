import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import GameSession, { IQuestionRecord } from '../models/GameSession';
import UserProgress from '../models/UserProgress';
import User from '../models/User';
import { questionGeneratorService } from '../services/question-generator.service';
import { screenTimeService } from '../services/screen-time.service';
import { ApiResponse, Question, SubmitAnswerResponse } from '../types';

/**
 * Generate a new question for a game
 */
export async function generateQuestion(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { gameType, difficulty } = req.query as {
      gameType: 'math' | 'letters' | 'image' | 'rhyme';
      difficulty?: 'easy' | 'medium' | 'hard';
    };

    const userId = req.user?._id?.toString();

    if (!gameType || !['math', 'letters', 'image', 'rhyme'].includes(gameType)) {
      res.status(400).json({
        success: false,
        error: 'Invalid game type',
      } as ApiResponse);
      return;
    }

    // Determine difficulty based on user progress if not specified
    let selectedDifficulty = difficulty || 'easy';

    if (!difficulty && userId) {
      try {
        selectedDifficulty = await getAdaptiveDifficulty(userId, gameType);
      } catch (dbError) {
        // Use default difficulty if database is unavailable
        console.warn('?? Using default difficulty (database unavailable)');
        selectedDifficulty = 'easy';
      }
    }

    // Generate questions
    const questions = await questionGeneratorService.generateQuestions(
      gameType,
      selectedDifficulty,
      1 // Generate one question at a time
    );

    if (questions.length === 0) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate question',
      } as ApiResponse);
      return;
    }

    const question = questions[0];

    // Ensure the question has an ID
    const questionWithId = {
      ...question,
      id: question.id || Math.random().toString(36).substr(2, 9),
    };

    res.status(200).json({
      success: true,
      data: {
        id: questionWithId.id,
        question: questionWithId.question,
        options: questionWithId.options,
        correctAnswer: questionWithId.correctAnswer,
        difficulty: questionWithId.difficulty,
        gameType: questionWithId.gameType,
        imageUrl: questionWithId.imageUrl,
        fullWord: questionWithId.fullWord,
      },
    } as ApiResponse<Question>);
  } catch (error) {
    console.error('Generate question error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate question',
    } as ApiResponse);
  }
}

/**
 * Start a new game session
 */
export async function startSession(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?._id?.toString();
    const { gameType, difficulty } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      } as ApiResponse);
      return;
    }

    // End any existing active sessions
    await GameSession.updateMany(
      { userId, isActive: true },
      { isActive: false, endTime: new Date() }
    );

    // Create new session
    const session = await GameSession.create({
      userId,
      gameType,
      difficulty: difficulty || 'easy',
      startTime: new Date(),
      isActive: true,
      questions: [],
      score: 0,
    });

    // Start screen time session
    await screenTimeService.startSession(userId);

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        gameType: session.gameType,
        difficulty: session.difficulty,
        startTime: session.startTime,
      },
      message: 'Game session started! Good luck!',
    } as ApiResponse);
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start session',
    } as ApiResponse);
  }
}

/**
 * Submit an answer
 */
export async function submitAnswer(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { sessionId, question, userAnswer, responseTime, difficulty } = req.body;

    const userId = req.user?._id?.toString();

    if (!sessionId || !question || userAnswer === undefined) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields',
      } as ApiResponse);
      return;
    }

    // Find the session
    const session = await GameSession.findById(sessionId);

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      } as ApiResponse);
      return;
    }

    // Check if answer is correct
    const isCorrect = userAnswer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();

    // Calculate points
    const pointsMap = {
      easy: 10,
      medium: 20,
      hard: 30,
    };
    const basePoints = pointsMap[difficulty as keyof typeof pointsMap] || 10;
    const points = isCorrect ? basePoints : 0;

    // Record the question result
    const questionRecord: IQuestionRecord = {
      question: question.question,
      userAnswer: userAnswer.toString(),
      correctAnswer: question.correctAnswer,
      isCorrect,
      responseTime,
      difficulty: difficulty || 'easy',
    };

    session.questions.push(questionRecord);
    session.score += points;
    await session.save();

    // Update user stats
    if (userId) {
      await updateUserProgress(userId, session.gameType, difficulty || 'easy', isCorrect);
      await updateUserStats(userId, points, isCorrect);
    }

    // Prepare response
    const responseData: SubmitAnswerResponse = {
      isCorrect,
      correctAnswer: question.correctAnswer,
      points,
      newScore: session.score,
      streak: isCorrect ? 1 : 0, // Simplified - frontend tracks actual streak
    };

    res.status(200).json({
      success: true,
      data: responseData,
      message: isCorrect ? '🎉 Correct! Great job!' : 'Keep trying! You got this!',
    } as ApiResponse<SubmitAnswerResponse>);
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit answer',
    } as ApiResponse);
  }
}

/**
 * End a game session
 */
export async function endSession(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findByIdAndUpdate(
      sessionId,
      {
        isActive: false,
        endTime: new Date(),
      },
      { new: true }
    );

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      } as ApiResponse);
      return;
    }

    // End screen time session
    if (session.userId) {
      await screenTimeService.endSession(session.userId.toString());
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        totalTime: session.totalTime,
        score: session.score,
        questionsAnswered: session.questions.length,
        correctAnswers: session.questions.filter((q) => q.isCorrect).length,
      },
      message: 'Great session! See you next time!',
    } as ApiResponse);
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end session',
    } as ApiResponse);
  }
}

/**
 * Get session info
 */
export async function getSession(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findById(sessionId)
      .populate('userId', 'username score level');

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        gameType: session.gameType,
        difficulty: session.difficulty,
        score: session.score,
        questions: session.questions,
        startTime: session.startTime,
        endTime: session.endTime,
        totalTime: session.totalTime,
        isActive: session.isActive,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session',
    } as ApiResponse);
  }
}

/**
 * Get adaptive difficulty based on user performance
 */
async function getAdaptiveDifficulty(
  userId: string,
  gameType: string
): Promise<'easy' | 'medium' | 'hard'> {
  const progress = await UserProgress.findOne({ userId });

  if (!progress) {
    return 'easy';
  }

  const gameProgress = progress[gameType as keyof typeof progress];

  if (!gameProgress || typeof gameProgress !== 'object') {
    return 'easy';
  }

  const anyProgress = gameProgress as {
    easy?: { correct: number; total: number };
    medium?: { correct: number; total: number };
    hard?: { correct: number; total: number };
  };

  // Check hard performance
  if (anyProgress.hard && anyProgress.hard.total >= 5) {
    const accuracy = (anyProgress.hard.correct / anyProgress.hard.total) * 100;
    if (accuracy >= 70) return 'hard';
  }

  // Check medium performance
  if (anyProgress.medium && anyProgress.medium.total >= 5) {
    const accuracy = (anyProgress.medium.correct / anyProgress.medium.total) * 100;
    if (accuracy >= 70) return 'medium';
  }

  // Check easy performance
  if (anyProgress.easy && anyProgress.easy.total >= 5) {
    const accuracy = (anyProgress.easy.correct / anyProgress.easy.total) * 100;
    if (accuracy >= 70) return 'easy';
  }

  return 'easy';
}

/**
 * Update user progress for a subject
 */
async function updateUserProgress(
  userId: string,
  gameType: string,
  difficulty: string,
  isCorrect: boolean
): Promise<void> {
  let progress = await UserProgress.findOne({ userId });

  if (!progress) {
    progress = await UserProgress.create({
      userId,
    });
  }

  const subject = gameType as keyof typeof progress;
  const difficultyLevel = difficulty as keyof typeof progress.math;

  if (progress[subject] && progress[subject][difficultyLevel]) {
    progress[subject][difficultyLevel].total += 1;
    if (isCorrect) {
      progress[subject][difficultyLevel].correct += 1;
    }
  }

  await progress.save();
}

/**
 * Update user stats
 */
async function updateUserStats(
  userId: string,
  points: number,
  isCorrect: boolean
): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    $inc: {
      score: points,
      totalGamesPlayed: 1,
      streak: isCorrect ? 1 : -999, // Will be reset to 0 if negative
    },
  });

  // Reset streak if it went negative
  const user = await User.findById(userId);
  if (user && user.streak < 0) {
    user.streak = 0;
    await user.save();
  }
}

