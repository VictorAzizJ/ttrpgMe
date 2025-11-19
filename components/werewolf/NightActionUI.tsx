'use client';

import React, { useState, useEffect } from 'react';
import type { WerewolfPlayer, WerewolfGameState, WerewolfRoleType } from '@/types/werewolf';

interface NightActionUIProps {
  gameState: WerewolfGameState;
  currentPlayerId: string;
  onActionSubmit: (targetId: string | null) => void;
  timeRemaining?: number;
}

const ROLE_ACTION_PROMPTS: Record<WerewolfRoleType, string> = {
  Werewolf: '🐺 The pack hungers. Choose your prey for tonight.',
  Seer: '🔮 The spirits whisper. Whose truth will you uncover?',
  Doctor: '💊 Death stalks the village. Whom will you protect?',
  Witch: '🧪 Your potions await. Will you heal or harm?',
  Hunter: '🏹 You rest tonight, but remain vigilant.',
  Cupid: '💘 Choose two souls to bind together (First Night Only).',
  Villager: '👤 You sleep soundly, trusting in the morning light.',
  Tanner: '🎭 You dream of your final day.',
  Fool: '🃏 You sleep, blissfully unaware of the danger.',
};

export default function NightActionUI({
  gameState,
  currentPlayerId,
  onActionSubmit,
  timeRemaining,
}: NightActionUIProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [hasActed, setHasActed] = useState(false);

  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);
  const playerRole = currentPlayer?.role;

  // Get valid targets based on role
  const getValidTargets = (): WerewolfPlayer[] => {
    const alivePlayers = gameState.players.filter((p) => p.status === 'Alive');

    switch (playerRole) {
      case 'Werewolf':
        // Can't target other werewolves
        return alivePlayers.filter(
          (p) => p.role !== 'Werewolf' && p.id !== currentPlayerId
        );

      case 'Seer':
      case 'Doctor':
        // Can target anyone except self (for Seer)
        // Doctor can protect anyone including self (but not same person twice in a row)
        return alivePlayers.filter((p) => {
          if (playerRole === 'Seer' && p.id === currentPlayerId) return false;

          // Check if player was protected last night (Doctor rule)
          if (playerRole === 'Doctor') {
            const lastProtection = gameState.nightActions
              .filter((a) => a.playerId === currentPlayerId && a.actionType === 'protect')
              .sort((a, b) => b.timestamp - a.timestamp)[0];

            if (lastProtection && lastProtection.targetId === p.id) {
              // Can't protect same person twice in a row
              return false;
            }
          }

          return true;
        });

      default:
        return [];
    }
  };

  const validTargets = getValidTargets();

  // Check if current player has already acted
  useEffect(() => {
    const existingAction = gameState.nightActions.find(
      (a) => a.playerId === currentPlayerId
    );
    if (existingAction) {
      setHasActed(true);
      setSelectedPlayerId(existingAction.targetId);
    }
  }, [gameState.nightActions, currentPlayerId]);

  const handleSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  const handleSubmit = () => {
    if (!hasActed && selectedPlayerId) {
      onActionSubmit(selectedPlayerId);
      setHasActed(true);
    }
  };

  // Show "sleeping" message for roles with no night action
  if (
    !playerRole ||
    playerRole === 'Villager' ||
    playerRole === 'Hunter' ||
    playerRole === 'Tanner' ||
    playerRole === 'Fool'
  ) {
    return (
      <div className="bg-gray-900 rounded-xl border-2 border-blue-500/50 p-8 text-center shadow-2xl">
        <div className="text-6xl mb-4">😴</div>
        <h2 className="text-2xl font-bold text-blue-100 mb-4">You Rest Tonight</h2>
        <p className="text-gray-300">
          {ROLE_ACTION_PROMPTS[playerRole || 'Villager']}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Waiting for other players to complete their actions...
        </p>
      </div>
    );
  }

  const actionPrompt = ROLE_ACTION_PROMPTS[playerRole];

  return (
    <div className="bg-gray-900 rounded-xl border-2 border-purple-500/50 p-6 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-purple-100 mb-2">
          🌙 Night Action
        </h2>
        <p className="text-gray-300">{actionPrompt}</p>
      </div>

      {/* Timer */}
      {timeRemaining !== undefined && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Time Remaining</span>
            <span className="text-purple-400 font-bold">
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                timeRemaining < 30 ? 'bg-red-500 animate-pulse' : 'bg-purple-500'
              }`}
              style={{
                width: `${
                  ((gameState.settings.nightPhaseTime - timeRemaining) /
                    gameState.settings.nightPhaseTime) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Werewolf Pack Info */}
      {playerRole === 'Werewolf' && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">🐺 Your Pack:</p>
          <div className="flex flex-wrap gap-2">
            {gameState.players
              .filter((p) => p.role === 'Werewolf' && p.status === 'Alive')
              .map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1 bg-red-900/50 rounded-lg text-red-300 text-sm"
                >
                  {p.id === currentPlayerId ? `${p.name} (You)` : p.name}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Target Selection */}
      {!hasActed ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6 max-h-64 overflow-y-auto">
            {validTargets.map((player) => {
              const isSelected = player.id === selectedPlayerId;

              return (
                <button
                  key={player.id}
                  onClick={() => handleSelect(player.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? 'border-purple-400 bg-purple-900/50 scale-105'
                        : 'border-gray-700 bg-gray-800 hover:border-purple-400/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-bold text-white text-sm">
                        {player.name}
                        {player.isAI && <span className="ml-1 text-xs">🤖</span>}
                      </p>
                    </div>
                    {isSelected && <span className="text-2xl">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedPlayerId}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            Confirm Action
          </button>
        </>
      ) : (
        <>
          {/* Action Confirmed */}
          <div className="text-center mb-6">
            <div className="inline-block bg-green-900/50 border-2 border-green-500 rounded-lg p-4">
              <p className="text-green-400 font-bold text-lg mb-2">
                ✓ Action Submitted
              </p>
              <p className="text-gray-300 text-sm">
                Target:{' '}
                <span className="font-bold">
                  {selectedPlayerId
                    ? gameState.players.find((p) => p.id === selectedPlayerId)?.name
                    : 'None'}
                </span>
              </p>
            </div>
          </div>

          {/* Previous Investigation Results (Seer) */}
          {playerRole === 'Seer' && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">
                🔮 Previous Visions
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gameState.nightActions
                  .filter(
                    (a) =>
                      a.playerId === currentPlayerId && a.actionType === 'investigate'
                  )
                  .reverse()
                  .slice(0, 5)
                  .map((action) => {
                    const target = gameState.players.find(
                      (p) => p.id === action.targetId
                    );
                    return (
                      <div
                        key={action.timestamp}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-300">{target?.name}</span>
                        <span
                          className={`font-bold ${
                            action.result === 'Werewolf'
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}
                        >
                          {action.result}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
