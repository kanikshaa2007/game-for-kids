'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AnswerButtonsProps {
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  disabled?: boolean;
  gameType?: 'math' | 'letters' | 'image' | 'rhyme';
}

const buttonColors = [
  'from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700',
  'from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700',
  'from-green-400 to-green-600 hover:from-green-500 hover:to-green-700',
  'from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700',
  'from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700',
  'from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700',
];

const funIcons = ['🎯', '🚀', '⭐', '🎨', '🎪', '🎭'];
const emoji3D = {
  container: 'perspective-1000',
  icon: 'transform-gpu transition-transform duration-300 drop-shadow-xl'
};

export default function AnswerButtons({
  options,
  correctAnswer,
  onAnswer,
  disabled = false,
  gameType = 'math',
}: AnswerButtonsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Reset state when new question loads
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [options, correctAnswer]);

  const handleAnswer = (answer: string) => {
    if (disabled || selectedAnswer) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();

    // Show result briefly before calling parent handler
    setTimeout(() => {
      onAnswer(answer, isCorrect);
    }, isCorrect ? 1200 : 1800); // Longer delay for better feedback
  };

  const getButtonStyles = (option: string, index: number) => {
    const baseClasses = 'relative w-full py-4 px-6 rounded-2xl font-bold text-lg md:text-xl shadow-button hover:shadow-button-hover transition-all duration-300 overflow-hidden';

    if (!showResult) {
      return `${baseClasses} bg-gradient-to-r ${buttonColors[index % buttonColors.length]} text-white transform hover:scale-105 hover:rotate-1 active:scale-95`;
    }

    if (option.toLowerCase() === correctAnswer.toLowerCase()) {
      return `${baseClasses} bg-gradient-to-r from-success to-success-600 text-white animate-tada shadow-2xl scale-105`;
    }

    if (option === selectedAnswer && option.toLowerCase() !== correctAnswer.toLowerCase()) {
      return `${baseClasses} bg-gradient-to-r from-error to-error-600 text-white animate-wobble shadow-2xl`;
    }

    return `${baseClasses} bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed`;
  };

  const getFeedbackIcon = (option: string) => {
    if (!showResult) return null;

    if (option.toLowerCase() === correctAnswer.toLowerCase()) {
      return (
        <motion.div
          className="absolute -top-2 -right-2 text-3xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          ✅
        </motion.div>
      );
    }

    if (option === selectedAnswer && option.toLowerCase() !== correctAnswer.toLowerCase()) {
      return (
        <motion.div
          className="absolute -top-2 -right-2 text-3xl"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          ❌
        </motion.div>
      );
    }

    return null;
  };

  const getParticleEffect = (option: string) => {
    if (!showResult) return null;

    if (option.toLowerCase() === correctAnswer.toLowerCase()) {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + i * 0.1,
                ease: "easeOut"
              }}
            >
              {['✨', '⭐', '🎉', '🌟'][i % 4]}
            </motion.div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
      {options.map((option, index) => (
        <motion.div
          key={option}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="relative"
        >
          <motion.button
            className={getButtonStyles(option, index)}
            onClick={() => handleAnswer(option)}
            type="button"
            whileHover={!showResult && !disabled && !selectedAnswer ? {
              scale: 1.08,
              rotate: 1,
              transition: { duration: 0.3 }
            } : {}}
            whileTap={!showResult && !disabled && !selectedAnswer ? { 
              scale: 0.94,
              rotate: -1
            } : {}}
          >
            {/* Button content - clean, no emojis */}
            <div className="relative z-10 flex items-center justify-center">
              <span className="drop-shadow-lg font-bold text-lg md:text-2xl">{option}</span>
            </div>

            {/* Feedback icon */}
            {getFeedbackIcon(option)}

            {/* Particle effects */}
            {getParticleEffect(option)}
          </motion.button>

          {/* Hover glow effect */}
          {!showResult && !disabled && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 pointer-events-none"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
