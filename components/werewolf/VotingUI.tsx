'use client';

import React, { useState, useEffect } from 'react';
import type { WerewolfPlayer, WerewolfGameState, DayVote } from '@/types/werewolf';

interface VotingUIProps {
  gameState: WerewolfGameState;
  currentPlayerId: string;
  onVoteSubmit: (targetId: string | null) => void;
  timeRemaining?: number; // seconds
}

export default function VotingUI({
  gameState,
  currentPlayerId,
  onVoteSubmit,
  timeRemaining,
}: VotingUIProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);
  const alivePlayers = gameState.players.filter(
    (p) => p.status === 'Alive' && p.id !== currentPlayerId
  );

  // Check if current player has already voted
  useEffect(() => {
    const existingVote = gameState.dayVotes.find((v) => v.voterId === currentPlayerId);
    if (existingVote) {
      setHasVoted(true);
      setSelectedPlayerId(existingVote.targetId);
    }
  }, [gameState.dayVotes, currentPlayerId]);

  const handleVote = (playerId: string | null) => {
    setSelectedPlayerId(playerId);
  };

  const handleSubmit = () => {
    if (!hasVoted) {
      onVoteSubmit(selectedPlayerId);
      setHasVoted(true);
    }
  };

  // Calculate vote counts for display
  const voteCounts = new Map<string, number>();
  gameState.dayVotes.forEach((vote) => {
    if (vote.targetId) {
      voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) || 0) + 1);
    }
  });

  const totalVotes = gameState.dayVotes.length;
  const totalPlayers = gameState.players.filter((p) => p.status === 'Alive').length;

  return (
    <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-6 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-100 mb-2">🗳️ Vote to Eliminate</h2>
        <p className="text-gray-300">
          Who do you believe is a Werewolf? Choose wisely.
        </p>
      </div>

      {/* Timer */}
      {timeRemaining !== undefined && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Time Remaining</span>
            <span className="text-amber-400 font-bold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                timeRemaining < 30 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
              }`}
              style={{
                width: `${((gameState.settings.votingPhaseTime - timeRemaining) / gameState.settings.votingPhaseTime) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Vote Progress */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-400">
          Votes Cast: <span className="text-white font-bold">{totalVotes}</span> / {totalPlayers}
        </p>
      </div>

      {/* Player Selection */}
      {!hasVoted ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6 max-h-64 overflow-y-auto">
            {alivePlayers.map((player) => {
              const isSelected = player.id === selectedPlayerId;
              const votes = voteCounts.get(player.id) || 0;

              return (
                <button
                  key={player.id}
                  onClick={() => handleVote(player.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? 'border-amber-400 bg-amber-900/50 scale-105'
                        : 'border-gray-700 bg-gray-800 hover:border-amber-400/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-bold text-white text-sm">
                        {player.name}
                        {player.isAI && <span className="ml-1 text-xs">🤖</span>}
                      </p>
                      {player.suspicionLevel && player.suspicionLevel > 0 && (
                        <p className="text-xs text-orange-400">
                          ⚠️ {player.suspicionLevel}% suspicious
                        </p>
                      )}
                    </div>
                    {isSelected && <span className="text-2xl">✓</span>}
                  </div>
                </button>
              );
            })}

            {/* Skip Vote Option */}
            <button
              onClick={() => handleVote(null)}
              className={`
                p-3 rounded-lg border-2 transition-all col-span-2
                ${
                  selectedPlayerId === null
                    ? 'border-amber-400 bg-amber-900/50 scale-105'
                    : 'border-gray-700 bg-gray-800 hover:border-amber-400/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-white text-sm">
                  Skip Vote (No Elimination)
                </p>
                {selectedPlayerId === null && <span className="text-2xl">✓</span>}
              </div>
            </button>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={selectedPlayerId === undefined}
            className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            Lock In Vote
          </button>
        </>
      ) : (
        <>
          {/* Voted Confirmation */}
          <div className="text-center mb-6">
            <div className="inline-block bg-green-900/50 border-2 border-green-500 rounded-lg p-4">
              <p className="text-green-400 font-bold text-lg mb-2">✓ Vote Submitted</p>
              <p className="text-gray-300 text-sm">
                You voted for:{' '}
                <span className="font-bold">
                  {selectedPlayerId
                    ? gameState.players.find((p) => p.id === selectedPlayerId)?.name
                    : 'No One (Skip)'}
                </span>
              </p>
            </div>
          </div>

          {/* Current Vote Tally (Partial) */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">
              Current Vote Tally
            </h3>
            <div className="space-y-2">
              {Array.from(voteCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([playerId, count]) => {
                  const player = gameState.players.find((p) => p.id === playerId);
                  if (!player) return null;

                  return (
                    <div key={playerId} className="flex items-center justify-between">
                      <span className="text-white text-sm">{player.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: count }).map((_, i) => (
                            <span key={i} className="text-amber-400">
                              🗳️
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">({count})</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
