'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { characterStorage } from '@/lib/storage';
import { Character } from '@/types/character';

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    setCharacters(characterStorage.getAll());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            My Characters
          </h1>
          <button
            onClick={() => router.push('/character/new')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            + New Character
          </button>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎲</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Characters Yet</h2>
            <p className="text-gray-500 mb-6">Create your first character to begin your adventure</p>
            <button
              onClick={() => router.push('/character/new')}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Create Character
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <div
                key={character.id}
                onClick={() => router.push(`/character/${character.id}`)}
                className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-purple-500 cursor-pointer transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-bold mb-2">{character.name}</h3>
                <p className="text-gray-400 mb-4">
                  Level {character.level} {character.race} {character.class}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-500">HP: </span>
                    <span className="text-red-400 font-semibold">
                      {character.current_hp}/{character.max_hp}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">AC: </span>
                    <span className="text-blue-400 font-semibold">{character.armor_class}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
