'use client';

import React from 'react';

interface AchievementsTabProps {
  userId: string;
  isOwnProfile: boolean;
}

// Sample achievements structure
const SAMPLE_ACHIEVEMENTS = [
  {
    id: 'first_game',
    icon: '🎮',
    name: 'First Steps',
    description: 'Complete your first game',
    rarity: 'Common' as const,
    unlocked: true,
    progress: 1,
    total: 1,
  },
  {
    id: 'veteran',
    icon: '🏆',
    name: 'Veteran Player',
    description: 'Play 100 games',
    rarity: 'Rare' as const,
    unlocked: false,
    progress: 0,
    total: 100,
  },
  {
    id: 'master_deceiver',
    icon: '🎭',
    name: 'Master of Deceit',
    description: 'Win 10 games as a Werewolf',
    rarity: 'Epic' as const,
    unlocked: false,
    progress: 0,
    total: 10,
  },
  {
    id: 'legendary_hero',
    icon: '⚔️',
    name: 'Legendary Hero',
    description: 'Complete a legendary difficulty campaign',
    rarity: 'Legendary' as const,
    unlocked: false,
    progress: 0,
    total: 1,
  },
];

export default function AchievementsTab({
  userId,
  isOwnProfile,
}: AchievementsTabProps) {
  // TODO: Load actual achievement data when achievement system is implemented
  const achievements = SAMPLE_ACHIEVEMENTS;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'border-gray-600 bg-gray-900';
      case 'Rare':
        return 'border-blue-600 bg-blue-900/20';
      case 'Epic':
        return 'border-purple-600 bg-purple-900/20';
      case 'Legendary':
        return 'border-amber-600 bg-amber-900/20';
      default:
        return 'border-gray-600 bg-gray-900';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-400';
      case 'Rare':
        return 'text-blue-400';
      case 'Epic':
        return 'text-purple-400';
      case 'Legendary':
        return 'text-amber-400';
      default:
        return 'text-gray-400';
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">Achievement Progress</h3>
          <span className="text-amber-400 font-bold">
            {unlockedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-4 rounded-full transition-all"
            style={{
              width: `${(unlockedCount / totalCount) * 100}%`,
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-400 text-right">
          {Math.floor((unlockedCount / totalCount) * 100)}% Complete
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl border-2 p-6 transition-all ${
              achievement.unlocked
                ? getRarityColor(achievement.rarity)
                : 'border-gray-700 bg-gray-900 opacity-60'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`text-5xl ${
                  achievement.unlocked ? '' : 'grayscale opacity-50'
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-lg font-bold text-white">
                    {achievement.name}
                  </h4>
                  {achievement.unlocked && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${getRarityText(
                      achievement.rarity
                    )}`}
                  >
                    {achievement.rarity}
                  </span>
                  {!achievement.unlocked && (
                    <span className="text-xs text-gray-500">
                      {achievement.progress} / {achievement.total}
                    </span>
                  )}
                </div>
                {!achievement.unlocked && achievement.total > 1 && (
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (achievement.progress / achievement.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-900/20 border-2 border-blue-600 rounded-xl p-6 text-center">
        <p className="text-blue-400">
          🎯 More achievements coming soon! Keep playing to unlock them all.
        </p>
      </div>
    </div>
  );
}
