'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WEREWOLF_ROLES } from '@/types/werewolf';

export default function WerewolfLandingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<number>(0);

  const roles = Object.values(WEREWOLF_ROLES);

  const handleQuickPlay = () => {
    router.push('/werewolf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

        {/* Moonlight Effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Icon */}
            <div className="text-8xl mb-6 animate-pulse">🐺</div>

            {/* Title */}
            <h1 className="text-6xl sm:text-7xl font-bold text-amber-100 mb-4" style={{ fontFamily: 'serif' }}>
              WEREWOLF
            </h1>
            <p className="text-2xl text-red-300 mb-8" style={{ fontFamily: 'serif' }}>
              A Game of Lies & Survival
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={handleQuickPlay}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-red-600/50 transition-all transform hover:scale-105"
              >
                Quick Play
              </button>
              <Link
                href="/werewolf"
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-amber-600/50 transition-all transform hover:scale-105"
              >
                Custom Game
              </Link>
              <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-lg border border-gray-600 transition-all">
                Watch Tutorial
              </button>
            </div>

            {/* Game Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <span>👥</span>
                <span>5-20 players</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏱️</span>
                <span>30-60 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🤖</span>
                <span>AI Narrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Story Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-red-900/50 p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-amber-100 mb-6 text-center" style={{ fontFamily: 'serif' }}>
            THE STORY
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed text-center italic mb-6">
            "A full moon rises over the village. Shadows move in the darkness.
            Some among you are not what they seem. Will you unmask the wolves
            before it's too late, or will the village fall to darkness?"
          </p>
          <div className="flex justify-center">
            <button className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-amber-400 rounded-lg transition-all">
              <span>▶️</span>
              <span>Hear AI Narration Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* How to Play */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-amber-100 mb-12 text-center" style={{ fontFamily: 'serif' }}>
          HOW TO PLAY
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Night Phase */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-600/50 rounded-xl p-6">
            <div className="text-5xl mb-4 text-center">🌙</div>
            <h3 className="text-2xl font-bold text-blue-200 mb-3 text-center">
              NIGHT PHASE
            </h3>
            <p className="text-gray-300 text-center">
              The village sleeps. Werewolves choose their victim.
              The Seer investigates. The Doctor protects.
              Darkness conceals deadly secrets.
            </p>
          </div>

          {/* Day Phase */}
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-2 border-amber-600/50 rounded-xl p-6">
            <div className="text-5xl mb-4 text-center">☀️</div>
            <h3 className="text-2xl font-bold text-amber-200 mb-3 text-center">
              DAY PHASE
            </h3>
            <p className="text-gray-300 text-center">
              Dawn breaks. The truth is revealed.
              Villagers debate, accuse, and defend.
              Who can you trust?
            </p>
          </div>

          {/* Voting */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-600/50 rounded-xl p-6">
            <div className="text-5xl mb-4 text-center">🗳️</div>
            <h3 className="text-2xl font-bold text-red-200 mb-3 text-center">
              VOTING
            </h3>
            <p className="text-gray-300 text-center">
              Cast your vote to eliminate a suspect.
              Will you condemn an innocent, or unmask a wolf?
              Choose wisely.
            </p>
          </div>
        </div>
      </div>

      {/* Roles Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-amber-100 mb-12 text-center" style={{ fontFamily: 'serif' }}>
          CHOOSE YOUR ROLE
        </h2>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-gray-700 p-8">
          {/* Role Display */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{roles[selectedRole].icon}</div>
              <h3 className="text-3xl font-bold text-amber-100 mb-2">
                {roles[selectedRole].name.toUpperCase()}
              </h3>
              <p className="text-gray-400">
                {roles[selectedRole].allegiance}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-300 mb-6 text-center">
                {roles[selectedRole].description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-400">Difficulty: </span>
                  <span className="text-amber-400">
                    {'⭐'.repeat(roles[selectedRole].difficulty === 'Easy' ? 1 : roles[selectedRole].difficulty === 'Medium' ? 2 : 3)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Team: </span>
                  <span className={
                    roles[selectedRole].allegiance === 'Werewolves'
                      ? 'text-red-400'
                      : 'text-blue-400'
                  }>
                    {roles[selectedRole].allegiance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setSelectedRole((prev) => (prev - 1 + roles.length) % roles.length)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              ← Prev
            </button>

            <div className="flex space-x-2 overflow-x-auto py-2">
              {roles.map((role, index) => (
                <button
                  key={role.name}
                  onClick={() => setSelectedRole(index)}
                  className={`text-3xl transition-all ${
                    selectedRole === index
                      ? 'scale-125 opacity-100'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  {role.icon}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedRole((prev) => (prev + 1) % roles.length)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Play Modes */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-amber-100 mb-12 text-center" style={{ fontFamily: 'serif' }}>
          PLAY MODES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center hover:border-amber-500/50 transition-all">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-3">AI NARRATED</h3>
            <p className="text-gray-400 mb-4">
              AI guides the entire game with atmospheric narration and automated moderation
            </p>
            <button
              onClick={handleQuickPlay}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all"
            >
              Quick Start
            </button>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center hover:border-amber-500/50 transition-all">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-3">HUMAN HOST</h3>
            <p className="text-gray-400 mb-4">
              You control the flow as moderator, perfect for experienced players
            </p>
            <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
              Host Game
            </button>
          </div>

          <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 text-center hover:border-amber-500/50 transition-all">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-white mb-3">HYBRID</h3>
            <p className="text-gray-400 mb-4">
              Mix of AI NPCs and real players for flexible party sizes
            </p>
            <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats & Social Proof */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-red-900/30 to-amber-900/30 rounded-xl border-2 border-amber-500/50 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">
                12,847
              </div>
              <div className="text-gray-300">Games This Week</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">
                ⭐ 4.8/5
              </div>
              <div className="text-gray-300">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400 mb-2">
                5,234
              </div>
              <div className="text-gray-300">Active Players</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl font-bold text-amber-100 mb-6" style={{ fontFamily: 'serif' }}>
          Ready to Play?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands of players in the ultimate game of deception
        </p>
        <button
          onClick={handleQuickPlay}
          className="px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-lg shadow-2xl shadow-red-600/50 transition-all transform hover:scale-105"
        >
          Start Playing Now
        </button>
      </div>
    </div>
  );
}
