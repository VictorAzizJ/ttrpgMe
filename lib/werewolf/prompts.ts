/**
 * Werewolf Game AI Prompts & Narration Templates
 * Pre-defined prompts, narrations, and lore generation for Werewolf games
 */

import type { WerewolfRoleType, GamePhase } from '@/types/werewolf';

// ============================================================================
// VILLAGE LORE GENERATION
// ============================================================================

export const VILLAGE_THEMES = [
  {
    name: 'Ravencrest',
    theme: 'Mountain Village',
    backstory:
      'Nestled high in the Frostpeak Mountains, Ravencrest has stood for centuries. But when the blood moon rose last winter, the wolves came down from the peaks. Now, every night brings fresh terror.',
    atmosphere: 'Dark, cold, isolated',
  },
  {
    name: 'Thornwick',
    theme: 'Coastal Town',
    backstory:
      'The fishing village of Thornwick prospered by the sea until strange ships arrived under cover of fog. Those who went aboard never returned... and those who stayed began to change.',
    atmosphere: 'Foggy, mysterious, maritime',
  },
  {
    name: 'Ashenvale',
    theme: 'Forest Settlement',
    backstory:
      'Deep in the Ashenvale Forest, where ancient oaks whisper secrets, the villagers lived in harmony with nature. But the druids warned of a curse—and now the forest itself hunts them.',
    atmosphere: 'Mystical, primal, verdant',
  },
  {
    name: 'Grimhollow',
    theme: 'Abandoned Mining Town',
    backstory:
      'Once a bustling mining town, Grimhollow was abandoned after the cave-in. Those who returned to reclaim it discovered the miners never left—they merely changed.',
    atmosphere: 'Dusty, claustrophobic, haunted',
  },
  {
    name: 'Silverbrook',
    theme: 'Riverside Village',
    backstory:
      "By the silver waters of the Moonbrook River, this peaceful village thrived. Until the night the water ran red, and the howling began. The elders say it's a curse from the old gods.",
    atmosphere: 'Pastoral, serene (formerly), cursed',
  },
];

/**
 * Generate random village lore
 */
export function generateVillageLore(): {
  name: string;
  backstory: string;
  atmosphere: string;
} {
  const village = VILLAGE_THEMES[Math.floor(Math.random() * VILLAGE_THEMES.length)];
  return {
    name: village.name,
    backstory: village.backstory,
    atmosphere: village.atmosphere,
  };
}

// ============================================================================
// CHARACTER NAME GENERATOR (For AI Players)
// ============================================================================

export const CHARACTER_NAMES = {
  male: [
    'Marcus',
    'Gregor',
    'Alaric',
    'Theron',
    'Dorian',
    'Kael',
    'Rowan',
    'Fenris',
    'Bjorn',
    'Aldric',
  ],
  female: [
    'Elara',
    'Lyssa',
    'Mira',
    'Seraphina',
    'Kira',
    'Astrid',
    'Freya',
    'Nyx',
    'Isolde',
    'Thalia',
  ],
  neutral: [
    'Raven',
    'Storm',
    'Ash',
    'Reed',
    'Sage',
    'Quinn',
    'River',
    'Ember',
    'Sky',
    'Winter',
  ],
};

export function generateCharacterName(): string {
  const allNames = [
    ...CHARACTER_NAMES.male,
    ...CHARACTER_NAMES.female,
    ...CHARACTER_NAMES.neutral,
  ];
  return allNames[Math.floor(Math.random() * allNames.length)];
}

// ============================================================================
// CHARACTER BACKSTORY TEMPLATES
// ============================================================================

export const CHARACTER_BACKSTORIES: Record<WerewolfRoleType, string[]> = {
  Werewolf: [
    'A cursed soul who hides their true nature behind a friendly smile.',
    'They remember the night of their transformation, and the hunger that never fades.',
    'To the village, they are a neighbor. To the pack, they are family.',
  ],
  Villager: [
    'A simple farmer who works the land and trusts in their neighbors.',
    'An ordinary person caught in extraordinary circumstances.',
    'They have nothing to hide, but everything to lose.',
  ],
  Seer: [
    'A reclusive herbalist who dreams prophetic visions. The villagers respect them, but fear their uncanny insights.',
    'Born with the gift of sight, they see truths others cannot.',
    'The spirits whisper secrets to them in the night.',
  ],
  Doctor: [
    'The village healer, sworn to protect life at all costs.',
    'They carry the weight of every soul they fail to save.',
    'With skillful hands and sharp mind, they stand between death and the living.',
  ],
  Hunter: [
    'A grizzled tracker who knows the forest and its dangers.',
    'They hunt not for sport, but for survival—and vengeance.',
    'If they fall, they will take their killer with them.',
  ],
  Witch: [
    'A mysterious figure who dabbles in forbidden arts.',
    'They possess two vials: one to save a life, one to end it.',
    'The village needs their magic, even as they fear it.',
  ],
  Tanner: [
    'Worn down by years of hardship, they welcome the end.',
    'They have nothing left to live for, and everything to gain in death.',
    'A tragic figure seeking release from their suffering.',
  ],
  Cupid: [
    'A romantic soul who believes in the power of connection.',
    'They bind fates together, for better or worse.',
    'Love is their weapon—and their curse.',
  ],
  Fool: [
    'A harmless eccentric who seems suspicious but means no harm.',
    'They bumble through life, unaware of how guilty they appear.',
    'Innocent, yet cursed to seem otherwise.',
  ],
};

export function generateCharacterBackstory(role: WerewolfRoleType): string {
  const backstories = CHARACTER_BACKSTORIES[role];
  return backstories[Math.floor(Math.random() * backstories.length)];
}

// ============================================================================
// PHASE NARRATION TEMPLATES
// ============================================================================

export const NARRATION_TEMPLATES = {
  // ========== GAME START ==========
  gameStart: [
    '🌙 Welcome to the village of {villageName}. For generations, your people lived in peace... until the wolves came. Each night, screams pierce the darkness. Each morning, another body is found.\n\nSome among you are not what they seem. Trust no one.\n\nThe sun sets. Night falls...',
    '🌙 {villageName} huddles in fear as darkness descends. Werewolves lurk among you, wearing the faces of neighbors and friends. Only through cunning and cooperation can you survive.\n\nLet the hunt begin...',
    '🌙 The village of {villageName} has seen better days. But tonight, as the moon rises full and red, ancient evils stir. The wolves are among you.\n\nWho will survive to see the dawn?',
  ],

  // ========== NIGHT PHASE ==========
  nightFall: [
    '🌙 Night falls over {villageName}. The moon rises, full and crimson. Villagers bar their doors and pray for dawn. In the shadows, hungry eyes gleam...',
    '🌙 Darkness blankets {villageName}. The wind howls through empty streets. Somewhere in the night, the wolves stir...',
    '🌙 The sun sinks below the horizon. One by one, candles are extinguished. Only the brave—or the cursed—remain awake.',
  ],

  werewolfWake: [
    '🐺 The pack awakens. Choose your prey.',
    '🐺 Hunger gnaws at you. The moon calls. Who will feed the wolves tonight?',
    '🐺 The scent of fear is thick in the air. Select your victim.',
  ],

  seerWake: [
    '🔮 The visions come to you in dreams. Choose one soul to examine.',
    '🔮 The spirits whisper. Whose truth will you uncover tonight?',
    '🔮 Your sight pierces the veil. Investigate wisely.',
  ],

  doctorWake: [
    '💊 You sense danger approaching. Choose one person to shield from harm.',
    '💊 Your healing hands can save a life tonight. Protect wisely.',
    '💊 Death stalks the village. Whom will you guard?',
  ],

  // ========== DAWN PHASE ==========
  dawnNoDeath: [
    '🌅 The rooster crows. Survivors emerge from their homes, eyes darting nervously. The town square fills with whispers...\n\nAnd miracle of miracles—everyone is accounted for. The wolves hunted, but found no prey. Was someone watching over you?',
    '🌅 Sunlight breaks through the mist. You gather in the square, expecting the worst... but by some fortune, all survived the night.\n\nThe relief is palpable, yet suspicion lingers. Why did no one die?',
  ],

  dawnWithDeath: [
    '🌅 The rooster crows. Survivors emerge from their homes, eyes darting nervously. The town square falls silent as you gather...\n\n[Dramatic pause]\n\nAnd there, slumped against the well... the lifeless body of {victimName}. Claw marks. Fangs. No doubt—the wolves struck again.',
    '🌅 Dawn breaks over {villageName}, but it brings no comfort. A scream pierces the air.\n\n{victimName} lies cold in the street, torn apart by savage jaws. The wolves have claimed another victim.',
    '🌅 The morning sun reveals what the night concealed. {victimName} is gone—dragged into the forest, only scraps of cloth remain.\n\nHow many more will fall before the pack is stopped?',
  ],

  // ========== DAY PHASE ==========
  dayDiscussion: [
    '☀️ The survivors gather in the town square, eyes darting nervously. Accusations fly. Someone here is lying—but who?',
    '☀️ The debate grows fierce. Voices rise. Fear grips the crowd. Someone must be chosen—but will you condemn an innocent, or catch a wolf?',
    '☀️ Paranoia spreads like wildfire. Every glance is suspicious. Every word could be a lie. Who can you trust?',
  ],

  voteStart: [
    '🗳️ The discussion grows heated. It is time to decide. Who among you will face judgment? Choose wisely—an innocent\'s blood may damn you all.',
    '🗳️ Silence falls. The time for words has passed. Point your finger and seal someone\'s fate. But beware—the wolves are watching, and they vote too.',
    '🗳️ The crowd murmurs with unease. A decision must be made. Who will you sacrifice in the name of safety?',
  ],

  voteReveal: [
    '🗳️ The votes are cast. Let us see whom you condemn...\n\n[Vote tallying]\n\nBy decree of the majority... {eliminatedName}, step forward.',
    '🗳️ One by one, the votes are revealed. The tension mounts...\n\nThe people have spoken. {eliminatedName}, your fate is sealed.',
  ],

  // ========== ELIMINATION ==========
  elimination: [
    '⚰️ {eliminatedName} steps forward, defiant to the last. The noose tightens.\n\nAs they fall, their true nature is revealed: {role}.',
    '⚰️ The crowd watches in grim silence as {eliminatedName} faces their end.\n\nWith their final breath, you see what they truly were: {role}.',
    '⚰️ Justice? Or murder? Time will tell. {eliminatedName} was a {role}.',
  ],

  // ========== SPECIAL EVENTS ==========
  hunterRevenge: [
    '🏹 But wait! {hunterName} was no ordinary villager. As death takes them, they draw their bow one final time.\n\n"If I fall, I take one of you with me!" {hunterName} aims at {targetName}...',
    '🏹 With their dying breath, {hunterName} reveals they were the Hunter. They will not go alone.\n\n{targetName} falls beside them.',
  ],

  seerInvestigation: [
    '🔮 You focus your mind on {targetName}. Your vision swims, then clears...\n\nThey are... {result}.',
    '🔮 The spirits show you the truth about {targetName}. You see their soul laid bare.\n\nResult: {result}.',
  ],

  // ========== VICTORY ==========
  villagersWin: [
    '☀️ The final wolf falls, its dying howl echoing across the valley. As dawn breaks, the survivors embrace.\n\nThe nightmare is over. VICTORY: VILLAGERS',
    '☀️ With the last werewolf eliminated, peace returns to {villageName}. The curse is broken.\n\nVICTORY: VILLAGERS',
  ],

  werewolvesWin: [
    '🌑 Too late, you realize your mistake. The "villagers" you trusted bare their fangs. Screams fill the night.\n\nWhen silence falls, only the pack remains. VICTORY: WEREWOLVES',
    '🌑 The wolves have won. One by one, you fell into their trap. {villageName} belongs to the beasts now.\n\nVICTORY: WEREWOLVES',
  ],
};

// ============================================================================
// TEMPLATE REPLACEMENT UTILITY
// ============================================================================

export function fillNarrationTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return result;
}

/**
 * Get a random narration for a specific event
 */
export function getNarration(
  eventType: keyof typeof NARRATION_TEMPLATES,
  variables: Record<string, string> = {}
): string {
  const templates = NARRATION_TEMPLATES[eventType];
  if (!templates || templates.length === 0) {
    return 'The story continues...';
  }

  const template = templates[Math.floor(Math.random() * templates.length)];
  return fillNarrationTemplate(template, variables);
}

// ============================================================================
// ROLE REVEAL MESSAGES
// ============================================================================

export const ROLE_REVEAL_MESSAGES: Record<WerewolfRoleType, string> = {
  Werewolf: '🐺 A WEREWOLF! The beast is slain.',
  Villager: '👤 An innocent Villager. Their blood is on your hands.',
  Seer: '🔮 The Seer! Your eyes in the darkness are now blind.',
  Doctor: '💊 The Doctor! Who will protect you now?',
  Hunter: '🏹 The Hunter! They will not go quietly...',
  Witch: '🧪 The Witch! Their potions are forever lost.',
  Tanner: '🎭 The Tanner! Wait... they WANTED to die. They WIN!',
  Cupid: '💘 Cupid! The bonds they forged remain.',
  Fool: '🃏 The Fool! Innocent, but cursed to seem guilty.',
};

// ============================================================================
// CHAT MESSAGE TEMPLATES (for AI players)
// ============================================================================

export const AI_CHAT_TEMPLATES = {
  accusation: [
    'I think {targetName} is acting suspicious.',
    'Has anyone else noticed how quiet {targetName} has been?',
    '{targetName} has been deflecting a lot. Just saying.',
    'My gut says {targetName} is hiding something.',
  ],
  defense: [
    'Wait, why are you all voting for me? I\'m innocent!',
    'This is crazy! I\'m not a werewolf!',
    'You\'re making a huge mistake. I\'m on your side!',
    'I can\'t believe you\'d think that of me.',
  ],
  agreement: [
    'I agree with that assessment.',
    'That makes sense to me.',
    'Yeah, I\'ve been thinking the same thing.',
    'Good point.',
  ],
  question: [
    'Who do you all find most suspicious?',
    'What happened last night?',
    'Does anyone have information to share?',
    'Should we vote or wait?',
  ],
  strategic: [
    'If {playerName} is telling the truth, then {otherName} must be lying.',
    'We need to think this through carefully.',
    'Let\'s not rush this decision.',
    'Remember what happened on Day {day}? That\'s important.',
  ],
};

export function getAIChatMessage(
  messageType: keyof typeof AI_CHAT_TEMPLATES,
  variables: Record<string, string> = {}
): string {
  const templates = AI_CHAT_TEMPLATES[messageType];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return fillNarrationTemplate(template, variables);
}
