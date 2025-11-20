/**
 * User Profile & Account System Type Definitions
 * Complete type system for user profiles, game history, achievements, and social features
 */

// ============================================================================
// USER IDENTITY & PROFILE
// ============================================================================

export interface User {
  id: string;
  email: string;
  username: string;                    // Unique, used for login and @mentions
  createdAt: Date;
  updatedAt: Date;

  // Subscription & Status
  subscriptionTier: 'Free' | 'Premium' | 'Pro';
  subscriptionExpiresAt?: Date;
  isEmailVerified: boolean;
  isBanned: boolean;

  // Gamification
  level: number;                       // 1-100
  currentXP: number;
  xpToNextLevel: number;

  // Privacy
  profileVisibility: 'Public' | 'Friends' | 'Private';

  // Metadata
  lastLoginAt: Date;
  totalPlayTime: number;               // minutes
}

export interface UserProfile {
  userId: string;

  // Display Identity
  displayName: string;                 // Can differ from username
  tagline: string;                     // "The Cunning Strategist"
  bio: string;                         // Longer description

  // Visual Identity
  avatar: string;                      // URL or data URI
  profileBanner?: string;
  avatarFrame?: string;                // Unlockable border

  // Customization
  preferredFaction?: string;           // "Horde", "Alliance", etc.
  preferredClass?: string;             // "Paladin", "Rogue"
  favoriteGameMode: 'TTRPG' | 'Werewolf' | 'All';

  // Badges & Titles
  activeBadge?: string;                // Achievement badge to display
  activeTitle?: string;                // "Master Tactician", "Dragonsbane"
  unlockedTitles: string[];
  unlockedBadges: string[];

  // Stats Display
  featuredAchievements: string[];      // Achievement IDs to showcase
  featuredCharacters: string[];        // Character IDs to showcase

  // Privacy Settings
  showGameHistory: boolean;
  showCharacters: boolean;
  showAchievements: boolean;
  showFriends: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;

  // Social
  friendCount: number;
  followerCount: number;
  followingCount: number;

  updatedAt: Date;
}

export interface UserStats {
  userId: string;

  // Overall Stats
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalGamesLost: number;
  winRate: number;                     // 0-100

  // TTRPG Stats
  ttrpgSessionsPlayed: number;
  ttrpgCampaignsCompleted: number;
  ttrpgCampaignsActive: number;
  ttrpgTotalXP: number;
  ttrpgTotalGold: number;

  // Werewolf Stats
  werewolfGamesPlayed: number;
  werewolfWins: number;
  werewolfLosses: number;
  werewolfWinRate: number;
  werewolfFavoriteRole?: string;
  werewolfBestRole?: string;           // Highest win rate

  // Social Stats
  gamesWithFriends: number;
  friendsReferred: number;

  // Marketplace Stats (if creator)
  itemsListed: number;
  totalSales: number;
  totalRevenue: number;
  totalDownloads: number;
  averageRating: number;

  // Achievements
  achievementsUnlocked: number;
  achievementsTotal: number;
  achievementCompletionRate: number;   // 0-100

  updatedAt: Date;
}

// ============================================================================
// GAME HISTORY
// ============================================================================

export type GameType = 'TTRPG' | 'Werewolf' | 'Custom';
export type GameOutcome = 'Victory' | 'Defeat' | 'Draw' | 'Abandoned' | 'Ongoing';

export interface GameHistoryEntry {
  // Core Identifiers
  id: string;
  userId: string;
  gameType: GameType;
  gameName: string;                    // "Lost Mines of Phandelver" or "Werewolf - Ravencrest"
  gameSessionId?: string;              // Link to actual game session data

  // Timestamps
  startedAt: Date;
  endedAt: Date | null;                // Null if ongoing
  duration: number;                    // minutes

  // Outcome
  status: 'Completed' | 'Ongoing' | 'Abandoned';
  outcome: GameOutcome;

  // Role/Character
  role: string;                        // "Seer", "Paladin Level 5", "Werewolf"
  characterId?: string;                // Link to character sheet (if applicable)
  characterName?: string;

  // Session Details
  sessionNumber?: number;              // For multi-session campaigns
  totalSessions?: number;              // Expected total sessions
  partyMembers: PartyMember[];
  dmId?: string;                       // DM player ID (or "AI")
  dmName?: string;

  // Performance Tracking
  stats: GameSessionStats;

  // XP & Rewards
  xpGained: number;
  goldGained?: number;
  itemsGained?: string[];

  // Metadata
  tags: string[];                      // ["beginner-friendly", "pvp", "AI-narrated"]
  notes: string;                       // Player's private notes
  isPublic: boolean;                   // Show on public profile?
  isFeatured: boolean;                 // Pin to top of profile

  // Media
  thumbnail?: string;                  // Screenshot or auto-generated image
  screenshots?: string[];
  replayAvailable: boolean;
  replayData?: string;                 // JSON replay data

  createdAt: Date;
  updatedAt: Date;
}

export interface PartyMember {
  id: string;
  name: string;
  role: string;                        // Character class or game role
  isAI: boolean;
}

export interface GameSessionStats {
  // TTRPG Stats
  encountersWon?: number;
  encountersFled?: number;
  encountersLost?: number;
  criticalHits?: number;
  criticalFails?: number;
  damageDealt?: number;
  damageTaken?: number;
  healingDone?: number;
  spellsCast?: number;

  // Werewolf Stats
  votesCorrect?: number;               // Voted for actual werewolf
  votesIncorrect?: number;             // Voted for innocent
  survived?: boolean;
  eliminatedOnDay?: number;
  rolesIdentified?: number;            // For Seer
  livesProtected?: number;             // For Doctor
  killsAsWerewolf?: number;
  bluffRating?: number;                // 0-10
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export type AchievementCategory =
  | 'Combat'
  | 'Social'
  | 'Exploration'
  | 'Meta'
  | 'Marketplace'
  | 'Werewolf'
  | 'TTRPG';

export type AchievementRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;

  // Visual
  icon: string;                        // Emoji or image URL
  badge?: string;                      // Special badge icon

  // Unlock Criteria
  requirements: AchievementRequirement[];
  hidden: boolean;                     // Don't show until unlocked

  // Rewards
  xpReward: number;
  title?: string;                      // Unlocks title for profile
  cosmetic?: string;                   // Avatar frame, badge, etc.

  // Metadata
  order: number;                       // Display order
  isSecret: boolean;                   // Easter egg achievements
}

export interface AchievementRequirement {
  type: 'GameCount' | 'WinStreak' | 'RoleMastery' | 'SocialAction' | 'Custom';
  description: string;
  target: number;
  metric: string;                      // What to track (e.g., "werewolf_wins")
}

export interface UserAchievement {
  userId: string;
  achievementId: string;

  // Progress
  progress: number;                    // 0-100
  currentValue: number;                // Current metric value
  targetValue: number;                 // Target to unlock
  unlocked: boolean;

  // Timestamps
  startedAt: Date;
  unlockedAt?: Date;

  // Showcase
  isFeatured: boolean;                 // Show on profile
}

// ============================================================================
// FRIENDS & SOCIAL
// ============================================================================

export type FriendshipStatus = 'Pending' | 'Accepted' | 'Blocked' | 'Declined';

export interface Friendship {
  id: string;
  userId: string;                      // User who initiated
  friendId: string;                    // User who received request
  status: FriendshipStatus;

  // Optional Metadata
  nickname?: string;                   // Custom nickname for friend
  tags: string[];                      // ["Good DM", "Likes Werewolf"]
  notes?: string;                      // Private notes

  // Activity
  lastPlayedTogether?: Date;
  gamesPlayedTogether: number;
  favoriteModes: GameType[];

  createdAt: Date;
  updatedAt: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;                    // Optional intro message
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: Date;
  expiresAt: Date;                     // Auto-decline after 30 days
}

// ============================================================================
// TRUST & REPUTATION
// ============================================================================

export type TrustLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface TrustScore {
  userId: string;

  // Overall Score
  trustScore: number;                  // 0-100
  level: TrustLevel;

  // Components
  gamesCompleted: number;              // Didn't abandon mid-game
  positiveReviews: number;             // From other players
  negativeReviews: number;
  reportsReceived: number;             // Behavior reports

  // DM-Specific (if applicable)
  isDM: boolean;
  dmRating: number;                    // 0-5 stars
  dmGamesHosted: number;

  // Marketplace (if applicable)
  isCreator: boolean;
  sellerRating: number;
  itemsSold: number;

  // Vouch System
  vouchedBy: string[];                 // User IDs who vouch
  vouchCount: number;

  // Penalties
  warnings: number;
  suspensions: number;

  updatedAt: Date;
}

export interface PlayerReview {
  id: string;
  reviewerId: string;                  // Who left the review
  reviewedUserId: string;              // Who is being reviewed
  gameId: string;                      // Which game session

  rating: number;                      // 1-5 stars
  tags: string[];                      // ["Helpful", "Good RP", "Toxic", etc.]
  comment?: string;

  isPublic: boolean;
  helpful: number;                     // Upvotes

  createdAt: Date;
}

// ============================================================================
// MARKETPLACE PROFILE
// ============================================================================

export interface MarketplaceProfile {
  userId: string;

  // Creator Info
  creatorName: string;
  creatorBio: string;
  specialties: string[];               // ["Character Sheets", "Maps", "AI Prompts"]

  // Stats
  itemsListed: number;
  itemsSold: number;
  totalSales: number;
  totalRevenue: number;                // USD
  totalDownloads: number;              // Free + paid

  // Ratings
  averageRating: number;               // 0-5 stars
  totalReviews: number;

  // Featured Items
  featuredItems: string[];             // Item IDs

  // Badges
  badges: CreatorBadge[];

  // Social
  followers: number;
  profileViews: number;

  // Status
  isVerified: boolean;
  isFeatured: boolean;                 // Platform-featured creator

  createdAt: Date;
  updatedAt: Date;
}

export interface CreatorBadge {
  id: string;
  name: string;                        // "Bestseller", "Top Rated", "Verified Creator"
  icon: string;
  description: string;
  earnedAt: Date;
}

export interface MarketplaceItem {
  id: string;
  creatorId: string;

  // Item Details
  type: 'Character' | 'Map' | 'Campaign' | 'AIPrompt' | 'Asset' | 'Template';
  name: string;
  description: string;
  longDescription?: string;

  // Pricing
  price: number;                       // 0 = free
  currency: 'USD' | 'Credits';
  discount?: {
    percentage: number;
    expiresAt: Date;
  };

  // Content
  fileURL: string;
  previewImages: string[];
  demoAvailable: boolean;
  demoURL?: string;

  // Metadata
  gameSystem?: string;                 // "D&D 5e", "Pathfinder"
  tags: string[];
  category: string;

  // Stats
  downloads: number;
  sales: number;
  views: number;
  rating: number;
  reviewCount: number;

  // Publishing
  status: 'Draft' | 'Published' | 'Unlisted' | 'Archived';
  publishedAt?: Date;
  updatedAt: Date;
  version: string;

  // Licensing
  license: 'Personal' | 'Commercial' | 'Attribution' | 'Custom';
  licenseDetails?: string;

  // Featured
  isFeatured: boolean;
  featuredUntil?: Date;
}

export interface MarketplaceReview {
  id: string;
  itemId: string;
  userId: string;
  username: string;

  rating: number;                      // 1-5 stars
  title?: string;
  comment: string;

  // Verification
  isPurchased: boolean;                // Verified purchase
  isVerified: boolean;

  // Engagement
  helpful: number;                     // Upvotes
  notHelpful: number;                  // Downvotes

  // Response
  creatorResponse?: {
    comment: string;
    respondedAt: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type NotificationType =
  | 'FriendRequest'
  | 'GameInvite'
  | 'AchievementUnlocked'
  | 'LevelUp'
  | 'MarketplaceSale'
  | 'Review'
  | 'Message'
  | 'System';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;

  title: string;
  message: string;

  // Action
  actionURL?: string;
  actionText?: string;

  // Metadata
  relatedUserId?: string;
  relatedItemId?: string;

  // Status
  isRead: boolean;
  readAt?: Date;

  createdAt: Date;
  expiresAt?: Date;
}

// ============================================================================
// USER PREFERENCES & SETTINGS
// ============================================================================

export interface UserSettings {
  userId: string;

  // Privacy
  profileVisibility: 'Public' | 'Friends' | 'Private';
  showOnlineStatus: boolean;
  showGameActivity: boolean;
  showGameHistory: boolean;
  showCharacters: boolean;
  showAchievements: boolean;
  showMarketplace: boolean;

  // Communication
  allowFriendRequests: boolean;
  allowMessages: boolean;
  allowGameInvites: boolean;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationPreferences: {
    friendRequests: boolean;
    gameInvites: boolean;
    achievements: boolean;
    marketplace: boolean;
    messages: boolean;
  };

  // Gameplay
  autoSaveCharacters: boolean;
  defaultDifficulty: 'Easy' | 'Normal' | 'Hard';
  preferredAIDifficulty: 'Beginner' | 'Intermediate' | 'Expert';

  // Accessibility
  fontSize: 'Small' | 'Medium' | 'Large';
  highContrast: boolean;
  reduceAnimations: boolean;

  updatedAt: Date;
}

// ============================================================================
// SESSION & ACTIVITY
// ============================================================================

export interface UserSession {
  id: string;
  userId: string;

  // Session Info
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser?: string;
  ipAddress?: string;
  location?: string;

  // Timestamps
  startedAt: Date;
  lastActiveAt: Date;
  endedAt?: Date;

  // Activity
  pagesVisited: number;
  actionsPerformed: number;
}

export interface UserActivity {
  userId: string;
  activityType: 'Login' | 'GameStart' | 'GameEnd' | 'Purchase' | 'Profile Edit' | 'Custom';
  activityData: Record<string, unknown>;
  timestamp: Date;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchFilters {
  query?: string;
  gameType?: GameType;
  dateFrom?: Date;
  dateTo?: Date;
  outcome?: GameOutcome;
  tags?: string[];
}
