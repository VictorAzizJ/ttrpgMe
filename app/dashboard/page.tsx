'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, ProtectedRoute } from '@/contexts/UserContext';
import { userStatsStorage, gameHistoryStorage } from '@/lib/user/storage';

function DashboardContent() {
  const { user, logout } = useUser();
  const router = useRouter();

  if (!user) return null;

  // Get user stats
  const stats = userStatsStorage.get(user.id);
  const gameHistory = gameHistoryStorage.getAll(user.id);
  const recentGames = gameHistory.slice(0, 5);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-100">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-400 mt-2">
              Level {user.level} | {user.currentXP} / {user.xpToNextLevel} XP
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/profile/${user.username}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Level Progress</span>
            <span className="text-amber-400 font-bold">
              {Math.floor((user.currentXP / user.xpToNextLevel) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-4 rounded-full transition-all"
              style={{
                width: `${(user.currentXP / user.xpToNextLevel) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-4xl mb-2">🎮</div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.totalGamesPlayed || 0}
            </h3>
            <p className="text-gray-400 text-sm">Games Played</p>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.winRate.toFixed(0) || 0}%
            </h3>
            <p className="text-gray-400 text-sm">Win Rate</p>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-4xl mb-2">🐺</div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.werewolfGamesPlayed || 0}
            </h3>
            <p className="text-gray-400 text-sm">Werewolf Games</p>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-4xl mb-2">🎲</div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.ttrpgSessionsPlayed || 0}
            </h3>
            <p className="text-gray-400 text-sm">TTRPG Sessions</p>
          </div>
        </div>

        {/* Continue Playing */}
        <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            🎮 Continue Playing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/werewolf"
              className="p-6 bg-gradient-to-br from-amber-900/30 to-red-900/30 border-2 border-amber-500/50 rounded-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">🐺</div>
                <div>
                  <h3 className="text-xl font-bold text-amber-100">
                    Play Werewolf
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Social deduction game
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/play"
              className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 rounded-lg hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">🎲</div>
                <div>
                  <h3 className="text-xl font-bold text-purple-100">
                    Play TTRPG
                  </h3>
                  <p className="text-gray-300 text-sm">
                    AI-powered adventures
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Games */}
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            📜 Recent Games
          </h2>

          {recentGames.length > 0 ? (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">
                        {game.gameType === 'Werewolf' ? '🐺' : '🎲'}{' '}
                        {game.gameName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Role: {game.role} | {game.outcome}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No games yet! Start playing to see your history here.
              </p>
              <div className="mt-4 flex gap-4 justify-center">
                <Link
                  href="/werewolf"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg"
                >
                  Play Werewolf
                </Link>
                <Link
                  href="/play"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
                >
                  Play TTRPG
                </Link>
              </div>
            </div>
          )}

          {recentGames.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href={`/profile/${user.username}?tab=history`}
                className="text-amber-400 hover:text-amber-300 text-sm"
              >
                View All Games →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
