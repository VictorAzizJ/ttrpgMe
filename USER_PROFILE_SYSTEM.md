# 🎭 User Profile System Implementation Guide

## ✅ Phase 1: Foundation (COMPLETED)

### What's Been Implemented

#### 1. **Complete Type System** (`types/user.ts`)
Comprehensive TypeScript interfaces for the entire user profile ecosystem:

**Core User Types:**
- `User` - Base user account (auth, subscription, XP/level)
- `UserProfile` - Public/private profile data
- `UserStats` - Aggregated game statistics
- `UserSettings` - Privacy & preferences
- `UserSession` - Session tracking

**Game History:**
- `GameHistoryEntry` - Universal game log (TTRPG + Werewolf)
- `GameSessionStats` - Performance metrics
- `PartyMember` - Multi-player session data

**Achievements & Progression:**
- `Achievement` - Achievement definitions
- `UserAchievement` - Progress tracking
- `AchievementRequirement` - Unlock criteria

**Social Features:**
- `Friendship` - Friend connections
- `FriendRequest` - Pending requests
- `TrustScore` - Reputation system
- `PlayerReview` - User reviews

**Marketplace:**
- `MarketplaceProfile` - Creator profile
- `MarketplaceItem` - Sellable content
- `MarketplaceReview` - Item reviews
- `CreatorBadge` - Creator achievements

**System:**
- `Notification` - In-app notifications
- `UserActivity` - Activity logging

---

#### 2. **Storage Utilities** (`lib/user/storage.ts`)
Complete localStorage-based persistence layer (Supabase-ready):

**Core Storage Modules:**
```typescript
currentUserStorage      // Current logged-in user
userProfileStorage      // Profile data
userStatsStorage        // Stats & metrics
gameHistoryStorage      // Game logs
achievementsStorage     // Achievement progress
friendsStorage          // Friendships
friendRequestsStorage   // Friend requests
trustScoreStorage       // Reputation
notificationsStorage    // Notifications
userSettingsStorage     // Settings & privacy
```

**Key Features:**
- ✅ Type-safe storage operations
- ✅ Auto-create defaults for new users
- ✅ Filtered queries (game history by type/date/outcome)
- ✅ Summary statistics generation
- ✅ Easy migration path to Supabase

**Utility Functions:**
- `initializeNewUser()` - Set up all defaults
- `clearAllUserData()` - Clean logout
- `generateId()` - Unique ID generation

---

## 📋 Implementation Roadmap

### Phase 2: Authentication & User Management (NEXT)

**Tasks:**
1. Create simple auth system (username/password localStorage MVP)
2. Build login/signup pages
3. Session management & protected routes
4. User context provider (React Context)

**Files to Create:**
- `lib/user/auth.ts` - Auth utilities
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `contexts/UserContext.tsx` - Global user state

---

### Phase 3: Profile Pages & UI Components

**Tasks:**
1. Build main profile page with tabs
2. Create game history display
3. Build character library UI
4. Implement achievements showcase
5. Create settings panel

**Files to Create:**
- `app/profile/[username]/page.tsx` - Public profile
- `app/dashboard/page.tsx` - User dashboard
- `components/profile/ProfileHeader.tsx`
- `components/profile/GameHistoryTab.tsx`
- `components/profile/CharactersTab.tsx`
- `components/profile/AchievementsTab.tsx`
- `components/profile/SettingsTab.tsx`

---

### Phase 4: Game History Integration

**Tasks:**
1. Update Werewolf game to log history
2. Update TTRPG mode to log sessions
3. Auto-update stats after games
4. Trigger achievement checks

**Files to Modify:**
- `app/werewolf/page.tsx` - Add history logging
- `app/play/page.tsx` - Add TTRPG logging
- Create `lib/user/achievements-engine.ts` - Achievement checker

---

### Phase 5: Social Features

**Tasks:**
1. Friend list UI
2. Friend requests system
3. Private lobbies for friends
4. In-app messaging (basic)

**Files to Create:**
- `app/friends/page.tsx` - Friends list
- `components/social/FriendCard.tsx`
- `components/social/FriendRequestCard.tsx`
- `app/api/friends/route.ts` - Friend API

---

### Phase 6: Achievements System

**Tasks:**
1. Define achievement catalog
2. Build achievement checker engine
3. Create achievement showcase UI
4. Implement XP/leveling system

**Files to Create:**
- `lib/user/achievements-catalog.ts` - All achievements
- `lib/user/xp-system.ts` - XP calculation
- `components/achievements/AchievementCard.tsx`
- `components/achievements/ProgressBar.tsx`

---

### Phase 7: Marketplace Integration

**Tasks:**
1. Connect character sheets to marketplace
2. Creator profile pages
3. Item listing UI
4. Purchase/download system

**Files to Create:**
- `app/marketplace/page.tsx` - Browse marketplace
- `app/marketplace/create/page.tsx` - List item
- `app/marketplace/item/[id]/page.tsx` - Item detail
- `components/marketplace/ItemCard.tsx`

---

## 🎯 Quick Start: Next Implementation Steps

### Step 1: Create Simple Auth System

Create a basic authentication system using localStorage:

```bash
# Files to create:
1. lib/user/auth.ts
2. app/auth/login/page.tsx
3. app/auth/signup/page.tsx
4. contexts/UserContext.tsx
```

### Step 2: Build User Dashboard

Create the main logged-in homepage:

```bash
# Files to create:
1. app/dashboard/page.tsx
2. components/dashboard/QuickStats.tsx
3. components/dashboard/ContinueGame.tsx
```

### Step 3: Create Profile Page

Build the public profile view:

```bash
# Files to create:
1. app/profile/[username]/page.tsx
2. components/profile/ProfileHeader.tsx
3. components/profile/StatsOverview.tsx
```

---

## 📊 Data Flow Example

### User Registration Flow

```
1. User fills signup form (username, email, password)
   ↓
2. lib/user/auth.ts validates & creates User
   ↓
3. initializeNewUser(userId, username) creates:
   - UserProfile (default settings)
   - UserStats (all zeros)
   - TrustScore (Bronze, 50/100)
   - UserSettings (public defaults)
   ↓
4. currentUserStorage.set(user) logs them in
   ↓
5. Redirect to /dashboard
```

### Game Completion Flow

```
1. Werewolf game ends with victory
   ↓
2. Create GameHistoryEntry:
   {
     gameType: 'Werewolf',
     role: 'Seer',
     outcome: 'Victory',
     xpGained: 30,
     stats: { votesCorrect: 3, survived: true }
   }
   ↓
3. gameHistoryStorage.add(entry)
   ↓
4. userStatsStorage.updateAfterGame(userId, 'Werewolf', true)
   ↓
5. Check achievements:
   - "First Win" → unlock if first
   - "Perfect Seer" → if found all werewolves
   - "Win Streak" → if 3 wins in a row
   ↓
6. Update XP:
   - currentUser.currentXP += 30
   - Check if leveled up
   - Trigger "Level Up" notification
```

---

## 🔧 Integration with Existing Systems

### Werewolf Integration Points

**In `app/werewolf/page.tsx`:**

```typescript
// On game start
const gameEntry: GameHistoryEntry = {
  id: generateId(),
  userId: currentUser.id,
  gameType: 'Werewolf',
  gameName: `Werewolf - ${gameState.villageName}`,
  startedAt: new Date(),
  endedAt: null,
  duration: 0,
  status: 'Ongoing',
  outcome: 'Ongoing',
  role: currentPlayer.role,
  // ...
};
gameHistoryStorage.add(gameEntry);

// On game end
gameHistoryStorage.update(userId, gameEntry.id, {
  endedAt: new Date(),
  duration: calculateDuration(),
  status: 'Completed',
  outcome: winner === playerTeam ? 'Victory' : 'Defeat',
  stats: {
    votesCorrect: calculateCorrectVotes(),
    survived: playerStatus === 'Alive',
    // ...
  },
  xpGained: winner === playerTeam ? 30 : 10,
});

userStatsStorage.updateAfterGame(userId, 'Werewolf', winner === playerTeam);
```

### TTRPG Integration Points

**In `app/play/page.tsx`:**

```typescript
// On session start
const sessionEntry: GameHistoryEntry = {
  id: generateId(),
  userId: currentUser.id,
  gameType: 'TTRPG',
  gameName: campaignName,
  characterId: character.id,
  sessionNumber: sessionCount + 1,
  // ...
};

// On session end
gameHistoryStorage.update(userId, sessionEntry.id, {
  stats: {
    encountersWon: combatLog.wins,
    criticalHits: combatLog.crits,
    xpGained: character.xpThisSession,
  },
  xpGained: 50 + (duration > 120 ? 50 : 0), // Bonus for long sessions
});
```

---

## 🎨 UI Component Hierarchy

```
App
├── AuthProvider (UserContext)
│   ├── Login/Signup Pages
│   └── Protected Routes
│       ├── Dashboard (logged in homepage)
│       │   ├── QuickStats
│       │   ├── ContinueGame
│       │   ├── FriendActivity
│       │   └── Notifications
│       ├── Profile Page
│       │   ├── ProfileHeader
│       │   ├── Tabs:
│       │   │   ├── Overview
│       │   │   ├── GameHistory
│       │   │   ├── Characters
│       │   │   ├── Achievements
│       │   │   └── Settings
│       ├── Friends Page
│       │   ├── FriendList
│       │   ├── FriendRequests
│       │   └── FindPlayers
│       └── Settings Page
│           ├── Privacy
│           ├── Notifications
│           └── Account
```

---

## 💡 Key Design Decisions

### 1. localStorage First, Supabase Later
**Why:** Faster MVP development, easy local testing
**Migration Path:** Storage utilities abstracted for easy swap

### 2. Flat Type Structure
**Why:** Easier to query, simpler to cache
**Tradeoff:** Some data duplication (e.g., stats in User and UserStats)

### 3. Separate Game History Table
**Why:** Supports multiple game types with different schemas
**Benefit:** Easy to add new game modes

### 4. Achievement Progress Tracking
**Why:** Allow incremental progress (not just unlocked/locked)
**UX:** Users see "18/25" progress bars

### 5. Privacy-First Design
**Why:** Users control visibility of all profile sections
**Default:** Public (but easy to change)

---

## 🚀 Deployment Checklist

### Before Launch:
- [ ] Migrate to Supabase for multi-device support
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add session expiration (7 days)
- [ ] Rate limit API endpoints
- [ ] Sanitize all user inputs
- [ ] Add CSRF protection
- [ ] Implement proper error handling
- [ ] Add analytics tracking
- [ ] Create backup/export system

### Post-Launch:
- [ ] Monitor storage usage
- [ ] Track achievement unlock rates
- [ ] A/B test XP rewards
- [ ] Gather feedback on friend system
- [ ] Optimize profile load times
- [ ] Add admin moderation tools

---

## 📚 Next Documentation to Create

1. **AUTH_SYSTEM.md** - Authentication architecture
2. **ACHIEVEMENT_CATALOG.md** - All achievements with unlock criteria
3. **XP_LEVELING_GUIDE.md** - XP sources, level perks, progression curve
4. **MARKETPLACE_GUIDE.md** - Creator onboarding, listing process
5. **PRIVACY_POLICY.md** - User data handling, GDPR compliance

---

## 🎉 What You Have Now

✅ **Comprehensive type system** covering all user profile features
✅ **Full storage layer** with 10+ storage modules
✅ **Type-safe operations** with TypeScript throughout
✅ **Easy Supabase migration** when ready to scale
✅ **Modular architecture** - each feature is independent
✅ **Game mode agnostic** - works with TTRPG, Werewolf, future modes

---

## 🛠️ Developer Quick Reference

### Common Operations

**Create New User:**
```typescript
import { currentUserStorage, initializeNewUser } from '@/lib/user/storage';

const newUser: User = {
  id: generateId(),
  email: 'user@example.com',
  username: 'PlayerName',
  level: 1,
  currentXP: 0,
  // ...
};

currentUserStorage.set(newUser);
initializeNewUser(newUser.id, newUser.username);
```

**Log Game:**
```typescript
import { gameHistoryStorage, userStatsStorage } from '@/lib/user/storage';

const gameEntry: GameHistoryEntry = {
  // ... game data
};

gameHistoryStorage.add(gameEntry);
userStatsStorage.updateAfterGame(userId, gameType, won);
```

**Check Achievement:**
```typescript
import { achievementsStorage } from '@/lib/user/storage';

achievementsStorage.updateProgress(
  userId,
  'first_win',
  1, // current value
  1  // target value
);
// Auto-unlocks when current >= target
```

---

**The foundation is solid. Ready to build the UI!** 🎮✨
