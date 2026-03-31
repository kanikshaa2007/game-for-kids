import confetti from 'canvas-confetti';

/**
 * Format seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time for display (e.g., "45 minutes")
 */
export function formatTimeLong(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs} seconds`;
  }
  if (secs === 0) {
    return `${mins} minute${mins > 1 ? 's' : ''}`;
  }
  return `${mins} minute${mins > 1 ? 's' : ''} and ${secs} second${secs > 1 ? 's' : ''}`;
}

/**
 * Trigger confetti celebration
 */
export function triggerConfetti(): void {
  const duration = 1000;
  const end = Date.now() + duration;

  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8D8EA'];

  // Side confetti
  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // Center burst
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  }, 200);
}

/**
 * Trigger a small confetti pop for correct answers
 */
export function triggerSmallConfetti(): void {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
    disableForReducedMotion: true,
  });
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-500 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-500 bg-red-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

/**
 * Get random item from array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Play sound effect
 */
export function playSound(type: 'correct' | 'wrong' | 'click' | 'win'): void {
  // In a real implementation, you would have actual sound files
  // For now, this is a placeholder
  const audio = new Audio();

  // These would be paths to actual sound files
  const sounds: Record<string, string> = {
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/wrong.mp3',
    click: '/sounds/click.mp3',
    win: '/sounds/win.mp3',
  };

  audio.src = sounds[type] || sounds.click;
  audio.volume = 0.3;
  audio.play().catch(() => {
    // Ignore autoplay errors
  });
}

/**
 * Check if user is a child (for parental controls)
 */
export function isChildMode(): boolean {
  return localStorage.getItem('parentMode') !== 'true';
}

/**
 * Toggle parent mode
 */
export function toggleParentMode(enabled: boolean): void {
  localStorage.setItem('parentMode', enabled.toString());
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Generate a fun username suggestion for kids
 */
export function generateFunUsername(): string {
  const adjectives = ['Happy', 'Silly', 'Brave', 'Clever', 'Funny', 'Magic', 'Super', 'Cool'];
  const nouns = ['Panda', 'Tiger', 'Star', 'Rocket', 'Rainbow', 'Cookie', 'Balloon', 'Dino'];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
}

/**
 * Local storage helpers
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },
};
