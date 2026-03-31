'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';
import { getDifficultyColor } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions?: number;
  gameType?: 'math' | 'letters' | 'image' | 'rhyme';
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  gameType = 'math',
}: QuestionCardProps) {
  const getGameTheme = () => {
    switch (gameType) {
      case 'math':
        return {
          bg: 'bg-gradient-to-br from-math-primary/20 to-math-secondary/20',
          border: 'border-math-primary',
          icon: '🧮',
          accent: 'text-math-primary',
        };
      case 'letters':
        return {
          bg: 'bg-gradient-to-br from-letters-primary/20 to-letters-secondary/20',
          border: 'border-letters-primary',
          icon: '📝',
          accent: 'text-letters-primary',
        };
      case 'image':
        return {
          bg: 'bg-gradient-to-br from-image-primary/20 to-image-secondary/20',
          border: 'border-image-primary',
          icon: '🖼️',
          accent: 'text-image-primary',
        };
      case 'rhyme':
        return {
          bg: 'bg-gradient-to-br from-rhyme-primary/20 to-rhyme-secondary/20',
          border: 'border-rhyme-primary',
          icon: '🎵',
          accent: 'text-rhyme-primary',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-primary/20 to-secondary/20',
          border: 'border-primary',
          icon: '❓',
          accent: 'text-primary',
        };
    }
  };

  const theme = getGameTheme();

  return (
    <motion.div
      className={`relative ${theme.bg} rounded-3xl p-8 shadow-card border-2 ${theme.border} overflow-hidden`}
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 text-6xl animate-float" style={{ animationDelay: '0s' }}>
          {theme.icon}
        </div>
        <div className="absolute bottom-4 left-4 text-4xl animate-float" style={{ animationDelay: '1s' }}>
          ✨
        </div>
        <div className="absolute top-1/2 left-1/4 text-3xl animate-float" style={{ animationDelay: '2s' }}>
          ⭐
        </div>
      </div>

      {/* Header with enhanced styling */}
      <motion.div
        className="flex items-center justify-between mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-button animate-bounce-gentle">
            <span className="text-2xl">{theme.icon}</span>
          </div>
          <div>
            <span className="text-lg font-bold font-heading text-gray-700">
              Question {questionNumber}
            </span>
            {totalQuestions && (
              <div className="text-sm text-gray-500">
                of {totalQuestions}
              </div>
            )}
          </div>
        </motion.div>

        <motion.span
          className={`px-4 py-2 rounded-full text-sm font-bold uppercase shadow-button border-2 border-white/50 ${getDifficultyColor(question.difficulty)}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {question.difficulty} ⭐
        </motion.span>
      </motion.div>

      {/* Question Text with enhanced typography */}
      <motion.h2
        className="text-3xl md:text-4xl font-black font-heading text-gray-800 mb-8 text-center leading-tight relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
      >
        <span className="relative inline-block">
          {question.question}
          {/* Animated underline */}
          <motion.div
            className={`absolute -bottom-2 left-0 right-0 h-1 ${theme.border} rounded-full`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </span>
      </motion.h2>

      {/* Image for image game with enhanced styling */}
      {question.imageUrl && (
        <motion.div
          className="flex justify-center mb-8 relative z-10"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={question.imageUrl}
              alt="Question image"
              className="max-w-xs rounded-2xl shadow-card border-4 border-white/80"
            />
            {/* Floating sparkles around image */}
            <div className="absolute -top-2 -right-2 text-2xl animate-star-twinkle">✨</div>
            <div className="absolute -bottom-2 -left-2 text-xl animate-star-twinkle" style={{ animationDelay: '1s' }}>⭐</div>
          </motion.div>
        </motion.div>
      )}

      {/* Full word hint for letters game with enhanced styling */}
      {question.fullWord && (
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="inline-block bg-white/90 rounded-2xl px-6 py-3 shadow-button border-2 border-secondary/30"
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-gray-600 font-medium">Hint: The word is </span>
            <span className={`font-black text-xl ${theme.accent}`}>
              {question.fullWord}
            </span>
            <span className="ml-2 animate-wiggle">💡</span>
          </motion.div>
        </motion.div>
      )}

      {/* Decorative elements */}
      <motion.div
        className="absolute top-4 left-4 text-3xl opacity-20 animate-float"
        style={{ animationDelay: '0.5s' }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-4 text-2xl opacity-20 animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        🎨
      </motion.div>
    </motion.div>
  );
}
