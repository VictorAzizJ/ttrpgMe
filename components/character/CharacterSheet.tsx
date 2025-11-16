'use client';

import { Character, getAbilityModifier } from '@/types/character';

interface CharacterSheetProps {
  character: Character;
  compact?: boolean;
}

export default function CharacterSheet({ character, compact = false }: CharacterSheetProps) {
  const abilities = [
    { key: 'strength', label: 'STR', value: character.strength },
    { key: 'dexterity', label: 'DEX', value: character.dexterity },
    { key: 'constitution', label: 'CON', value: character.constitution },
    { key: 'intelligence', label: 'INT', value: character.intelligence },
    { key: 'wisdom', label: 'WIS', value: character.wisdom },
    { key: 'charisma', label: 'CHA', value: character.charisma },
  ];

  if (compact) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">{character.name}</h3>
            <p className="text-sm text-gray-400">
              Level {character.level} {character.race} {character.class}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-400">
              {character.current_hp}/{character.max_hp}
            </div>
            <div className="text-xs text-gray-400">HP</div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {abilities.map(({ label, value }) => {
            const mod = getAbilityModifier(value);
            return (
              <div key={label} className="bg-gray-800 p-2 rounded text-center">
                <div className="text-xs text-gray-400">{label}</div>
                <div className="font-bold">{value}</div>
                <div className={`text-xs ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {mod >= 0 ? '+' : ''}{mod}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-xs text-gray-400">AC</div>
            <div className="font-bold text-lg">{character.armor_class}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-xs text-gray-400">Initiative</div>
            <div className="font-bold text-lg">
              {character.initiative >= 0 ? '+' : ''}{character.initiative}
            </div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-xs text-gray-400">Speed</div>
            <div className="font-bold text-lg">{character.speed} ft</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-purple-400">{character.name}</h1>
        <p className="text-lg text-gray-400">
          Level {character.level} {character.race} {character.class}
        </p>
        {character.background && (
          <p className="text-sm text-gray-500">{character.background}</p>
        )}
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded text-center">
          <div className="text-sm text-gray-400 mb-1">Armor Class</div>
          <div className="text-3xl font-bold text-blue-400">{character.armor_class}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded text-center">
          <div className="text-sm text-gray-400 mb-1">Hit Points</div>
          <div className="text-3xl font-bold text-red-400">
            {character.current_hp}/{character.max_hp}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded text-center">
          <div className="text-sm text-gray-400 mb-1">Speed</div>
          <div className="text-3xl font-bold text-green-400">{character.speed} ft</div>
        </div>
      </div>

      {/* Ability Scores */}
      <div>
        <h2 className="text-xl font-bold mb-3 text-purple-400">Ability Scores</h2>
        <div className="grid grid-cols-6 gap-3">
          {abilities.map(({ key, label, value }) => {
            const mod = getAbilityModifier(value);
            return (
              <div key={key} className="bg-gray-800 p-3 rounded text-center">
                <div className="text-xs text-gray-400 uppercase mb-1">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
                <div className={`text-sm font-semibold ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {mod >= 0 ? '+' : ''}{mod}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backstory */}
      {character.backstory && (
        <div>
          <h2 className="text-xl font-bold mb-3 text-purple-400">Backstory</h2>
          <p className="text-gray-300 leading-relaxed">{character.backstory}</p>
        </div>
      )}
    </div>
  );
}
