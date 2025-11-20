'use client';

import React, { useState } from 'react';
import { useUser, ProtectedRoute } from '@/contexts/UserContext';

function SettingsContent() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'account' | 'privacy' | 'notifications'
  >('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: '👤' },
    { id: 'account' as const, label: 'Account', icon: '🔐' },
    { id: 'privacy' as const, label: 'Privacy', icon: '🔒' },
    { id: 'notifications' as const, label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-100 mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Profile Settings
                  </h2>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your display name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell others about yourself..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    ></textarea>
                  </div>

                  <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Account Settings
                  </h2>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-bold text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Privacy Settings
                  </h2>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Profile Visibility
                    </label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500">
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-white font-medium">
                        Show Game History
                      </h4>
                      <p className="text-sm text-gray-400">
                        Display your game history on your profile
                      </p>
                    </div>
                    <input type="checkbox" className="w-6 h-6" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-white font-medium">
                        Show Achievements
                      </h4>
                      <p className="text-sm text-gray-400">
                        Display your achievements on your profile
                      </p>
                    </div>
                    <input type="checkbox" className="w-6 h-6" defaultChecked />
                  </div>

                  <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-white font-medium">Game Invites</h4>
                        <p className="text-sm text-gray-400">
                          Get notified when someone invites you to a game
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-6 h-6"
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-white font-medium">
                          Friend Requests
                        </h4>
                        <p className="text-sm text-gray-400">
                          Get notified when someone sends you a friend request
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-6 h-6"
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-white font-medium">
                          Achievement Unlocks
                        </h4>
                        <p className="text-sm text-gray-400">
                          Get notified when you unlock a new achievement
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-6 h-6"
                        defaultChecked
                      />
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
