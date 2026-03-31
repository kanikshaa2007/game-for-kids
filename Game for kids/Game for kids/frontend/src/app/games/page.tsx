'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Card, Button } from '@/components/ui';
import { GAME_TYPES } from '@/lib/constants';
import LightningFX from '@/components/3d/scenes/LightningFX';

export default function GameTypePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ⚡
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-10 bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 relative overflow-hidden">
      {/* Background Lightning */}
      <div className="hidden md:block">
        <LightningFX />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
            🎯 Pick Your Game!
          </h1>
          <p className="text-xl text-white drop-shadow-md">
            Choose a challenge and start learning
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {GAME_TYPES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card
                className="h-full cursor-pointer overflow-hidden group hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => router.push(`/play/${game.id}`)}
              >
                <div className="p-6 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-gray-50 group-hover:to-gray-100 transition-colors">
                  {/* Icon */}
                  <motion.div
                    className={`text-6xl mb-4 p-4 rounded-3xl bg-gradient-to-br ${game.color}`}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {game.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold font-heading text-gray-800 mb-2">
                    {game.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Play Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-auto rounded-full"
                  >
                    Play Now →
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <p className="text-gray-700 font-semibold mb-2">💡 Learning Tip</p>
            <p className="text-gray-600">
              Take breaks every 30 minutes to keep your brain fresh!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}