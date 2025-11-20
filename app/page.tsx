'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useUser();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isLoggedIn) {
    return null; // Will redirect
  }

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* NEW: Werewolf Game Mode Highlight */}
        <div className="bg-gradient-to-br from-amber-900/30 to-red-900/30 border-2 border-amber-500/50 p-6 rounded-xl mb-12">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-6xl">🐺</div>
            <div className="text-center md:text-left flex-1">
              <div className="inline-block bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded mb-2">
                NEW GAME MODE
              </div>
              <h3 className="text-2xl font-bold mb-2 text-amber-100">Werewolf: Village of Shadows</h3>
              <p className="text-gray-300 text-sm mb-3">
                A complete social deduction game powered by AI. Play with friends or AI villagers.
                Uncover the werewolves before they eliminate everyone!
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-800 px-3 py-1 rounded-full">5-12 Players</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full">9 Unique Roles</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full">AI Narration</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full">Smart AI Players</span>
              </div>
            </div>
            <Link
              href="/werewolf"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold transition-colors whitespace-nowrap"
            >
              Play Werewolf →
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-amber-600/50"
          >
            Get Started Free
          </Link>
          <Link
            href="/games/werewolf"
            className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
          >
            Play Werewolf
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-lg transition-colors border border-gray-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
