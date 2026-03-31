'use client';

import { motion } from 'framer-motion';
import { SubjectProgress } from '@/types';

interface ProgressChartProps {
  subject: string;
  data: SubjectProgress;
  icon: string;
}

export default function ProgressChart({ subject, data, icon }: ProgressChartProps) {
  const calculatePercentage = (level: keyof typeof data) => {
    const { correct, total } = data[level];
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const easyPercent = calculatePercentage('easy');
  const mediumPercent = calculatePercentage('medium');
  const hardPercent = calculatePercentage('hard');

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-bold font-heading text-gray-800 capitalize">
          {subject}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Easy */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-600 font-semibold">Easy</span>
            <span className="text-gray-500">{data.easy.correct}/{data.easy.total}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${easyPercent}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        </div>

        {/* Medium */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-yellow-600 font-semibold">Medium</span>
            <span className="text-gray-500">{data.medium.correct}/{data.medium.total}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${mediumPercent}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Hard */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-600 font-semibold">Hard</span>
            <span className="text-gray-500">{data.hard.correct}/{data.hard.total}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${hardPercent}%` }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Overall Accuracy */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-semibold">Overall Accuracy</span>
          <span className="text-2xl font-bold font-heading text-primary">
            {(() => {
              const totalCorrect = data.easy.correct + data.medium.correct + data.hard.correct;
              const totalAttempts = data.easy.total + data.medium.total + data.hard.total;
              if (totalAttempts === 0) return '0%';
              return `${Math.round((totalCorrect / totalAttempts) * 100)}%`;
            })()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}