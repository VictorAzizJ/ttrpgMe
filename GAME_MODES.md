# 🎮 Game Modes System

This document explains the game mode architecture of the TTRPG Platform and how different game types are implemented.

---

## Overview

The platform supports multiple game modes, each with distinct mechanics, rules, and AI behavior:

1. **Traditional TTRPG** - D&D-style adventures with AI Dungeon Master
2. **Werewolf** - Social deduction party game
3. **[Future]** - Additional game modes (board games, custom systems)

---

## Current Game Modes

### 1. Traditional TTRPG Mode

**Type**: Turn-based role-playing adventure
**Players**: 1 (single-player with AI DM)
**AI Role**: Dungeon Master (narrator, NPC controller, world simulator)

**Features:**
- Character sheet management (D&D 5e)
- Dice rolling with automatic integration
- AI-narrated campaigns
- Combat, exploration, and social interactions
- Persistent game sessions

**Tech Stack:**
- **State**: React state + localStorage
- **AI**: Groq API (Llama 3.1 8B)
- **Components**: `components/character/`, `components/dice/`, `components/chat/`
- **Types**: `types/character.ts`, `types/chat.ts`, `types/dice.ts`

**Entry Point**: `/play`

**Status**: ✅ Complete

---

### 2. Werewolf Mode

**Type**: Social deduction party game
**Players**: 5-20 (human + AI mix)
**AI Role**: Narrator + Player (fills empty slots)

**Features:**
- Lobby system with invite codes
- 9 unique roles with special abilities
- Night/Day phase cycle
- Voting mechanics
- AI narration with atmospheric lore
- Smart AI players (3 difficulty levels)
- Suspicion tracking system

**Tech Stack:**
- **State**: React state + localStorage
- **AI Narration**: Groq API
- **AI Players**: Groq API (decision-making)
- **Components**: `components/werewolf/`
- **Utils**: `lib/werewolf/game-utils.ts`
- **Types**: `types/werewolf.ts`

**Entry Point**: `/werewolf`

**Status**: ✅ Complete

---

## Game Mode Architecture

### File Structure Pattern

Each game mode follows this structure:

```
app/
  [game-mode]/
    page.tsx                    # Main game page

components/
  [game-mode]/
    Component1.tsx              # UI components
    Component2.tsx

lib/
  [game-mode]/
    game-utils.ts               # Core game logic
    storage.ts                  # Persistence utilities
    prompts.ts                  # AI prompt templates

types/
  [game-mode].ts                # TypeScript interfaces

app/api/
  [game-mode]/
    narrate/route.ts            # AI narration endpoint
    ai-decision/route.ts        # AI player logic (if applicable)
```

### Core Components by Game Mode

| Component Type | TTRPG | Werewolf |
|---------------|-------|----------|
| **Character/Role System** | Character Sheet | Role Card |
| **Action Input** | Chat + Dice Roller | Night Action UI, Voting UI |
| **Player View** | Single Player Stats | Player Grid (all players) |
| **Narration** | AI DM Chat | AI Narrator Events |
| **State Management** | Game Session | Game State + Lobby |
| **Multiplayer** | ❌ Not yet | ✅ Lobby + Players |

---

## AI System by Game Mode

### TTRPG AI (Dungeon Master)

**Role**: World builder, narrator, NPC controller, rule arbiter

**Inputs:**
- Player chat messages
- Character stats (HP, abilities, equipment)
- Dice roll results
- Current game state (location, quest, combat status)

**Outputs:**
- Narrated responses (descriptive, immersive)
- NPC dialogue
- Combat outcomes
- Quest progression

**Prompt Structure:**
```typescript
System Prompt:
- You are a Dungeon Master for D&D 5e
- Current campaign: [campaign name]
- Character: [name, class, level, stats]
- Location: [current location]
- Active quest: [quest objective]

User Prompt:
- Player action/question
```

**Temperature**: 0.8 (creative but coherent)
**Max Tokens**: 500
**Model**: Llama 3.1 8B Instant

**API Endpoint**: `/api/chat`

---

### Werewolf AI System

The Werewolf mode uses AI for **two distinct purposes**:

#### 1. AI Narrator (Dungeon Master)

**Role**: Atmospheric storytelling, event narration, game moderation

**Inputs:**
- Game state (phase, players, village lore)
- Event type (death, voting, game start, etc.)
- Context (victim names, roles, etc.)

**Outputs:**
- Dramatic narrations
- Village lore (names, backstories)
- Phase transitions

**Prompt Structure:**
```typescript
System Prompt:
- You are narrating a Werewolf game
- Village: [name] with backstory [lore]
- Current Day/Night: [number]
- Tone: Dark, dramatic, suspenseful

User Prompt:
- Event: [gameStart | death | voting | etc.]
- Context: [specific details]
```

**Temperature**: 0.9 (highly creative)
**Max Tokens**: 200
**Model**: Llama 3.1 8B Instant

**API Endpoint**: `/api/werewolf/narrate`

---

#### 2. AI Players (Automated Participants)

**Role**: Substitute for human players, execute strategic decisions

**Inputs:**
- Game state
- AI player's role (Werewolf, Seer, etc.)
- Decision type (night action, day vote, discussion)
- Difficulty level (Beginner, Intermediate, Expert)
- AI personality (Aggressive, Cautious, Analytical, Chaotic)

**Outputs:**
- Action decisions (who to kill/investigate/protect/vote for)
- Reasoning (internal logic)
- Confidence level (0-1)

**Decision Logic Examples:**

**Werewolf (Expert):**
```
- Analyze voting patterns
- Target active/strategic players (likely Seer/Doctor)
- Avoid fellow Werewolves
- Occasionally "suspect" pack members to appear innocent
```

**Seer (Intermediate):**
```
- Investigate most suspicious players
- Track previous findings
- Subtly hint at results without revealing role
```

**Villager (Beginner):**
```
- Vote for most-accused player
- Random vote if no consensus
```

**Temperature**: 0.8
**Max Tokens**: 100 (for discussion messages)
**Model**: Llama 3.1 8B Instant

**API Endpoint**: `/api/werewolf/ai-decision`

---

## State Management Comparison

### TTRPG State

```typescript
interface GameSession {
  id: string;
  user_id: string;
  character_id: string;
  campaign_name: string;
  messages: ChatMessage[];        // Full chat history
  game_state: {
    location: string;
    quest_objective: string;
    active_npcs: string[];
    combat_active: boolean;
    turn_order?: string[];
  };
  created_at: Date;
  updated_at: Date;
}
```

**Storage**: localStorage (`ttrpg_game_session`)

---

### Werewolf State

```typescript
interface WerewolfGameState {
  id: string;
  lobbyCode: string;
  phase: 'Lobby' | 'Night' | 'Day' | 'Voting' | 'GameOver';
  dayNumber: number;
  nightNumber: number;
  players: WerewolfPlayer[];      // All players with roles
  alivePlayers: string[];
  deadPlayers: string[];

  // Phase-specific
  nightActions: NightAction[];    // Werewolf kills, Seer checks, etc.
  dayVotes: DayVote[];           // Voting records

  // History
  events: GameEvent[];           // Full game log
  eliminatedPlayers: Array<{ playerId, role, day, method }>;

  // Victory
  gameOver: boolean;
  winner: 'Villagers' | 'Werewolves' | null;

  // Settings
  settings: WerewolfGameSettings;
  villageName: string;
  villageBackstory: string;
}
```

**Storage**: localStorage (`werewolf_active_game`, `werewolf_lobbies`)

---

## Adding New Game Modes

### Step-by-Step Guide

1. **Define Game Type**
   - Create `types/[game-mode].ts` with interfaces
   - Define core types: GameState, Player, Action, Event

2. **Create Utilities**
   - `lib/[game-mode]/game-utils.ts` - Game logic (win conditions, action resolution)
   - `lib/[game-mode]/storage.ts` - localStorage helpers
   - `lib/[game-mode]/prompts.ts` - AI prompt templates

3. **Build Components**
   - Create `components/[game-mode]/` directory
   - Build UI components (player view, action inputs, display)

4. **Implement Game Loop**
   - Create `app/[game-mode]/page.tsx`
   - Implement state management
   - Handle phase transitions
   - Integrate AI calls

5. **Add AI Endpoints**
   - `app/api/[game-mode]/narrate/route.ts` - Narration
   - `app/api/[game-mode]/ai-player/route.ts` - AI players (if needed)

6. **Update Homepage**
   - Add game mode card to `app/page.tsx`
   - Create guide document `[GAME_MODE]_GUIDE.md`

---

## Future Game Modes (Roadmap)

### 🎴 Poker Night (Planned)

- **Type**: Card game
- **Players**: 2-8
- **AI**: Player (fills empty seats) + Dealer/Narrator
- **Features**: Texas Hold'em, betting, chip management
- **Complexity**: Medium

---

### ♟️ Chess with AI Commentary (Planned)

- **Type**: Board game
- **Players**: 1 vs AI
- **AI**: Opponent + Commentator (narrates moves dramatically)
- **Features**: Move validation, AI difficulty levels, game analysis
- **Complexity**: Medium

---

### 🗡️ Secret Hitler (Planned)

- **Type**: Social deduction
- **Players**: 5-10
- **AI**: Narrator + Players
- **Features**: Policy voting, role assignment, assassination mechanic
- **Complexity**: High (similar to Werewolf)

---

### 🏴‍☠️ Coup (Planned)

- **Type**: Bluffing card game
- **Players**: 2-6
- **AI**: Narrator + Players
- **Features**: Character actions, challenges, bluffing detection
- **Complexity**: Medium

---

## Best Practices for Game Mode Development

### 1. **Separation of Concerns**
- Keep game logic in `lib/[game-mode]/game-utils.ts`
- Keep UI in `components/[game-mode]/`
- Keep AI prompts in `lib/[game-mode]/prompts.ts`

### 2. **Type Safety**
- Define all interfaces in `types/[game-mode].ts`
- Use TypeScript strictly (no `any`)

### 3. **AI Integration**
- Use template-based narrations for speed (no API call)
- Use AI generation for complex/contextual narrations
- Cache AI responses when possible

### 4. **State Persistence**
- Use localStorage for MVP
- Design state to be easily migrated to database (Supabase)

### 5. **Multiplayer Readiness**
- Structure state to support multi-device sync
- Use unique IDs for players/games
- Design for eventual WebSocket integration

---

## Technical Comparison

| Aspect | TTRPG Mode | Werewolf Mode |
|--------|-----------|---------------|
| **Complexity** | High (open-ended gameplay) | Medium (structured phases) |
| **State Size** | Large (full chat history) | Medium (game events log) |
| **AI Calls/Game** | 10-50+ (continuous chat) | 5-15 (narration only) |
| **Player Count** | 1 | 5-20 |
| **Session Length** | 30-120 minutes | 10-30 minutes |
| **Replayability** | Low (same campaign) | High (different roles each time) |

---

## Extensibility

The platform is designed for easy addition of new game modes:

✅ **Easy to Add:**
- Turn-based games (Tic-Tac-Toe, Connect 4)
- Card games with clear rules (Poker, Blackjack)
- Simple board games (Checkers, Reversi)

⚠️ **Medium Difficulty:**
- Real-time games (would need WebSocket)
- Complex board games (Chess, Go)
- Multi-phase deduction games (Secret Hitler, Coup)

❌ **Not Suitable:**
- Fast-paced action games
- Graphics-heavy games
- Games requiring sub-second response times

---

**The platform is built to be a comprehensive online gaming suite, with each mode showcasing different aspects of AI-powered gameplay.** 🎮
