# 🤖 AI Dungeon Master System

Complete documentation for the AI-powered narration and game moderation system used across all game modes.

---

## Overview

The **AI Dungeon Master** (AI DM) serves as an intelligent narrator, game master, and moderator. Unlike traditional chatbots, the AI DM is context-aware, game-specific, and optimized for immersive storytelling.

**Primary Functions:**
1. **Narration** - Atmospheric storytelling and event description
2. **Moderation** - Rule enforcement and game state management
3. **Player Simulation** - Controlling AI-operated players (Werewolf mode)

---

## Architecture

### Tech Stack

**AI Provider**: [Groq](https://groq.com)
- **Model**: Llama 3.1 8B Instant
- **Why Groq**: Fastest inference speed (critical for game responsiveness)
- **Why Llama 3.1 8B**: Balance of quality and speed
- **Cost**: Free tier (14,400 requests/day)

**API Integration**: Edge Runtime (Next.js)
- Deployed on Vercel Edge Network
- Sub-second response times globally

---

## System Components

### 1. AI DM for TTRPG Mode

**File**: `app/api/chat/route.ts`

**Purpose**: Traditional Dungeon Master for D&D-style adventures

#### Input Context

```typescript
interface DMContext {
  character: Character;           // Player's character stats
  gameState: GameSession['game_state'];  // Location, quest, NPCs, combat
  chatHistory: ChatMessage[];     // Previous conversation
  diceRolls: DiceRoll[];         // Recent dice rolls
}
```

#### System Prompt Structure

```typescript
const systemPrompt = `You are an expert Dungeon Master for Dungeons & Dragons 5th Edition.

CURRENT CAMPAIGN: ${campaignName}

PLAYER CHARACTER:
- Name: ${character.name}
- Class: ${character.class}
- Level: ${character.level}
- HP: ${character.current_hp}/${character.max_hp}
- Ability Scores: STR ${character.strength}, DEX ${character.dexterity}, ...

CURRENT SITUATION:
- Location: ${gameState.location}
- Quest: ${gameState.quest_objective}
- Active NPCs: ${gameState.active_npcs.join(', ')}
- Combat Active: ${gameState.combat_active ? 'YES' : 'NO'}

TONE & STYLE:
- Vivid, descriptive narration
- Respond to player actions dynamically
- Integrate dice roll results naturally
- Maintain D&D 5e rule consistency
- Keep responses concise (2-4 paragraphs max)

Your response:`;
```

#### Example Interaction

**User Input:**
```
I rolled a 18 on my attack roll and 12 damage.
I swing my sword at the goblin.
```

**AI DM Response:**
```
Your blade arcs through the air with practiced precision! [Natural 18 - Hit!]

The goblin barely has time to raise its rusty shield before your sword
finds its mark, cleaving deep into its shoulder for 12 points of damage.
It shrieks in pain, staggering backward as dark blood seeps from the wound.

The creature is badly wounded but still standing. It snarls at you,
raising its crude spear for a desperate counterattack.

What do you do?
```

#### Configuration

```typescript
const completion = await groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [
    { role: 'system', content: systemPrompt },
    ...chatHistory,
    { role: 'user', content: userMessage }
  ],
  temperature: 0.8,        // Creative but coherent
  max_tokens: 500,         // Keep responses concise
  stream: false
});
```

---

### 2. AI DM for Werewolf Mode

**Files**:
- `app/api/werewolf/narrate/route.ts` - Narration
- `lib/werewolf/prompts.ts` - Templates

**Purpose**: Atmospheric narrator for social deduction gameplay

#### Narration Types

| Event Type | Example Narration |
|-----------|------------------|
| `gameStart` | "Welcome to Ravencrest. Until the wolves came..." |
| `nightFall` | "Night falls over the village. In the shadows, hungry eyes gleam..." |
| `dawnWithDeath` | "The rooster crows... slumped against the well, the body of Marcus..." |
| `dawnNoDeath` | "Miracle of miracles—everyone survived the night..." |
| `voteStart` | "The discussion grows heated. It's time to decide..." |
| `elimination` | "Marcus steps forward. As they fall, you see: WEREWOLF." |
| `victory` | "The final wolf falls. The nightmare is over." |

#### System Prompt Structure

```typescript
const systemPrompt = `You are the AI Dungeon Master narrating a Werewolf game.

VILLAGE LORE:
- Name: ${villageName}
- Backstory: ${villageBackstory}
- Current Day: ${dayNumber}
- Current Phase: ${phase}

TONE & STYLE:
- Dramatic and atmospheric
- Build suspense and tension
- Use vivid, evocative language
- Keep narrations concise (2-4 sentences)
- Never reveal roles unless eliminated

PLAYERS:
${alivePlayers.map(p => `- ${p.name}`).join('\n')}

Generate narration for: ${eventType}

Narration:`;
```

#### Template vs. AI Generation

**Templates** (Fast, No API Call):
```typescript
const TEMPLATES = {
  nightFall: [
    "🌙 Night falls over {villageName}. The moon rises, full and crimson...",
    "🌙 Darkness blankets {villageName}. The wind howls through empty streets..."
  ]
};

// Use template
const narration = TEMPLATES.nightFall[Math.floor(Math.random() * TEMPLATES.nightFall.length)]
  .replace('{villageName}', villageName);
```

**AI Generation** (Slower, More Dynamic):
```typescript
// For complex, context-specific events
const response = await groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Narrate the death of ${victimName}` }
  ],
  temperature: 0.9,        // Highly creative
  max_tokens: 200
});
```

**Decision Logic:**
- Use **templates** for standard events (night falls, vote starts)
- Use **AI generation** for unique events (deaths, victories with context)

---

### 3. AI Players (Werewolf Mode)

**File**: `app/api/werewolf/ai-decision/route.ts`

**Purpose**: Simulate human players with strategic decision-making

#### AI Player Decision Flow

```
1. Game State + Player Role → API
2. Analyze Context (who's alive, voting history, suspicion levels)
3. Role-Specific Logic:
   - Werewolf: Strategic targeting
   - Seer: Investigate suspicious players
   - Doctor: Protect high-value players
   - Villager: Vote with majority
4. Return Decision + Reasoning
```

#### Input

```typescript
interface AIDecisionRequest {
  gameState: WerewolfGameState;
  aiPlayer: WerewolfPlayer;      // Role, difficulty, personality
  decisionType: 'nightAction' | 'dayVote' | 'discussion';
}
```

#### Output

```typescript
interface AIPlayerDecision {
  playerId: string;
  decisionType: 'nightAction' | 'dayVote';
  targetId: string | null;       // Who to target
  reasoning: string;              // Internal logic (for debugging)
  confidence: number;             // 0-1 (how sure the AI is)
  timestamp: number;
}
```

#### Decision Logic Examples

**Werewolf (Expert Difficulty):**
```typescript
function selectWerewolfTarget(gameState, aiPlayer) {
  // Prioritize active, strategic players (likely Seer/Doctor)
  const activeVoters = nonWerewolves.sort((a, b) => {
    const aActivity = countPlayerEvents(gameState, a.id);
    const bActivity = countPlayerEvents(gameState, b.id);
    return bActivity - aActivity;
  });

  const target = activeVoters[0];
  return {
    targetId: target.id,
    reasoning: `Strategic elimination of ${target.name} (high activity)`,
    confidence: 0.8
  };
}
```

**Seer (Intermediate Difficulty):**
```typescript
function selectSeerTarget(gameState, aiPlayer) {
  // Investigate uninvestigated, suspicious players
  const uninvestigated = players.filter(p =>
    !previouslyInvestigated.includes(p.id)
  );

  const suspicious = uninvestigated.sort((a, b) =>
    (b.suspicionLevel || 0) - (a.suspicionLevel || 0)
  )[0];

  return {
    targetId: suspicious.id,
    reasoning: `Investigating suspicious player: ${suspicious.name}`,
    confidence: 0.7
  };
}
```

**Configuration:**
```typescript
// For discussion messages (coming soon)
const completion = await groq.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [
    {
      role: 'system',
      content: `You are ${aiPlayer.name}, a ${aiPlayer.role} (don't reveal this).
      Generate a 1-2 sentence discussion message.`
    },
    { role: 'user', content: `Day ${dayNumber}. What do you say?` }
  ],
  temperature: 0.8,
  max_tokens: 100
});
```

---

## Prompt Engineering Best Practices

### 1. Context Window Management

**Problem**: Llama 3.1 8B has limited context (8K tokens)

**Solution**:
- Truncate old chat messages (keep last 10)
- Summarize game state (don't include full history)
- Use concise character stats

**Example**:
```typescript
// BAD: Include entire 50-message chat history
const messages = [...allChatHistory];  // Could exceed context window

// GOOD: Truncate and summarize
const recentMessages = chatHistory.slice(-10);
const summary = summarizeOlderMessages(chatHistory.slice(0, -10));
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'assistant', content: `Summary: ${summary}` },
  ...recentMessages
];
```

---

### 2. Temperature Tuning

| Use Case | Temperature | Rationale |
|----------|-------------|-----------|
| TTRPG Narration | 0.8 | Creative but coherent storytelling |
| Werewolf Narration | 0.9 | Highly atmospheric, varied phrasing |
| AI Player Decisions | 0.7 | Strategic but not repetitive |
| Rule Clarifications | 0.3 | Factual, consistent |

---

### 3. Tone Enforcement

**Challenge**: AI may break immersion with modern language or meta-commentary

**Solution**: Explicit tone instructions in system prompt

```typescript
// BAD
"You are a Dungeon Master."

// GOOD
"You are a Dungeon Master. TONE RULES:
- Use fantasy medieval language (no modern slang)
- Never break character or reference being an AI
- Stay dramatic and immersive
- No meta-commentary about game mechanics
- Never refuse player requests (always narrate consequences)"
```

---

### 4. Response Length Control

**Challenge**: AI may generate overly long responses

**Solution**: Explicit length constraints

```typescript
const systemPrompt = `...
Keep responses concise:
- 2-4 paragraphs maximum
- 3-5 sentences per paragraph
- Use line breaks for readability
...`;

// Also enforce with max_tokens
const completion = await groq.chat.completions.create({
  max_tokens: 500,  // Hard limit
  ...
});
```

---

## Performance Optimization

### 1. Template-Based Responses

**When**: Standard, repetitive narrations (night falls, vote starts)

**Benefit**: 0ms latency, 0 API cost

**Implementation**:
```typescript
// lib/werewolf/prompts.ts
export const NARRATION_TEMPLATES = {
  nightFall: [
    "🌙 Night falls over {villageName}. The moon rises...",
    "🌙 Darkness descends upon {villageName}..."
  ]
};

// Use template instead of API call
const narration = getRandomTemplate('nightFall', { villageName });
```

---

### 2. Caching

**When**: Repeated AI calls with same context (village lore generation)

**Benefit**: Reduce redundant API calls

**Implementation**:
```typescript
const villageLoreCache = new Map<string, string>();

function getVillageLore(villageName: string) {
  if (villageLoreCache.has(villageName)) {
    return villageLoreCache.get(villageName);
  }

  const lore = await generateVillageLore(villageName);
  villageLoreCache.set(villageName, lore);
  return lore;
}
```

---

### 3. Edge Runtime Deployment

**Benefit**: Global low latency (sub-100ms API calls)

**Configuration**:
```typescript
// app/api/chat/route.ts
export const runtime = 'edge';  // Deploy to Vercel Edge Network
```

**Result**: API calls from any location → nearest edge node → Groq → response in ~200-500ms

---

## Error Handling

### 1. API Failures

**Scenario**: Groq API is down or rate-limited

**Solution**: Fallback to templates

```typescript
async function getNarration(eventType, context) {
  try {
    // Try AI generation
    const aiNarration = await generateAINarration(eventType, context);
    return aiNarration;
  } catch (error) {
    console.error('AI narration failed, using template:', error);
    // Fallback to template
    return getTemplateNarration(eventType, context);
  }
}
```

---

### 2. Rate Limiting

**Groq Free Tier**: 14,400 requests/day = ~10 requests/minute

**Solution**: Implement request tracking

```typescript
let requestCount = 0;
const DAILY_LIMIT = 14000;  // Buffer

async function makeAIRequest(prompt) {
  if (requestCount >= DAILY_LIMIT) {
    throw new Error('Daily AI request limit reached');
  }

  const response = await groq.chat.completions.create(prompt);
  requestCount++;
  return response;
}
```

---

### 3. Invalid Responses

**Scenario**: AI returns empty, malformed, or off-topic response

**Solution**: Validation + retry

```typescript
function validateNarration(narration: string): boolean {
  if (!narration || narration.length < 10) return false;
  if (narration.includes('I cannot') || narration.includes('I apologize')) return false;
  return true;
}

async function getNarrationWithRetry(eventType, context, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    const narration = await generateAINarration(eventType, context);
    if (validateNarration(narration)) return narration;
  }
  // Final fallback
  return getTemplateNarration(eventType, context);
}
```

---

## Cost Analysis

### Free Tier (Groq)

- **Limit**: 14,400 requests/day
- **Cost**: $0

**Usage Breakdown (per game):**

| Game Mode | Requests/Game | Games/Day (Limit) |
|-----------|---------------|-------------------|
| **TTRPG** | 20-50 (chat-based) | ~300-700 games |
| **Werewolf** | 5-15 (narration only) | ~1000+ games |

**Conclusion**: Free tier is sufficient for MVP and moderate usage.

---

### Paid Tier (if scaling)

Groq charges ~$0.10 per 1M tokens.

**Estimated Costs:**

| Usage | Monthly Cost |
|-------|-------------|
| 100 games/day | ~$0.50 |
| 1,000 games/day | ~$5 |
| 10,000 games/day | ~$50 |

**Alternative**: Switch to other providers (OpenRouter, Anthropic) if Groq scales poorly.

---

## Future Enhancements

### 1. Multi-Modal AI

**Vision**: Support image generation for scenes

**Example Use Case**: Generate village map, character portraits, death scenes

**Tech**: Integrate DALL-E or Stable Diffusion API

---

### 2. Voice AI Integration

**Vision**: AI DM speaks narrations (text-to-speech)

**Tech**: ElevenLabs or Groq Whisper

**Use Case**: Werewolf narrations spoken dramatically

---

### 3. Memory & Continuity

**Vision**: AI remembers past games, player preferences

**Tech**: Vector database (Pinecone, Weaviate)

**Example**: "Last time you played, your Seer correctly identified 3 Werewolves!"

---

### 4. Fine-Tuned Models

**Vision**: Custom Llama model trained on TTRPG campaigns

**Benefit**: Better D&D rule adherence, more immersive narration

**Challenge**: Requires training data and compute

---

## Conclusion

The AI DM system is the core innovation of this platform, transforming traditional tabletop experiences into accessible, AI-powered digital games. By balancing AI generation with templates, optimizing prompts, and handling errors gracefully, the system delivers **fast, immersive, and cost-effective** narration across multiple game modes.

**Key Takeaways:**
- ✅ Groq + Llama 3.1 8B = Fast, free, high-quality AI
- ✅ Prompt engineering is critical for tone and quality
- ✅ Templates + AI hybrid approach balances speed and creativity
- ✅ Edge deployment ensures global low latency
- ✅ Designed for extensibility (easy to add new game modes)

🎮 **Happy Gaming!**
