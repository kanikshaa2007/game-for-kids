# 🔗 Integration Guide - Using New Components

## How to Use the New Features in Your Existing Code

### Option 1: Use ImprovedGameSession (Recommended)

Replace your current game page with the new improved session:

**Before:**
```tsx
// frontend/src/app/games/[type]/page.tsx
import { useGame } from '@/hooks/useGame';
// ... lots of state management code
```

**After:**
```tsx
'use client';

import { ImprovedGameSession } from '@/components/game';
import { useRouter } from 'next/navigation';

export default function GamePlayPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <ImprovedGameSession
        gameType="math"
        difficulty="medium"
        onGameEnd={(score) => {
          router.push(`/progress?score=${score}`);
        }}
      />
    </div>
  );
}
```

### Option 2: Use EnhancedGameDisplay in Your Existing Code

Add 3D visuals to your current game:

```tsx
'use client';

import { EnhancedGameDisplay } from '@/components/game';
import { useState } from 'react';

export default function MyGameComponent() {
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>();
  const [showParticles, setShowParticles] = useState(false);

  const handleAnswer = (answer: string) => {
    const correct = answer === 'correct_answer';
    setIsCorrect(correct);
    setShowParticles(true);

    setTimeout(() => {
      setShowParticles(false);
      setIsCorrect(undefined);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <EnhancedGameDisplay
        gameType="math"
        isCorrect={isCorrect}
        showParticles={showParticles}
        difficulty="medium"
      />

      {/* Your existing game content */}
      <div className="bg-white rounded-2xl p-6">
        {/* Question and answers */}
      </div>
    </div>
  );
}
```

### Option 3: Use Individual 3D Components

Add 3D elements to specific parts of your game:

#### Add 3D Character
```tsx
import { AnimatedCharacter3D } from '@/components/ui';

export default function GameHeader() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h1>Math Magic</h1>
        <p>Solve the problems!</p>
      </div>
      <AnimatedCharacter3D emotion="thinking" scale={1.2} />
    </div>
  );
}
```

#### Add 3D Shapes
```tsx
import { Shape3D } from '@/components/ui';

export default function MathVisualization() {
  return (
    <div className="space-y-4">
      <h2>How many cubes?</h2>
      <Shape3D type="cube" color="#FF6B6B" count={3} />
      <p>Answer: 3 cubes!</p>
    </div>
  );
}
```

#### Add Particle Effects
```tsx
import { ParticleEffect } from '@/components/ui';
import { useState } from 'react';

export default function GameWithEffects() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCorrectAnswer = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <ParticleEffect type="success" trigger={showSuccess} />
      <button onClick={handleCorrectAnswer}>
        Check Answer
      </button>
    </>
  );
}
```

### Option 4: Use useReactiveGame Hook

Replace your current game hook with better state management:

**Before:**
```tsx
import { useGame } from '@/hooks/useGame';

const {
  question,
  isLoading,
  error,
  score,
  generateQuestion,
  submitAnswer,
} = useGame({ gameType: 'math', difficulty: 'easy' });
```

**After:**
```tsx
import { useReactiveGame } from '@/hooks/useReactiveGame';

const {
  question,
  isLoading,
  error,
  score,
  streak,
  feedback,
  generateQuestion,
  submitAnswer,
  clearError,
  clearFeedback,
} = useReactiveGame('math', 'easy');
```

## Step-by-Step Integration

### Step 1: Update Your Game Page

Edit: `frontend/src/app/games/[type]/page.tsx`

```tsx
'use client';

import { ImprovedGameSession } from '@/components/game';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function GamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const gameType = params.type as string;

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <ImprovedGameSession
          gameType={gameType as any}
          difficulty="medium"
          onGameEnd={(score) => {
            router.push('/games');
          }}
        />
      </div>
    </div>
  );
}
```

### Step 2: Update Your Dashboard

Add 3D character to your dashboard:

```tsx
'use client';

import { AnimatedCharacter3D } from '@/components/ui';
import { useUser } from '@/contexts/UserContext';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1>Welcome, {user?.username}!</h1>
        <p>Your Score: {user?.score}</p>
      </div>
      <AnimatedCharacter3D emotion="happy" scale={1.5} />
    </div>
  );
}
```

### Step 3: Add Error Handling

Update your API calls to use better error handling:

```tsx
import { getErrorMessage } from '@/lib/errors';
import toast from 'react-hot-toast';

async function handleGameAction() {
  try {
    const response = await fetch('/api/game/generate');
    if (!response.ok) throw new Error('Failed');
    // ... handle success
  } catch (error) {
    const message = getErrorMessage(error);
    toast.error(message);
  }
}
```

## Common Integration Patterns

### Pattern 1: Game with Feedback
```tsx
const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

const handleAnswer = async (answer: string) => {
  const result = await submitAnswer(answer);
  setFeedback(result.isCorrect ? 'correct' : 'incorrect');
  
  setTimeout(() => setFeedback(null), 1500);
};

return (
  <>
    <EnhancedGameDisplay
      gameType="math"
      isCorrect={feedback === 'correct'}
      showParticles={feedback !== null}
    />
  </>
);
```

### Pattern 2: Progressive Difficulty
```tsx
const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

const handleLevelUp = () => {
  if (difficulty === 'easy') setDifficulty('medium');
  else if (difficulty === 'medium') setDifficulty('hard');
};

return (
  <ImprovedGameSession
    gameType="math"
    difficulty={difficulty}
    onGameEnd={handleLevelUp}
  />
);
```

### Pattern 3: Character Reactions
```tsx
const getEmotion = () => {
  if (streak > 5) return 'celebrating';
  if (isLoading) return 'thinking';
  return 'happy';
};

return (
  <AnimatedCharacter3D emotion={getEmotion()} scale={1.2} />
);
```

## Styling Integration

### Tailwind Classes Used
- `rounded-2xl` - Rounded corners
- `shadow-lg` - Drop shadows
- `bg-gradient-to-br` - Gradient backgrounds
- `grid grid-cols-2` - Grid layouts
- `space-y-6` - Vertical spacing

### Custom Animations
- Framer Motion for smooth transitions
- Three.js for 3D rotations
- CSS animations for floating effects

## Performance Optimization

### For Slower Devices
```tsx
// Disable particle effects
<ParticleEffect trigger={false} />

// Reduce shape count
<Shape3D type="cube" count={1} />

// Disable auto-rotate
// Edit Shape3D.tsx and remove autoRotate
```

### For Better Performance
```tsx
// Use React.memo for components
const MemoizedCharacter = React.memo(AnimatedCharacter3D);

// Lazy load 3D components
const Shape3D = dynamic(() => import('@/components/ui/Shape3D'), {
  loading: () => <div>Loading...</div>,
});
```

## Testing Your Integration

### Test Checklist
- [ ] 3D character appears
- [ ] 3D shapes rotate smoothly
- [ ] Particle effects trigger on answers
- [ ] No console errors
- [ ] Smooth animations
- [ ] Error messages display correctly
- [ ] Game completes successfully

## Rollback Instructions

If you need to revert to the original code:

```bash
# Restore original game page
git checkout frontend/src/app/games/[type]/page.tsx

# Remove new components
rm frontend/src/components/ui/AnimatedCharacter3D.tsx
rm frontend/src/components/ui/Shape3D.tsx
rm frontend/src/components/ui/ParticleEffect.tsx
```

## Next Steps

1. Choose your integration approach
2. Update your game page
3. Test thoroughly
4. Customize colors and animations
5. Deploy and enjoy!

---

**Need help?** Check the component files for inline documentation!
