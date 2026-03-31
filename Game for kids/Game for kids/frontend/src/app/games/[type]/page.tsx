'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useGame } from '@/hooks/useGame';
import { useScreenTime } from '@/hooks/useScreenTime';
import { Header, Navigation } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  QuestionCard,
  AnswerButtons,
  Scoreboard,
  Timer,
  BreakModal,
} from '@/components/game';
import { GAME_TYPES, DIFFICULTIES, CORRECT_MESSAGES, ENCOURAGEMENT_MESSAGES } from '@/lib/constants';
import { triggerConfetti, getRandomItem } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function GamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const gameType = params.type as string;
  const gameInfo = GAME_TYPES.find((g) => g.id === gameType);

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  const {
    question,
    isLoading,
    error,
    score,
    streak,
    questionNumber,
    generateQuestion,
    submitAnswer,
    reset,
  } = useGame({
    gameType: gameType as 'math' | 'letters' | 'image' | 'rhyme',
    difficulty: selectedDifficulty,
    autoStart: false,
  });

  const {
    shouldShowBreak,
    skipBreak,
    remainingSeconds,
  } = useScreenTime();

  useEffect(() => {
    if (gameStarted) {
      setQuestionStartTime(Date.now());
    }
  }, [gameStarted, questionNumber]);

  const handleStartGame = () => {
    setGameStarted(true);
    reset();
    void generateQuestion();
  };

  const handleAnswer = useCallback(async (answer: string, isCorrect: boolean) => {
    const result = await submitAnswer(answer);

    if (result.isCorrect) {
      triggerConfetti();
    }

    setFeedback({
      message: isCorrect
        ? getRandomItem(CORRECT_MESSAGES)
        : getRandomItem(ENCOURAGEMENT_MESSAGES),
      isCorrect: result.isCorrect,
    });

    setTimeout(() => {
      setFeedback(null);
      setQuestionStartTime(Date.now());
      void generateQuestion();
    }, 1500);
  }, [submitAnswer, generateQuestion]);

  const handleEndGame = () => {
    triggerConfetti();
    // Save score to sessionStorage for the result page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('gameScore', score.toString());
      sessionStorage.setItem('gameType', gameType);
    }
    toast.success(`Great session! You scored ${score} points!`);
    router.push('/games/result');
  };

  if (!user) {
    router.push('/');
    return null;
  }

  if (!gameInfo) {
    router.push('/games');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <Navigation />
        </div>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{gameInfo.icon}</span>
            <h1 className="text-3xl font-bold font-heading text-gray-800">
              {gameInfo.name}
            </h1>
          </div>
          <p className="text-gray-500">{gameInfo.description}</p>
        </motion.div>

        {!gameStarted ? (
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-card text-center">
              <span className="text-6xl mb-4 block">{gameInfo.icon}</span>
              <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">
                Ready to Play?
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Choose Difficulty
                </label>
                <div className="flex gap-2 justify-center">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`
                        px-4 py-3 rounded-2xl font-bold transition-all
                        ${selectedDifficulty === diff.id
                          ? 'bg-primary text-white scale-105 shadow-button'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {diff.name}
                      <span className="ml-1">{'*'.repeat(diff.stars)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleStartGame}
                variant="primary"
                size="xl"
                fullWidth
              >
                Let&apos;s Go!
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-soft">
              <Scoreboard score={score} streak={streak} level={user.level} />
              <Timer
                seconds={Math.floor((Date.now() - questionStartTime) / 1000)}
                isRunning={gameStarted && !isLoading}
                variant="count-up"
                showLabel={false}
              />
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  className={`
                    text-center p-6 rounded-2xl mb-8 font-bold text-2xl
                    ${feedback.isCorrect
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-2xl'
                      : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-2xl'
                    }
                  `}
                  initial={{ opacity: 0, scale: 0.5, y: -30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 30 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={feedback.isCorrect ? { 
                      rotate: [0, 10, -10, 0],
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {feedback.message}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {question && (
              <>
                <QuestionCard
                  question={question}
                  questionNumber={questionNumber}
                />

                {question.options && (
                  <div className="mt-6">
                    <AnswerButtons
                      options={question.options}
                      correctAnswer={question.correctAnswer}
                      onAnswer={handleAnswer}
                      disabled={!!feedback}
                    />
                  </div>
                )}
              </>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <motion.div
                  className="text-6xl inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  Loading
                </motion.div>
                <p className="text-gray-500 mt-4">Thinking...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => void generateQuestion()} variant="secondary">
                  Try Again
                </Button>
              </div>
            )}

            <div className="text-center mt-8">
              <Button onClick={handleEndGame} variant="ghost" size="md">
                End Game
              </Button>
            </div>
          </div>
        )}
      </main>

      <BreakModal
        isOpen={shouldShowBreak}
        remainingSeconds={remainingSeconds}
        onSkipBreak={skipBreak}
        onClose={() => {}}
      />
    </div>
  );
}