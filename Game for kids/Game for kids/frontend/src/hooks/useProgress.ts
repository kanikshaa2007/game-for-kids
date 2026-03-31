'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress, SubjectProgress } from '@/types';
import { getUserProgress } from '@/lib/api';

interface UseProgressReturn {
  progress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getAccuracy: (subject: keyof UserProgress) => number;
  getTotalCorrect: (subject: keyof UserProgress) => number;
  getTotalAttempts: (subject: keyof UserProgress) => number;
}

export function useProgress(userId: string | null): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserProgress(userId);
      setProgress(data.progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getAccuracy = useCallback((subject: keyof UserProgress): number => {
    if (!progress) return 0;

    const subjectProgress = progress[subject];
    const totalCorrect =
      subjectProgress.easy.correct +
      subjectProgress.medium.correct +
      subjectProgress.hard.correct;

    const totalAttempts =
      subjectProgress.easy.total +
      subjectProgress.medium.total +
      subjectProgress.hard.total;

    if (totalAttempts === 0) return 0;
    return Math.round((totalCorrect / totalAttempts) * 100);
  }, [progress]);

  const getTotalCorrect = useCallback((subject: keyof UserProgress): number => {
    if (!progress) return 0;

    const subjectProgress = progress[subject];
    return (
      subjectProgress.easy.correct +
      subjectProgress.medium.correct +
      subjectProgress.hard.correct
    );
  }, [progress]);

  const getTotalAttempts = useCallback((subject: keyof UserProgress): number => {
    if (!progress) return 0;

    const subjectProgress = progress[subject];
    return (
      subjectProgress.easy.total +
      subjectProgress.medium.total +
      subjectProgress.hard.total
    );
  }, [progress]);

  return {
    progress,
    isLoading,
    error,
    refresh: fetchProgress,
    getAccuracy,
    getTotalCorrect,
    getTotalAttempts,
  };
}
