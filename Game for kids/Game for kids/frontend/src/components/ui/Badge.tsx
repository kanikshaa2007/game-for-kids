'use client';

import { motion } from 'framer-motion';

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({
  name,
  description,
  icon,
  unlocked,
  size = 'md',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-6xl',
  };

  return (
    <motion.div
      className={`
        flex flex-col items-center justify-center p-4 rounded-2xl
        ${unlocked
          ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400'
          : 'bg-gray-100 border-4 border-gray-300 grayscale opacity-50'
        }
        ${sizeStyles[size]}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: unlocked ? 1 : 0.9,
        opacity: unlocked ? 1 : 0.5,
      }}
      transition={{ type: 'spring', duration: 0.5 }}
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
    >
      <motion.span
        className="mb-2"
        animate={unlocked ? {
          rotate: [0, -10, 10, -10, 0],
        } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {icon}
      </motion.span>

      {size !== 'sm' && (
        <div className="text-center">
          <p className={`font-bold text-gray-800 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
            {name}
          </p>
          {unlocked && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function BadgeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {children}
    </div>
  );
}
