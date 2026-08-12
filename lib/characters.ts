export type Character = {
    id: string
    base: number
    hair: number // 0 = none
    outfit: number
    accessory: number // 0 = none
    createdAt: number
  }
  
  // TODO: replace these placeholder pixel-art files with your own art.
  // Keep the same file paths/count (or update the arrays below to match
  // however many options you end up with) — everything else just works.
  export const BASE_OPTIONS = [
    '/images/character/base/tone-1.png',
    '/images/character/base/tone-2.png',
    '/images/character/base/tone-3.png',
    '/images/character/base/tone-4.png',
  ]
  
  // Index 0 reserved for "no hair" — rendered as no layer at all.
  export const HAIR_OPTIONS = [
    null,
    '/images/character/hair/style-1.png',
    '/images/character/hair/style-2.png',
    '/images/character/hair/style-3.png',
    '/images/character/hair/style-4.png',
  ]
  
  export const OUTFIT_OPTIONS = [
    '/images/character/outfit/style-1.png',
    '/images/character/outfit/style-2.png',
    '/images/character/outfit/style-3.png',
    '/images/character/outfit/style-4.png',
  ]
  
  // Index 0 reserved for "no accessory".
  export const ACCESSORY_OPTIONS = [
    null,
    '/images/character/accessory/style-1.png',
    '/images/character/accessory/style-2.png',
    '/images/character/accessory/style-3.png',
  ]
  
  const STORAGE_KEY = 'jt-portfolio-characters'
  // Cap the collection so localStorage and the parade animation don't grow
  // unbounded — oldest characters drop off once this is exceeded.
  const MAX_CHARACTERS = 40
  
  export function loadCharacters(): Character[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  
  export function saveCharacter(character: Omit<Character, 'id' | 'createdAt'>): Character {
    const newCharacter: Character = {
      ...character,
      id: `char-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: Date.now(),
    }
    const existing = loadCharacters()
    const updated = [...existing, newCharacter].slice(-MAX_CHARACTERS)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // localStorage unavailable (private browsing, storage full, etc.) —
      // the character just won't persist, which is an acceptable fallback.
    }
    // Notify any mounted CharacterParade to re-read and show the new arrival
    // immediately, without needing a page reload.
    window.dispatchEvent(new Event('characters-updated'))
    return newCharacter
  }
  
  /** Permanently deletes every saved character for this visitor. */
  export function clearCharacters(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clean up if storage was never accessible.
    }
    window.dispatchEvent(new Event('characters-updated'))
  }