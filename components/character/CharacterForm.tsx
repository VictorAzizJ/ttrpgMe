'use client';

import { useState } from 'react';
import { Character, DND_RACES, DND_CLASSES, getAbilityModifier } from '@/types/character';

interface CharacterFormProps {
  onSave: (character: Character) => void;
  initialCharacter?: Character;
}

export default function CharacterForm({ onSave, initialCharacter }: CharacterFormProps) {
  const [formData, setFormData] = useState({
    name: initialCharacter?.name || '',
    race: initialCharacter?.race || 'Human',
    class: initialCharacter?.class || 'Fighter',
    background: initialCharacter?.background || '',
    backstory: initialCharacter?.backstory || '',
    strength: initialCharacter?.strength || 10,
    dexterity: initialCharacter?.dexterity || 10,
    constitution: initialCharacter?.constitution || 10,
    intelligence: initialCharacter?.intelligence || 10,
    wisdom: initialCharacter?.wisdom || 10,
    charisma: initialCharacter?.charisma || 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate derived stats
    const conMod = getAbilityModifier(formData.constitution);
    const maxHp = 10 + conMod + (formData.class === 'Barbarian' ? 2 : 0);
    const ac = 10 + getAbilityModifier(formData.dexterity);

    const character: Character = {
      id: initialCharacter?.id || crypto.randomUUID(),
      user_id: initialCharacter?.user_id || 'local',
      name: formData.name,
      race: formData.race,
      class: formData.class,
      level: initialCharacter?.level || 1,

      strength: formData.strength,
      dexterity: formData.dexterity,
      constitution: formData.constitution,
      intelligence: formData.intelligence,
      wisdom: formData.wisdom,
      charisma: formData.charisma,

      max_hp: maxHp,
      current_hp: initialCharacter?.current_hp || maxHp,
      armor_class: ac,
      initiative: getAbilityModifier(formData.dexterity),
      speed: 30,

      proficiencies: [],
      skills: {},
      equipment: [],

      background: formData.background,
      backstory: formData.backstory,

      created_at: initialCharacter?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(character);
  };

  const updateAbilityScore = (ability: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [ability]: Math.max(1, Math.min(20, value))
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Basic Info */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Character Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="Aragorn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Race</label>
            <select
              value={formData.race}
              onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              {DND_RACES.map(race => (
                <option key={race} value={race}>{race}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
            >
              {DND_CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Background</label>
            <input
              type="text"
              value={formData.background}
              onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
              placeholder="Soldier, Noble, etc."
            />
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Ability Scores</h2>
        <p className="text-sm text-gray-400 mb-4">Standard array: 15, 14, 13, 12, 10, 8</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'strength', label: 'Strength' },
            { key: 'dexterity', label: 'Dexterity' },
            { key: 'constitution', label: 'Constitution' },
            { key: 'intelligence', label: 'Intelligence' },
            { key: 'wisdom', label: 'Wisdom' },
            { key: 'charisma', label: 'Charisma' },
          ].map(({ key, label }) => {
            const score = formData[key as keyof typeof formData] as number;
            const modifier = getAbilityModifier(score);

            return (
              <div key={key} className="bg-gray-800 p-3 rounded">
                <label className="block text-xs font-medium mb-1 text-gray-400">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={score}
                    onChange={(e) => updateAbilityScore(key, parseInt(e.target.value) || 10)}
                    className="w-16 px-2 py-1 bg-gray-900 rounded border border-gray-700 text-center text-lg font-bold"
                  />
                  <span className={`text-lg font-bold ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {modifier >= 0 ? '+' : ''}{modifier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backstory */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Backstory</h2>
        <textarea
          value={formData.backstory}
          onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
          placeholder="Tell us about your character's past..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-colors"
      >
        {initialCharacter ? 'Update Character' : 'Create Character'}
      </button>
    </form>
  );
}
