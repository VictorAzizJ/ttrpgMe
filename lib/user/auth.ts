/**
 * Authentication System
 * Simple username/password authentication using localStorage
 * Ready for migration to Supabase Auth later
 */

import type { User } from '@/types/user';
import { currentUserStorage, initializeNewUser, generateId } from './storage';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  email: string;
  displayName?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const AUTH_STORAGE_KEY = 'auth_users';
const SESSIONS_STORAGE_KEY = 'auth_sessions';

// ============================================================================
// PASSWORD HASHING (Simple for MVP)
// ============================================================================

/**
 * Simple hash function for passwords (MVP only)
 * In production, use bcrypt on backend
 */
function hashPassword(password: string): string {
  // Simple hash for localStorage MVP
  // In production: use bcrypt server-side
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Verify password against hash
 */
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ============================================================================
// USER DATABASE (localStorage)
// ============================================================================

interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

/**
 * Get all users from storage
 */
function getAllUsers(): StoredUser[] {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save users to storage
 */
function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Find user by username
 */
function findUserByUsername(username: string): StoredUser | null {
  const users = getAllUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

/**
 * Find user by email
 */
function findUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find user by ID
 */
function findUserById(id: string): StoredUser | null {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<AuthResult> {
  // Validation
  if (!data.username || data.username.length < 3) {
    return {
      success: false,
      error: 'Username must be at least 3 characters',
    };
  }

  if (!data.email || !data.email.includes('@')) {
    return {
      success: false,
      error: 'Valid email is required',
    };
  }

  if (!data.password || data.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters',
    };
  }

  // Check if username already exists
  if (findUserByUsername(data.username)) {
    return {
      success: false,
      error: 'Username already taken',
    };
  }

  // Check if email already exists
  if (findUserByEmail(data.email)) {
    return {
      success: false,
      error: 'Email already registered',
    };
  }

  // Create new user
  const userId = generateId();
  const storedUser: StoredUser = {
    id: userId,
    username: data.username,
    email: data.email,
    passwordHash: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  };

  // Save to auth storage
  const users = getAllUsers();
  users.push(storedUser);
  saveUsers(users);

  // Create full User object
  const user: User = {
    id: userId,
    email: data.email,
    username: data.username,
    createdAt: new Date(),
    updatedAt: new Date(),
    subscriptionTier: 'Free',
    isEmailVerified: false,
    isBanned: false,
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    profileVisibility: 'Public',
    lastLoginAt: new Date(),
    totalPlayTime: 0,
  };

  // Initialize all user data (profile, stats, etc.)
  initializeNewUser(userId, data.username);

  // Auto-login
  currentUserStorage.set(user);

  // Create session
  createSession(userId);

  return {
    success: true,
    user,
  };
}

/**
 * Log in an existing user
 */
export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  // Validation
  if (!credentials.username || !credentials.password) {
    return {
      success: false,
      error: 'Username and password are required',
    };
  }

  // Find user
  const storedUser = findUserByUsername(credentials.username);
  if (!storedUser) {
    return {
      success: false,
      error: 'Invalid username or password',
    };
  }

  // Verify password
  if (!verifyPassword(credentials.password, storedUser.passwordHash)) {
    return {
      success: false,
      error: 'Invalid username or password',
    };
  }

  // Check if banned
  // (In future, add ban checking logic)

  // Create full User object
  const user: User = {
    id: storedUser.id,
    email: storedUser.email,
    username: storedUser.username,
    createdAt: new Date(storedUser.createdAt),
    updatedAt: new Date(),
    subscriptionTier: 'Free',
    isEmailVerified: false,
    isBanned: false,
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    profileVisibility: 'Public',
    lastLoginAt: new Date(),
    totalPlayTime: 0,
  };

  // Set as current user
  currentUserStorage.set(user);

  // Create session
  createSession(user.id);

  return {
    success: true,
    user,
  };
}

/**
 * Log out current user
 */
export function logout(): void {
  const currentUser = currentUserStorage.get();
  if (currentUser) {
    endSession(currentUser.id);
  }
  currentUserStorage.clear();
}

/**
 * Get currently logged-in user
 */
export function getCurrentUser(): User | null {
  return currentUserStorage.get();
}

/**
 * Check if user is logged in
 */
export function isAuthenticated(): boolean {
  return currentUserStorage.isLoggedIn();
}

/**
 * Update current user's password
 */
export function updatePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): AuthResult {
  const storedUser = findUserById(userId);
  if (!storedUser) {
    return {
      success: false,
      error: 'User not found',
    };
  }

  // Verify current password
  if (!verifyPassword(currentPassword, storedUser.passwordHash)) {
    return {
      success: false,
      error: 'Current password is incorrect',
    };
  }

  // Validate new password
  if (newPassword.length < 6) {
    return {
      success: false,
      error: 'New password must be at least 6 characters',
    };
  }

  // Update password
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    users[index].passwordHash = hashPassword(newPassword);
    saveUsers(users);
  }

  return {
    success: true,
  };
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

interface Session {
  userId: string;
  createdAt: string;
  expiresAt: string;
}

/**
 * Create a new session
 */
function createSession(userId: string): void {
  const session: Session = {
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };

  localStorage.setItem(`${SESSIONS_STORAGE_KEY}_${userId}`, JSON.stringify(session));
}

/**
 * End a session
 */
function endSession(userId: string): void {
  localStorage.removeItem(`${SESSIONS_STORAGE_KEY}_${userId}`);
}

/**
 * Check if session is valid
 */
export function isSessionValid(userId: string): boolean {
  const data = localStorage.getItem(`${SESSIONS_STORAGE_KEY}_${userId}`);
  if (!data) return false;

  try {
    const session: Session = JSON.parse(data);
    const expiresAt = new Date(session.expiresAt);
    return expiresAt > new Date();
  } catch {
    return false;
  }
}

/**
 * Restore session on app load
 */
export function restoreSession(): User | null {
  const currentUser = currentUserStorage.get();
  if (!currentUser) return null;

  // Check if session is still valid
  if (!isSessionValid(currentUser.id)) {
    logout();
    return null;
  }

  return currentUser;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get user by username (for profile viewing)
 */
export function getUserByUsername(username: string): User | null {
  const storedUser = findUserByUsername(username);
  if (!storedUser) return null;

  return {
    id: storedUser.id,
    email: storedUser.email,
    username: storedUser.username,
    createdAt: new Date(storedUser.createdAt),
    updatedAt: new Date(),
    subscriptionTier: 'Free',
    isEmailVerified: false,
    isBanned: false,
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    profileVisibility: 'Public',
    lastLoginAt: new Date(),
    totalPlayTime: 0,
  };
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, hyphens, and underscores',
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Validate password format
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  if (password.length > 100) {
    return { valid: false, error: 'Password is too long' };
  }

  return { valid: true };
}
