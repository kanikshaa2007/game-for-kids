'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

interface StatsCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'primary' | 'secondary' | 'accent' | 'success';
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary to-pink-500',
  secondary: 'from-secondary to-teal-500',
  accent: 'from-accent to-yellow-500',
  success: 'from-success to-green-500',
};

export default function StatsCard({
  icon,
  title,
  value,
  subtitle,
  color,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-3xl shadow-button`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-semibold">{title}</p>
            <p className="text-3xl font-bold font-heading text-gray-800">{value}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}