'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  gameType?: 'math' | 'letters' | 'image' | 'rhyme';
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

export function AnimatedBackground({
  gameType = 'math',
  intensity = 'medium',
  children
}: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getThemeColors = () => {
    switch (gameType) {
      case 'math':
        return {
          primary: 'bg-math-primary',
          secondary: 'bg-math-secondary',
          gradient: 'from-math-primary to-math-secondary'
        };
      case 'letters':
        return {
          primary: 'bg-letters-primary',
          secondary: 'bg-letters-secondary',
          gradient: 'from-letters-primary to-letters-secondary'
        };
      case 'image':
        return {
          primary: 'bg-image-primary',
          secondary: 'bg-image-secondary',
          gradient: 'from-image-primary to-image-secondary'
        };
      case 'rhyme':
        return {
          primary: 'bg-rhyme-primary',
          secondary: 'bg-rhyme-secondary',
          gradient: 'from-rhyme-primary to-rhyme-secondary'
        };
      default:
        return {
          primary: 'bg-primary',
          secondary: 'bg-secondary',
          gradient: 'from-primary to-secondary'
        };
    }
  };

  const theme = getThemeColors();
  const elementCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`} />

      {/* Animated Elements */}
      {Array.from({ length: elementCount }, (_, i) => (
        <div key={i} className="absolute pointer-events-none">
          {getAnimatedElement(i, gameType, intensity)}
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Framer Motion Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-pink-400 to-yellow-500 rounded-full"
          animate={{
            x: [100, -100, 0, 100],
            y: [-50, 50, 0, -50],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

function getAnimatedElement(index: number, gameType: string, intensity: string) {
  const positions = [
    { top: '10%', left: '10%', delay: '0s' },
    { top: '20%', right: '15%', delay: '1s' },
    { top: '60%', left: '20%', delay: '2s' },
    { top: '70%', right: '10%', delay: '3s' },
    { top: '40%', left: '70%', delay: '4s' },
    { top: '15%', right: '60%', delay: '5s' },
    { top: '80%', left: '50%', delay: '6s' },
    { top: '30%', right: '40%', delay: '7s' },
  ];

  const pos = positions[index % positions.length];
  const size = intensity === 'low' ? 'w-8 h-8' : intensity === 'medium' ? 'w-12 h-12' : 'w-16 h-16';

  switch (gameType) {
    case 'math':
      return (
        <div
          className={`${size} ${pos.top} ${pos.left} absolute animate-plane-fly`}
          style={{ animationDelay: pos.delay }}
        >
          <div className="w-full h-full bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            ✈️
          </div>
        </div>
      );

    case 'letters':
      return (
        <div
          className={`${size} ${pos.top} ${pos.left} absolute animate-tree-sway`}
          style={{ animationDelay: pos.delay }}
        >
          <div className="w-full h-full text-4xl opacity-60">
            🌳
          </div>
        </div>
      );

    case 'image':
      return (
        <div
          className={`${size} ${pos.top} ${pos.left} absolute animate-ball-bounce`}
          style={{ animationDelay: pos.delay }}
        >
          <div className="w-full h-full bg-accent-400 rounded-full shadow-lg border-2 border-accent-600">
            ⚽
          </div>
        </div>
      );

    case 'rhyme':
      return (
        <div
          className={`${size} ${pos.top} ${pos.left} absolute animate-star-twinkle`}
          style={{ animationDelay: pos.delay }}
        >
          <div className="w-full h-full text-3xl opacity-70">
            ⭐
          </div>
        </div>
      );

    default:
      return (
        <div
          className={`${size} ${pos.top} ${pos.left} absolute animate-float`}
          style={{ animationDelay: pos.delay }}
        >
          <div className="w-full h-full bg-secondary-400 rounded-full opacity-50">
            ✨
          </div>
        </div>
      );
  }
}