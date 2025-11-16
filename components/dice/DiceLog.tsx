'use client';

import { DiceRoll } from '@/types/dice';

interface DiceLogProps {
  rolls: DiceRoll[];
  maxEntries?: number;
}

export default function DiceLog({ rolls, maxEntries = 10 }: DiceLogProps) {
  const displayRolls = rolls.slice(-maxEntries).reverse();

  if (displayRolls.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-bold mb-3 text-purple-400">Roll History</h3>
        <p className="text-gray-500 text-center py-4">No rolls yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <h3 className="text-lg font-bold mb-3 text-purple-400">Roll History</h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {displayRolls.map((roll) => (
          <div
            key={roll.id}
            className="bg-gray-800 p-3 rounded flex items-center justify-between hover:bg-gray-750 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{roll.purpose}</span>
                <span className="text-xs text-gray-500">
                  {new Date(roll.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {roll.num_dice}{roll.dice_type}
                {roll.modifier !== 0 && ` ${roll.modifier >= 0 ? '+' : ''}${roll.modifier}`}
                {' → '}
                <span className="text-gray-300">[{roll.results.join(', ')}]</span>
              </div>
            </div>

            <div
              className={`text-2xl font-bold ml-4 ${
                roll.total >= 15 ? 'text-green-400' : roll.total <= 5 ? 'text-red-400' : 'text-white'
              }`}
            >
              {roll.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
