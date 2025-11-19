/**
 * Werewolf AI Player Decision API Route
 * Handles AI player decision-making for night actions and voting
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import type {
  WerewolfGameState,
  WerewolfPlayer,
  AIDifficulty,
  AIPlayerDecision,
} from '@/types/werewolf';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = 'edge';

// ============================================================================
// AI DECISION REQUEST
// ============================================================================

interface AIDecisionRequest {
  gameState: WerewolfGameState;
  aiPlayer: WerewolfPlayer;
  decisionType: 'nightAction' | 'dayVote' | 'discussion';
}

// ============================================================================
// AI DECISION LOGIC
// ============================================================================

/**
 * Generate AI player decision based on role and difficulty
 */
export async function generateAIDecision(
  request: AIDecisionRequest
): Promise<AIPlayerDecision> {
  const { gameState, aiPlayer, decisionType } = request;
  const difficulty = aiPlayer.aiDifficulty || 'Beginner';

  switch (decisionType) {
    case 'nightAction':
      return await generateNightAction(gameState, aiPlayer, difficulty);
    case 'dayVote':
      return await generateDayVote(gameState, aiPlayer, difficulty);
    case 'discussion':
      return await generateDiscussionMessage(gameState, aiPlayer, difficulty);
    default:
      throw new Error(`Unknown decision type: ${decisionType}`);
  }
}

// ============================================================================
// NIGHT ACTION LOGIC
// ============================================================================

async function generateNightAction(
  gameState: WerewolfGameState,
  aiPlayer: WerewolfPlayer,
  difficulty: AIDifficulty
): Promise<AIPlayerDecision> {
  const { role } = aiPlayer;
  const alivePlayers = gameState.players.filter(
    (p) => p.status === 'Alive' && p.id !== aiPlayer.id
  );

  let targetId: string | null = null;
  let reasoning = '';
  let confidence = 0.5;

  switch (role) {
    case 'Werewolf':
      const werewolfTarget = selectWerewolfTarget(
        gameState,
        aiPlayer,
        alivePlayers,
        difficulty
      );
      targetId = werewolfTarget.targetId;
      reasoning = werewolfTarget.reasoning;
      confidence = werewolfTarget.confidence;
      break;

    case 'Seer':
      const seerTarget = selectSeerTarget(
        gameState,
        aiPlayer,
        alivePlayers,
        difficulty
      );
      targetId = seerTarget.targetId;
      reasoning = seerTarget.reasoning;
      confidence = seerTarget.confidence;
      break;

    case 'Doctor':
      const doctorTarget = selectDoctorTarget(
        gameState,
        aiPlayer,
        alivePlayers,
        difficulty
      );
      targetId = doctorTarget.targetId;
      reasoning = doctorTarget.reasoning;
      confidence = doctorTarget.confidence;
      break;

    case 'Witch':
      // TODO: Implement Witch logic (heal/poison)
      targetId = null;
      reasoning = 'Witch saves potions for critical moments';
      confidence = 0.6;
      break;

    default:
      targetId = null;
      reasoning = 'No night action available';
      confidence = 1.0;
  }

  return {
    playerId: aiPlayer.id,
    decisionType: 'nightAction',
    targetId,
    reasoning,
    confidence,
    timestamp: Date.now(),
  };
}

// ============================================================================
// WEREWOLF TARGET SELECTION
// ============================================================================

function selectWerewolfTarget(
  gameState: WerewolfGameState,
  aiPlayer: WerewolfPlayer,
  alivePlayers: WerewolfPlayer[],
  difficulty: AIDifficulty
): { targetId: string; reasoning: string; confidence: number } {
  // Filter out other werewolves
  const nonWerewolves = alivePlayers.filter((p) => p.role !== 'Werewolf');

  if (nonWerewolves.length === 0) {
    return {
      targetId: alivePlayers[0]?.id || '',
      reasoning: 'No valid targets',
      confidence: 0.1,
    };
  }

  switch (difficulty) {
    case 'Beginner':
      // Random target
      const randomTarget =
        nonWerewolves[Math.floor(Math.random() * nonWerewolves.length)];
      return {
        targetId: randomTarget.id,
        reasoning: `Random selection: ${randomTarget.name}`,
        confidence: 0.3,
      };

    case 'Intermediate':
      // Target quiet or suspicious players
      const suspiciousTarget = nonWerewolves.sort(
        (a, b) => (b.suspicionLevel || 0) - (a.suspicionLevel || 0)
      )[0];
      return {
        targetId: suspiciousTarget.id,
        reasoning: `Target suspicious player: ${suspiciousTarget.name}`,
        confidence: 0.6,
      };

    case 'Expert':
      // Strategic targeting - prioritize Seer-like behavior
      // Look for players who might be Seer or Doctor
      const activeVoters = nonWerewolves.sort((a, b) => {
        // Prioritize players who have been vocal or strategic
        const aActivity = gameState.events.filter((e) =>
          e.involvedPlayers.includes(a.id)
        ).length;
        const bActivity = gameState.events.filter((e) =>
          e.involvedPlayers.includes(b.id)
        ).length;
        return bActivity - aActivity;
      });

      const strategicTarget = activeVoters[0];
      return {
        targetId: strategicTarget.id,
        reasoning: `Strategic elimination of active player: ${strategicTarget.name}`,
        confidence: 0.8,
      };

    default:
      return selectWerewolfTarget(gameState, aiPlayer, alivePlayers, 'Beginner');
  }
}

// ============================================================================
// SEER TARGET SELECTION
// ============================================================================

function selectSeerTarget(
  gameState: WerewolfGameState,
  aiPlayer: WerewolfPlayer,
  alivePlayers: WerewolfPlayer[],
  difficulty: AIDifficulty
): { targetId: string; reasoning: string; confidence: number } {
  // Filter out already investigated players
  const previouslyInvestigated = gameState.nightActions
    .filter((action) => action.playerId === aiPlayer.id && action.actionType === 'investigate')
    .map((action) => action.targetId);

  const uninvestigated = alivePlayers.filter(
    (p) => !previouslyInvestigated.includes(p.id)
  );

  if (uninvestigated.length === 0) {
    // Re-investigate if necessary
    const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    return {
      targetId: target.id,
      reasoning: `Re-investigating ${target.name}`,
      confidence: 0.2,
    };
  }

  switch (difficulty) {
    case 'Beginner':
      const randomTarget =
        uninvestigated[Math.floor(Math.random() * uninvestigated.length)];
      return {
        targetId: randomTarget.id,
        reasoning: `Random investigation: ${randomTarget.name}`,
        confidence: 0.4,
      };

    case 'Intermediate':
    case 'Expert':
      // Investigate most suspicious or quiet players
      const suspiciousTarget = uninvestigated.sort(
        (a, b) => (b.suspicionLevel || 0) - (a.suspicionLevel || 0)
      )[0];
      return {
        targetId: suspiciousTarget.id,
        reasoning: `Investigating suspicious player: ${suspiciousTarget.name}`,
        confidence: 0.7,
      };

    default:
      return selectSeerTarget(gameState, aiPlayer, alivePlayers, 'Beginner');
  }
}

// ============================================================================
// DOCTOR TARGET SELECTION
// ============================================================================

function selectDoctorTarget(
  gameState: WerewolfGameState,
  aiPlayer: WerewolfPlayer,
  alivePlayers: WerewolfPlayer[],
  difficulty: AIDifficulty
): { targetId: string; reasoning: string; confidence: number } {
  // Check who was protected last night (can't protect same person twice in a row)
  const lastNightProtection = gameState.nightActions
    .filter(
      (action) =>
        action.playerId === aiPlayer.id &&
        action.actionType === 'protect' &&
        action.timestamp > Date.now() - 86400000 // Last 24 hours
    )
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  const validTargets = alivePlayers.filter(
    (p) => p.id !== lastNightProtection?.targetId
  );

  if (validTargets.length === 0) {
    return {
      targetId: alivePlayers[0]?.id || '',
      reasoning: 'No valid targets (all recently protected)',
      confidence: 0.2,
    };
  }

  switch (difficulty) {
    case 'Beginner':
      // Protect random player
      const randomTarget =
        validTargets[Math.floor(Math.random() * validTargets.length)];
      return {
        targetId: randomTarget.id,
        reasoning: `Random protection: ${randomTarget.name}`,
        confidence: 0.4,
      };

    case 'Intermediate':
      // Protect valuable players (those who speak up, seem strategic)
      const valuableTarget = validTargets.sort((a, b) => {
        const aActivity = gameState.events.filter((e) =>
          e.involvedPlayers.includes(a.id)
        ).length;
        const bActivity = gameState.events.filter((e) =>
          e.involvedPlayers.includes(b.id)
        ).length;
        return bActivity - aActivity;
      })[0];
      return {
        targetId: valuableTarget.id,
        reasoning: `Protecting active player: ${valuableTarget.name}`,
        confidence: 0.6,
      };

    case 'Expert':
      // Protect likely Seer or strategic players
      // Similar to Intermediate but with more analysis
      const strategicTarget = validTargets.sort((a, b) => {
        const aImportance =
          (gameState.events.filter((e) => e.involvedPlayers.includes(a.id))
            .length || 0) + (a.suspicionLevel || 0);
        const bImportance =
          (gameState.events.filter((e) => e.involvedPlayers.includes(b.id))
            .length || 0) + (b.suspicionLevel || 0);
        return bImportance - aImportance;
      })[0];
      return {
        targetId: strategicTarget.id,
        reasoning: `Strategic protection of key player: ${strategicTarget.name}`,
        confidence: 0.8,
      };

    default:
      return selectDoctorTarget(gameState, aiPlayer, alivePlayers, 'Beginner');
  }
}

// ============================================================================
// DAY VOTE LOGIC
// ============================================================================

async function generateDayVote(
  gameState: WerewolfGameState,
  aiPlayer: WerewolfPlayer,
  difficulty: AIDifficulty
): Promise<AIPlayerDecision> {
  const alivePlayers = gameState.players.filter(
    (p) => p.status === 'Alive' && p.id !== aiPlayer.id
  );

  if (alivePlayers.length === 0) {
    return {
      playerId: aiPlayer.id,
      decisionType: 'dayVote',
      targetId: null,
      reasoning: 'No valid voting targets',
      confidence: 0,
      timestamp: Date.now(),
    };
  }

  let targetId: string;
  let reasoning: string;
  let confidence: number;

  if (aiPlayer.role === 'Werewolf') {
    // Werewolves vote for villagers
    const target = alivePlayers
      .filter((p) => p.role !== 'Werewolf')
      .sort((a, b) => (b.suspicionLevel || 0) - (a.suspicionLevel || 0))[0];
    targetId = target?.id || alivePlayers[0].id;
    reasoning = `Voting to eliminate ${target?.name || alivePlayers[0].name}`;
    confidence = difficulty === 'Expert' ? 0.8 : 0.6;
  } else {
    // Villagers vote for most suspicious
    const target = alivePlayers.sort(
      (a, b) => (b.suspicionLevel || 0) - (a.suspicionLevel || 0)
    )[0];
    targetId = target.id;
    reasoning = `Voting for most suspicious player: ${target.name}`;
    confidence = difficulty === 'Expert' ? 0.7 : 0.5;
  }

  return {
    playerId: aiPlayer.id,
    decisionType: 'dayVote',
    targetId,
    reasoning,
    confidence,
    timestamp: Date.now(),
  };
}

// ============================================================================
// DISCUSSION MESSAGE GENERATION
// ============================================================================

async function generateDiscussionMessage(
  gameState: WerewolfGameState,
  aiPlayer: WerewolfPlayer,
  difficulty: AIDifficulty
): Promise<AIPlayerDecision> {
  // Use Groq to generate contextual discussion messages
  try {
    const systemPrompt = `You are ${aiPlayer.name}, a player in a Werewolf game.
Your role is ${aiPlayer.role}, but you must NOT reveal this.
${
  aiPlayer.role === 'Werewolf'
    ? 'You must blend in and deflect suspicion.'
    : 'You must help identify the werewolves.'
}

Generate a short (1-2 sentence) message to contribute to the discussion.
Be natural, conversational, and stay in character.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Day ${gameState.dayNumber}. What do you say?`,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const message = completion.choices[0]?.message?.content || 'I agree with the group.';

    return {
      playerId: aiPlayer.id,
      decisionType: 'discussion',
      targetId: null,
      reasoning: message,
      confidence: 0.7,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Failed to generate AI discussion:', error);
    return {
      playerId: aiPlayer.id,
      decisionType: 'discussion',
      targetId: null,
      reasoning: 'I think we should vote carefully.',
      confidence: 0.5,
      timestamp: Date.now(),
    };
  }
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: AIDecisionRequest = await request.json();
    const { gameState, aiPlayer, decisionType } = body;

    if (!gameState || !aiPlayer || !decisionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const decision = await generateAIDecision({ gameState, aiPlayer, decisionType });

    return NextResponse.json({
      decision,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('AI decision API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI decision' },
      { status: 500 }
    );
  }
}
