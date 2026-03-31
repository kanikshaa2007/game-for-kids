'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatTime } from '@/lib/utils';
import { PARENT_PIN } from '@/lib/constants';

interface BreakModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onSkipBreak: () => void;
  onClose: () => void;
}

const breakActivities = [
  { icon: '🏃‍♂️', text: 'Run around the room!', color: 'from-blue-400 to-blue-600' },
  { icon: '🤸‍♀️', text: 'Do some jumping jacks!', color: 'from-pink-400 to-pink-600' },
  { icon: '💧', text: 'Drink some water!', color: 'from-cyan-400 to-cyan-600' },
  { icon: '👀', text: 'Look out the window!', color: 'from-green-400 to-green-600' },
  { icon: '🧘‍♂️', text: 'Take deep breaths!', color: 'from-purple-400 to-purple-600' },
  { icon: '🤗', text: 'Give someone a hug!', color: 'from-yellow-400 to-yellow-600' },
];

export default function BreakModal({
  isOpen,
  remainingSeconds,
  onSkipBreak,
  onClose,
}: BreakModalProps) {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [currentActivity, setCurrentActivity] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentActivity(prev => (prev + 1) % breakActivities.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleSkipBreak = () => {
    if (pin === PARENT_PIN) {
      onSkipBreak();
      setShowPinInput(false);
      setPin('');
      setError('');
      onClose();
      return;
    }

    setError('Incorrect PIN. Please try again.');
    setPin('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      closeOnOverlay={false}
    >
      <div className="text-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['🌟', '✨', '💫', '🎈', '🎊', '🎉'][i % 6]}
            </motion.div>
          ))}
        </div>

        {/* Main character */}
        <motion.div
          className="text-8xl mb-4 relative z-10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          😴
        </motion.div>

        {/* Brain character */}
        <motion.div
          className="text-6xl mb-2"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            delay: 0.5
          }}
        >
          🧠
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          BREAK TIME! 🎉
        </motion.h2>

        <motion.p
          className="text-gray-700 mb-6 text-xl font-semibold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your amazing brain needs a rest! You&apos;ve been learning for 45 minutes! 🌟
        </motion.p>

        {/* Timer display */}
        <motion.div
          className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white rounded-3xl p-8 mb-6 shadow-2xl border-4 border-white/50 relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Timer background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 text-3xl animate-pulse">⏰</div>
            <div className="absolute bottom-2 left-2 text-2xl animate-bounce">⭐</div>
          </div>

          <motion.p
            className="text-white/90 mb-2 font-bold text-lg tracking-wider"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            BREAK TIME REMAINING
          </motion.p>
          <motion.p
            className="text-5xl md:text-6xl font-black font-mono drop-shadow-2xl"
            key={remainingSeconds}
            initial={{ scale: 1.2, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(remainingSeconds)}
          </motion.p>
        </motion.div>

        {/* Activity suggestion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentActivity}
            className={`bg-gradient-to-r ${breakActivities[currentActivity].color} text-white rounded-2xl p-6 mb-6 shadow-xl border-4 border-white/30`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              {breakActivities[currentActivity].icon}
            </motion.div>
            <p className="text-xl font-bold drop-shadow-lg">
              {breakActivities[currentActivity].text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-4">
          <motion.p
            className="text-gray-600 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Take a break and come back refreshed! 💪
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              variant="secondary"
              size="xl"
              fullWidth
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              I&apos;m Ready to Continue! 🚀
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setShowPinInput(true)}
              className="text-gray-500 hover:text-gray-700 font-semibold"
            >
              👨‍👩‍👧‍👦 Parent Override
            </Button>
          </motion.div>
        </div>

        {/* PIN input modal */}
        <AnimatePresence>
          {showPinInput && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mt-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-4 border-yellow-200 shadow-2xl"
            >
              <motion.div
                className="text-4xl mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔐
              </motion.div>
              <h3 className="font-black text-gray-800 mb-4 text-xl">
                Enter Parent PIN
              </h3>
              <motion.input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-4 border-gray-300 focus:border-purple-400 focus:outline-none text-center text-3xl tracking-widest mb-4 font-bold bg-white shadow-inner"
                placeholder="****"
                autoFocus
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-red-600 text-sm mb-4 font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setShowPinInput(false);
                    setPin('');
                    setError('');
                  }}
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleSkipBreak}
                  disabled={pin.length !== 4}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
                >
                  Skip Break
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
