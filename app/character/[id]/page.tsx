'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CharacterSheet from '@/components/character/CharacterSheet';
import { characterStorage } from '@/lib/storage';
import { Character } from '@/types/character';

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const char = characterStorage.getById(id);

    if (!char) {
      router.push('/character/new');
      return;
    }

    setCharacter(char);
    characterStorage.setActive(id);
  }, [params.id, router]);

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading character...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => router.push('/play')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition-colors"
          >
            Start Adventure →
          </button>
        </div>

        <CharacterSheet character={character} />

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(`/character/${character.id}/edit`)}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Edit Character
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this character?')) {
                characterStorage.delete(character.id);
                router.push('/');
              }
            }}
            className="px-6 py-3 bg-red-900 hover:bg-red-800 rounded-lg font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
