'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreboardProps {
  score: number;
  streak: number;
  level?: number;
  className?: string;
}

export default function Scoreboard({
  score,
  streak,
  level = 1,
  className = '',
}: ScoreboardProps) {
  const [prevScore, setPrevScore] = useState(score);
  const [prevStreak, setPrevStreak] = useState(streak);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (score > prevScore) {
      // Score increased - show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
    setPrevScore(score);
  }, [score, prevScore]);

  useEffect(() => {
    if (streak > prevStreak && streak > 0) {
      // Streak increased - show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 20) return '🌟🔥';
    if (streak >= 15) return '🚀🔥';
    if (streak >= 10) return '🔥💯';
    if (streak >= 5) return '⚡✨';
    if (streak >= 3) return '⭐✨';
    return '';
  };

  const getStreakTitle = (streak: number): string => {
    if (streak >= 20) return 'LEGEND!';
    if (streak >= 15) return 'MASTER!';
    if (streak >= 10) return 'FIRE!';
    if (streak >= 5) return 'HOT!';
    if (streak >= 3) return 'GOOD!';
    return 'Streak';
  };

  const getLevelEmoji = (level: number): string => {
    if (level >= 10) return '👑';
    if (level >= 5) return '🏆';
    if (level >= 3) return '🎖️';
    return '🎯';
  };

  return (
    <div className={`flex items-center justify-center gap-4 md:gap-6 ${className}`}>
      <motion.div
        className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-300"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        key={score}
        whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 text-2xl animate-bounce">💰</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-pulse">⭐</div>

        <div className="text-center relative z-10">
          <p className="text-xs font-black opacity-90 tracking-wider">SCORE</p>
          <motion.p
            className="text-3xl md:text-4xl font-black font-heading drop-shadow-lg"
            initial={{ scale: 1.2, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {score.toLocaleString()}
          </motion.p>
        </div>

        {/* Score increase celebration */}
        <AnimatePresence>
          {showCelebration && score > prevScore && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 150}%`,
                    y: `${50 + (Math.random() - 0.5) * 150}%`,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {['💎', '💰', '⭐', '✨', '🎉', '🌟'][i]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          className="relative bg-gradient-to-br from-red-400 via-red-500 to-pink-500 text-white px-6 py-4 rounded-3xl shadow-2xl border-4 border-red-300"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          key={streak}
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 text-2xl animate-pulse">🔥</div>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">⚡</div>

          <div className="text-center relative z-10">
            <p className="text-xs font-black opacity-90 tracking-wider">{getStreakTitle(streak)}</p>
            <motion.p
              className="text-3xl md:text-4xl font-black font-heading drop-shadow-lg flex items-center justify-center gap-2"
              initial={{ scale: 1.3, color: '#fca5a5' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.4 }}
            >
              {streak}
              <span className="text-2xl md:text-3xl">{getStreakEmoji(streak)}</span>
            </motion.p>
          </div>

          {/* Streak celebration */}
          <AnimatePresence>
            {showCelebration && streak > prevStreak && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-xl"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 180}%`,
                      y: `${50 + (Math.random() - 0.5) * 180}%`,
                      scale: [0, 1.8, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.08,
                      ease: "easeOut"
                    }}
                  >
                    {['🔥', '⚡', '💥', '✨', '🌟', '🎆', '🎇', '⭐'][i]}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Level */}
      <motion.div
        className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 text-white px-6 py-4 rounded-3xl shadow-2xl border-4 border-blue-300"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 text-2xl animate-pulse">{getLevelEmoji(level)}</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎯</div>

        <div className="text-center relative z-10">
          <p className="text-xs font-black opacity-90 tracking-wider">LEVEL</p>
          <motion.p
            className="text-3xl md:text-4xl font-black font-heading drop-shadow-lg"
            initial={{ scale: 1.2, color: '#93c5fd' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {level}
          </motion.p>
        </div>

        {/* Level up celebration */}
        <AnimatePresence>
          {level > 1 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 120}%`,
                    y: `${50 + (Math.random() - 0.5) * 120}%`,
                    scale: [0, 1.2, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.0,
                    delay: i * 0.15,
                    ease: "easeOut"
                  }}
                >
                  {['🏆', '🎖️', '⭐', '✨'][i]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
