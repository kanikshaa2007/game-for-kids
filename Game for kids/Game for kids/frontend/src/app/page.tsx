'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import AircraftIntro from '@/components/3d/scenes/AircraftIntro';

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 via-pink-300 to-blue-200">
      {/* 3D Aircraft Animation */}
      <AircraftIntro />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Logo */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            🎮
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.4 }}
          >
            Quik Learn
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-white mb-8 drop-shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.4 }}
          >
            Learn Through Play!
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.4 }}
          >
            <Button
              onClick={() => router.push('/login')}
              variant="primary"
              size="xl"
              className="rounded-full px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
            >
              Get Started 🚀
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}