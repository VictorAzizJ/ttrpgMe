export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export interface DiceRoll {
  id: string;
  dice_type: DiceType;
  num_dice: number;
  modifier: number;
  results: number[];
  total: number;
  purpose: string; // e.g., "Attack Roll", "Damage", "Ability Check"
  character_name?: string;
  timestamp: string;
}

export interface DiceRollRequest {
  dice_type: DiceType;
  num_dice: number;
  modifier: number;
  purpose: string;
}

export const DICE_SIDES: Record<DiceType, number> = {
  'd4': 4,
  'd6': 6,
  'd8': 8,
  'd10': 10,
  'd12': 12,
  'd20': 20,
  'd100': 100,
};

// Roll a single die
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll multiple dice and return results
export function rollDice(diceType: DiceType, count: number, modifier: number = 0): DiceRoll {
  const sides = DICE_SIDES[diceType];
  const results: number[] = [];

  for (let i = 0; i < count; i++) {
    results.push(rollDie(sides));
  }

  const sum = results.reduce((acc, val) => acc + val, 0);
  const total = sum + modifier;

  return {
    id: crypto.randomUUID(),
    dice_type: diceType,
    num_dice: count,
    modifier,
    results,
    total,
    purpose: '',
    timestamp: new Date().toISOString(),
  };
}

// Parse dice notation like "2d6+3" or "1d20"
export function parseDiceNotation(notation: string): DiceRollRequest | null {
  const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/i);

  if (!match) return null;

  const numDice = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  // Map sides to dice type
  const diceType = `d${sides}` as DiceType;

  if (!DICE_SIDES[diceType]) return null;

  return {
    dice_type: diceType,
    num_dice: numDice,
    modifier,
    purpose: 'Custom Roll',
  };
}
