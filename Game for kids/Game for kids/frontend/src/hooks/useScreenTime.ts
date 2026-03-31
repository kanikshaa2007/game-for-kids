'use client';

import { useState, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '@/lib/constants';

interface UseScreenTimeReturn {
  elapsedSeconds: number;
  remainingSeconds: number;
  isOnBreak: boolean;
  breakRemainingSeconds: number;
  shouldShowBreak: boolean;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  startBreak: () => void;
  skipBreak: () => void;
}

export function useScreenTime(): UseScreenTimeReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakRemainingSeconds, setBreakRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [shouldShowBreak, setShouldShowBreak] = useState(false);

  const remainingSeconds = GAME_CONFIG.screenTimeLimit - elapsedSeconds;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newValue = prev + 1;

          if (newValue >= GAME_CONFIG.screenTimeLimit) {
            setShouldShowBreak(true);
            setIsRunning(false);
            return GAME_CONFIG.screenTimeLimit;
          }

          return newValue;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isOnBreak]);

  // Break timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOnBreak && breakRemainingSeconds > 0) {
      interval = setInterval(() => {
        setBreakRemainingSeconds((prev) => {
          const newValue = prev - 1;

          if (newValue <= 0) {
            setIsOnBreak(false);
            setElapsedSeconds(0);
            return 0;
          }

          return newValue;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isOnBreak, breakRemainingSeconds]);

  const start = useCallback(() => {
    setIsRunning(true);
    setShouldShowBreak(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
    setShouldShowBreak(false);
    setIsOnBreak(false);
    setBreakRemainingSeconds(0);
  }, []);

  const startBreak = useCallback(() => {
    setIsOnBreak(true);
    setBreakRemainingSeconds(GAME_CONFIG.breakDuration);
    setShouldShowBreak(false);
  }, []);

  const skipBreak = useCallback(() => {
    setIsOnBreak(false);
    setElapsedSeconds(0);
    setBreakRemainingSeconds(0);
    setIsRunning(true);
  }, []);

  return {
    elapsedSeconds,
    remainingSeconds,
    isOnBreak,
    breakRemainingSeconds,
    shouldShowBreak,
    isRunning,
    start,
    pause,
    resume,
    reset,
    startBreak,
    skipBreak,
  };
}
