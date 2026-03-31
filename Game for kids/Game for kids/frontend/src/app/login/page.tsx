'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Button, Card } from '@/components/ui';
import { AVATARS } from '@/lib/constants';
import { getRandomItem } from '@/lib/utils';
import TargetBackground from '@/components/3d/scenes/TargetBackground';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isAuthenticated, isLoading } = useUser();
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(6);
  const [selectedAvatar, setSelectedAvatar] = useState(getRandomItem(AVATARS));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/game-type');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username.trim(), age);
      router.push('/game-type');
    } catch (error) {
      toast.error('Failed to continue. Try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-purple-400">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🌟
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-300 relative overflow-hidden">
      {/* Background 3D */}
      <TargetBackground />

      {/* Content */}
      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/95">
          {/* Icon */}
          <motion.div
            className="text-6xl text-center mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🎮
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Let&apos;s Get Started!
          </h1>
          <p className="text-center text-gray-600 mb-6">Tell us about yourself</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                What&apos;s your name?
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none text-lg font-semibold"
                maxLength={30}
                autoFocus
              />
            </div>

            {/* Age Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Your Age: {age}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span className="text-3xl font-bold text-primary w-12 text-center">
                  {age}
                </span>
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Pick your avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map((avatar) => (
                  <motion.button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-3xl p-3 rounded-2xl transition-all border-2 ${
                      selectedAvatar === avatar
                        ? 'bg-primary/20 border-primary scale-110'
                        : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="xl"
              fullWidth
              isLoading={isSubmitting}
              className="rounded-2xl"
            >
              Start Learning! 🚀
            </Button>
          </form>

          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 py-2 text-gray-600 font-semibold hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </Card>
      </motion.div>
    </div>
  );
}
