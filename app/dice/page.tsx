'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DiceRoller from '@/components/dice/DiceRoller';
import DiceLog from '@/components/dice/DiceLog';
import { DiceRoll } from '@/types/dice';

export default function DicePage() {
  const router = useRouter();
  const [rolls, setRolls] = useState<DiceRoll[]>([]);

  const handleRoll = (roll: DiceRoll) => {
    setRolls(prev => [...prev, roll]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Dice Roller
          </h1>
          <button
            onClick={() => setRolls([])}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded transition-colors"
          >
            Clear History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiceRoller onRoll={handleRoll} />
          <DiceLog rolls={rolls} maxEntries={20} />
        </div>

        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-3 text-purple-400">Quick Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-300">d4:</span>
              <span className="text-gray-400"> Damage (daggers)</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">d6:</span>
              <span className="text-gray-400"> Damage (shortswords)</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">d8:</span>
              <span className="text-gray-400"> Damage (longswords)</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">d10:</span>
              <span className="text-gray-400"> Damage (pikes)</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">d12:</span>
              <span className="text-gray-400"> Damage (greataxes)</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">d20:</span>
              <span className="text-gray-400"> Attacks, checks, saves</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">d100:</span>
              <span className="text-gray-400"> Percentile rolls</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">Notation:</span>
              <span className="text-gray-400"> 2d6+3, 1d20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
