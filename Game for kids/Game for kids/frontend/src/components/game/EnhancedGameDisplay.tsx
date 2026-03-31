'use client';

import { motion } from 'framer-motion';
import { AnimatedCharacter3D, Shape3D, ParticleEffect } from '@/components/ui';

interface EnhancedGameDisplayProps {
  gameType: 'math' | 'letters' | 'image' | 'rhyme';
  isCorrect?: boolean;
  showParticles?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export default function EnhancedGameDisplay({
  gameType,
  isCorrect,
  showParticles = false,
  difficulty = 'easy',
}: EnhancedGameDisplayProps) {
  const getCharacterEmotion = () => {
    if (isCorrect === undefined) return 'thinking';
    return isCorrect ? 'celebrating' : 'thinking';
  };

  const getShapeForGame = () => {
    switch (gameType) {
      case 'math':
        return {
          type: 'cube' as const,
          count: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5,
        };
      case 'letters':
        return { type: 'sphere' as const, count: 1 };
      case 'image':
        return { type: 'pyramid' as const, count: 2 };
      case 'rhyme':
        return { type: 'cylinder' as const, count: 3 };
      default:
        return { type: 'cube' as const, count: 1 };
    }
  };

  const shape = getShapeForGame();

  return (
    <div className="space-y-6">
      <ParticleEffect type={isCorrect ? 'success' : 'error'} trigger={showParticles} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Character Display */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <AnimatedCharacter3D emotion={getCharacterEmotion()} scale={1.2} />
        </motion.div>

        {/* 3D Shapes Display */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <Shape3D
            type={shape.type}
            color={isCorrect ? '#4ECDC4' : '#FF6B6B'}
            count={shape.count}
          />
        </motion.div>
      </motion.div>

      {/* Feedback Message */}
      {isCorrect !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-center font-bold text-lg ${
            isCorrect
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {isCorrect ? '🎉 Excellent! Keep it up!' : '💡 Try again, you can do it!'}
        </motion.div>
      )}
    </div>
  );
}
