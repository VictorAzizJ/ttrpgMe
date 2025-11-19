# 🐺 Werewolf Game Mode - Complete Guide

Welcome to **Werewolf: Village of Shadows**, a complete implementation of the classic social deduction game (also known as Mafia) powered by AI narration and intelligent computer players.

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Game Overview](#game-overview)
3. [Roles & Abilities](#roles--abilities)
4. [How to Play](#how-to-play)
5. [AI Features](#ai-features)
6. [Game Mechanics](#game-mechanics)
7. [Tips & Strategy](#tips--strategy)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Start a New Game (3 Steps)

1. **Navigate to Werewolf Mode**
   - From the homepage, click "Play Werewolf →"
   - Or visit `/werewolf` directly

2. **Create or Join a Lobby**
   - **Create**: Enter your name → Create New Game → Share the 6-character lobby code with friends
   - **Join**: Enter your name + lobby code → Join

3. **Configure & Play**
   - Host configures settings (AI difficulty, time limits, advanced roles)
   - Add AI players to fill empty slots (or enable auto-fill)
   - Click "Start Game" when ready (minimum 5 players)

---

## Game Overview

### What is Werewolf?

Werewolf is a social deduction game where players are secretly divided into two teams:

- **Villagers** (Good) - Eliminate all Werewolves to win
- **Werewolves** (Evil) - Outnumber or equal the Villagers to win

The game alternates between **Night** (Werewolves kill) and **Day** (everyone discusses and votes to eliminate suspects).

### Player Count

- **Minimum**: 5 players (2 Werewolves, 1 Seer, 1 Doctor, 1 Villager)
- **Recommended**: 8-12 players
- **Maximum**: 20 players
- **AI Auto-Fill**: Enabled by default to reach minimum

---

## Roles & Abilities

### 🐺 Werewolf Team

#### **Werewolf**
- **Allegiance**: Werewolves
- **Night Action**: Vote with pack to kill one villager
- **Special**: Knows other Werewolves
- **Strategy**: Blend in during the day, deflect suspicion, eliminate threats at night

---

### 👥 Villager Team

#### **Villager**
- **Allegiance**: Villagers
- **Night Action**: None (sleeps)
- **Special**: None
- **Strategy**: Vote wisely, watch for suspicious behavior, help identify Werewolves

#### **Seer** 🔮
- **Allegiance**: Villagers
- **Night Action**: Investigate one player to learn if they're a Werewolf
- **Special**: Gains information each night
- **Strategy**: Stay hidden, gather intel, subtly guide village votes

#### **Doctor** 💊
- **Allegiance**: Villagers
- **Night Action**: Protect one player from Werewolf attacks
- **Special**: Can save someone's life (but not same person twice in a row)
- **Strategy**: Protect high-value players, vary your pattern

#### **Hunter** 🏹
- **Allegiance**: Villagers
- **Night Action**: None
- **Special**: When eliminated, immediately kills one other player
- **Strategy**: Be vocal so Werewolves avoid you, use revenge kill wisely

#### **Witch** 🧪
- **Allegiance**: Villagers
- **Night Action**: Use heal potion (save victim) OR poison potion (kill someone)
- **Special**: Each potion can only be used once per game
- **Strategy**: Save heal for critical moments, use poison on confirmed Werewolves

---

### 🎭 Advanced Roles (Optional)

#### **Tanner**
- **Allegiance**: Neutral
- **Win Condition**: Only wins if THEY are voted off during the day
- **Strategy**: Act suspicious, get yourself eliminated (chaos agent)

#### **Cupid** 💘
- **Allegiance**: Villagers
- **Night Action**: Link two players on Night 1 (if one dies, both die)
- **Special**: Creates complex dynamics
- **Strategy**: Link strong players, or link a Werewolf to a Villager for chaos

#### **Fool** 🃏
- **Allegiance**: Villagers
- **Special**: Appears as a Werewolf to the Seer (but is innocent)
- **Strategy**: Confuses the Seer, adds uncertainty

---

## How to Play

### Game Flow

```
1. LOBBY → Host configures, players join
2. ROLE ASSIGNMENT → Each player gets secret role
3. NIGHT PHASE → Werewolves kill, Seer investigates, Doctor protects
4. DAWN → AI DM reveals if anyone died
5. DAY PHASE → Open discussion, accusations
6. VOTING → Players vote to eliminate someone
7. ELIMINATION → Voted player's role is revealed
8. REPEAT → Cycle continues until one side wins
```

### Night Phase (60 seconds default)

**What Happens:**
1. All players "go to sleep" (screen darkens)
2. **Werewolves wake**: Select a victim to kill (must agree if multiple wolves)
3. **Seer wakes**: Choose one player to investigate
4. **Doctor wakes**: Choose one player to protect
5. **Other special roles** act in sequence

**For Players Without Night Actions:**
- You see a "sleeping" message and wait for dawn

**Private Information:**
- Werewolves see each other (highlighted in red)
- Seer receives investigation results privately
- Other players cannot see your actions

### Day Phase (3 minutes default)

**What Happens:**
1. AI DM narrates dawn (reveals deaths or "no one died")
2. Players discuss openly:
   - Accuse suspicious players
   - Share information (carefully if you're Seer)
   - Defend yourself if accused
   - Form alliances or suspicions

**Suspicion Tracker** (if enabled):
- Visual indicator showing how suspicious each player seems
- Updates based on voting patterns

### Voting Phase (60 seconds default)

**What Happens:**
1. Host or timer triggers voting
2. Each player selects one person to eliminate (or skip)
3. Votes are revealed one-by-one with dramatic effect
4. Player with most votes is eliminated
5. Their role is revealed to everyone
6. If Hunter, they immediately revenge-kill someone

**Tie Votes:**
- Random selection among tied players (or revote, depending on settings)

---

## AI Features

### AI Dungeon Master

The AI DM narrates the entire game with atmospheric storytelling:

**Village Lore Generation:**
- Unique village names (Ravencrest, Thornwick, Ashenvale, etc.)
- Backstories and atmospheric descriptions
- Dynamic narration based on game events

**Narration Examples:**
- Opening: *"Welcome to the village of Ravencrest. For generations, your people lived in peace... until the wolves came."*
- Death: *"The rooster crows... and there, slumped against the well, the lifeless body of Marcus. Claw marks. Fangs."*
- Victory: *"The final wolf falls. As dawn breaks, the survivors embrace. The nightmare is over."*

**Features:**
- Varied templates (no repetitive messages)
- Contextual awareness (references village name, player names)
- Dramatic timing and pacing

### AI Players

When human players are insufficient, AI players automatically fill slots.

**AI Difficulty Levels:**

#### **Beginner**
- Random targeting (Werewolf)
- Random investigations (Seer)
- Simple voting based on suspicion

#### **Intermediate** (Default)
- Strategic targeting (prioritize threats)
- Analyzes voting patterns
- Defends self when accused
- Builds basic suspicion models

#### **Expert**
- Advanced strategic targeting (eliminates Seer-like players)
- Tracks voting inconsistencies
- Constructs alibis and deflects suspicion
- Identifies confirmed innocents and allies with them
- Occasionally "suspects" fellow Werewolves to appear innocent

**AI Personalities:**
- **Aggressive**: Accuses often, votes decisively
- **Cautious**: Defensive, seeks consensus
- **Analytical**: Logic-based, cites evidence
- **Chaotic**: Unpredictable, random behavior

**AI Chat (Coming Soon):**
- AI players will participate in text discussions
- Natural language contributions ("I think Marcus is suspicious...")
- Responsive to accusations and questions

---

## Game Mechanics

### Role Distribution by Player Count

| Players | Werewolves | Seer | Doctor | Hunter | Witch | Villagers |
|---------|-----------|------|--------|--------|-------|-----------|
| 5       | 2         | 1    | 1      | 0      | 0     | 1         |
| 6       | 2         | 1    | 1      | 0      | 0     | 2         |
| 7       | 2         | 1    | 1      | 1      | 0     | 2         |
| 8       | 2         | 1    | 1      | 1      | 0     | 3         |
| 9       | 2         | 1    | 1      | 1      | 0     | 4         |
| 10      | 3         | 1    | 1      | 1      | 1     | 3         |
| 11      | 3         | 1    | 1      | 1      | 1     | 4         |
| 12      | 3         | 1    | 1      | 1      | 1     | 5         |

### Win Conditions

**Villagers Win:**
- All Werewolves are eliminated

**Werewolves Win:**
- Werewolves equal or outnumber Villagers

**Tanner Wins (if enabled):**
- Tanner is voted off during the day (game continues for others)

### Action Resolution Order (Night)

1. **Doctor protection** is set
2. **Werewolf attack** executes
3. **If protected**: No death
4. **If not protected**: Player dies
5. **Seer investigation** reveals result (private to Seer)

---

## Tips & Strategy

### For All Players

**Do:**
- ✅ Pay attention to voting patterns
- ✅ Note who accuses whom
- ✅ Watch for defensive behavior
- ✅ Remember who was killed and when

**Don't:**
- ❌ Reveal your role too early (especially Seer)
- ❌ Trust anyone completely
- ❌ Vote randomly without reason
- ❌ Stay silent during discussions

### Role-Specific Tips

**Werewolves:**
- Agree on target quickly at night
- Vote with majority during day (blend in)
- Defend accused Werewolves subtly (not obviously)
- Kill Seer/Doctor if you identify them

**Seer:**
- Don't reveal you're Seer until critical moment
- Investigate suspicious or quiet players
- Subtly guide votes without exposing yourself
- Track your findings privately

**Doctor:**
- Protect different people each night
- Protect likely targets (vocal players, Seer suspects)
- Don't claim Doctor unless necessary

**Hunter:**
- Be vocal to deter Werewolves from killing you
- If eliminated, revenge-kill your top suspect

---

## Troubleshooting

### Common Issues

**Q: Game won't start**
- Ensure minimum 5 players (including AI)
- Enable "AI Auto-Fill" in settings
- Check that host has clicked "Start Game"

**Q: My vote didn't count**
- Votes lock when submitted - check if you clicked "Lock In Vote"
- Timer may have expired
- You may have been eliminated

**Q: I can't see other Werewolves**
- Only visible during Night phase
- Check that it's currently Night (not Day)

**Q: Seer investigation not showing**
- Results are private - check your action confirmation
- Previous investigations shown in "Previous Visions" panel

**Q: Game stuck on a phase**
- Wait for timer to expire (auto-advances)
- All players with actions must submit
- Host may need to refresh

### Performance Tips

- Close other browser tabs for smooth timers
- Use desktop browser for best experience
- Ensure stable internet connection (for future multiplayer)

---

## Coming Soon

🚧 **Planned Features:**

- Real-time text chat during Day phase
- Voice chat integration
- Spectator mode for eliminated players
- Game replay with timeline scrubber
- Advanced statistics and leaderboards
- Custom role creation
- Additional game modes (Speed Werewolf, One Night Werewolf)
- Multiplayer sync across devices

---

## Need Help?

- **Report Bugs**: [GitHub Issues](https://github.com/your-repo/issues)
- **Join Discord**: [Community Server](https://discord.gg/your-server)
- **Read Full Design Doc**: See main README for complete architecture

**Enjoy the hunt! May the best faction win.** 🐺🌙
