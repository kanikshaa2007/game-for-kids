'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout';
import { Card, Button, ProgressBar } from '@/components/ui';
import { getAllUsers, getScreenTimeStats } from '@/lib/api';
import toast from 'react-hot-toast';

interface UserStats {
  _id: string;
  username: string;
  age: number;
  score: number;
  level: number;
  totalGamesPlayed: number;
  lastActive: string;
}

export default function ParentPage() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [screenTimeData, setScreenTimeData] = useState<Record<string, any>>({});

  const PARENT_PIN = '1234';

  useEffect(() => {
    const isAuth = sessionStorage.getItem('parentAuthenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      loadUsers();
      return;
    }

    setShowPinModal(true);
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);

      const stats: Record<string, any> = {};
      for (const user of data) {
        try {
          const screenStats = await getScreenTimeStats(user._id);
          stats[user._id] = screenStats;
        } catch {
          stats[user._id] = { todaySeconds: 0, sessionsToday: 0 };
        }
      }
      setScreenTimeData(stats);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = () => {
    if (pin === PARENT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('parentAuthenticated', 'true');
      setShowPinModal(false);
      loadUsers();
      toast.success('Welcome, Parent!');
      return;
    }

    toast.error('Incorrect PIN');
    setPin('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('parentAuthenticated');
    setShowPinModal(true);
    setUsers([]);
  };

  const getLastActiveText = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold font-heading text-primary">
              Parent Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your child&apos;s learning progress
            </p>
          </div>

          {isAuthenticated && (
            <Button onClick={handleLogout} variant="ghost" size="md">
              Exit Parent Mode
            </Button>
          )}
        </motion.div>

        {!isAuthenticated ? (
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center">
              <span className="text-6xl mb-4 block">PIN</span>
              <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">
                Parent Access
              </h2>
              <p className="text-gray-600 mb-6">
                Enter your PIN to access the parent dashboard
              </p>

              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="input-field text-center text-3xl tracking-widest mb-4"
                placeholder="****"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
              />

              <Button
                onClick={handlePinSubmit}
                variant="primary"
                size="xl"
                fullWidth
                disabled={pin.length !== 4}
              >
                Submit
              </Button>

              <p className="text-xs text-gray-400 mt-4">
                Default PIN: 1234
              </p>
            </Card>
          </motion.div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <motion.div
              className="text-6xl inline-block"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Loading
            </motion.div>
            <p className="text-gray-500 mt-4">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="stat">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">Kids</span>
                  <div>
                    <p className="text-3xl font-bold font-heading text-primary">
                      {users.length}
                    </p>
                    <p className="text-sm text-gray-500">Registered Kids</p>
                  </div>
                </div>
              </Card>

              <Card variant="stat">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">Games</span>
                  <div>
                    <p className="text-3xl font-bold font-heading text-secondary">
                      {users.reduce((sum, u) => sum + u.totalGamesPlayed, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Total Games Played</p>
                  </div>
                </div>
              </Card>

              <Card variant="stat">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">Top</span>
                  <div>
                    <p className="text-3xl font-bold font-heading text-accent">
                      {Math.max(...users.map((u) => u.score), 0)}
                    </p>
                    <p className="text-sm text-gray-500">Highest Score</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-bold font-heading text-gray-800 mb-6">
                Kids Overview
              </h2>

              {users.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No users registered yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => {
                    const screenStats = screenTimeData[user._id] || {};
                    const todayMinutes = Math.floor((screenStats.todaySeconds || 0) / 60);

                    return (
                      <motion.div
                        key={user._id}
                        className="bg-gray-50 rounded-2xl p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">
                                {user.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                Age {user.age} | Level {user.level}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xl font-bold text-primary">
                                {user.score}
                              </p>
                              <p className="text-xs text-gray-500">Points</p>
                            </div>

                            <div className="text-center">
                              <p className="text-xl font-bold text-secondary">
                                {user.totalGamesPlayed}
                              </p>
                              <p className="text-xs text-gray-500">Games</p>
                            </div>

                            <div className="text-center">
                              <p className="text-xl font-bold text-accent">
                                {todayMinutes}m
                              </p>
                              <p className="text-xs text-gray-500">Today</p>
                            </div>

                            <div className="text-center text-sm text-gray-500">
                              <p className="text-xs">Last Active</p>
                              <p className="font-semibold">
                                {getLastActiveText(user.lastActive)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">Screen Time Today</span>
                            <span className="text-gray-700 font-semibold">
                              {todayMinutes} / 45 min
                            </span>
                          </div>
                          <ProgressBar
                            value={todayMinutes}
                            max={45}
                            color={todayMinutes >= 45 ? 'warning' : 'secondary'}
                            showLabel={false}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-2xl font-bold font-heading text-gray-800 mb-4">
                Tips for Parents
              </h2>

              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>Screen Time:</strong> The app enforces a 45-minute limit with automatic breaks. You can override this with the PIN if needed.
                </p>
                <p>
                  <strong>Progress Tracking:</strong> Check the Progress page to see your child&apos;s improvement in each subject area.
                </p>
                <p>
                  <strong>Encouragement:</strong> Celebrate badge unlocks and level ups to keep your child motivated.
                </p>
                <p>
                  <strong>Difficulty:</strong> The AI adapts difficulty based on performance. Don&apos;t worry if it seems challenging; it&apos;s personalized.
                </p>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
