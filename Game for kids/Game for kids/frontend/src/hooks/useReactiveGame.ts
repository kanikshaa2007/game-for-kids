'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getErrorMessage } from '@/lib/errors';

interface UseReactiveGameState {
  question: any | null;
  isLoading: boolean;
  error: string | null;
  score: number;
  streak: number;
  questionNumber: number;
  feedback: { message: string; isCorrect: boolean } | null;
}

interface UseReactiveGameActions {
  generateQuestion: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<{ isCorrect: boolean }>;
  reset: () => void;
  clearError: () => void;
  clearFeedback: () => void;
}

export function useReactiveGame(
  gameType: 'math' | 'letters' | 'image' | 'rhyme',
  difficulty: 'easy' | 'medium' | 'hard'
): UseReactiveGameState & UseReactiveGameActions {
  const [state, setState] = useState<UseReactiveGameState>({
    question: null,
    isLoading: false,
    error: null,
    score: 0,
    streak: 0,
    questionNumber: 0,
    feedback: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateQuestion = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      abortControllerRef.current = new AbortController();

      const response = await fetch(
        `/api/game/generate?gameType=${gameType}&difficulty=${difficulty}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        question: data.question,
        questionNumber: prev.questionNumber + 1,
        isLoading: false,
      }));
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setState((prev) => ({
          ...prev,
          error: getErrorMessage(error),
          isLoading: false,
        }));
      }
    }
  }, [gameType, difficulty]);

  const submitAnswer = useCallback(
    async (answer: string): Promise<{ isCorrect: boolean }> => {
      try {
        const response = await fetch('/api/game/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: state.question?._id,
            answer,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit answer');
        }

        const data = await response.json();
        const isCorrect = data.isCorrect;

        setState((prev) => ({
          ...prev,
          score: prev.score + (isCorrect ? 10 : 0),
          streak: isCorrect ? prev.streak + 1 : 0,
          feedback: {
            message: isCorrect ? 'Correct!' : 'Try again!',
            isCorrect,
          },
        }));

        return { isCorrect };
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: getErrorMessage(error),
        }));
        return { isCorrect: false };
      }
    },
    [state.question?._id]
  );

  const reset = useCallback(() => {
    setState({
      question: null,
      isLoading: false,
      error: null,
      score: 0,
      streak: 0,
      questionNumber: 0,
      feedback: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearFeedback = useCallback(() => {
    setState((prev) => ({ ...prev, feedback: null }));
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...state,
    generateQuestion,
    submitAnswer,
    reset,
    clearError,
    clearFeedback,
  };
}
