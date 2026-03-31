/**
 * In-memory database for local development
 * Fallback when MongoDB Atlas is unavailable
 */

interface StoredUser {
  _id: string;
  username: string;
  age: number;
  score: number;
  level: number;
  accuracy: number;
  totalGamesPlayed: number;
  streak: number;
  badges: string[];
  createdAt: Date;
  lastActive: Date;
}

class MemoryDatabase {
  private users: Map<string, StoredUser> = new Map();
  private userCounter: number = 1;

  initialize() {
    console.log('✓ In-memory database initialized (local fallback)');
    return Promise.resolve();
  }

  generateId(): string {
    const id = (this.userCounter++).toString().padStart(24, '0');
    return id;
  }

  createUser(username: string, age: number): StoredUser {
    const id = this.generateId();
    const user: StoredUser = {
      _id: id,
      username,
      age,
      score: 0,
      level: 1,
      accuracy: 0,
      totalGamesPlayed: 0,
      streak: 0,
      badges: [],
      createdAt: new Date(),
      lastActive: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  findUserByUsername(username: string): StoredUser | null {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  findUserById(id: string): StoredUser | null {
    return this.users.get(id) || null;
  }

  updateUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates, lastActive: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  getAllUsers(): StoredUser[] {
    return Array.from(this.users.values());
  }

  getLeaderboard(limit: number = 10): StoredUser[] {
    return Array.from(this.users.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  clear() {
    this.users.clear();
    this.userCounter = 1;
  }

  getStats() {
    return {
      totalUsers: this.users.size,
      users: Array.from(this.users.values()),
    };
  }
}

export const memoryDb = new MemoryDatabase();
