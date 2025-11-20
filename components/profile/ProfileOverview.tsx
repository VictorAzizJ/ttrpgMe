'use client';

import React from 'react';
import Link from 'next/link';
import type { User, UserStats, GameHistoryEntry } from '@/types/user';

interface ProfileOverviewProps {
  user: User;
  stats: UserStats | null;
  gameHistory: GameHistoryEntry[];
  isOwnProfile: boolean;
}

export default function ProfileOverview({
  user,
  stats,
  gameHistory,
  isOwnProfile,
}: ProfileOverviewProps) {
  const recentGames = gameHistory.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center">
          <div className="text-4xl mb-2">🎮</div>
          <h3 className="text-3xl font-bold text-white">
            {stats?.totalGamesPlayed || 0}
          </h3>
          <p className="text-gray-400 text-sm mt-1">Games Played</p>
        </div>

        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-3xl font-bold text-white">
            {stats?.winRate.toFixed(0) || 0}%
          </h3>
          <p className="text-gray-400 text-sm mt-1">Win Rate</p>
        </div>

        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center">
          <div className="text-4xl mb-2">🐺</div>
          <h3 className="text-3xl font-bold text-white">
            {stats?.werewolfGamesPlayed || 0}
          </h3>
          <p className="text-gray-400 text-sm mt-1">Werewolf Games</p>
        </div>

        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center">
          <div className="text-4xl mb-2">🎲</div>
          <h3 className="text-3xl font-bold text-white">
            {stats?.ttrpgSessionsPlayed || 0}
          </h3>
          <p className="text-gray-400 text-sm mt-1">TTRPG Sessions</p>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">Level Progress</h3>
          <span className="text-amber-400 font-bold">
            Level {user.level} → {user.level + 1}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-4 rounded-full transition-all"
            style={{
              width: `${(user.currentXP / user.xpToNextLevel) * 100}%`,
            }}
          ></div>
        </div>
        <div className="text-sm text-gray-400 text-right">
          {user.currentXP} / {user.xpToNextLevel} XP ({Math.floor((user.currentXP / user.xpToNextLevel) * 100)}%)
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
        <h3 className="text-2xl font-bold text-white mb-4">
          📋 Recent Activity
        </h3>
        {recentGames.length > 0 ? (
          <div className="space-y-3">
            {recentGames.map((game) => (
              <div
                key={game.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white flex items-center">
                      {game.gameType === 'Werewolf' ? '🐺' : '🎲'}{' '}
                      {game.gameName}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Role: <span className="text-amber-400">{game.role}</span>{' '}
                      | <span className={
                        game.outcome === 'Victory'
                          ? 'text-green-400'
                          : game.outcome === 'Defeat'
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }>{game.outcome}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(game.startedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {game.duration} min
                    </p>
                  </div>
                </div>
                {game.xpGained > 0 && (
                  <div className="mt-2 text-xs text-amber-400">
                    +{game.xpGained} XP
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No recent games yet
          </div>
        )}

        {recentGames.length > 0 && (
          <div className="mt-4 text-center">
            <Link
              href={`/profile/${user.username}?tab=history`}
              className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
            >
              View All Games →
            </Link>
          </div>
        )}
      </div>

      {/* Party Members / Friends (Placeholder) */}
      <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
        <h3 className="text-2xl font-bold text-white mb-4">
          👥 Party Members
        </h3>
        <div className="text-center py-8 text-gray-400">
          <p>Friend system coming soon!</p>
        </div>
      </div>
    </div>
  );
}
