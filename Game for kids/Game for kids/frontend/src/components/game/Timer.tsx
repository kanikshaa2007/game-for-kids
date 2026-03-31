'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '@/lib/utils';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onTimeUp?: () => void;
  variant?: 'count-up' | 'count-down';
  showLabel?: boolean;
  className?: string;
}

export default function Timer({
  seconds,
  isRunning,
  onTimeUp,
  variant = 'count-up',
  showLabel = true,
  className = '',
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(variant === 'count-down' ? seconds : 0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimeUpCelebration, setShowTimeUpCelebration] = useState(false);

  useEffect(() => {
    if (variant === 'count-down') {
      setTimeLeft(seconds);
    }
  }, [seconds, variant]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (variant === 'count-up') {
          setElapsedTime((prev) => {
            const newValue = prev + 1;
            if (onTimeUp && newValue >= seconds) {
              onTimeUp();
              setShowTimeUpCelebration(true);
              setTimeout(() => setShowTimeUpCelebration(false), 2000);
            }
            return newValue;
          });
        } else {
          setTimeLeft((prev) => {
            const newValue = prev - 1;
            if (onTimeUp && newValue <= 0) {
              onTimeUp();
              setShowTimeUpCelebration(true);
              setTimeout(() => setShowTimeUpCelebration(false), 2000);
            }
            return Math.max(0, newValue);
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, variant, seconds, onTimeUp]);

  const displayTime = variant === 'count-up' ? elapsedTime : timeLeft;
  const isLow = variant === 'count-down' && timeLeft <= 10;
  const isVeryLow = variant === 'count-down' && timeLeft <= 5;
  const progress = variant === 'count-down' ? (timeLeft / seconds) * 100 : Math.min((elapsedTime / seconds) * 100, 100);

  const getTimerColor = () => {
    if (isVeryLow) return 'from-red-500 to-red-700 border-red-400';
    if (isLow) return 'from-orange-500 to-orange-700 border-orange-400';
    if (variant === 'count-up' && elapsedTime > seconds * 0.8) return 'from-yellow-500 to-yellow-700 border-yellow-400';
    return 'from-green-500 to-green-700 border-green-400';
  };

  const getTimerIcon = () => {
    if (isVeryLow) return '⏰';
    if (isLow) return '⚠️';
    if (variant === 'count-up' && elapsedTime > seconds * 0.8) return '🏃';
    return '⏱️';
  };

  const getUrgencyAnimation = () => {
    if (isVeryLow) return { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] };
    if (isLow) return { scale: [1, 1.1, 1] };
    return {};
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Timer Display */}
      <motion.div
        className={`relative bg-gradient-to-br ${getTimerColor()} text-white px-6 py-4 rounded-3xl shadow-2xl border-4 min-w-[140px] overflow-hidden`}
        animate={getUrgencyAnimation()}
        transition={{
          repeat: isLow ? Infinity : 0,
          duration: isVeryLow ? 0.3 : 0.5,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1 right-1 text-xl animate-pulse">
            {getTimerIcon()}
          </div>
        </div>

        {/* Progress bar background */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20">
          <motion.div
            className="h-full bg-white/60 rounded-full"
            initial={{ width: variant === 'count-down' ? '100%' : '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Timer content */}
        <div className="text-center relative z-10">
          {showLabel && (
            <p className="text-xs font-black opacity-90 tracking-wider mb-1">
              {variant === 'count-up' ? 'TIME ELAPSED' : 'TIME LEFT'}
            </p>
          )}
          <motion.p
            className="text-2xl md:text-3xl font-black font-mono drop-shadow-lg"
            key={displayTime}
            initial={{ scale: 1.1, color: '#ffffff' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(displayTime)}
          </motion.p>
        </div>

        {/* Time up celebration */}
        <AnimatePresence>
          {showTimeUpCelebration && (
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center h-full">
                <motion.div
                  className="text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🎉
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Urgency particles */}
        <AnimatePresence>
          {isVeryLow && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-lg"
                  initial={{
                    x: `${20 + Math.random() * 60}%`,
                    y: `${20 + Math.random() * 60}%`,
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${20 + Math.random() * 60}%`,
                    y: `${20 + Math.random() * 60}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.0,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                >
                  {['💨', '⚡', '🔥', '💥', '⚠️', '⏰'][i]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress indicator for countdown */}
      {variant === 'count-down' && (
        <div className="w-full max-w-[140px]">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isVeryLow ? 'bg-red-500' :
                isLow ? 'bg-orange-500' : 'bg-green-500'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Motivational messages */}
      {isLow && variant === 'count-down' && (
        <motion.p
          className="text-sm font-bold text-red-600 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {timeLeft <= 3 ? 'HURRY UP! 🚀' : 'QUICK! ⚡'}
        </motion.p>
      )}
    </div>
  );
}
