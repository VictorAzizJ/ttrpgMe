/**
 * Werewolf AI Narrator API Route
 * Handles AI-generated narration and moderation for Werewolf games
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import type { WerewolfGameState, GamePhase, WerewolfPlayer } from '@/types/werewolf';

// Lazy initialization of Groq client
let groq: Groq | null = null;
function getGroqClient() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

export const runtime = 'edge';

// ============================================================================
// NARRATION REQUEST INTERFACE
// ============================================================================

interface NarrationRequest {
  gameState: WerewolfGameState;
  eventType:
    | 'gameStart'
    | 'nightFall'
    | 'dawn'
    | 'death'
    | 'noDeath'
    | 'dayDiscussion'
    | 'voteStart'
    | 'voteResult'
    | 'elimination'
    | 'victory'
    | 'seerResult'
    | 'hunterRevenge';
  context?: {
    victimName?: string;
    eliminatedName?: string;
    eliminatedRole?: string;
    seerTarget?: string;
    seerResult?: 'Innocent' | 'Werewolf';
    winner?: string;
    hunterTarget?: string;
  };
}

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

function buildNarratorPrompt(
  gameState: WerewolfGameState,
  eventType: string
): string {
  const { villageName, villageBackstory, dayNumber, nightNumber, phase } =
    gameState;

  const basePrompt = `You are the AI Dungeon Master narrating a game of Werewolf (Mafia).

VILLAGE LORE:
- Village Name: ${villageName}
- Backstory: ${villageBackstory}
- Current Day: ${dayNumber}
- Current Night: ${nightNumber}
- Current Phase: ${phase}

TONE & STYLE:
- Dramatic and atmospheric
- Build suspense and tension
- Use vivid, evocative language
- Keep narrations concise (2-4 sentences)
- Never reveal roles unless they are eliminated
- Use the village's lore to add flavor

PLAYERS:
${gameState.players
  .filter((p) => p.status === 'Alive')
  .map((p) => `- ${p.name} (${p.characterName || 'Unknown'})`)
  .join('\n')}

Generate a narration for the event: "${eventType}"

Narration:`;

  return basePrompt;
}

// ============================================================================
// NARRATION GENERATORS
// ============================================================================

async function generateNarration(
  request: NarrationRequest
): Promise<string> {
  const { gameState, eventType, context } = request;

  // For simple events, use templates (faster, no AI call needed)
  const template = getTemplateNarration(gameState, eventType, context);
  if (template) return template;

  // For complex events, use AI generation
  try {
    const systemPrompt = buildNarratorPrompt(gameState, eventType);
    const userPrompt = buildUserPrompt(eventType, context);

    const completion = await getGroqClient().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9, // More creative for narration
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || getDefaultNarration(eventType);
  } catch (error) {
    console.error('AI narration failed:', error);
    return getDefaultNarration(eventType);
  }
}

function buildUserPrompt(
  eventType: string,
  context?: NarrationRequest['context']
): string {
  switch (eventType) {
    case 'death':
      return `A villager named ${context?.victimName} was killed by werewolves last night. Describe the grim discovery at dawn.`;
    case 'noDeath':
      return `Miraculously, no one died last night. The village is surprised and relieved. Narrate this fortunate outcome.`;
    case 'elimination':
      return `${context?.eliminatedName}, a ${context?.eliminatedRole}, has been voted off. Describe the solemn moment.`;
    case 'victory':
      return `The ${context?.winner} have won! Narrate the conclusion of the game with appropriate emotion.`;
    case 'seerResult':
      return `The Seer investigates ${context?.seerTarget} and discovers they are ${context?.seerResult}. Narrate this private revelation.`;
    default:
      return `Narrate the ${eventType} event.`;
  }
}

// ============================================================================
// TEMPLATE NARRATIONS (Fast, No AI Call)
// ============================================================================

function getTemplateNarration(
  gameState: WerewolfGameState,
  eventType: string,
  context?: NarrationRequest['context']
): string | null {
  const { villageName } = gameState;

  const templates: Record<string, string[]> = {
    gameStart: [
      `🌙 Welcome to the village of ${villageName}. For generations, your people lived in peace... until the wolves came. Each night, screams pierce the darkness. Each morning, another body is found. Some among you are not what they seem. Trust no one. The sun sets. Night falls...`,
      `🌙 The village of ${villageName} huddles in fear as darkness descends. Werewolves lurk among you, wearing the faces of neighbors and friends. Only through cunning and cooperation can you survive. Let the hunt begin...`,
    ],
    nightFall: [
      `🌙 Night falls over ${villageName}. The moon rises, full and crimson. Villagers bar their doors and pray for dawn. In the shadows, hungry eyes gleam...`,
      `🌙 Darkness blankets ${villageName}. The wind howls through empty streets. Somewhere in the night, the wolves stir...`,
    ],
    dayDiscussion: [
      `☀️ The survivors gather in the town square, eyes darting nervously. Accusations fly. Someone here is lying. Who can you trust?`,
      `☀️ The debate grows fierce. Voices rise. Fear grips the crowd. Someone must be chosen—but will you condemn an innocent, or catch a wolf?`,
    ],
    voteStart: [
      `🗳️ The discussion grows heated. It's time to decide. Who among you will face judgment? Choose wisely—an innocent's blood may damn you all.`,
      `🗳️ Silence falls. The time for words has passed. Point your finger and seal someone's fate. But beware—the wolves are watching, and they vote too.`,
    ],
  };

  const options = templates[eventType];
  if (!options) return null;

  // Randomly select a template variant
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================================================
// DEFAULT NARRATIONS (Fallback)
// ============================================================================

function getDefaultNarration(eventType: string): string {
  const defaults: Record<string, string> = {
    gameStart: '🌙 The game begins. Night falls over the village...',
    nightFall: '🌙 Night falls. The village sleeps... but some are awake.',
    dawn: '🌅 Dawn breaks. The villagers emerge from their homes.',
    death: '💀 A scream pierces the morning air. Another villager has fallen.',
    noDeath: '✨ By some miracle, everyone survived the night.',
    dayDiscussion: '☀️ The villagers gather to discuss what happened.',
    voteStart: '🗳️ It is time to vote.',
    voteResult: '🗳️ The votes have been counted.',
    elimination: '⚰️ The accused steps forward to face their fate.',
    victory: '🎉 The game is over!',
    seerResult: '🔮 Your visions reveal the truth...',
    hunterRevenge: '🏹 With their dying breath, the Hunter takes aim...',
  };

  return defaults[eventType] || 'The story continues...';
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: NarrationRequest = await request.json();
    const { gameState, eventType, context } = body;

    if (!gameState || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: gameState, eventType' },
        { status: 400 }
      );
    }

    const narration = await generateNarration({ gameState, eventType, context });

    return NextResponse.json({
      narration,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Narration API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate narration' },
      { status: 500 }
    );
  }
}
