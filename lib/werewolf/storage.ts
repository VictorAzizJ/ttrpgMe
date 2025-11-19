/**
 * Werewolf Game Storage Utilities
 * Handles localStorage persistence for Werewolf game state
 */

import type {
  WerewolfGameState,
  WerewolfLobby,
  GameReplay,
  PlayerStatistics,
  WerewolfPlayer,
} from '@/types/werewolf';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  ACTIVE_GAME: 'werewolf_active_game',
  LOBBIES: 'werewolf_lobbies',
  REPLAYS: 'werewolf_replays',
  PLAYER_STATS: 'werewolf_player_stats',
  CURRENT_PLAYER: 'werewolf_current_player',
} as const;

// ============================================================================
// GAME STATE STORAGE
// ============================================================================

export const gameStateStorage = {
  /**
   * Save the current active game state
   */
  save(gameState: WerewolfGameState): void {
    try {
      const serialized = JSON.stringify({
        ...gameState,
        updatedAt: Date.now(),
      });
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME, serialized);
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  },

  /**
   * Load the current active game state
   */
  load(): WerewolfGameState | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  },

  /**
   * Clear the active game state
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
  },

  /**
   * Check if there's an active game
   */
  hasActiveGame(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME) !== null;
  },
};

// ============================================================================
// LOBBY STORAGE
// ============================================================================

export const lobbyStorage = {
  /**
   * Get all lobbies
   */
  getAll(): WerewolfLobby[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.LOBBIES);
      if (!serialized) return [];
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load lobbies:', error);
      return [];
    }
  },

  /**
   * Get lobby by code
   */
  getByCode(lobbyCode: string): WerewolfLobby | null {
    const lobbies = this.getAll();
    return lobbies.find((lobby) => lobby.lobbyCode === lobbyCode) || null;
  },

  /**
   * Get lobby by ID
   */
  getById(lobbyId: string): WerewolfLobby | null {
    const lobbies = this.getAll();
    return lobbies.find((lobby) => lobby.id === lobbyId) || null;
  },

  /**
   * Save or update a lobby
   */
  save(lobby: WerewolfLobby): void {
    try {
      const lobbies = this.getAll();
      const index = lobbies.findIndex((l) => l.id === lobby.id);

      if (index >= 0) {
        lobbies[index] = lobby;
      } else {
        lobbies.push(lobby);
      }

      localStorage.setItem(STORAGE_KEYS.LOBBIES, JSON.stringify(lobbies));
    } catch (error) {
      console.error('Failed to save lobby:', error);
    }
  },

  /**
   * Delete a lobby
   */
  delete(lobbyId: string): void {
    try {
      const lobbies = this.getAll();
      const filtered = lobbies.filter((l) => l.id !== lobbyId);
      localStorage.setItem(STORAGE_KEYS.LOBBIES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete lobby:', error);
    }
  },

  /**
   * Get public lobbies that are waiting for players
   */
  getPublicLobbies(): WerewolfLobby[] {
    return this.getAll().filter(
      (lobby) => lobby.isPublic && lobby.status === 'Waiting'
    );
  },
};

// ============================================================================
// REPLAY STORAGE
// ============================================================================

export const replayStorage = {
  /**
   * Get all replays
   */
  getAll(): GameReplay[] {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.REPLAYS);
      if (!serialized) return [];
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load replays:', error);
      return [];
    }
  },

  /**
   * Get replay by game ID
   */
  getByGameId(gameId: string): GameReplay | null {
    const replays = this.getAll();
    return replays.find((replay) => replay.gameId === gameId) || null;
  },

  /**
   * Save a replay
   */
  save(replay: GameReplay): void {
    try {
      const replays = this.getAll();
      const index = replays.findIndex((r) => r.gameId === replay.gameId);

      if (index >= 0) {
        replays[index] = replay;
      } else {
        replays.push(replay);
      }

      // Keep only the last 20 replays to avoid storage bloat
      const limited = replays.slice(-20);
      localStorage.setItem(STORAGE_KEYS.REPLAYS, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save replay:', error);
    }
  },

  /**
   * Delete a replay
   */
  delete(gameId: string): void {
    try {
      const replays = this.getAll();
      const filtered = replays.filter((r) => r.gameId !== gameId);
      localStorage.setItem(STORAGE_KEYS.REPLAYS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete replay:', error);
    }
  },

  /**
   * Get recent replays (last N)
   */
  getRecent(count: number = 10): GameReplay[] {
    const replays = this.getAll();
    return replays
      .sort((a, b) => b.recordedAt - a.recordedAt)
      .slice(0, count);
  },
};

// ============================================================================
// PLAYER STATISTICS STORAGE
// ============================================================================

export const playerStatsStorage = {
  /**
   * Get player statistics by ID
   */
  get(playerId: string): PlayerStatistics | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      if (!serialized) return null;

      const allStats: Record<string, PlayerStatistics> = JSON.parse(serialized);
      return allStats[playerId] || null;
    } catch (error) {
      console.error('Failed to load player stats:', error);
      return null;
    }
  },

  /**
   * Save player statistics
   */
  save(playerId: string, stats: PlayerStatistics): void {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      const allStats: Record<string, PlayerStatistics> = serialized
        ? JSON.parse(serialized)
        : {};

      allStats[playerId] = stats;
      localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(allStats));
    } catch (error) {
      console.error('Failed to save player stats:', error);
    }
  },

  /**
   * Get all player statistics
   */
  getAll(): Record<string, PlayerStatistics> {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      if (!serialized) return {};
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load all player stats:', error);
      return {};
    }
  },

  /**
   * Get leaderboard (top N players by win rate)
   */
  getLeaderboard(count: number = 10): PlayerStatistics[] {
    const allStats = this.getAll();
    return Object.values(allStats)
      .filter((stats) => stats.gamesPlayed >= 5) // Min 5 games to qualify
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, count);
  },
};

// ============================================================================
// CURRENT PLAYER STORAGE
// ============================================================================

export const currentPlayerStorage = {
  /**
   * Save current player info
   */
  save(player: WerewolfPlayer): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(player));
    } catch (error) {
      console.error('Failed to save current player:', error);
    }
  },

  /**
   * Load current player info
   */
  load(): WerewolfPlayer | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEYS.CURRENT_PLAYER);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load current player:', error);
      return null;
    }
  },

  /**
   * Clear current player
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique lobby code (6 characters)
 */
export function generateLobbyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clear all Werewolf game data (for reset/debugging)
 */
export function clearAllWerewolfData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Export all Werewolf data as JSON
 */
export function exportWerewolfData(): string {
  const data = {
    activeGame: gameStateStorage.load(),
    lobbies: lobbyStorage.getAll(),
    replays: replayStorage.getAll(),
    playerStats: playerStatsStorage.getAll(),
    currentPlayer: currentPlayerStorage.load(),
    exportedAt: Date.now(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Import Werewolf data from JSON
 */
export function importWerewolfData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);

    if (data.activeGame) {
      gameStateStorage.save(data.activeGame);
    }
    if (data.currentPlayer) {
      currentPlayerStorage.save(data.currentPlayer);
    }
    if (data.lobbies) {
      localStorage.setItem(STORAGE_KEYS.LOBBIES, JSON.stringify(data.lobbies));
    }
    if (data.replays) {
      localStorage.setItem(STORAGE_KEYS.REPLAYS, JSON.stringify(data.replays));
    }
    if (data.playerStats) {
      localStorage.setItem(
        STORAGE_KEYS.PLAYER_STATS,
        JSON.stringify(data.playerStats)
      );
    }

    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}
