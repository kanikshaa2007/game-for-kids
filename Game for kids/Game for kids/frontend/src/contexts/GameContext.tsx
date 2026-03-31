'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Question, GameType, Difficulty } from '@/types';
import { generateQuestion as generateQuestionApi, startGameSession, submitAnswer as submitAnswerApi } from '@/lib/api';
import { triggerSmallConfetti, playSound } from '@/lib/utils';

interface GameState {
  isPlaying: boolean;
  currentQuestion: Question | null;
  sessionId: string | null;
  score: number;
  streak: number;
  questionNumber: number;
  isAnswering: boolean;
  gameType: GameType | null;
  difficulty: Difficulty | null;
}

interface GameContextType extends GameState {
  startGame: (gameType: GameType, difficulty: Difficulty) => Promise<void>;
  generateQuestion: () => Promise<void>;
  submitAnswer: (answer: string, responseTime: number) => Promise<{ isCorrect: boolean; points: number }>;
  endGame: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  isPlaying: false,
  currentQuestion: null,
  sessionId: null,
  score: 0,
  streak: 0,
  questionNumber: 0,
  isAnswering: false,
  gameType: null,
  difficulty: null,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback(async (gameType: GameType, difficulty: Difficulty) => {
    setState((prev) => ({ ...prev, isAnswering: true }));

    try {
      // Start session
      const session = await startGameSession(gameType, difficulty);

      setState({
        ...initialState,
        isPlaying: true,
        sessionId: session.sessionId,
        gameType,
        difficulty,
        isAnswering: true,
      });

      // Generate first question
      const question = await generateQuestionApi(gameType, difficulty);
      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        questionNumber: 1,
        isAnswering: false,
      }));
    } catch (error) {
      console.error('Failed to start game:', error);
      setState((prev) => ({ ...prev, isAnswering: false }));
      throw error;
    }
  }, []);

  const generateQuestion = useCallback(async () => {
    if (!state.gameType || !state.difficulty || !state.sessionId) return;

    setState((prev) => ({ ...prev, isAnswering: true }));

    try {
      const question = await generateQuestionApi(state.gameType, state.difficulty);
      setState((prev) => ({
        ...prev,
        currentQuestion: question,
        questionNumber: prev.questionNumber + 1,
        isAnswering: false,
      }));
    } catch (error) {
      console.error('Failed to generate question:', error);
      setState((prev) => ({ ...prev, isAnswering: false }));
      throw error;
    }
  }, [state.gameType, state.difficulty, state.sessionId]);

  const submitAnswer = useCallback(async (
    answer: string,
    responseTime: number
  ): Promise<{ isCorrect: boolean; points: number }> => {
    if (!state.sessionId || !state.currentQuestion || !state.difficulty) {
      return { isCorrect: false, points: 0 };
    }

    try {
      const result = await submitAnswerApi({
        sessionId: state.sessionId,
        question: {
          question: state.currentQuestion.question,
          correctAnswer: state.currentQuestion.correctAnswer,
        },
        userAnswer: answer,
        responseTime,
        difficulty: state.difficulty,
      });

      if (result.isCorrect) {
        triggerSmallConfetti();
        playSound('correct');
      } else {
        playSound('wrong');
      }

      setState((prev) => ({
        ...prev,
        score: prev.score + result.points,
        streak: result.isCorrect ? prev.streak + 1 : 0,
      }));

      return {
        isCorrect: result.isCorrect,
        points: result.points,
      };
    } catch (error) {
      console.error('Failed to submit answer:', error);
      return { isCorrect: false, points: 0 };
    }
  }, [state.sessionId, state.currentQuestion, state.difficulty]);

  const endGame = useCallback(() => {
    setState(initialState);
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        startGame,
        generateQuestion,
        submitAnswer,
        endGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
}
