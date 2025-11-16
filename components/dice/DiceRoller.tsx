'use client';

import { useState } from 'react';
import { DiceType, DiceRoll, rollDice, parseDiceNotation } from '@/types/dice';

interface DiceRollerProps {
  onRoll?: (roll: DiceRoll) => void;
  compact?: boolean;
}

const DICE_EMOJI: Record<DiceType, string> = {
  'd4': '🔺',
  'd6': '🎲',
  'd8': '🔶',
  'd10': '🔟',
  'd12': '🎯',
  'd20': '🌟',
  'd100': '💯',
};

export default function DiceRoller({ onRoll, compact = false }: DiceRollerProps) {
  const [selectedDice, setSelectedDice] = useState<DiceType>('d20');
  const [numDice, setNumDice] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [customNotation, setCustomNotation] = useState('');
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);

    // Animate rolling
    setTimeout(() => {
      const roll = rollDice(selectedDice, numDice, modifier);
      roll.purpose = purpose || 'General Roll';
      setLastRoll(roll);
      setIsRolling(false);
      onRoll?.(roll);
    }, 500);
  };

  const handleCustomRoll = () => {
    const parsed = parseDiceNotation(customNotation);
    if (!parsed) {
      alert('Invalid dice notation. Use format like "2d6+3" or "1d20"');
      return;
    }

    setIsRolling(true);
    setTimeout(() => {
      const roll = rollDice(parsed.dice_type, parsed.num_dice, parsed.modifier);
      roll.purpose = purpose || 'Custom Roll';
      setLastRoll(roll);
      setIsRolling(false);
      onRoll?.(roll);
    }, 500);
  };

  const quickRolls = [
    { label: 'Attack', dice: 'd20' as DiceType, num: 1, mod: 0 },
    { label: 'Damage', dice: 'd8' as DiceType, num: 1, mod: 0 },
    { label: 'Ability Check', dice: 'd20' as DiceType, num: 1, mod: 0 },
    { label: 'Initiative', dice: 'd20' as DiceType, num: 1, mod: 0 },
  ];

  if (compact) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex gap-2 mb-3">
          {(['d20', 'd12', 'd10', 'd8', 'd6', 'd4'] as DiceType[]).map(dice => (
            <button
              key={dice}
              onClick={() => {
                setSelectedDice(dice);
                handleRoll();
              }}
              className="flex-1 p-2 bg-gray-800 hover:bg-purple-700 rounded transition-colors text-2xl"
              title={dice}
            >
              {DICE_EMOJI[dice]}
            </button>
          ))}
        </div>

        {lastRoll && (
          <div className="text-center p-4 bg-gray-800 rounded">
            <div className={`text-4xl font-bold ${lastRoll.total >= 15 ? 'text-green-400' : 'text-white'}`}>
              {lastRoll.total}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {lastRoll.num_dice}{lastRoll.dice_type}
              {lastRoll.modifier !== 0 && ` ${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier}`}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-6">
      <h2 className="text-2xl font-bold text-purple-400">Dice Roller</h2>

      {/* Quick Roll Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {quickRolls.map(quick => (
          <button
            key={quick.label}
            onClick={() => {
              setSelectedDice(quick.dice);
              setNumDice(quick.num);
              setModifier(quick.mod);
              setPurpose(quick.label);
              setTimeout(handleRoll, 100);
            }}
            className="p-3 bg-purple-900 hover:bg-purple-800 rounded-lg font-semibold transition-colors"
          >
            {quick.label}
          </button>
        ))}
      </div>

      {/* Dice Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Dice</label>
        <div className="grid grid-cols-7 gap-2">
          {(['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as DiceType[]).map(dice => (
            <button
              key={dice}
              onClick={() => setSelectedDice(dice)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedDice === dice
                  ? 'bg-purple-600 scale-110'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{DICE_EMOJI[dice]}</div>
              <div className="text-xs">{dice}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Number and Modifier */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number</label>
          <input
            type="number"
            min="1"
            max="20"
            value={numDice}
            onChange={(e) => setNumDice(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none text-center text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Modifier</label>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none text-center text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Attack"
            className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Custom Notation */}
      <div>
        <label className="block text-sm font-medium mb-2">Or Use Custom Notation</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customNotation}
            onChange={(e) => setCustomNotation(e.target.value)}
            placeholder="e.g., 2d6+3 or 1d20"
            className="flex-1 px-3 py-2 bg-gray-800 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={handleCustomRoll}
            disabled={!customNotation}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Roll
          </button>
        </div>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRolling ? '🎲 Rolling...' : `Roll ${numDice}${selectedDice}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''}`}
      </button>

      {/* Result Display */}
      {lastRoll && (
        <div className="p-6 bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg text-center border-2 border-purple-500">
          <div className="text-sm text-purple-200 mb-2">{lastRoll.purpose}</div>
          <div className="text-6xl font-bold mb-2 animate-pulse">
            {lastRoll.total}
          </div>
          <div className="text-sm text-purple-300">
            Rolls: {lastRoll.results.join(', ')}
            {lastRoll.modifier !== 0 && ` (${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier})`}
          </div>
        </div>
      )}
    </div>
  );
}
