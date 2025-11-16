export interface Character {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;

  // Ability Scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat Stats
  max_hp: number;
  current_hp: number;
  armor_class: number;
  initiative: number;
  speed: number;

  // Skills & Proficiencies
  proficiencies: string[];
  skills: Record<string, number>;

  // Equipment
  equipment: string[];

  // Background
  background: string;
  backstory: string;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface CharacterFormData {
  name: string;
  race: string;
  class: string;
  background: string;
  backstory: string;

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export const DND_RACES = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn',
  'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'
] as const;

export const DND_CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
  'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer',
  'Warlock', 'Wizard'
] as const;

export const ABILITY_SCORES = [
  'strength', 'dexterity', 'constitution',
  'intelligence', 'wisdom', 'charisma'
] as const;

// Calculate ability modifier from score
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
