/**
 * User Profile Storage Utilities
 * Handles localStorage persistence for user profiles, game history, achievements, and social features
 * Designed to be easily migrated to Supabase later
 */

import type {
  User,
  UserProfile,
  UserStats,
  GameHistoryEntry,
  UserAchievement,
  Friendship,
  FriendRequest,
  TrustScore,
  MarketplaceProfile,
  Notification,
  UserSettings,
} from '@/types/user';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  // Core User Data
  CURRENT_USER: 'user_current',
  USER_PROFILE: 'user_profile',
  USER_STATS: 'user_stats',
  USER_SETTINGS: 'user_settings',

  // Game Data
  GAME_HISTORY: 'user_game_history',

  // Achievements
  USER_ACHIEVEMENTS: 'user_achievements',
  ACHIEVEMENT_PROGRESS: 'achievement_progress',

  // Social
  FRIENDSHIPS: 'user_friendships',
  FRIEND_REQUESTS: 'user_friend_requests',
  TRUST_SCORE: 'user_trust_score',

  // Marketplace
  MARKETPLACE_PROFILE: 'user_marketplace_profile',

  // Notifications
  NOTIFICATIONS: 'user_notifications',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function safeJSONParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// ============================================================================
// CURRENT USER STORAGE
// ============================================================================

export const currentUserStorage = {
  /**
   * Get the currently logged-in user
   */
  get(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return safeJSONParse(data, null);
  },

  /**
   * Set the current user (login)
   */
  set(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  /**
   * Clear current user (logout)
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.get() !== null;
  },

  /**
   * Update current user fields
   */
  update(updates: Partial<User>): void {
    const current = this.get();
    if (current) {
      this.set({ ...current, ...updates, updatedAt: new Date() });
    }
  },
};

// ============================================================================
// USER PROFILE STORAGE
// ============================================================================

export const userProfileStorage = {
  /**
   * Get user profile by user ID
   */
  get(userId: string): UserProfile | null {
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`);
    return safeJSONParse(data, null);
  },

  /**
   * Save or update user profile
   */
  save(profile: UserProfile): void {
    const updated = { ...profile, updatedAt: new Date() };
    localStorage.setItem(
      `${STORAGE_KEYS.USER_PROFILE}_${profile.userId}`,
      JSON.stringify(updated)
    );
  },

  /**
   * Create default profile for new user
   */
  createDefault(userId: string, username: string): UserProfile {
    const defaultProfile: UserProfile = {
      userId,
      displayName: username,
      tagline: '',
      bio: '',
      avatar: '',
      favoriteGameMode: 'All',
      unlockedTitles: [],
      unlockedBadges: [],
      featuredAchievements: [],
      featuredCharacters: [],
      showGameHistory: true,
      showCharacters: true,
      showAchievements: true,
      showFriends: true,
      allowFriendRequests: true,
      allowMessages: true,
      friendCount: 0,
      followerCount: 0,
      followingCount: 0,
      updatedAt: new Date(),
    };

    this.save(defaultProfile);
    return defaultProfile;
  },

  /**
   * Update profile fields
   */
  update(userId: string, updates: Partial<UserProfile>): void {
    const profile = this.get(userId);
    if (profile) {
      this.save({ ...profile, ...updates });
    }
  },
};

// ============================================================================
// USER STATS STORAGE
// ============================================================================

export const userStatsStorage = {
  /**
   * Get user stats
   */
  get(userId: string): UserStats | null {
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_STATS}_${userId}`);
    return safeJSONParse(data, null);
  },

  /**
   * Save user stats
   */
  save(stats: UserStats): void {
    const updated = { ...stats, updatedAt: new Date() };
    localStorage.setItem(
      `${STORAGE_KEYS.USER_STATS}_${stats.userId}`,
      JSON.stringify(updated)
    );
  },

  /**
   * Create default stats for new user
   */
  createDefault(userId: string): UserStats {
    const defaultStats: UserStats = {
      userId,
      totalGamesPlayed: 0,
      totalGamesWon: 0,
      totalGamesLost: 0,
      winRate: 0,
      ttrpgSessionsPlayed: 0,
      ttrpgCampaignsCompleted: 0,
      ttrpgCampaignsActive: 0,
      ttrpgTotalXP: 0,
      ttrpgTotalGold: 0,
      werewolfGamesPlayed: 0,
      werewolfWins: 0,
      werewolfLosses: 0,
      werewolfWinRate: 0,
      gamesWithFriends: 0,
      friendsReferred: 0,
      itemsListed: 0,
      totalSales: 0,
      totalRevenue: 0,
      totalDownloads: 0,
      averageRating: 0,
      achievementsUnlocked: 0,
      achievementsTotal: 100,
      achievementCompletionRate: 0,
      updatedAt: new Date(),
    };

    this.save(defaultStats);
    return defaultStats;
  },

  /**
   * Update stats after a game
   */
  updateAfterGame(
    userId: string,
    gameType: 'TTRPG' | 'Werewolf',
    won: boolean
  ): void {
    const stats = this.get(userId);
    if (!stats) return;

    const updated = { ...stats };
    updated.totalGamesPlayed++;

    if (won) {
      updated.totalGamesWon++;
    } else {
      updated.totalGamesLost++;
    }

    updated.winRate =
      (updated.totalGamesWon / updated.totalGamesPlayed) * 100;

    if (gameType === 'TTRPG') {
      updated.ttrpgSessionsPlayed++;
    } else if (gameType === 'Werewolf') {
      updated.werewolfGamesPlayed++;
      if (won) {
        updated.werewolfWins++;
      } else {
        updated.werewolfLosses++;
      }
      updated.werewolfWinRate =
        (updated.werewolfWins / updated.werewolfGamesPlayed) * 100;
    }

    this.save(updated);
  },
};

// ============================================================================
// GAME HISTORY STORAGE
// ============================================================================

export const gameHistoryStorage = {
  /**
   * Get all game history for a user
   */
  getAll(userId: string): GameHistoryEntry[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.GAME_HISTORY}_${userId}`);
    return safeJSONParse(data, []);
  },

  /**
   * Get a specific game entry
   */
  getById(userId: string, gameId: string): GameHistoryEntry | null {
    const history = this.getAll(userId);
    return history.find((entry) => entry.id === gameId) || null;
  },

  /**
   * Add a new game to history
   */
  add(entry: GameHistoryEntry): void {
    const history = this.getAll(entry.userId);
    history.unshift(entry); // Add to beginning (most recent first)

    // Keep last 100 games
    const limited = history.slice(0, 100);

    localStorage.setItem(
      `${STORAGE_KEYS.GAME_HISTORY}_${entry.userId}`,
      JSON.stringify(limited)
    );
  },

  /**
   * Update an existing game entry
   */
  update(userId: string, gameId: string, updates: Partial<GameHistoryEntry>): void {
    const history = this.getAll(userId);
    const index = history.findIndex((entry) => entry.id === gameId);

    if (index >= 0) {
      history[index] = { ...history[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(
        `${STORAGE_KEYS.GAME_HISTORY}_${userId}`,
        JSON.stringify(history)
      );
    }
  },

  /**
   * Delete a game entry
   */
  delete(userId: string, gameId: string): void {
    const history = this.getAll(userId);
    const filtered = history.filter((entry) => entry.id !== gameId);
    localStorage.setItem(
      `${STORAGE_KEYS.GAME_HISTORY}_${userId}`,
      JSON.stringify(filtered)
    );
  },

  /**
   * Get game history with filters
   */
  getFiltered(
    userId: string,
    filters: {
      gameType?: 'TTRPG' | 'Werewolf';
      dateFrom?: Date;
      dateTo?: Date;
      outcome?: string;
    }
  ): GameHistoryEntry[] {
    let history = this.getAll(userId);

    if (filters.gameType) {
      history = history.filter((entry) => entry.gameType === filters.gameType);
    }

    if (filters.dateFrom) {
      history = history.filter(
        (entry) => new Date(entry.startedAt) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      history = history.filter(
        (entry) => new Date(entry.startedAt) <= filters.dateTo!
      );
    }

    if (filters.outcome) {
      history = history.filter((entry) => entry.outcome === filters.outcome);
    }

    return history;
  },

  /**
   * Get summary stats from game history
   */
  getSummary(userId: string): {
    totalGames: number;
    ttrpgGames: number;
    werewolfGames: number;
    winRate: number;
    hoursPlayed: number;
  } {
    const history = this.getAll(userId);

    const totalGames = history.length;
    const ttrpgGames = history.filter((e) => e.gameType === 'TTRPG').length;
    const werewolfGames = history.filter((e) => e.gameType === 'Werewolf').length;

    const wins = history.filter((e) => e.outcome === 'Victory').length;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    const hoursPlayed = history.reduce((sum, e) => sum + e.duration, 0) / 60;

    return { totalGames, ttrpgGames, werewolfGames, winRate, hoursPlayed };
  },
};

// ============================================================================
// ACHIEVEMENTS STORAGE
// ============================================================================

export const achievementsStorage = {
  /**
   * Get all user achievements
   */
  getAll(userId: string): UserAchievement[] {
    const data = localStorage.getItem(
      `${STORAGE_KEYS.USER_ACHIEVEMENTS}_${userId}`
    );
    return safeJSONParse(data, []);
  },

  /**
   * Get a specific achievement
   */
  get(userId: string, achievementId: string): UserAchievement | null {
    const achievements = this.getAll(userId);
    return (
      achievements.find((a) => a.achievementId === achievementId) || null
    );
  },

  /**
   * Save or update an achievement
   */
  save(achievement: UserAchievement): void {
    const achievements = this.getAll(achievement.userId);
    const index = achievements.findIndex(
      (a) => a.achievementId === achievement.achievementId
    );

    if (index >= 0) {
      achievements[index] = achievement;
    } else {
      achievements.push(achievement);
    }

    localStorage.setItem(
      `${STORAGE_KEYS.USER_ACHIEVEMENTS}_${achievement.userId}`,
      JSON.stringify(achievements)
    );
  },

  /**
   * Unlock an achievement
   */
  unlock(userId: string, achievementId: string): void {
    const achievement = this.get(userId, achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.progress = 100;
      achievement.unlockedAt = new Date();
      this.save(achievement);
    }
  },

  /**
   * Update achievement progress
   */
  updateProgress(
    userId: string,
    achievementId: string,
    currentValue: number,
    targetValue: number
  ): void {
    let achievement = this.get(userId, achievementId);

    if (!achievement) {
      // Create new achievement progress
      achievement = {
        userId,
        achievementId,
        progress: 0,
        currentValue: 0,
        targetValue,
        unlocked: false,
        startedAt: new Date(),
        isFeatured: false,
      };
    }

    achievement.currentValue = currentValue;
    achievement.targetValue = targetValue;
    achievement.progress = Math.min((currentValue / targetValue) * 100, 100);

    // Auto-unlock if reached target
    if (currentValue >= targetValue && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
    }

    this.save(achievement);
  },

  /**
   * Get unlocked achievements
   */
  getUnlocked(userId: string): UserAchievement[] {
    return this.getAll(userId).filter((a) => a.unlocked);
  },

  /**
   * Get in-progress achievements
   */
  getInProgress(userId: string): UserAchievement[] {
    return this.getAll(userId).filter((a) => !a.unlocked && a.progress > 0);
  },
};

// ============================================================================
// FRIENDS STORAGE
// ============================================================================

export const friendsStorage = {
  /**
   * Get all friendships for a user
   */
  getAll(userId: string): Friendship[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.FRIENDSHIPS}_${userId}`);
    return safeJSONParse(data, []);
  },

  /**
   * Get accepted friends
   */
  getFriends(userId: string): Friendship[] {
    return this.getAll(userId).filter((f) => f.status === 'Accepted');
  },

  /**
   * Add or update friendship
   */
  save(friendship: Friendship): void {
    const friendships = this.getAll(friendship.userId);
    const index = friendships.findIndex((f) => f.id === friendship.id);

    if (index >= 0) {
      friendships[index] = friendship;
    } else {
      friendships.push(friendship);
    }

    localStorage.setItem(
      `${STORAGE_KEYS.FRIENDSHIPS}_${friendship.userId}`,
      JSON.stringify(friendships)
    );
  },

  /**
   * Remove friendship
   */
  remove(userId: string, friendshipId: string): void {
    const friendships = this.getAll(userId);
    const filtered = friendships.filter((f) => f.id !== friendshipId);
    localStorage.setItem(
      `${STORAGE_KEYS.FRIENDSHIPS}_${userId}`,
      JSON.stringify(filtered)
    );
  },

  /**
   * Check if users are friends
   */
  areFriends(userId: string, otherUserId: string): boolean {
    const friendships = this.getFriends(userId);
    return friendships.some((f) => f.friendId === otherUserId);
  },
};

export const friendRequestsStorage = {
  /**
   * Get all friend requests for a user
   */
  getAll(userId: string): FriendRequest[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.FRIEND_REQUESTS}_${userId}`);
    return safeJSONParse(data, []);
  },

  /**
   * Get pending requests (received)
   */
  getPending(userId: string): FriendRequest[] {
    return this.getAll(userId).filter(
      (r) => r.toUserId === userId && r.status === 'Pending'
    );
  },

  /**
   * Add friend request
   */
  add(request: FriendRequest): void {
    const requests = this.getAll(request.toUserId);
    requests.push(request);
    localStorage.setItem(
      `${STORAGE_KEYS.FRIEND_REQUESTS}_${request.toUserId}`,
      JSON.stringify(requests)
    );
  },

  /**
   * Update request status
   */
  updateStatus(
    userId: string,
    requestId: string,
    status: 'Accepted' | 'Declined'
  ): void {
    const requests = this.getAll(userId);
    const index = requests.findIndex((r) => r.id === requestId);

    if (index >= 0) {
      requests[index].status = status;
      localStorage.setItem(
        `${STORAGE_KEYS.FRIEND_REQUESTS}_${userId}`,
        JSON.stringify(requests)
      );
    }
  },
};

// ============================================================================
// TRUST SCORE STORAGE
// ============================================================================

export const trustScoreStorage = {
  /**
   * Get trust score for a user
   */
  get(userId: string): TrustScore | null {
    const data = localStorage.getItem(`${STORAGE_KEYS.TRUST_SCORE}_${userId}`);
    return safeJSONParse(data, null);
  },

  /**
   * Save trust score
   */
  save(trustScore: TrustScore): void {
    localStorage.setItem(
      `${STORAGE_KEYS.TRUST_SCORE}_${trustScore.userId}`,
      JSON.stringify({ ...trustScore, updatedAt: new Date() })
    );
  },

  /**
   * Create default trust score
   */
  createDefault(userId: string): TrustScore {
    const defaultScore: TrustScore = {
      userId,
      trustScore: 50,
      level: 'Bronze',
      gamesCompleted: 0,
      positiveReviews: 0,
      negativeReviews: 0,
      reportsReceived: 0,
      isDM: false,
      dmRating: 0,
      dmGamesHosted: 0,
      isCreator: false,
      sellerRating: 0,
      itemsSold: 0,
      vouchedBy: [],
      vouchCount: 0,
      warnings: 0,
      suspensions: 0,
      updatedAt: new Date(),
    };

    this.save(defaultScore);
    return defaultScore;
  },
};

// ============================================================================
// NOTIFICATIONS STORAGE
// ============================================================================

export const notificationsStorage = {
  /**
   * Get all notifications for a user
   */
  getAll(userId: string): Notification[] {
    const data = localStorage.getItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`);
    return safeJSONParse(data, []);
  },

  /**
   * Get unread notifications
   */
  getUnread(userId: string): Notification[] {
    return this.getAll(userId).filter((n) => !n.isRead);
  },

  /**
   * Add notification
   */
  add(notification: Notification): void {
    const notifications = this.getAll(notification.userId);
    notifications.unshift(notification);

    // Keep last 50 notifications
    const limited = notifications.slice(0, 50);

    localStorage.setItem(
      `${STORAGE_KEYS.NOTIFICATIONS}_${notification.userId}`,
      JSON.stringify(limited)
    );
  },

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const notifications = this.getAll(userId);
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index >= 0) {
      notifications[index].isRead = true;
      notifications[index].readAt = new Date();
      localStorage.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`,
        JSON.stringify(notifications)
      );
    }
  },

  /**
   * Mark all as read
   */
  markAllAsRead(userId: string): void {
    const notifications = this.getAll(userId);
    const updated = notifications.map((n) => ({
      ...n,
      isRead: true,
      readAt: new Date(),
    }));
    localStorage.setItem(
      `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`,
      JSON.stringify(updated)
    );
  },
};

// ============================================================================
// USER SETTINGS STORAGE
// ============================================================================

export const userSettingsStorage = {
  /**
   * Get user settings
   */
  get(userId: string): UserSettings | null {
    const data = localStorage.getItem(`${STORAGE_KEYS.USER_SETTINGS}_${userId}`);
    return safeJSONParse(data, null);
  },

  /**
   * Save user settings
   */
  save(settings: UserSettings): void {
    localStorage.setItem(
      `${STORAGE_KEYS.USER_SETTINGS}_${settings.userId}`,
      JSON.stringify({ ...settings, updatedAt: new Date() })
    );
  },

  /**
   * Create default settings
   */
  createDefault(userId: string): UserSettings {
    const defaultSettings: UserSettings = {
      userId,
      profileVisibility: 'Public',
      showOnlineStatus: true,
      showGameActivity: true,
      showGameHistory: true,
      showCharacters: true,
      showAchievements: true,
      showMarketplace: true,
      allowFriendRequests: true,
      allowMessages: true,
      allowGameInvites: true,
      emailNotifications: true,
      pushNotifications: false,
      notificationPreferences: {
        friendRequests: true,
        gameInvites: true,
        achievements: true,
        marketplace: true,
        messages: true,
      },
      autoSaveCharacters: true,
      defaultDifficulty: 'Normal',
      preferredAIDifficulty: 'Intermediate',
      fontSize: 'Medium',
      highContrast: false,
      reduceAnimations: false,
      updatedAt: new Date(),
    };

    this.save(defaultSettings);
    return defaultSettings;
  },

  /**
   * Update settings
   */
  update(userId: string, updates: Partial<UserSettings>): void {
    const settings = this.get(userId);
    if (settings) {
      this.save({ ...settings, ...updates });
    }
  },
};

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export { generateId };

/**
 * Initialize all default data for a new user
 */
export function initializeNewUser(userId: string, username: string): void {
  userProfileStorage.createDefault(userId, username);
  userStatsStorage.createDefault(userId);
  trustScoreStorage.createDefault(userId);
  userSettingsStorage.createDefault(userId);
}

/**
 * Clear all user data (for testing/logout)
 */
export function clearAllUserData(userId: string): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(`${key}_${userId}`);
  });
}
