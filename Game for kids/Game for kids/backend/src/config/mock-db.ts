/**
 * Mock database for when MongoDB is unavailable
 * Stores data in memory for development/testing
 */

interface MockUser {
  _id: string;
  username: string;
  age: number;
  score: number;
  level: number;
  accuracy: number;
  totalGamesPlayed: number;
  streak: number;
  badges: string[];
}

const mockUsers = new Map<string, MockUser>();
let userIdCounter = 1000;

function generateId(): string {
  return (userIdCounter++).toString().padStart(24, '0');
}

export const mockDb = {
  findUserByUsername(username: string): MockUser | null {
    for (const user of mockUsers.values()) {
      if (user.username === username) {
        return { ...user };
      }
    }
    return null;
  },

  findUserById(id: string): MockUser | null {
    const user = mockUsers.get(id);
    return user ? { ...user } : null;
  },

  createUser(username: string, age: number): MockUser {
    const id = generateId();
    const user: MockUser = {
      _id: id,
      username,
      age,
      score: 0,
      level: 1,
      accuracy: 0,
      totalGamesPlayed: 0,
      streak: 0,
      badges: [],
    };
    mockUsers.set(id, user);
    return { ...user };
  },

  updateUser(id: string, updates: Partial<MockUser>): MockUser | null {
    const user = mockUsers.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    mockUsers.set(id, updated);
    return { ...updated };
  },

  getAllUsers(): MockUser[] {
    return Array.from(mockUsers.values()).map(u => ({ ...u }));
  },

  getLeaderboard(limit: number = 10): MockUser[] {
    return Array.from(mockUsers.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(u => ({ ...u }));
  },

  clear() {
    mockUsers.clear();
    userIdCounter = 1000;
  },

  isEnabled: false,

  enable() {
    this.isEnabled = true;
    console.log('✓ Mock database enabled (MongoDB unavailable)');
  },
};
