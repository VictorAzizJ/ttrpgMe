/**
 * Werewolf Game Utility Functions
 * Core game logic, role assignment, win condition checking, etc.
 */

import type {
  WerewolfGameState,
  WerewolfPlayer,
  WerewolfRoleType,
  RoleDistribution,
  NightAction,
  DayVote,
  GameEvent,
  WerewolfGameSettings,
  WerewolfLobby,
} from '@/types/werewolf';
import { WEREWOLF_ROLES, ROLE_DISTRIBUTIONS } from '@/types/werewolf';
import { generateId, generateLobbyCode } from './storage';
import { generateVillageLore, generateCharacterName, generateCharacterBackstory } from './prompts';

// ============================================================================
// GAME INITIALIZATION
// ============================================================================

/**
 * Create a new game lobby
 */
export function createLobby(
  hostName: string,
  settings: Partial<WerewolfGameSettings> = {}
): WerewolfLobby {
  const defaultSettings: WerewolfGameSettings = {
    minPlayers: 5,
    maxPlayers: 12,
    aiPlayerFill: true,
    aiDifficulty: 'Intermediate',
    nightPhaseTime: 60,
    dayDiscussionTime: 180,
    votingPhaseTime: 60,
    voiceChatEnabled: false,
    textChatEnabled: true,
    whisperEnabled: false,
    deadCanSpeak: false,
    advancedRoles: false,
    suspicionTracker: true,
    bluffTokens: false,
    spectatorMode: true,
    spectatorDelay: 30,
  };

  const lore = generateVillageLore();
  const lobbyCode = generateLobbyCode();
  const hostId = generateId();

  const hostPlayer: WerewolfPlayer = {
    id: hostId,
    name: hostName,
    isAI: false,
    role: null,
    status: 'Alive',
    votedFor: null,
    suspicionLevel: 0,
    isHost: true,
  };

  return {
    id: generateId(),
    lobbyCode,
    hostPlayerId: hostId,
    gameName: `${lore.name} Werewolf`,
    villageName: lore.name,
    players: [hostPlayer],
    maxPlayers: settings.maxPlayers || defaultSettings.maxPlayers,
    settings: { ...defaultSettings, ...settings },
    isPublic: false,
    status: 'Waiting',
    createdAt: Date.now(),
  };
}

/**
 * Add AI players to fill lobby
 */
export function addAIPlayers(
  lobby: WerewolfLobby,
  count: number
): WerewolfPlayer[] {
  const aiPlayers: WerewolfPlayer[] = [];

  for (let i = 0; i < count; i++) {
    const name = generateCharacterName();
    const personalities = ['Aggressive', 'Cautious', 'Analytical', 'Chaotic'] as const;

    const aiPlayer: WerewolfPlayer = {
      id: generateId(),
      name,
      isAI: true,
      aiDifficulty: lobby.settings.aiDifficulty,
      aiPersonality: personalities[i % personalities.length],
      role: null,
      status: 'Alive',
      votedFor: null,
      suspicionLevel: 0,
      isHost: false,
      characterName: name,
    };

    aiPlayers.push(aiPlayer);
  }

  return aiPlayers;
}

/**
 * Initialize game from lobby
 */
export function initializeGame(lobby: WerewolfLobby): WerewolfGameState {
  const lore = generateVillageLore();

  return {
    id: generateId(),
    lobbyCode: lobby.lobbyCode,
    hostPlayerId: lobby.hostPlayerId,
    phase: 'Lobby',
    dayNumber: 0,
    nightNumber: 0,
    players: lobby.players,
    alivePlayers: lobby.players.map((p) => p.id),
    deadPlayers: [],
    currentPhaseStartTime: Date.now(),
    phaseTimeLimit: lobby.settings.dayDiscussionTime,
    nightActions: [],
    nightActionsComplete: false,
    dayVotes: [],
    votingOpen: false,
    events: [],
    eliminatedPlayers: [],
    gameOver: false,
    winner: null,
    settings: lobby.settings,
    villageName: lobby.villageName || lore.name,
    villageBackstory: lore.backstory,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ============================================================================
// ROLE ASSIGNMENT
// ============================================================================

/**
 * Get role distribution for player count
 */
export function getRoleDistribution(
  playerCount: number,
  advancedRoles: boolean = false
): RoleDistribution {
  // Find matching distribution or use closest
  let distribution =
    ROLE_DISTRIBUTIONS.find((d) => d.playerCount === playerCount) ||
    ROLE_DISTRIBUTIONS[ROLE_DISTRIBUTIONS.length - 1];

  return distribution;
}

/**
 * Assign roles to players
 */
export function assignRoles(
  players: WerewolfPlayer[],
  advancedRoles: boolean = false
): WerewolfPlayer[] {
  const playerCount = players.length;
  const distribution = getRoleDistribution(playerCount, advancedRoles);

  // Build role array
  const roles: WerewolfRoleType[] = [];

  // Add werewolves
  for (let i = 0; i < distribution.werewolves; i++) {
    roles.push('Werewolf');
  }

  // Add special roles
  for (let i = 0; i < distribution.seer; i++) roles.push('Seer');
  for (let i = 0; i < distribution.doctor; i++) roles.push('Doctor');
  for (let i = 0; i < distribution.hunter; i++) roles.push('Hunter');
  for (let i = 0; i < distribution.witch; i++) roles.push('Witch');

  // Add advanced roles if enabled
  if (advancedRoles) {
    if (distribution.tanner) roles.push('Tanner');
    if (distribution.cupid) roles.push('Cupid');
    if (distribution.fool) roles.push('Fool');
  }

  // Fill remaining with villagers
  while (roles.length < playerCount) {
    roles.push('Villager');
  }

  // Shuffle roles
  const shuffledRoles = shuffleArray(roles);

  // Assign to players
  return players.map((player, index) => {
    const role = shuffledRoles[index];
    return {
      ...player,
      role,
      characterBackstory: generateCharacterBackstory(role),
    };
  });
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// WIN CONDITION CHECKING
// ============================================================================

/**
 * Check if game is over and determine winner
 */
export function checkWinCondition(
  gameState: WerewolfGameState
): { gameOver: boolean; winner: 'Villagers' | 'Werewolves' | null } {
  const alivePlayers = gameState.players.filter((p) => p.status === 'Alive');

  const werewolvesAlive = alivePlayers.filter((p) => p.role === 'Werewolf').length;
  const villagersAlive = alivePlayers.filter(
    (p) => p.role !== 'Werewolf' && p.role !== 'Tanner'
  ).length;

  // Check for Tanner win (if Tanner was voted off)
  const tannerVotedOff = gameState.eliminatedPlayers.some(
    (e) => e.role === 'Tanner' && e.method === 'vote'
  );
  if (tannerVotedOff) {
    // Tanner wins (but game continues for others)
    // This is a special case - handle in UI
  }

  // Werewolves win if they equal or outnumber villagers
  if (werewolvesAlive > 0 && werewolvesAlive >= villagersAlive) {
    return { gameOver: true, winner: 'Werewolves' };
  }

  // Villagers win if all werewolves are dead
  if (werewolvesAlive === 0) {
    return { gameOver: true, winner: 'Villagers' };
  }

  return { gameOver: false, winner: null };
}

// ============================================================================
// NIGHT ACTION RESOLUTION
// ============================================================================

/**
 * Resolve all night actions and determine victim(s)
 */
export function resolveNightActions(
  gameState: WerewolfGameState
): {
  deaths: string[]; // Player IDs who died
  protections: string[]; // Player IDs who were protected
  investigations: Array<{ seerId: string; targetId: string; result: string }>;
} {
  const deaths: string[] = [];
  const protections: string[] = [];
  const investigations: Array<{ seerId: string; targetId: string; result: string }> = [];

  // Get werewolf target(s)
  const werewolfActions = gameState.nightActions.filter(
    (action) => action.actionType === 'kill'
  );

  // Tally werewolf votes
  const werewolfVotes = new Map<string, number>();
  werewolfActions.forEach((action) => {
    if (action.targetId) {
      werewolfVotes.set(
        action.targetId,
        (werewolfVotes.get(action.targetId) || 0) + 1
      );
    }
  });

  // Get most voted target
  let werewolfTarget: string | null = null;
  let maxVotes = 0;
  werewolfVotes.forEach((votes, targetId) => {
    if (votes > maxVotes) {
      maxVotes = votes;
      werewolfTarget = targetId;
    }
  });

  // Get doctor protection
  const doctorActions = gameState.nightActions.filter(
    (action) => action.actionType === 'protect'
  );
  const protectedTargets = doctorActions.map((action) => action.targetId);

  // Resolve werewolf kill
  if (werewolfTarget && !protectedTargets.includes(werewolfTarget)) {
    deaths.push(werewolfTarget);
  } else if (werewolfTarget && protectedTargets.includes(werewolfTarget)) {
    protections.push(werewolfTarget);
  }

  // Resolve Seer investigations
  const seerActions = gameState.nightActions.filter(
    (action) => action.actionType === 'investigate'
  );
  seerActions.forEach((action) => {
    if (action.targetId) {
      const target = gameState.players.find((p) => p.id === action.targetId);
      const result = target?.role === 'Werewolf' ? 'Werewolf' : 'Innocent';
      // Special case: Fool appears as Werewolf
      if (target?.role === 'Fool') {
        investigations.push({
          seerId: action.playerId,
          targetId: action.targetId,
          result: 'Werewolf',
        });
      } else {
        investigations.push({
          seerId: action.playerId,
          targetId: action.targetId,
          result,
        });
      }
    }
  });

  return { deaths, protections, investigations };
}

// ============================================================================
// DAY VOTING RESOLUTION
// ============================================================================

/**
 * Count votes and determine who is eliminated
 */
export function resolveVoting(
  gameState: WerewolfGameState
): {
  eliminatedId: string | null;
  voteCounts: Map<string, number>;
  isTie: boolean;
} {
  const voteCounts = new Map<string, number>();

  // Tally votes
  gameState.dayVotes.forEach((vote) => {
    if (vote.targetId) {
      voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) || 0) + 1);
    }
  });

  // Find player(s) with most votes
  let maxVotes = 0;
  let eliminatedId: string | null = null;
  const playersWithMaxVotes: string[] = [];

  voteCounts.forEach((votes, playerId) => {
    if (votes > maxVotes) {
      maxVotes = votes;
      eliminatedId = playerId;
      playersWithMaxVotes.length = 0;
      playersWithMaxVotes.push(playerId);
    } else if (votes === maxVotes) {
      playersWithMaxVotes.push(playerId);
    }
  });

  // Check for tie
  const isTie = playersWithMaxVotes.length > 1;

  // If tie, randomly select one (or return null to trigger revote)
  if (isTie) {
    eliminatedId =
      playersWithMaxVotes[Math.floor(Math.random() * playersWithMaxVotes.length)];
  }

  return { eliminatedId, voteCounts, isTie };
}

// ============================================================================
// GAME EVENT LOGGING
// ============================================================================

/**
 * Create a game event
 */
export function createGameEvent(
  type: GameEvent['type'],
  phase: GameEvent['phase'],
  message: string,
  involvedPlayers: string[],
  isPublic: boolean = true,
  dayNumber?: number,
  nightNumber?: number
): GameEvent {
  return {
    id: generateId(),
    type,
    phase,
    dayNumber,
    nightNumber,
    message,
    involvedPlayers,
    timestamp: Date.now(),
    isPublic,
  };
}

// ============================================================================
// PLAYER MANAGEMENT
// ============================================================================

/**
 * Mark player as dead
 */
export function killPlayer(
  gameState: WerewolfGameState,
  playerId: string,
  method: 'vote' | 'werewolf' | 'hunter'
): WerewolfGameState {
  const player = gameState.players.find((p) => p.id === playerId);
  if (!player) return gameState;

  return {
    ...gameState,
    players: gameState.players.map((p) =>
      p.id === playerId ? { ...p, status: 'Dead' as const } : p
    ),
    alivePlayers: gameState.alivePlayers.filter((id) => id !== playerId),
    deadPlayers: [...gameState.deadPlayers, playerId],
    eliminatedPlayers: [
      ...gameState.eliminatedPlayers,
      {
        playerId,
        role: player.role!,
        day: gameState.dayNumber,
        method,
      },
    ],
  };
}

/**
 * Get players by role
 */
export function getPlayersByRole(
  gameState: WerewolfGameState,
  role: WerewolfRoleType
): WerewolfPlayer[] {
  return gameState.players.filter((p) => p.role === role);
}

/**
 * Get alive players
 */
export function getAlivePlayers(gameState: WerewolfGameState): WerewolfPlayer[] {
  return gameState.players.filter((p) => p.status === 'Alive');
}

/**
 * Get player by ID
 */
export function getPlayerById(
  gameState: WerewolfGameState,
  playerId: string
): WerewolfPlayer | null {
  return gameState.players.find((p) => p.id === playerId) || null;
}

// ============================================================================
// PHASE TRANSITIONS
// ============================================================================

/**
 * Transition to next phase
 */
export function transitionPhase(
  gameState: WerewolfGameState,
  nextPhase: WerewolfGameState['phase']
): WerewolfGameState {
  let updatedState = { ...gameState, phase: nextPhase };

  switch (nextPhase) {
    case 'Night':
      updatedState.nightNumber += 1;
      updatedState.nightActions = [];
      updatedState.nightActionsComplete = false;
      updatedState.phaseTimeLimit = gameState.settings.nightPhaseTime;
      break;

    case 'Day':
      updatedState.dayNumber += 1;
      updatedState.dayVotes = [];
      updatedState.votingOpen = false;
      updatedState.phaseTimeLimit = gameState.settings.dayDiscussionTime;
      break;

    case 'Voting':
      updatedState.votingOpen = true;
      updatedState.dayVotes = [];
      updatedState.phaseTimeLimit = gameState.settings.votingPhaseTime;
      break;

    case 'GameOver':
      const { winner } = checkWinCondition(gameState);
      updatedState.gameOver = true;
      updatedState.winner = winner;
      break;
  }

  updatedState.currentPhaseStartTime = Date.now();
  return updatedState;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate suspicion level based on voting patterns
 */
export function calculateSuspicion(
  gameState: WerewolfGameState,
  playerId: string
): number {
  const player = getPlayerById(gameState, playerId);
  if (!player) return 0;

  // Count how many times this player was voted for
  const votesAgainst = gameState.dayVotes.filter(
    (vote) => vote.targetId === playerId
  ).length;

  // Simple formula: votes against * 20 (max 100)
  return Math.min(votesAgainst * 20, 100);
}

/**
 * Update all players' suspicion levels
 */
export function updateAllSuspicionLevels(
  gameState: WerewolfGameState
): WerewolfGameState {
  return {
    ...gameState,
    players: gameState.players.map((player) => ({
      ...player,
      suspicionLevel: calculateSuspicion(gameState, player.id),
    })),
  };
}
