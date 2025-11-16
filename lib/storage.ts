import { Character } from '@/types/character';
import { GameSession } from '@/types/chat';

// LocalStorage keys
const KEYS = {
  CHARACTERS: 'ttrpg_characters',
  ACTIVE_CHARACTER: 'ttrpg_active_character',
  GAME_SESSION: 'ttrpg_game_session',
} as const;

// Character Storage
export const characterStorage = {
  getAll(): Character[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.CHARACTERS);
    return data ? JSON.parse(data) : [];
  },

  getById(id: string): Character | null {
    const characters = this.getAll();
    return characters.find(c => c.id === id) || null;
  },

  save(character: Character): void {
    const characters = this.getAll();
    const index = characters.findIndex(c => c.id === character.id);

    if (index >= 0) {
      characters[index] = character;
    } else {
      characters.push(character);
    }

    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(characters));
  },

  delete(id: string): void {
    const characters = this.getAll().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CHARACTERS, JSON.stringify(characters));
  },

  getActive(): Character | null {
    if (typeof window === 'undefined') return null;
    const id = localStorage.getItem(KEYS.ACTIVE_CHARACTER);
    return id ? this.getById(id) : null;
  },

  setActive(id: string): void {
    localStorage.setItem(KEYS.ACTIVE_CHARACTER, id);
  },
};

// Game Session Storage
export const sessionStorage = {
  get(): GameSession | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.GAME_SESSION);
    return data ? JSON.parse(data) : null;
  },

  save(session: GameSession): void {
    localStorage.setItem(KEYS.GAME_SESSION, JSON.stringify(session));
  },

  clear(): void {
    localStorage.removeItem(KEYS.GAME_SESSION);
  },
};
