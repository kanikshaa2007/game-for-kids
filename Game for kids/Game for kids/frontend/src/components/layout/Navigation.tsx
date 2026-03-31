'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GAME_TYPES } from '@/lib/constants';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="bg-white rounded-3xl shadow-soft p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-wrap justify-center gap-3">
        {GAME_TYPES.map((game) => {
          const isActive = pathname.includes(game.id);

          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold
                transition-all duration-200
                ${isActive
                  ? `bg-gradient-to-r ${game.color} text-white shadow-button`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <span className="text-xl">{game.icon}</span>
              <span className="hidden sm:inline">{game.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
