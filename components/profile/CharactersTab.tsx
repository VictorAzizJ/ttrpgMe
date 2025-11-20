'use client';

import React from 'react';
import Link from 'next/link';

interface CharactersTabProps {
  userId: string;
  isOwnProfile: boolean;
}

export default function CharactersTab({
  userId,
  isOwnProfile,
}: CharactersTabProps) {
  // TODO: Load actual character data when character system is implemented
  const characters: any[] = [];

  return (
    <div className="space-y-6">
      {characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 hover:border-amber-500/50 transition-all cursor-pointer"
            >
              {/* Character card content */}
              <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold text-white">{character.name}</h3>
              <p className="text-gray-400 text-sm">{character.class}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            No Characters Yet
          </h3>
          <p className="text-gray-400 mb-6">
            {isOwnProfile
              ? 'Create your first character to get started on epic adventures!'
              : 'This user hasn\'t created any characters yet.'}
          </p>
          {isOwnProfile && (
            <Link
              href="/characters/create"
              className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all"
            >
              Create Character
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
