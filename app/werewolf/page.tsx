'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type {
  WerewolfGameState,
  WerewolfLobby,
  WerewolfPlayer,
  GamePhase,
  NightAction,
  DayVote,
} from '@/types/werewolf';
import {
  createLobby,
  addAIPlayers,
  initializeGame,
  assignRoles,
  resolveNightActions,
  resolveVoting,
  checkWinCondition,
  transitionPhase,
  killPlayer,
  createGameEvent,
  updateAllSuspicionLevels,
} from '@/lib/werewolf/game-utils';
import { gameStateStorage, lobbyStorage, generateId } from '@/lib/werewolf/storage';
import { getNarration } from '@/lib/werewolf/prompts';

// Components
import WerewolfLobbyComponent from '@/components/werewolf/WerewolfLobby';
import RoleCard from '@/components/werewolf/RoleCard';
import PlayerGrid from '@/components/werewolf/PlayerGrid';
import NightActionUI from '@/components/werewolf/NightActionUI';
import VotingUI from '@/components/werewolf/VotingUI';

type GameView = 'menu' | 'createLobby' | 'joinLobby' | 'lobby' | 'game';

export default function WerewolfPage() {
  const router = useRouter();
  const [view, setView] = useState<GameView>('menu');
  const [lobby, setLobby] = useState<WerewolfLobby | null>(null);
  const [gameState, setGameState] = useState<WerewolfGameState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [joinCode, setJoinCode] = useState<string>('');
  const [showRoleCard, setShowRoleCard] = useState<boolean>(false);
  const [narration, setNarration] = useState<string>('');
  const [phaseTimer, setPhaseTimer] = useState<number>(0);

  // Load existing game state on mount
  useEffect(() => {
    const savedGame = gameStateStorage.load();
    if (savedGame) {
      setGameState(savedGame);
      setView('game');
    }
  }, []);

  // Phase timer countdown
  useEffect(() => {
    if (!gameState || gameState.phase === 'Lobby' || gameState.phase === 'GameOver') {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.currentPhaseStartTime) / 1000);
      const remaining = Math.max(0, gameState.phaseTimeLimit - elapsed);
      setPhaseTimer(remaining);

      // Auto-advance phase when timer runs out
      if (remaining === 0) {
        handlePhaseTimeout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState) {
      gameStateStorage.save(gameState);
    }
  }, [gameState]);

  // ============================================================================
  // LOBBY FUNCTIONS
  // ============================================================================

  const handleCreateLobby = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    const newLobby = createLobby(playerName);
    setLobby(newLobby);
    setCurrentPlayerId(newLobby.hostPlayerId);
    lobbyStorage.save(newLobby);
    setView('lobby');
  };

  const handleJoinLobby = () => {
    if (!playerName.trim() || !joinCode.trim()) {
      alert('Please enter your name and lobby code');
      return;
    }

    const existingLobby = lobbyStorage.getByCode(joinCode.toUpperCase());
    if (!existingLobby) {
      alert('Lobby not found');
      return;
    }

    if (existingLobby.players.length >= existingLobby.maxPlayers) {
      alert('Lobby is full');
      return;
    }

    const newPlayer: WerewolfPlayer = {
      id: generateId(),
      name: playerName,
      isAI: false,
      role: null,
      status: 'Alive',
      votedFor: null,
      suspicionLevel: 0,
      isHost: false,
    };

    const updatedLobby = {
      ...existingLobby,
      players: [...existingLobby.players, newPlayer],
    };

    setLobby(updatedLobby);
    setCurrentPlayerId(newPlayer.id);
    lobbyStorage.save(updatedLobby);
    setView('lobby');
  };

  const handleAddAI = () => {
    if (!lobby) return;

    const aiPlayers = addAIPlayers(lobby, 1);
    const updatedLobby = {
      ...lobby,
      players: [...lobby.players, ...aiPlayers],
    };

    setLobby(updatedLobby);
    lobbyStorage.save(updatedLobby);
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!lobby) return;

    const updatedLobby = {
      ...lobby,
      players: lobby.players.filter((p) => p.id !== playerId),
    };

    setLobby(updatedLobby);
    lobbyStorage.save(updatedLobby);
  };

  const handleStartGame = async () => {
    if (!lobby) return;

    let finalLobby = { ...lobby };

    // Fill with AI players if needed
    if (lobby.settings.aiPlayerFill && lobby.players.length < lobby.settings.minPlayers) {
      const needed = lobby.settings.minPlayers - lobby.players.length;
      const aiPlayers = addAIPlayers(lobby, needed);
      finalLobby = {
        ...lobby,
        players: [...lobby.players, ...aiPlayers],
      };
    }

    // Initialize game state
    let newGameState = initializeGame(finalLobby);

    // Assign roles
    const playersWithRoles = assignRoles(
      newGameState.players,
      finalLobby.settings.advancedRoles
    );
    newGameState.players = playersWithRoles;

    // Create opening narration
    const openingNarration = getNarration('gameStart', {
      villageName: newGameState.villageName,
    });
    setNarration(openingNarration);

    // Add opening event
    const openingEvent = createGameEvent(
      'narration',
      'Night',
      openingNarration,
      [],
      true
    );
    newGameState.events.push(openingEvent);

    // Transition to Night phase
    newGameState = transitionPhase(newGameState, 'Night');

    setGameState(newGameState);
    setShowRoleCard(true);
    setView('game');

    // Hide role card after 10 seconds
    setTimeout(() => setShowRoleCard(false), 10000);
  };

  // ============================================================================
  // GAME PHASE FUNCTIONS
  // ============================================================================

  const handleNightAction = async (targetId: string | null) => {
    if (!gameState || !currentPlayerId) return;

    const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);
    if (!currentPlayer || !currentPlayer.role) return;

    const action: NightAction = {
      playerId: currentPlayerId,
      roleType: currentPlayer.role,
      actionType:
        currentPlayer.role === 'Werewolf'
          ? 'kill'
          : currentPlayer.role === 'Seer'
          ? 'investigate'
          : 'protect',
      targetId,
      timestamp: Date.now(),
    };

    // Add action to game state
    const updatedState = {
      ...gameState,
      nightActions: [...gameState.nightActions, action],
    };

    setGameState(updatedState);

    // Check if all night actions are complete
    checkNightActionsComplete(updatedState);
  };

  const checkNightActionsComplete = async (state: WerewolfGameState) => {
    // Count players with night actions
    const playersWithActions = state.players.filter(
      (p) =>
        p.status === 'Alive' &&
        (p.role === 'Werewolf' || p.role === 'Seer' || p.role === 'Doctor')
    );

    const actionsSubmitted = state.nightActions.filter(
      (a) => a.timestamp > state.currentPhaseStartTime
    ).length;

    // All players acted or time ran out
    if (actionsSubmitted >= playersWithActions.length || phaseTimer === 0) {
      await resolveNightPhase(state);
    }
  };

  const resolveNightPhase = async (state: WerewolfGameState) => {
    // Resolve night actions
    const { deaths, protections, investigations } = resolveNightActions(state);

    let updatedState = { ...state };

    // Process deaths
    deaths.forEach((playerId) => {
      updatedState = killPlayer(updatedState, playerId, 'werewolf');
      const victim = state.players.find((p) => p.id === playerId);

      const deathEvent = createGameEvent(
        'death',
        'Night',
        `${victim?.name} was killed by werewolves`,
        [playerId],
        true,
        state.dayNumber,
        state.nightNumber
      );
      updatedState.events.push(deathEvent);
    });

    // Store investigation results (private to Seer)
    investigations.forEach((inv) => {
      const investigationAction = updatedState.nightActions.find(
        (a) => a.playerId === inv.seerId && a.actionType === 'investigate'
      );
      if (investigationAction) {
        investigationAction.result = inv.result;
      }
    });

    // Generate dawn narration
    const dawnNarration =
      deaths.length > 0
        ? getNarration('dawnWithDeath', {
            villageName: updatedState.villageName,
            victimName:
              updatedState.players.find((p) => p.id === deaths[0])?.name || 'Unknown',
          })
        : getNarration('dawnNoDeath', { villageName: updatedState.villageName });

    setNarration(dawnNarration);

    // Check win condition
    const { gameOver, winner } = checkWinCondition(updatedState);
    if (gameOver) {
      updatedState = transitionPhase(updatedState, 'GameOver');
      updatedState.winner = winner;
    } else {
      // Transition to Day phase
      updatedState = transitionPhase(updatedState, 'Day');
    }

    setGameState(updatedState);
  };

  const handleStartVoting = () => {
    if (!gameState) return;

    const votingState = transitionPhase(gameState, 'Voting');
    const voteNarration = getNarration('voteStart');
    setNarration(voteNarration);
    setGameState(votingState);
  };

  const handleVoteSubmit = (targetId: string | null) => {
    if (!gameState || !currentPlayerId) return;

    const vote: DayVote = {
      voterId: currentPlayerId,
      targetId,
      timestamp: Date.now(),
    };

    const updatedState = {
      ...gameState,
      dayVotes: [...gameState.dayVotes, vote],
      players: gameState.players.map((p) =>
        p.id === currentPlayerId ? { ...p, votedFor: targetId } : p
      ),
    };

    setGameState(updatedState);

    // Check if all votes are in
    checkVotingComplete(updatedState);
  };

  const checkVotingComplete = async (state: WerewolfGameState) => {
    const alivePlayers = state.players.filter((p) => p.status === 'Alive');
    const votesSubmitted = state.dayVotes.length;

    if (votesSubmitted >= alivePlayers.length || phaseTimer === 0) {
      await resolveVotingPhase(state);
    }
  };

  const resolveVotingPhase = async (state: WerewolfGameState) => {
    const { eliminatedId, voteCounts, isTie } = resolveVoting(state);

    let updatedState = { ...state };

    if (eliminatedId) {
      const eliminated = state.players.find((p) => p.id === eliminatedId);

      // Kill the eliminated player
      updatedState = killPlayer(updatedState, eliminatedId, 'vote');

      // Generate elimination narration
      const eliminationNarration = getNarration('elimination', {
        eliminatedName: eliminated?.name || 'Unknown',
        role: eliminated?.role || 'Unknown',
      });
      setNarration(eliminationNarration);

      // Update suspicion levels
      updatedState = updateAllSuspicionLevels(updatedState);

      // Check for Hunter revenge
      if (eliminated?.role === 'Hunter') {
        // TODO: Implement Hunter revenge logic
      }

      // Check win condition
      const { gameOver, winner } = checkWinCondition(updatedState);
      if (gameOver) {
        updatedState = transitionPhase(updatedState, 'GameOver');
        updatedState.winner = winner;
      } else {
        // Transition to next Night phase
        updatedState = transitionPhase(updatedState, 'Night');
      }
    } else {
      // No elimination (tie or all skipped)
      const noEliminationNarration =
        'The village cannot agree. No one is eliminated today.';
      setNarration(noEliminationNarration);
      updatedState = transitionPhase(updatedState, 'Night');
    }

    setGameState(updatedState);
  };

  const handlePhaseTimeout = () => {
    if (!gameState) return;

    switch (gameState.phase) {
      case 'Night':
        resolveNightPhase(gameState);
        break;
      case 'Day':
        handleStartVoting();
        break;
      case 'Voting':
        resolveVotingPhase(gameState);
        break;
    }
  };

  const handleNewGame = () => {
    gameStateStorage.clear();
    setGameState(null);
    setLobby(null);
    setView('menu');
  };

  // ============================================================================
  // RENDER VIEWS
  // ============================================================================

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-amber-100 mb-4">
              🐺 Werewolf
            </h1>
            <p className="text-xl text-gray-300">
              A Social Deduction Game of Lies and Survival
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setView('createLobby')}
              className="w-full py-6 px-8 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xl rounded-lg transition-all transform hover:scale-105"
            >
              Create New Game
            </button>
            <button
              onClick={() => setView('joinLobby')}
              className="w-full py-6 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-lg transition-all transform hover:scale-105"
            >
              Join Existing Game
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
            >
              Back to Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'createLobby' || view === 'joinLobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-8">
            <h2 className="text-3xl font-bold text-amber-100 mb-6 text-center">
              {view === 'createLobby' ? 'Create Game' : 'Join Game'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  maxLength={20}
                />
              </div>

              {view === 'joinLobby' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Lobby Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="6-character code"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white uppercase tracking-wider text-center text-2xl font-bold"
                    maxLength={6}
                  />
                </div>
              )}

              <button
                onClick={
                  view === 'createLobby' ? handleCreateLobby : handleJoinLobby
                }
                className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all"
              >
                {view === 'createLobby' ? 'Create Lobby' : 'Join Lobby'}
              </button>

              <button
                onClick={() => setView('menu')}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'lobby' && lobby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
        <WerewolfLobbyComponent
          lobby={lobby}
          currentPlayerId={currentPlayerId}
          onStartGame={handleStartGame}
          onAddAI={handleAddAI}
          onRemovePlayer={handleRemovePlayer}
          onUpdateSettings={(settings) => {
            if (lobby) {
              const updatedLobby = {
                ...lobby,
                settings: { ...lobby.settings, ...settings },
              };
              setLobby(updatedLobby);
              lobbyStorage.save(updatedLobby);
            }
          }}
          onLeave={() => {
            lobbyStorage.delete(lobby.id);
            setView('menu');
          }}
        />
      </div>
    );
  }

  if (view === 'game' && gameState) {
    const currentPlayer = gameState.players.find((p) => p.id === currentPlayerId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gray-900 rounded-xl border-2 border-amber-500/50 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-amber-100">
                  {gameState.villageName}
                </h1>
                <p className="text-gray-400">
                  {gameState.phase === 'Night'
                    ? `🌙 Night ${gameState.nightNumber}`
                    : gameState.phase === 'Day' || gameState.phase === 'Voting'
                    ? `☀️ Day ${gameState.dayNumber}`
                    : gameState.phase}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Players Alive</p>
                <p className="text-2xl font-bold text-white">
                  {gameState.alivePlayers.length} / {gameState.players.length}
                </p>
              </div>
            </div>
          </div>

          {/* Role Card Modal */}
          {showRoleCard && currentPlayer && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
              <div className="max-w-md w-full">
                <RoleCard player={currentPlayer} />
                <button
                  onClick={() => setShowRoleCard(false)}
                  className="w-full mt-4 py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Narration */}
          {narration && (
            <div className="bg-gray-800 border-2 border-amber-500/30 rounded-xl p-6 mb-6">
              <p className="text-gray-200 text-lg italic whitespace-pre-line">
                {narration}
              </p>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState.phase === 'GameOver' && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-amber-500 p-8 text-center mb-6">
              <h2 className="text-5xl font-bold text-amber-100 mb-4">
                {gameState.winner === 'Villagers' ? '☀️ Villagers Win!' : '🌑 Werewolves Win!'}
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                {gameState.winner === 'Villagers'
                  ? 'The village is safe! All werewolves have been eliminated.'
                  : 'The wolves have won. The village falls to darkness.'}
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">Final Roles:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gameState.players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-lg border-2 ${
                        player.role === 'Werewolf'
                          ? 'border-red-500 bg-red-900/20'
                          : 'border-blue-500 bg-blue-900/20'
                      }`}
                    >
                      <p className="font-bold text-white text-sm">{player.name}</p>
                      <p className="text-xs text-gray-300">{player.role}</p>
                      {player.status === 'Dead' && (
                        <p className="text-xs text-red-400">💀 Eliminated</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNewGame}
                className="py-3 px-8 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-lg transition-all"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Phase-specific UI */}
          {gameState.phase !== 'GameOver' && currentPlayer && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Phase Action */}
              <div className="lg:col-span-2 space-y-6">
                {gameState.phase === 'Night' && (
                  <NightActionUI
                    gameState={gameState}
                    currentPlayerId={currentPlayerId}
                    onActionSubmit={handleNightAction}
                    timeRemaining={phaseTimer}
                  />
                )}

                {gameState.phase === 'Day' && (
                  <div className="bg-gray-900 rounded-xl border-2 border-blue-500/50 p-6">
                    <h2 className="text-2xl font-bold text-blue-100 mb-4 text-center">
                      ☀️ Day Discussion
                    </h2>
                    <p className="text-gray-300 text-center mb-4">
                      Discuss with other players and determine who to vote off.
                    </p>
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-4">
                        Time Remaining: {Math.floor(phaseTimer / 60)}:
                        {(phaseTimer % 60).toString().padStart(2, '0')}
                      </p>
                      {currentPlayer.isHost && (
                        <button
                          onClick={handleStartVoting}
                          className="py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg"
                        >
                          Start Voting
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {gameState.phase === 'Voting' && (
                  <VotingUI
                    gameState={gameState}
                    currentPlayerId={currentPlayerId}
                    onVoteSubmit={handleVoteSubmit}
                    timeRemaining={phaseTimer}
                  />
                )}

                {/* Player Grid */}
                <PlayerGrid
                  gameState={gameState}
                  currentPlayerId={currentPlayerId}
                  highlightWerewolves={
                    currentPlayer.role === 'Werewolf' && gameState.phase === 'Night'
                  }
                />
              </div>

              {/* Right Column - Player Info */}
              <div className="space-y-6">
                <button
                  onClick={() => setShowRoleCard(true)}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg"
                >
                  View Your Role
                </button>

                {currentPlayer && (
                  <div className="bg-gray-900 rounded-xl border-2 border-gray-700 p-4">
                    <h3 className="text-lg font-bold text-white mb-3">Your Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-bold">{currentPlayer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white">{currentPlayer.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleNewGame}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                >
                  Leave Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
