import { Document, Schema, model } from 'mongoose';

export interface IScreenTimeSession extends Document {
  userId: Schema.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  totalSeconds: number;
  isActive: boolean;
  breakStartedAt?: Date;
  breakEndsAt?: Date;
}

const ScreenTimeSessionSchema = new Schema<IScreenTimeSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
  },
  totalSeconds: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  breakStartedAt: {
    type: Date,
  },
  breakEndsAt: {
    type: Date,
  },
});

const ScreenTimeSession = model<IScreenTimeSession>('ScreenTimeSession', ScreenTimeSessionSchema);

export class ScreenTimeService {
  private static readonly SCREEN_TIME_LIMIT = 45 * 60; // 45 minutes in seconds
  private static readonly BREAK_DURATION = 10 * 60; // 10 minutes in seconds

  /**
   * Start a new screen time session for a user
   */
  async startSession(userId: string): Promise<IScreenTimeSession> {
    // End any existing active sessions first
    await this.endAllSessions(userId);

    const session = await ScreenTimeSession.create({
      userId,
      startTime: new Date(),
      isActive: true,
    });

    return session;
  }

  /**
   * Get the current active session for a user
   */
  async getActiveSession(userId: string): Promise<IScreenTimeSession | null> {
    const session = await ScreenTimeSession.findOne({
      userId,
      isActive: true,
    }).sort({ startTime: -1 });

    return session;
  }

  /**
   * Update session time
   */
  async updateSessionTime(sessionId: string, totalSeconds: number): Promise<void> {
    await ScreenTimeSession.findByIdAndUpdate(sessionId, {
      totalSeconds,
    });
  }

  /**
   * End a session
   */
  async endSession(sessionId: string): Promise<void> {
    await ScreenTimeSession.findByIdAndUpdate(sessionId, {
      endTime: new Date(),
      isActive: false,
    });
  }

  /**
   * End all sessions for a user
   */
  async endAllSessions(userId: string): Promise<void> {
    await ScreenTimeSession.updateMany(
      { userId, isActive: true },
      {
        endTime: new Date(),
        isActive: false,
      }
    );
  }

  /**
   * Check if user should take a break
   */
  async shouldTakeBreak(userId: string): Promise<{
    shouldBreak: boolean;
    elapsedSeconds: number;
    remainingSeconds: number;
    isOnBreak: boolean;
    breakRemainingSeconds: number;
  }> {
    const session = await this.getActiveSession(userId);

    if (!session) {
      return {
        shouldBreak: false,
        elapsedSeconds: 0,
        remainingSeconds: ScreenTimeService.SCREEN_TIME_LIMIT,
        isOnBreak: false,
        breakRemainingSeconds: 0,
      };
    }

    // Check if currently on break
    if (session.breakStartedAt && session.breakEndsAt) {
      const now = new Date().getTime();
      const breakEnd = session.breakEndsAt.getTime();

      if (now < breakEnd) {
        // Still on break
        const breakRemainingSeconds = Math.floor((breakEnd - now) / 1000);
        return {
          shouldBreak: false,
          elapsedSeconds: session.totalSeconds,
          remainingSeconds: Math.max(0, ScreenTimeService.SCREEN_TIME_LIMIT - session.totalSeconds),
          isOnBreak: true,
          breakRemainingSeconds,
        };
      } else {
        // Break is over, clear break status
        await ScreenTimeSession.findByIdAndUpdate(session._id, {
          breakStartedAt: undefined,
          breakEndsAt: undefined,
        });
      }
    }

    const elapsedSeconds = session.totalSeconds;
    const remainingSeconds = ScreenTimeService.SCREEN_TIME_LIMIT - elapsedSeconds;

    return {
      shouldBreak: remainingSeconds <= 0,
      elapsedSeconds,
      remainingSeconds: Math.max(0, remainingSeconds),
      isOnBreak: false,
      breakRemainingSeconds: 0,
    };
  }

  /**
   * Start a break for a session
   */
  async startBreak(sessionId: string): Promise<{ breakEndsAt: Date }> {
    const breakEndsAt = new Date(Date.now() + ScreenTimeService.BREAK_DURATION * 1000);

    await ScreenTimeSession.findByIdAndUpdate(sessionId, {
      breakStartedAt: new Date(),
      breakEndsAt,
    });

    return { breakEndsAt };
  }

  /**
   * Skip break (parent override)
   */
  async skipBreak(sessionId: string): Promise<void> {
    await ScreenTimeSession.findByIdAndUpdate(sessionId, {
      breakStartedAt: undefined,
      breakEndsAt: undefined,
      // Reset session time after break
      totalSeconds: 0,
      startTime: new Date(),
    });
  }

  /**
   * Get session statistics
   */
  async getSessionStats(userId: string): Promise<{
    todaySeconds: number;
    sessionsToday: number;
    averageSessionSeconds: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await ScreenTimeSession.find({
      userId,
      startTime: { $gte: today },
    });

    const todaySeconds = sessions.reduce((acc, s) => acc + (s.totalSeconds || 0), 0);

    return {
      todaySeconds,
      sessionsToday: sessions.length,
      averageSessionSeconds: sessions.length > 0 ? Math.floor(todaySeconds / sessions.length) : 0,
    };
  }

  /**
   * Get the screen time limit in seconds
   */
  getScreenTimeLimit(): number {
    return ScreenTimeService.SCREEN_TIME_LIMIT;
  }

  /**
   * Get the break duration in seconds
   */
  getBreakDuration(): number {
    return ScreenTimeService.BREAK_DURATION;
  }
}

export const screenTimeService = new ScreenTimeService();
