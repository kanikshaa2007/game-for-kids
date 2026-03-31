'use client';

import { useState, useCallback, useEffect } from 'react';
import { Question, GameType, Difficulty } from '@/types';
import { generateQuestion as generateQuestionApi } from '@/lib/api';
import { triggerSmallConfetti, playSound } from '@/lib/utils';

interface UseGameOptions {
  gameType: GameType;
  difficulty: Difficulty;
  autoStart?: boolean;
}

interface UseGameReturn {
  question: Question | null;
  isLoading: boolean;
  error: string | null;
  score: number;
  streak: number;
  questionNumber: number;
  generateQuestion: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<{ isCorrect: boolean; points: number }>;
  reset: () => void;
}

export function useGame({
  gameType,
  difficulty,
  autoStart = false,
}: UseGameOptions): UseGameReturn {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(autoStart);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);

  const generateQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newQuestion = await generateQuestionApi(gameType, difficulty);
      setQuestion(newQuestion);
      setQuestionNumber((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question');
    } finally {
      setIsLoading(false);
    }
  }, [gameType, difficulty]);

  const submitAnswer = useCallback(async (answer: string): Promise<{ isCorrect: boolean; points: number }> => {
    if (!question) {
      return { isCorrect: false, points: 0 };
    }

    const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();

    if (isCorrect) {
      const pointsMap = {
        easy: 10,
        medium: 20,
        hard: 30,
      };
      const points = pointsMap[difficulty];

      triggerSmallConfetti();
      playSound('correct');
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);

      return { isCorrect: true, points };
    } else {
      playSound('wrong');
      setStreak(0);
      return { isCorrect: false, points: 0 };
    }
  }, [question, difficulty]);

  const reset = useCallback(() => {
    setQuestion(null);
    setScore(0);
    setStreak(0);
    setQuestionNumber(0);
    setError(null);
  }, []);

  // Auto-start on mount if enabled
  useEffect(() => {
    if (autoStart) {
      generateQuestion();
    }
  }, [autoStart, generateQuestion]);

  return {
    question,
    isLoading,
    error,
    score,
    streak,
    questionNumber,
    generateQuestion,
    submitAnswer,
    reset,
  };
}
