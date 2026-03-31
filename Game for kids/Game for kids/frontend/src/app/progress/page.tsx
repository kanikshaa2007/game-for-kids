'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/hooks/useProgress';
import { Header, Navigation } from '@/components/layout';
import { Card, Badge, BadgeGrid, ProgressBar } from '@/components/ui';
import { BADGES } from '@/lib/constants';

export default function ProgressPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const { progress, isLoading: isProgressLoading, getAccuracy, getTotalCorrect, getTotalAttempts } = useProgress(user?._id || null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    if (user?.badges) {
      setUnlockedBadges(user.badges);
    }
  }, [user?.badges]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, router, user]);

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-gray-500">
          Loading...
        </main>
      </div>
    );
  }

  const subjects = ['math', 'letters', 'image', 'rhyme'] as const;

  const getSubjectIcon = (subject: typeof subjects[number]): string => {
    const icons: Record<typeof subjects[number], string> = {
      math: '123',
      letters: 'ABC',
      image: 'IMG',
      rhyme: 'RHY',
    };
    return icons[subject];
  };

  const getSubjectName = (subject: typeof subjects[number]): string => {
    const names: Record<typeof subjects[number], string> = {
      math: 'Math Magic',
      letters: 'Letter Land',
      image: 'Picture Puzzle',
      rhyme: 'Rhyme Time',
    };
    return names[subject];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <Navigation />
        </div>

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold font-heading text-primary mb-2">
            Your Progress
          </h1>
          <p className="text-gray-600">
            Great job, {user.username}! Keep learning!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card variant="stat" className="text-center">
              <span className="text-4xl block mb-2">Score</span>
              <p className="text-3xl font-bold font-heading text-primary">{user.score}</p>
              <p className="text-sm text-gray-500">Total Points</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card variant="stat" className="text-center">
              <span className="text-4xl block mb-2">Lvl</span>
              <p className="text-3xl font-bold font-heading text-secondary">{user.level}</p>
              <p className="text-sm text-gray-500">Level</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card variant="stat" className="text-center">
              <span className="text-4xl block mb-2">Acc</span>
              <p className="text-3xl font-bold font-heading text-success">{user.accuracy}%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card variant="stat" className="text-center">
              <span className="text-4xl block mb-2">Run</span>
              <p className="text-3xl font-bold font-heading text-accent">{user.streak}</p>
              <p className="text-sm text-gray-500">Streak</p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-6">
              Subject Progress
            </h2>

            {isProgressLoading || !progress ? (
              <p className="text-gray-500">Loading progress...</p>
            ) : (
              <div className="space-y-6">
                {subjects.map((subject) => {
                  const accuracy = getAccuracy(subject);
                  const correct = getTotalCorrect(subject);
                  const total = getTotalAttempts(subject);

                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getSubjectIcon(subject)}</span>
                          <span className="font-bold text-gray-700">
                            {getSubjectName(subject)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {correct}/{total} correct
                        </div>
                      </div>
                      <ProgressBar
                        value={accuracy}
                        max={100}
                        color="gradient"
                        showLabel={false}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h2 className="text-2xl font-bold font-heading text-gray-800 mb-6">
              Your Badges
            </h2>

            <BadgeGrid>
              {BADGES.map((badge) => (
                <Badge
                  key={badge.id}
                  {...badge}
                  unlocked={unlockedBadges.includes(badge.id)}
                  size="sm"
                />
              ))}
            </BadgeGrid>

            {unlockedBadges.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                Play games to unlock badges.
              </p>
            )}
          </Card>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-heading text-gray-800">
                Level Progress
              </h2>
              <span className="text-3xl">Next</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold font-heading text-primary">
                  {user.level}
                </p>
                <p className="text-sm text-gray-500">Current</p>
              </div>

              <div className="flex-1">
                <ProgressBar
                  value={user.score % 100}
                  max={100}
                  color="primary"
                />
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold font-heading text-gray-400">
                  {user.level + 1}
                </p>
                <p className="text-sm text-gray-500">Next</p>
              </div>
            </div>

            <p className="text-center text-gray-500 mt-4 text-sm">
              {100 - (user.score % 100)} more points to reach Level {user.level + 1}!
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
