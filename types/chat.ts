export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  dice_roll?: {
    notation: string;
    result: number;
  };
}

export interface GameSession {
  id: string;
  user_id: string;
  character_id: string;
  campaign_name: string;
  messages: ChatMessage[];
  game_state: GameState;
  created_at: string;
  updated_at: string;
}

export interface GameState {
  location: string;
  quest_objective: string;
  active_npcs: string[];
  combat_active: boolean;
  turn_order?: string[];
}

export const STARTER_CAMPAIGNS = [
  {
    id: 'lost-mines',
    name: 'The Lost Mines of Phandelver',
    description: 'A classic adventure for beginning heroes. Explore dungeons, fight goblins, and uncover ancient secrets.',
    difficulty: 'Beginner',
    starting_level: 1,
  },
  {
    id: 'dragon-heist',
    name: 'Waterdeep: Dragon Heist',
    description: 'A treasure hunt in the City of Splendors. Navigate intrigue, chase villains, and claim your fortune.',
    difficulty: 'Intermediate',
    starting_level: 1,
  },
  {
    id: 'custom',
    name: 'Custom Adventure',
    description: 'Start fresh with a custom campaign created by the AI Dungeon Master.',
    difficulty: 'Any',
    starting_level: 1,
  },
] as const;
