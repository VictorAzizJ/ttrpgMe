'use client';

import React from 'react';
import type { WerewolfRole, WerewolfPlayer } from '@/types/werewolf';
import { WEREWOLF_ROLES } from '@/types/werewolf';

interface RoleCardProps {
  player: WerewolfPlayer;
  revealed?: boolean;
  compact?: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  Werewolf: 'from-red-900 to-red-700',
  Villager: 'from-blue-900 to-blue-700',
  Seer: 'from-purple-900 to-purple-700',
  Doctor: 'from-green-900 to-green-700',
  Hunter: 'from-amber-900 to-amber-700',
  Witch: 'from-indigo-900 to-indigo-700',
  Tanner: 'from-gray-900 to-gray-700',
  Cupid: 'from-pink-900 to-pink-700',
  Fool: 'from-yellow-900 to-yellow-700',
};

const ROLE_ICONS: Record<string, string> = {
  Werewolf: '🐺',
  Villager: '👤',
  Seer: '🔮',
  Doctor: '💊',
  Hunter: '🏹',
  Witch: '🧪',
  Tanner: '🎭',
  Cupid: '💘',
  Fool: '🃏',
};

export default function RoleCard({ player, revealed = true, compact = false }: RoleCardProps) {
  if (!player.role) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border-2 border-gray-700">
        <p className="text-gray-400">Role not assigned</p>
      </div>
    );
  }

  const role = WEREWOLF_ROLES[player.role];
  const colorClass = ROLE_COLORS[role.type] || 'from-gray-900 to-gray-700';
  const icon = ROLE_ICONS[role.type] || '❓';

  if (compact) {
    return (
      <div
        className={`bg-gradient-to-br ${colorClass} rounded-lg p-3 border-2 border-amber-500/30`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-bold text-amber-100 text-sm">{role.name}</p>
            <p className="text-xs text-gray-300">{role.allegiance}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} rounded-xl p-6 shadow-2xl border-2 border-amber-500/50 transform transition-all hover:scale-105`}
    >
      {/* Role Icon & Name */}
      <div className="text-center mb-4">
        <div className="text-6xl mb-2 animate-pulse">{icon}</div>
        <h2 className="text-3xl font-bold text-amber-100 mb-1">{role.name}</h2>
        <p className="text-sm text-gray-300 uppercase tracking-wider">
          {role.allegiance}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-amber-500/30 my-4"></div>

      {/* Description */}
      <p className="text-gray-200 text-center mb-4 italic">"{role.description}"</p>

      {/* Abilities */}
      <div className="space-y-2 bg-black/20 rounded-lg p-4">
        <div>
          <p className="text-xs text-gray-400 uppercase">Night Action</p>
          <p className="text-sm text-white font-medium">
            {role.nightAction || 'None'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase">Special Ability</p>
          <p className="text-sm text-white font-medium">{role.specialAbility}</p>
        </div>
      </div>

      {/* Character Backstory (if available) */}
      {player.characterBackstory && (
        <>
          <div className="border-t border-amber-500/30 my-4"></div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase mb-1">Your Story</p>
            <p className="text-sm text-gray-300 italic">
              {player.characterBackstory}
            </p>
          </div>
        </>
      )}

      {/* Win Condition Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-amber-400">
          {role.winsWithVillagers
            ? '✓ Eliminate all Werewolves to win'
            : '⚠️ Outnumber the Villagers to win'}
        </p>
      </div>
    </div>
  );
}
