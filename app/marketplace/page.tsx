'use client';

import React, { useState } from 'react';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900/50 via-amber-900/50 to-blue-900/50 border-b-2 border-amber-500/30 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-amber-100 mb-4">
            Discover Epic Content
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Browse thousands of characters, maps, and campaigns created by the community
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for maps, characters, campaigns..."
              className="w-full px-6 py-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Navigation */}
        <div className="mb-12">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {[
              { icon: '🗺️', label: 'Maps' },
              { icon: '🎭', label: 'Characters' },
              { icon: '📜', label: 'Campaigns' },
              { icon: '🎨', label: 'Tokens' },
              { icon: '🎵', label: 'Music' },
              { icon: '🧩', label: 'Rules' },
              { icon: '🏰', label: 'Scenarios' },
            ].map((category) => (
              <button
                key={category.label}
                className="flex flex-col items-center space-y-2 px-6 py-4 bg-gray-900 hover:bg-gray-800 border-2 border-gray-700 hover:border-amber-500/50 rounded-xl transition-all whitespace-nowrap"
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm text-gray-300">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            🔥 Trending This Week
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center text-5xl">
                  🗺️
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    Sample Item {i}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    by @creator{i}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400">⭐ 4.8</span>
                    <span className="text-gray-300 font-bold">$4.99</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-purple-900/30 to-amber-900/30 rounded-xl border-2 border-amber-500/50 p-12 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Marketplace Coming Soon
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            We're building an amazing marketplace where creators can share and sell their content
          </p>
          <button className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all">
            Join the Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}
