'use client';

import React from 'react';

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-100 mb-8">Library</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Rulesets</h3>
            <p className="text-gray-400">
              Browse game rules and mechanics
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-white mb-2">Tutorials</h3>
            <p className="text-gray-400">
              Learn how to play and master the games
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">AI Tools</h3>
            <p className="text-gray-400">
              Explore AI narration and game master tools
            </p>
          </div>
        </div>

        <div className="mt-8 bg-blue-900/20 border-2 border-blue-600 rounded-xl p-6 text-center">
          <p className="text-blue-400">
            📖 Library content coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
