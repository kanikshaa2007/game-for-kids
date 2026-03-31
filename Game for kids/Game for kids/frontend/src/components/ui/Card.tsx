'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'game' | 'stat' | 'badge';
  hover?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white rounded-3xl p-6 shadow-soft',
    game: 'bg-white rounded-3xl p-6 shadow-card border-4 border-transparent',
    stat: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-soft',
    badge: 'bg-white rounded-2xl p-4 shadow-soft border-2',
  };

  const hoverStyles = hover
    ? 'hover:shadow-soft-hover transform hover:scale-105 cursor-pointer'
    : '';

  return (
    <motion.div
      className={`
        ${variantStyles[variant]}
        ${hoverStyles}
        ${className}
      `}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`text-xl font-bold font-heading text-gray-800 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
