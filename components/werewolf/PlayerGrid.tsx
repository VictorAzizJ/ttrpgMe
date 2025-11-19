'use client';

import React from 'react';
import type { WerewolfPlayer, WerewolfGameState } from '@/types/werewolf';

interface PlayerGridProps {
  gameState: WerewolfGameState;
  currentPlayerId: string;
  onPlayerClick?: (player: WerewolfPlayer) => void;
  highlightWerewolves?: boolean; // For werewolves to see each other
  revealAllRoles?: boolean; // For spectators or game over
  selectMode?: 'vote' | 'nightAction' | 'none';
  selectedPlayerId?: string | null;
}

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

export default function PlayerGrid({
  gameState,
  currentPlayerId,
  onPlayerClick,
  highlightWerewolves = false,
  revealAllRoles = false,
  selectMode = 'none',
  selectedPlayerId = null,
}: PlayerGridProps) {
  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);

  const getPlayerBorderColor = (player: WerewolfPlayer): string => {
    // Selected player
    if (player.id === selectedPlayerId) {
      return 'border-amber-400';
    }

    // Dead player
    if (player.status === 'Dead') {
      return 'border-gray-600';
    }

    // Highlight werewolves (for werewolf players)
    if (
      highlightWerewolves &&
      player.role === 'Werewolf' &&
      player.id !== currentPlayerId
    ) {
      return 'border-red-500';
    }

    // High suspicion
    if ((player.suspicionLevel || 0) >= 60) {
      return 'border-orange-500';
    }

    // Default
    return 'border-gray-700';
  };

  const getPlayerBackground = (player: WerewolfPlayer): string => {
    if (player.status === 'Dead') {
      return 'bg-gray-900/50';
    }
    if (player.id === currentPlayerId) {
      return 'bg-blue-900/30';
    }
    return 'bg-gray-800';
  };

  const isClickable = (player: WerewolfPlayer): boolean => {
    if (!onPlayerClick || selectMode === 'none') return false;
    if (player.id === currentPlayerId) return false; // Can't select self
    if (player.status === 'Dead') return false; // Can't select dead players
    return true;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gameState.players.map((player) => {
        const borderColor = getPlayerBorderColor(player);
        const bgColor = getPlayerBackground(player);
        const clickable = isClickable(player);
        const roleIcon = player.role ? ROLE_ICONS[player.role] : '❓';

        return (
          <div
            key={player.id}
            onClick={() => clickable && onPlayerClick?.(player)}
            className={`
              ${bgColor}
              border-2 ${borderColor}
              rounded-lg p-4
              transition-all duration-200
              ${clickable ? 'cursor-pointer hover:scale-105 hover:border-amber-400' : ''}
              ${player.id === currentPlayerId ? 'ring-2 ring-blue-500' : ''}
              ${player.status === 'Dead' ? 'opacity-50' : ''}
            `}
          >
            {/* Player Name & Status */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {player.isAI && <span className="text-xs">🤖</span>}
                <h3 className="font-bold text-white truncate">
                  {player.name}
                  {player.isHost && <span className="text-xs ml-1">👑</span>}
                </h3>
              </div>
              {player.status === 'Dead' && (
                <span className="text-xl">💀</span>
              )}
            </div>

            {/* Role (if revealed) */}
            {(revealAllRoles || player.id === currentPlayerId) && player.role && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{roleIcon}</span>
                <span className="text-sm text-gray-300">{player.role}</span>
              </div>
            )}

            {/* Suspicion Level */}
            {player.status === 'Alive' && gameState.settings.suspicionTracker && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Suspicion</span>
                  <span>{player.suspicionLevel || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      (player.suspicionLevel || 0) >= 70
                        ? 'bg-red-500'
                        : (player.suspicionLevel || 0) >= 40
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${player.suspicionLevel || 0}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Vote Indicator */}
            {player.votedFor && (
              <div className="mt-2 text-xs text-gray-400">
                🗳️ Voted
              </div>
            )}

            {/* AI Personality (for AI players) */}
            {player.isAI && player.aiPersonality && (
              <div className="mt-2 text-xs text-gray-500">
                {player.aiPersonality}
              </div>
            )}

            {/* "You" indicator */}
            {player.id === currentPlayerId && (
              <div className="mt-2 text-xs text-blue-400 font-bold">
                ← You
              </div>
            )}

            {/* Werewolf ally indicator */}
            {highlightWerewolves &&
              player.role === 'Werewolf' &&
              player.id !== currentPlayerId && (
                <div className="mt-2 text-xs text-red-400 font-bold">
                  🐺 Pack Member
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}
