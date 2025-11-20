'use client';

import React, { useState } from 'react';
import type { GameHistoryEntry, GameType, GameOutcome } from '@/types/user';

interface GameHistoryTabProps {
  gameHistory: GameHistoryEntry[];
  isOwnProfile: boolean;
}

export default function GameHistoryTab({
  gameHistory,
  isOwnProfile,
}: GameHistoryTabProps) {
  const [filterType, setFilterType] = useState<GameType | 'All'>('All');
  const [filterOutcome, setFilterOutcome] = useState<GameOutcome | 'All'>('All');

  // Filter games
  const filteredGames = gameHistory.filter((game) => {
    if (filterType !== 'All' && game.gameType !== filterType) return false;
    if (filterOutcome !== 'All' && game.outcome !== filterOutcome) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Game Type Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Game Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as GameType | 'All')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Games</option>
              <option value="TTRPG">TTRPG</option>
              <option value="Werewolf">Werewolf</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Outcome Filter */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Outcome
            </label>
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value as GameOutcome | 'All')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Outcomes</option>
              <option value="Victory">Victory</option>
              <option value="Defeat">Defeat</option>
              <option value="Draw">Draw</option>
              <option value="Abandoned">Abandoned</option>
              <option value="Ongoing">Ongoing</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredGames.length} of {gameHistory.length} games
        </div>
      </div>

      {/* Game List */}
      {filteredGames.length > 0 ? (
        <div className="space-y-4">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl">
                      {game.gameType === 'Werewolf' ? '🐺' : '🎲'}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {game.gameName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {game.gameType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="text-gray-400">
                      Role:{' '}
                      <span className="text-amber-400 font-medium">
                        {game.role}
                      </span>
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className={
                      game.outcome === 'Victory'
                        ? 'text-green-400 font-medium'
                        : game.outcome === 'Defeat'
                        ? 'text-red-400 font-medium'
                        : game.outcome === 'Ongoing'
                        ? 'text-blue-400 font-medium'
                        : 'text-gray-400 font-medium'
                    }>
                      {game.outcome}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400">
                      {game.duration} min
                    </span>
                    {game.xpGained > 0 && (
                      <>
                        <span className="text-gray-500">|</span>
                        <span className="text-amber-400">
                          +{game.xpGained} XP
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right text-sm text-gray-500">
                  <p>{new Date(game.startedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(game.startedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Stats (if available) */}
              {game.stats && Object.keys(game.stats).length > 0 && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Performance Stats
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                    {game.stats.votesCorrect !== undefined && (
                      <div>
                        <span className="text-gray-400">Correct Votes:</span>{' '}
                        <span className="text-white font-medium">
                          {game.stats.votesCorrect}
                        </span>
                      </div>
                    )}
                    {game.stats.survived !== undefined && (
                      <div>
                        <span className="text-gray-400">Survived:</span>{' '}
                        <span className={game.stats.survived ? 'text-green-400' : 'text-red-400'}>
                          {game.stats.survived ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                    {game.stats.rolesIdentified !== undefined && (
                      <div>
                        <span className="text-gray-400">Investigated:</span>{' '}
                        <span className="text-white font-medium">
                          {game.stats.rolesIdentified}
                        </span>
                      </div>
                    )}
                    {game.stats.livesProtected !== undefined && (
                      <div>
                        <span className="text-gray-400">Lives Saved:</span>{' '}
                        <span className="text-white font-medium">
                          {game.stats.livesProtected}
                        </span>
                      </div>
                    )}
                    {game.stats.killsAsWerewolf !== undefined && (
                      <div>
                        <span className="text-gray-400">Kills:</span>{' '}
                        <span className="text-white font-medium">
                          {game.stats.killsAsWerewolf}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Party Members */}
              {game.partyMembers && game.partyMembers.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Party ({game.partyMembers.length} players)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {game.partyMembers.slice(0, 6).map((member) => (
                      <div
                        key={member.id}
                        className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                      >
                        {member.name}
                        {member.isAI && ' 🤖'}
                      </div>
                    ))}
                    {game.partyMembers.length > 6 && (
                      <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                        +{game.partyMembers.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-12 text-center">
          <p className="text-gray-400 text-lg">No games found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or start playing!
          </p>
        </div>
      )}
    </div>
  );
}
