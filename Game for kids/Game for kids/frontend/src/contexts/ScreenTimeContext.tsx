'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ScreenTimeStatus } from '@/types';
import { getScreenTimeStatus, startScreenTimeSession, startBreak, skipBreak } from '@/lib/api';
import { GAME_CONFIG } from '@/lib/constants';

interface ScreenTimeContextType extends ScreenTimeStatus {
  sessionId: string | null;
  startSession: (userId: string) => Promise<void>;
  triggerBreak: () => Promise<void>;
  skipBreakAction: () => Promise<void>;
  shouldShowBreakModal: boolean;
  setShouldShowBreakModal: (show: boolean) => void;
  updateStatus: () => Promise<void>;
}

const ScreenTimeContext = createContext<ScreenTimeContextType | undefined>(undefined);

export function ScreenTimeProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<ScreenTimeStatus>({
    shouldBreak: false,
    elapsedSeconds: 0,
    remainingSeconds: GAME_CONFIG.screenTimeLimit,
    isOnBreak: false,
    breakRemainingSeconds: 0,
  });
  const [shouldShowBreakModal, setShouldShowBreakModal] = useState(false);
  const [localElapsedTime, setLocalElapsedTime] = useState(0);

  // Update local timer when on session
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionId && !status.isOnBreak && !status.shouldBreak) {
      interval = setInterval(() => {
        setLocalElapsedTime((prev) => {
          const newValue = prev + 1;
          const newRemaining = GAME_CONFIG.screenTimeLimit - newValue;

          if (newRemaining <= 0) {
            // Time for break
            setStatus((prev) => ({ ...prev, shouldBreak: true, remainingSeconds: 0 }));
            setShouldShowBreakModal(true);
          } else {
            setStatus((prev) => ({
              ...prev,
              elapsedSeconds: newValue,
              remainingSeconds: newRemaining,
            }));
          }

          return newValue;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionId, status.isOnBreak, status.shouldBreak]);

  // Update break timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status.isOnBreak && status.breakRemainingSeconds > 0) {
      interval = setInterval(() => {
        setStatus((prev) => ({
          ...prev,
          breakRemainingSeconds: Math.max(0, prev.breakRemainingSeconds - 1),
        }));
      }, 1000);
    } else if (status.isOnBreak && status.breakRemainingSeconds === 0) {
      // Break is over
      setStatus((prev) => ({
        ...prev,
        isOnBreak: false,
        elapsedSeconds: 0,
        remainingSeconds: GAME_CONFIG.screenTimeLimit,
      }));
      setLocalElapsedTime(0);
    }

    return () => clearInterval(interval);
  }, [status.isOnBreak, status.breakRemainingSeconds]);

  const startSession = useCallback(async (userId: string) => {
    try {
      const session = await startScreenTimeSession(userId);
      setSessionId(session.sessionId);
      setLocalElapsedTime(0);

      setStatus({
        shouldBreak: false,
        elapsedSeconds: 0,
        remainingSeconds: GAME_CONFIG.screenTimeLimit,
        isOnBreak: false,
        breakRemainingSeconds: 0,
      });
    } catch (error) {
      console.error('Failed to start screen time session:', error);
    }
  }, []);

  const triggerBreak = useCallback(async () => {
    if (!sessionId) return;

    try {
      const result = await startBreak(sessionId);
      const breakEndsAt = new Date(result.breakEndsAt).getTime();
      const now = Date.now();
      const breakRemainingSeconds = Math.floor((breakEndsAt - now) / 1000);

      setStatus((prev) => ({
        ...prev,
        isOnBreak: true,
        breakRemainingSeconds,
        shouldBreak: false,
      }));

      setShouldShowBreakModal(true);
    } catch (error) {
      console.error('Failed to start break:', error);
    }
  }, [sessionId]);

  const skipBreakAction = useCallback(async () => {
    if (!sessionId) return;

    try {
      await skipBreak(sessionId, GAME_CONFIG.screenTimeLimit.toString());
      // This will fail server-side but we handle it in the BreakModal component
    } catch (error) {
      console.error('Failed to skip break:', error);
      throw error;
    }
  }, [sessionId]);

  const updateStatus = useCallback(async () => {
    // This would be called with userId from parent component
    // For now, we rely on the local timer
  }, []);

  return (
    <ScreenTimeContext.Provider
      value={{
        ...status,
        sessionId,
        startSession,
        triggerBreak,
        skipBreakAction,
        shouldShowBreakModal,
        setShouldShowBreakModal,
        updateStatus,
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
}

export function useScreenTime() {
  const context = useContext(ScreenTimeContext);

  if (context === undefined) {
    throw new Error('useScreenTime must be used within a ScreenTimeProvider');
  }

  return context;
}
