'use client';

import React, { useState } from 'react';
import type { WerewolfLobby, WerewolfPlayer, WerewolfGameSettings } from '@/types/werewolf';

interface WerewolfLobbyProps {
  lobby: WerewolfLobby;
  currentPlayerId: string;
  onStartGame: () => void;
  onAddAI: () => void;
  onRemovePlayer: (playerId: string) => void;
  onUpdateSettings: (settings: Partial<WerewolfGameSettings>) => void;
  onLeave: () => void;
}

export default function WerewolfLobby({
  lobby,
  currentPlayerId,
  onStartGame,
  onAddAI,
  onRemovePlayer,
  onUpdateSettings,
  onLeave,
}: WerewolfLobbyProps) {
  const [showSettings, setShowSettings] = useState(false);
  const currentPlayer = lobby.players.find((p) => p.id === currentPlayerId);
  const isHost = currentPlayer?.isHost || false;

  const canStartGame =
    isHost &&
    lobby.players.length >= lobby.settings.minPlayers &&
    lobby.players.length <= lobby.settings.maxPlayers;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-amber-500/50 p-8 mb-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-100 mb-2">
            🐺 {lobby.gameName}
          </h1>
          <p className="text-gray-300 text-lg">Village of {lobby.villageName}</p>
        </div>

        {/* Lobby Code */}
        <div className="bg-black/30 rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Lobby Code</p>
          <p className="text-3xl font-bold text-amber-400 tracking-wider">
            {lobby.lobbyCode}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Share this code with friends to join
          </p>
        </div>

        {/* Player Count */}
        <div className="text-center">
          <p className="text-gray-300">
            Players:{' '}
            <span className="font-bold text-white">
              {lobby.players.length} / {lobby.maxPlayers}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Minimum {lobby.settings.minPlayers} players required to start
          </p>
        </div>
      </div>

      {/* Player List */}
      <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Players</h2>
          {isHost && lobby.settings.aiPlayerFill && (
            <button
              onClick={onAddAI}
              disabled={lobby.players.length >= lobby.maxPlayers}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-sm rounded-lg transition-all"
            >
              + Add AI Player
            </button>
          )}
        </div>

        <div className="space-y-3">
          {lobby.players.map((player) => (
            <div
              key={player.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border-2
                ${
                  player.id === currentPlayerId
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-800'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {player.isAI ? (
                  <span className="text-2xl">🤖</span>
                ) : (
                  <span className="text-2xl">👤</span>
                )}
                <div>
                  <p className="font-bold text-white">
                    {player.name}
                    {player.isHost && (
                      <span className="ml-2 text-xs bg-amber-600 px-2 py-1 rounded">
                        Host 👑
                      </span>
                    )}
                    {player.id === currentPlayerId && (
                      <span className="ml-2 text-xs text-blue-400">(You)</span>
                    )}
                  </p>
                  {player.isAI && player.aiDifficulty && (
                    <p className="text-xs text-gray-400">
                      AI Difficulty: {player.aiDifficulty}
                    </p>
                  )}
                </div>
              </div>

              {isHost && player.id !== lobby.hostPlayerId && (
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Toggle */}
      {isHost && (
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-6 mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between text-white font-bold"
          >
            <span>⚙️ Game Settings</span>
            <span>{showSettings ? '▼' : '▶'}</span>
          </button>

          {showSettings && (
            <div className="mt-4 space-y-4">
              {/* Time Limits */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Day Discussion Time (seconds)
                </label>
                <input
                  type="number"
                  value={lobby.settings.dayDiscussionTime}
                  onChange={(e) =>
                    onUpdateSettings({ dayDiscussionTime: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  min="60"
                  max="600"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Voting Time (seconds)
                </label>
                <input
                  type="number"
                  value={lobby.settings.votingPhaseTime}
                  onChange={(e) =>
                    onUpdateSettings({ votingPhaseTime: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  min="30"
                  max="300"
                />
              </div>

              {/* AI Settings */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  AI Difficulty
                </label>
                <select
                  value={lobby.settings.aiDifficulty}
                  onChange={(e) =>
                    onUpdateSettings({
                      aiDifficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Expert',
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Voice Chat</span>
                  <input
                    type="checkbox"
                    checked={lobby.settings.voiceChatEnabled}
                    onChange={(e) =>
                      onUpdateSettings({ voiceChatEnabled: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Advanced Roles (Tanner, Cupid)</span>
                  <input
                    type="checkbox"
                    checked={lobby.settings.advancedRoles}
                    onChange={(e) =>
                      onUpdateSettings({ advancedRoles: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Suspicion Tracker</span>
                  <input
                    type="checkbox"
                    checked={lobby.settings.suspicionTracker}
                    onChange={(e) =>
                      onUpdateSettings({ suspicionTracker: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">AI Auto-Fill Empty Slots</span>
                  <input
                    type="checkbox"
                    checked={lobby.settings.aiPlayerFill}
                    onChange={(e) =>
                      onUpdateSettings({ aiPlayerFill: e.target.checked })
                    }
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {isHost ? (
          <button
            onClick={onStartGame}
            disabled={!canStartGame}
            className="flex-1 py-4 px-6 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105"
          >
            {canStartGame ? '🎮 Start Game' : `Need ${lobby.settings.minPlayers - lobby.players.length} More Players`}
          </button>
        ) : (
          <div className="flex-1 py-4 px-6 bg-gray-800 text-gray-400 text-center rounded-lg border-2 border-gray-700">
            Waiting for host to start game...
          </div>
        )}

        <button
          onClick={onLeave}
          className="px-6 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all"
        >
          Leave Lobby
        </button>
      </div>

      {/* Info Notice */}
      {lobby.settings.aiPlayerFill && lobby.players.length < lobby.settings.minPlayers && (
        <div className="mt-4 bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 text-center">
          <p className="text-blue-300 text-sm">
            ℹ️ AI players will automatically fill empty slots when the game starts
          </p>
        </div>
      )}
    </div>
  );
}
