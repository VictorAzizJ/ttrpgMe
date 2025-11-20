/**
 * Werewolf Game Mode Type Definitions
 * Complete type system for the Werewolf (Mafia) social deduction game
 */

// ============================================================================
// CORE WEREWOLF TYPES
// ============================================================================

export type WerewolfRoleType =
  | 'Werewolf'
  | 'Villager'
  | 'Seer'
  | 'Doctor'
  | 'Hunter'
  | 'Witch'
  | 'Tanner'
  | 'Cupid'
  | 'Fool';

export type WerewolfAllegiance = 'Villagers' | 'Werewolves' | 'Neutral';

export type GamePhase = 'Lobby' | 'Night' | 'Day' | 'Voting' | 'GameOver';

export type PlayerStatus = 'Alive' | 'Dead' | 'Spectating';

export type AIDifficulty = 'Beginner' | 'Intermediate' | 'Expert';

// ============================================================================
// PLAYER & ROLE INTERFACES
// ============================================================================

export interface WerewolfRole {
  type: WerewolfRoleType;
  allegiance: WerewolfAllegiance;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nightAction: string | null;
  specialAbility: string;
  winsWithVillagers: boolean;
}

export interface WerewolfPlayer {
  id: string;
  name: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  aiPersonality?: 'Aggressive' | 'Cautious' | 'Analytical' | 'Chaotic';
  role: WerewolfRoleType | null;
  status: PlayerStatus;
  votedFor: string | null; // Player ID they voted for
  suspicionLevel: number; // 0-100, how suspicious others find them
  isHost: boolean;
  // Lore/flavor
  characterName?: string;
  characterBackstory?: string;
  avatar?: string;
}

// ============================================================================
// GAME STATE INTERFACES
// ============================================================================

export interface NightAction {
  playerId: string;
  roleType: WerewolfRoleType;
  actionType: 'kill' | 'investigate' | 'protect' | 'poison' | 'heal';
  targetId: string | null;
  timestamp: number;
  result?: string; // e.g., "Innocent" or "Werewolf" for Seer
}

export interface DayVote {
  voterId: string;
  targetId: string | null; // null if skip vote
  timestamp: number;
}

export interface GameEvent {
  id: string;
  type:
    | 'death'
    | 'elimination'
    | 'roleReveal'
    | 'investigation'
    | 'protection'
    | 'vote'
    | 'narration';
  phase: GamePhase;
  dayNumber?: number;
  nightNumber?: number;
  message: string;
  involvedPlayers: string[]; // Player IDs
  timestamp: number;
  isPublic: boolean; // False for secret actions
}

export interface WerewolfGameState {
  id: string;
  lobbyCode: string;
  hostPlayerId: string;
  phase: GamePhase;
  dayNumber: number;
  nightNumber: number;
  players: WerewolfPlayer[];
  alivePlayers: string[]; // Player IDs
  deadPlayers: string[]; // Player IDs

  // Phase-specific state
  currentPhaseStartTime: number;
  phaseTimeLimit: number; // seconds

  // Night phase tracking
  nightActions: NightAction[];
  nightActionsComplete: boolean;

  // Day phase tracking
  dayVotes: DayVote[];
  votingOpen: boolean;

  // Game history
  events: GameEvent[];
  eliminatedPlayers: Array<{
    playerId: string;
    role: WerewolfRoleType;
    day: number;
    method: 'vote' | 'werewolf' | 'hunter';
  }>;

  // Victory tracking
  gameOver: boolean;
  winner: WerewolfAllegiance | null;

  // Settings
  settings: WerewolfGameSettings;

  // Lore
  villageName: string;
  villageBackstory: string;

  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export interface WerewolfGameSettings {
  minPlayers: number;
  maxPlayers: number;
  aiPlayerFill: boolean;
  aiDifficulty: AIDifficulty;

  // Time limits (seconds)
  nightPhaseTime: number;
  dayDiscussionTime: number;
  votingPhaseTime: number;

  // Communication
  voiceChatEnabled: boolean;
  textChatEnabled: boolean;
  whisperEnabled: boolean; // Private messages during day
  deadCanSpeak: boolean;

  // Advanced features
  advancedRoles: boolean; // Include Tanner, Cupid, etc.
  suspicionTracker: boolean;
  bluffTokens: boolean;

  // Spectator settings
  spectatorMode: boolean;
  spectatorDelay: number; // seconds delay for live spectating
}

export interface RoleDistribution {
  playerCount: number;
  werewolves: number;
  seer: number;
  doctor: number;
  hunter: number;
  witch: number;
  villagers: number;
  // Advanced roles (optional)
  tanner?: number;
  cupid?: number;
  fool?: number;
}

// ============================================================================
// AI PLAYER LOGIC
// ============================================================================

export interface AIPlayerDecision {
  playerId: string;
  decisionType: 'nightAction' | 'dayVote' | 'discussion';
  targetId: string | null;
  reasoning: string; // AI's internal reasoning
  confidence: number; // 0-1
  timestamp: number;
}

export interface AIMemory {
  playerId: string;
  observations: Array<{
    day: number;
    event: string;
    suspicionChange: number; // -100 to +100
  }>;
  knownRoles: Map<string, WerewolfRoleType>; // Players whose roles AI knows
  suspicions: Map<string, number>; // Player ID -> suspicion level (0-100)
  alliances: string[]; // Player IDs AI trusts
  targets: string[]; // Player IDs AI wants eliminated
}

// ============================================================================
// CHAT & NARRATION
// ============================================================================

export interface WerewolfChatMessage {
  id: string;
  senderId: string; // Player ID or 'AI_DM'
  senderName: string;
  content: string;
  channel: 'global' | 'werewolf' | 'graveyard' | 'whisper' | 'system';
  recipientId?: string; // For whispers
  phase: GamePhase;
  dayNumber?: number;
  nightNumber?: number;
  timestamp: number;
  isNarration: boolean;
}

export interface NarrationTemplate {
  phase: GamePhase;
  event: string;
  templates: string[];
  variables: string[]; // e.g., ['playerName', 'villageName']
}

// ============================================================================
// REPLAY & STATISTICS
// ============================================================================

export interface GameReplay {
  gameId: string;
  summary: GameSummary;
  timeline: GameEvent[];
  keyMoments: KeyMoment[];
  playerPerspectives: Map<string, GameEvent[]>; // What each player saw
  fullChatLog: WerewolfChatMessage[];
  duration: number; // milliseconds
  recordedAt: number;
}

export interface GameSummary {
  gameId: string;
  villageName: string;
  playerCount: number;
  aiPlayerCount: number;
  winner: WerewolfAllegiance;
  totalDays: number;
  totalNights: number;
  roles: Map<string, WerewolfRoleType>; // Player name -> role
  eliminationOrder: Array<{
    playerName: string;
    role: WerewolfRoleType;
    day: number;
    method: string;
  }>;
  mvp: string; // Player name
  duration: number;
  recordedAt: number;
}

export interface KeyMoment {
  id: string;
  type: 'firstDeath' | 'accusation' | 'criticalVote' | 'roleReveal' | 'victory';
  timestamp: number;
  day?: number;
  description: string;
  involvedPlayers: string[];
  videoTimestamp?: number; // For highlight reel
}

export interface PlayerStatistics {
  playerId: string;
  playerName: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;

  // Role-specific stats
  roleStats: Map<
    WerewolfRoleType,
    {
      gamesPlayed: number;
      wins: number;
      winRate: number;
      avgSurvivalDays: number;
    }
  >;

  // Behavioral stats
  totalVotesCast: number;
  correctWerewolfVotes: number; // Voted for actual werewolves
  incorrectVillagerVotes: number; // Voted for innocent villagers
  timesVotedOff: number;
  timesKilledAtNight: number;

  // Social stats
  mostVotedFor: string; // Player name they vote for most
  mostVotedBy: string; // Player who votes for them most
  avgEliminationDay: number;
  survivalRate: number;

  // Achievements
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

// ============================================================================
// LOBBY & MULTIPLAYER
// ============================================================================

export interface WerewolfLobby {
  id: string;
  lobbyCode: string;
  hostPlayerId: string;
  gameName: string;
  villageName: string;
  players: WerewolfPlayer[];
  maxPlayers: number;
  settings: WerewolfGameSettings;
  isPublic: boolean;
  status: 'Waiting' | 'Starting' | 'InProgress' | 'Finished';
  createdAt: number;
}

// ============================================================================
// ROLE DEFINITIONS (Constants)
// ============================================================================

export const WEREWOLF_ROLES: Record<WerewolfRoleType, WerewolfRole> = {
  Werewolf: {
    type: 'Werewolf',
    allegiance: 'Werewolves',
    name: 'Werewolf',
    icon: '🐺',
    difficulty: 'Medium',
    description:
      'You are a creature of the night. Each night, you and your pack choose a villager to kill.',
    nightAction: 'Choose a player to kill',
    specialAbility: 'Knows other Werewolves',
    winsWithVillagers: false,
  },
  Villager: {
    type: 'Villager',
    allegiance: 'Villagers',
    name: 'Villager',
    icon: '👨',
    difficulty: 'Easy',
    description:
      'You are a simple villager. You have no special powers, but your vote during the day is crucial.',
    nightAction: null,
    specialAbility: 'None',
    winsWithVillagers: true,
  },
  Seer: {
    type: 'Seer',
    allegiance: 'Villagers',
    name: 'Seer',
    icon: '🔮',
    difficulty: 'Hard',
    description:
      'Each night, you may investigate one player to learn their true nature.',
    nightAction: 'Investigate one player',
    specialAbility: 'Learn if target is Werewolf or not',
    winsWithVillagers: true,
  },
  Doctor: {
    type: 'Doctor',
    allegiance: 'Villagers',
    name: 'Doctor',
    icon: '⚕️',
    difficulty: 'Medium',
    description:
      'Each night, you may protect one player from being killed by Werewolves.',
    nightAction: 'Protect one player',
    specialAbility: 'Prevents death if chosen player attacked',
    winsWithVillagers: true,
  },
  Hunter: {
    type: 'Hunter',
    allegiance: 'Villagers',
    name: 'Hunter',
    icon: '🏹',
    difficulty: 'Medium',
    description:
      'You are a skilled hunter. When you die, you immediately kill one other player.',
    nightAction: null,
    specialAbility: 'Upon death, immediately kills one player',
    winsWithVillagers: true,
  },
  Witch: {
    type: 'Witch',
    allegiance: 'Villagers',
    name: 'Witch',
    icon: '🧙',
    difficulty: 'Hard',
    description:
      'You have two potions: one to heal and one to poison. Each can be used once per game.',
    nightAction: 'Use heal or poison potion',
    specialAbility: 'Save victim OR kill someone (once each)',
    winsWithVillagers: true,
  },
  Tanner: {
    type: 'Tanner',
    allegiance: 'Neutral',
    name: 'Tanner',
    icon: '🪡',
    difficulty: 'Easy',
    description:
      'You are tired of life and want to die. You win if YOU are eliminated during the day.',
    nightAction: null,
    specialAbility: 'Wins if they are voted off',
    winsWithVillagers: false,
  },
  Cupid: {
    type: 'Cupid',
    allegiance: 'Villagers',
    name: 'Cupid',
    icon: '💘',
    difficulty: 'Medium',
    description:
      'On the first night, you link two players. If one dies, both die.',
    nightAction: 'Link two players (first night only)',
    specialAbility: 'Linked players share fate',
    winsWithVillagers: true,
  },
  Fool: {
    type: 'Fool',
    allegiance: 'Villagers',
    name: 'Fool',
    icon: '🃏',
    difficulty: 'Medium',
    description:
      'You are a villager, but you appear as a Werewolf to the Seer.',
    nightAction: null,
    specialAbility: 'Appears as Werewolf to Seer (but innocent)',
    winsWithVillagers: true,
  },
};

// ============================================================================
// ROLE DISTRIBUTION TEMPLATES
// ============================================================================

export const ROLE_DISTRIBUTIONS: RoleDistribution[] = [
  {
    playerCount: 5,
    werewolves: 2,
    seer: 1,
    doctor: 1,
    hunter: 0,
    witch: 0,
    villagers: 1,
  },
  {
    playerCount: 6,
    werewolves: 2,
    seer: 1,
    doctor: 1,
    hunter: 0,
    witch: 0,
    villagers: 2,
  },
  {
    playerCount: 7,
    werewolves: 2,
    seer: 1,
    doctor: 1,
    hunter: 1,
    witch: 0,
    villagers: 2,
  },
  {
    playerCount: 8,
    werewolves: 2,
    seer: 1,
    doctor: 1,
    hunter: 1,
    witch: 0,
    villagers: 3,
  },
  {
    playerCount: 9,
    werewolves: 2,
    seer: 1,
    doctor: 1,
    hunter: 1,
    witch: 0,
    villagers: 4,
  },
  {
    playerCount: 10,
    werewolves: 3,
    seer: 1,
    doctor: 1,
    hunter: 1,
    witch: 1,
    villagers: 3,
  },
  {
    playerCount: 11,
    werewolves: 3,
    seer: 1,
    doctor: 1,
    hunter: 1,
    witch: 1,
    villagers: 4,
  },
  {
    playerCount: 12,
    werewolves: 3,
    seer: 1,
    doctor: 1,
    hunter: 1,
    witch: 1,
    villagers: 5,
  },
];

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface WerewolfGameConfig {
  mode: 'Classic' | 'Chaos' | 'OneNight' | 'Speed';
  settings: WerewolfGameSettings;
  roleDistribution: RoleDistribution;
}

export type WerewolfGameMode = 'Classic' | 'Chaos' | 'OneNight' | 'Speed';
