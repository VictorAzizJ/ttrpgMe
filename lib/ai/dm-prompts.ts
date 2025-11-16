import { Character } from '@/types/character';
import { GameState } from '@/types/chat';

export function buildDMSystemPrompt(character: Character | null, gameState: GameState): string {
  const characterInfo = character
    ? `
CHARACTER INFO:
- Name: ${character.name}
- Race: ${character.race}
- Class: ${character.class}
- Level: ${character.level}
- HP: ${character.current_hp}/${character.max_hp}
- AC: ${character.armor_class}
- Key Stats: STR ${character.strength}, DEX ${character.dexterity}, CON ${character.constitution}, INT ${character.intelligence}, WIS ${character.wisdom}, CHA ${character.charisma}
`
    : 'No character selected - create a generic adventurer.';

  const gameStateInfo = `
GAME STATE:
- Location: ${gameState.location || 'Unknown'}
- Quest: ${gameState.quest_objective || 'Beginning adventure'}
- Combat Active: ${gameState.combat_active ? 'YES' : 'NO'}
- NPCs Present: ${gameState.active_npcs.length > 0 ? gameState.active_npcs.join(', ') : 'None'}
`;

  return `You are an expert Dungeon Master for Dungeons & Dragons 5th Edition.

CORE RULES:
1. Keep responses concise (2-4 sentences for exploration, 1-2 for combat)
2. Be dramatic, vivid, and engaging
3. Always acknowledge dice rolls and incorporate results into narration
4. Ask the player for decisions at key moments
5. Track combat state carefully (initiative, HP, positioning)
6. Use D&D 5e rules accurately
7. Adapt to player creativity and reward clever solutions

${characterInfo}

${gameStateInfo}

TONE: Dramatic, immersive, and responsive to player actions. Balance challenge with fun.

IMPORTANT: When the player attempts an action, prompt them to roll appropriate dice. Example:
- "Roll a d20 + your Dexterity modifier for Stealth"
- "Make an Attack roll (d20 + proficiency + STR)"
- "Roll damage: 1d8 + STR modifier"

After they roll, narrate the outcome dramatically based on the result.`;
}

export function buildCampaignIntro(campaignName: string, character: Character | null): string {
  const charName = character?.name || 'brave adventurer';

  const intros: Record<string, string> = {
    'lost-mines': `Welcome, ${charName}! You've been hired to escort a wagon of supplies to the frontier town of Phandalin. The journey has been uneventful so far, but as you round a bend in the trail, you spot two dead horses ahead, black-feathered arrows protruding from their sides. An ambush!

What do you do?`,

    'dragon-heist': `${charName}, you arrive in the grand City of Splendors - Waterdeep! The autumn air is crisp, and the streets bustle with merchants, nobles, and rogues alike. You've heard rumors of a hidden cache of dragons' gold somewhere in the city, worth half a million gold pieces.

As you enter the Yawning Portal tavern, you notice a hooded figure watching you from the corner. What's your next move?`,

    'custom': `Greetings, ${charName}. You awaken in a dimly lit tavern, the smell of ale and woodsmoke filling your nostrils. The innkeeper eyes you warily and slides a sealed letter across the bar.

"This came for you yesterday," he grunts. "The messenger said it was urgent."

Do you open the letter?`,
  };

  return intros[campaignName] || intros['custom'];
}

export const COMMON_DM_RESPONSES = {
  criticalSuccess: [
    "A CRITICAL HIT! Your strike is perfect!",
    "Natural 20! Fate smiles upon you!",
    "A masterful execution!",
  ],
  criticalFailure: [
    "Oh no! A critical failure!",
    "Your weapon slips from your grasp!",
    "Things go terribly wrong!",
  ],
  highRoll: [
    "An excellent roll!",
    "Well done!",
    "Fortune favors you!",
  ],
  lowRoll: [
    "Not quite...",
    "Your attempt falls short.",
    "Unlucky roll.",
  ],
};

export function getResponseForRoll(total: number, dc: number = 15): string {
  if (total === 20) {
    return COMMON_DM_RESPONSES.criticalSuccess[Math.floor(Math.random() * COMMON_DM_RESPONSES.criticalSuccess.length)];
  }
  if (total === 1) {
    return COMMON_DM_RESPONSES.criticalFailure[Math.floor(Math.random() * COMMON_DM_RESPONSES.criticalFailure.length)];
  }
  if (total >= dc + 5) {
    return COMMON_DM_RESPONSES.highRoll[Math.floor(Math.random() * COMMON_DM_RESPONSES.highRoll.length)];
  }
  if (total < dc) {
    return COMMON_DM_RESPONSES.lowRoll[Math.floor(Math.random() * COMMON_DM_RESPONSES.lowRoll.length)];
  }
  return "You succeed.";
}
