'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactiveGame } from '@/hooks/useReactiveGame';
import { EnhancedGameDisplay } from '@/components/game';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

interface ImprovedGameSessionProps {
  gameType: 'math' | 'letters' | 'image' | 'rhyme';
  difficulty: 'easy' | 'medium' | 'hard';
  onGameEnd?: (score: number) => void;
}

export default function ImprovedGameSession({
  gameType,
  difficulty,
  onGameEnd,
}: ImprovedGameSessionProps) {
  const [isAnswering, setIsAnswering] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  const {
    question,
    isLoading,
    error,
    score,
    streak,
    questionNumber,
    feedback,
    generateQuestion,
    submitAnswer,
    reset,
    clearError,
    clearFeedback,
  } = useReactiveGame(gameType, difficulty);

  useEffect(() => {
    void generateQuestion();
  }, []);

  const handleAnswer = async (answer: string) => {
    if (isAnswering || !question) return;

    setIsAnswering(true);
    setSelectedAnswer(answer);
    setShowParticles(true);

    const result = await submitAnswer(answer);

    setTimeout(() => {
      setShowParticles(false);
      setIsAnswering(false);
      setSelectedAnswer(null);
      clearFeedback();

      if (questionNumber < 10) {
        void generateQuestion();
      } else {
        toast.success(`Game Complete! Final Score: ${score}`);
        onGameEnd?.(score);
      }
    }, 1500);
  };

  const handleEndGame = () => {
    toast.success(`Session ended! You scored ${score} points!`);
    onGameEnd?.(score);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-semibold opacity-90">Score</div>
          <div className="text-3xl font-bold">{score}</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 text-white text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-semibold opacity-90">Streak</div>
          <div className="text-3xl font-bold">{streak}</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-4 text-white text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-sm font-semibold opacity-90">Question</div>
          <div className="text-3xl font-bold">{questionNumber}/10</div>
        </motion.div>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border-2 border-red-400 rounded-2xl p-4 text-red-700 font-semibold flex justify-between items-center"
          >
            <span>⚠️ {error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-6xl inline-block"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            🎮
          </motion.div>
          <p className="text-gray-600 mt-4 font-semibold">Generating question...</p>
        </motion.div>
      )}

      {/* Game Display with 3D Elements */}
      {question && !isLoading && (
        <>
          <EnhancedGameDisplay
            gameType={gameType}
            isCorrect={feedback?.isCorrect}
            showParticles={showParticles}
            difficulty={difficulty}
          />

          {/* Question */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {question.question}
            </h2>

            {question.imageUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={question.imageUrl}
                  alt="Question"
                  className="max-w-xs rounded-xl shadow-md"
                />
              </div>
            )}

            {question.fullWord && (
              <div className="text-center mb-6 p-4 bg-blue-50 rounded-xl">
                <span className="text-gray-600">Hint: </span>
                <span className="font-bold text-blue-600 text-lg">{question.fullWord}</span>
              </div>
            )}
          </motion.div>

          {/* Answer Options */}
          {question.options && (
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {question.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswering}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-2xl font-bold text-lg transition-all ${
                    selectedAnswer === option
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } ${isAnswering ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Feedback Message */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`p-4 rounded-2xl text-center font-bold text-lg ${
                  feedback.isCorrect
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {feedback.isCorrect ? '🎉 Excellent!' : '💡 Try again!'}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* End Game Button */}
      {questionNumber > 0 && (
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button onClick={handleEndGame} variant="secondary" size="lg">
            End Game
          </Button>
        </motion.div>
      )}
    </div>
  );
}
