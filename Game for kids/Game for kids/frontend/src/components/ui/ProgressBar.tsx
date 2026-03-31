'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  max,
  color = 'primary',
  size = 'md',
  showLabel = true,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const colorStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    gradient: 'bg-gradient-to-r from-primary via-secondary to-success',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm font-semibold text-gray-600">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        {animated ? (
          <motion.div
            className={`h-full ${colorStyles[color]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`h-full ${colorStyles[color]} rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      {showLabel && (
        <p className="text-center text-xs text-gray-500 mt-1">
          {Math.round(percentage)}% complete
        </p>
      )}
    </div>
  );
}
