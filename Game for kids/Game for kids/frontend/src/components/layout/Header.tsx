'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function Header() {
  const { user } = useUser();

  return (
    <motion.header
      className="bg-white shadow-soft sticky top-0 z-30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🎓
            </motion.span>
            <div>
              <h1 className="text-2xl font-bold font-heading text-primary">
                Kids Learning
              </h1>
              <p className="text-xs text-gray-500">Fun & Educational!</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/games"
                  className="hidden sm:block px-4 py-2 text-gray-600 hover:text-primary font-semibold transition-colors"
                >
                  Games
                </Link>
                <Link
                  href="/progress"
                  className="hidden sm:block px-4 py-2 text-gray-600 hover:text-primary font-semibold transition-colors"
                >
                  Progress
                </Link>
                <Link
                  href="/parent"
                  className="px-4 py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
                  title="Parent Dashboard"
                >
                  👨‍👩‍👧‍👦
                </Link>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                  <span className="text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {user.username}
                  </span>
                </div>
              </>
            ) : (
              <Link
                href="/"
                className="btn-primary text-sm py-2 px-4"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
