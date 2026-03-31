'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Button, Card } from '@/components/ui';
import { motion } from 'framer-motion';
import ResultDisplay from '@/components/3d/scenes/ResultDisplay';

export default function ResultPage() {
  const router = useRouter();
  const { user } = useUser();
  const [score, setScore] = useState(0);
  const [gameType, setGameType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Get score from sessionStorage
    if (typeof window !== 'undefined') {
      const sessionScore = sessionStorage.getItem('gameScore');
      const sessionGameType = sessionStorage.getItem('gameType');
      
      if (sessionScore) {
        setScore(parseInt(sessionScore, 10));
        setGameType(sessionGameType || '');
      }
      
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-400">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🎉
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
            🎮 Game Over!
          </h1>
          <p className="text-xl text-white drop-shadow-md">
            Amazing effort, {user.username}!
          </p>
        </motion.div>

        {/* Result Display with 3D Model */}
        <Card className="p-8 shadow-2xl mb-8 bg-white/95">
          <ResultDisplay score={score} />
        </Card>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={() => router.push('/games')}
            variant="primary"
            size="lg"
            className="rounded-2xl"
          >
            ← Pick Another Game
          </Button>
          <Button
            onClick={() => router.push('/login')}
            variant="secondary"
            size="lg"
            className="rounded-2xl"
          >
            Change Profile
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="lg"
            className="rounded-2xl"
          >
            Go Home
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Final Score</p>
            <p className="text-4xl font-bold text-primary">{score}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
