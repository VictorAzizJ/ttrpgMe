'use client';

import { useRouter } from 'next/navigation';
import CharacterForm from '@/components/character/CharacterForm';
import { characterStorage } from '@/lib/storage';
import { Character } from '@/types/character';

export default function NewCharacterPage() {
  const router = useRouter();

  const handleSave = (character: Character) => {
    characterStorage.save(character);
    characterStorage.setActive(character.id);
    router.push('/character/' + character.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Create Your Character
          </h1>
          <p className="text-gray-400">
            Build your hero for epic adventures
          </p>
        </div>

        <CharacterForm onSave={handleSave} />
      </div>
    </div>
  );
}
