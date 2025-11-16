'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { characterStorage } from '@/lib/storage';

export default function Home() {
  const [hasCharacters, setHasCharacters] = useState(false);

  useEffect(() => {
    const characters = characterStorage.getAll();
    setHasCharacters(characters.length > 0);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          TTRPG Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-4">
          AI-Powered Tabletop Gaming Experience
        </p>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          Create characters, roll dice, and embark on epic adventures with an AI Dungeon Master that adapts to your every decision.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-4xl mb-3">📜</div>
            <h3 className="text-xl font-bold mb-2">Character Sheets</h3>
            <p className="text-gray-400 text-sm">Create and manage detailed D&D 5e characters</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="text-xl font-bold mb-2">Dice Rolling</h3>
            <p className="text-gray-400 text-sm">Visual dice roller with automatic logging</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Dungeon Master</h3>
            <p className="text-gray-400 text-sm">Play with an intelligent, adaptive DM</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {hasCharacters ? (
            <>
              <Link
                href="/characters"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-lg transition-colors"
              >
                My Characters
              </Link>
              <Link
                href="/play"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Adventure →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/character/new"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-colors"
              >
                Create Your First Character
              </Link>
              <Link
                href="/play"
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-lg transition-colors"
              >
                Quick Start (No Character)
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
