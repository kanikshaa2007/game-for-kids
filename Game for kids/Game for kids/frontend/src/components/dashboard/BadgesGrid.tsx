'use client';

import { Badge, BadgeGrid as BaseBadgeGrid } from '@/components/ui';
import { BADGES } from '@/lib/constants';

interface BadgesGridProps {
  unlockedBadgeIds: string[];
  showLocked?: boolean;
}

export default function BadgesGrid({ unlockedBadgeIds, showLocked = true }: BadgesGridProps) {
  return (
    <BaseBadgeGrid>
      {BADGES.map((badge) => (
        <Badge
          key={badge.id}
          {...badge}
          unlocked={unlockedBadgeIds.includes(badge.id)}
          size="md"
        />
      ))}
    </BaseBadgeGrid>
  );
}

export function BadgeShowcase({ unlockedBadgeIds }: { unlockedBadgeIds: string[] }) {
  const unlockedBadges = BADGES.filter((b) => unlockedBadgeIds.includes(b.id));
  const lockedCount = BADGES.length - unlockedBadges.length;

  if (unlockedBadges.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-6xl mb-4 block">🔒</span>
        <p className="text-gray-500">
          Play games to unlock badges!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-heading text-gray-800">
          Recent Badges
        </h3>
        <span className="text-sm text-gray-500">
          {unlockedBadges.length}/{BADGES.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {unlockedBadges.slice(-6).map((badge) => (
          <Badge
            key={badge.id}
            {...badge}
            unlocked={true}
            size="md"
          />
        ))}
      </div>

      {lockedCount > 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          {lockedCount} more badges to collect! 🌟
        </p>
      )}
    </div>
  );
}
