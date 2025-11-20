'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { getUserByUsername } from '@/lib/user/auth';
import { userStatsStorage, gameHistoryStorage } from '@/lib/user/storage';
import type { User, UserStats, GameHistoryEntry } from '@/types/user';

// Tab components
import ProfileOverview from '@/components/profile/ProfileOverview';
import GameHistoryTab from '@/components/profile/GameHistoryTab';
import CharactersTab from '@/components/profile/CharactersTab';
import AchievementsTab from '@/components/profile/AchievementsTab';

type Tab = 'overview' | 'history' | 'characters' | 'achievements';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useUser();
  const username = params.username as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    // Load profile data
    const user = getUserByUsername(username);
    if (!user) {
      setError('User not found');
      setLoading(false);
      return;
    }

    setProfileUser(user);
    setStats(userStatsStorage.get(user.id));
    setGameHistory(gameHistoryStorage.getAll(user.id));
    setLoading(false);
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This user does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'history', label: 'Game History', icon: '📜' },
    { id: 'characters', label: 'Characters', icon: '🎭' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-purple-900/50 via-amber-900/50 to-blue-900/50 border-b-2 border-amber-500/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-gray-900">
                {profileUser.username.substring(0, 2).toUpperCase()}
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Lvl {profileUser.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left pb-4">
              <h1 className="text-4xl font-bold text-amber-100">
                @{profileUser.username}
              </h1>
              <p className="text-gray-400 mt-1">
                Level {profileUser.level} Game Master
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2 text-sm text-gray-500">
                <span>Member since {new Date(profileUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pb-4">
              {isOwnProfile ? (
                <button
                  onClick={() => router.push('/settings')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all">
                    Add Friend
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'overview' && (
            <ProfileOverview
              user={profileUser}
              stats={stats}
              gameHistory={gameHistory}
              isOwnProfile={isOwnProfile}
            />
          )}
          {activeTab === 'history' && (
            <GameHistoryTab
              gameHistory={gameHistory}
              isOwnProfile={isOwnProfile}
            />
          )}
          {activeTab === 'characters' && (
            <CharactersTab
              userId={profileUser.id}
              isOwnProfile={isOwnProfile}
            />
          )}
          {activeTab === 'achievements' && (
            <AchievementsTab
              userId={profileUser.id}
              isOwnProfile={isOwnProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
