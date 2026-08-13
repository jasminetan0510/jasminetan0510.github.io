export type BaseGender = 'female' | 'male'

export type Character = {
  id: string
  base: BaseGender
  hair: number // index into HAIR_STYLES
  shirtColor: string // hex
  eyeColor: string // hex
  createdAt: number
}

export const HAIR_STYLES = [
  { label: 'Waves' },
  { label: 'Bob' },
  { label: 'Ponytail' },
  { label: 'Short crop' },
] as const

export const SHIRT_COLORS = [
  '#f2a6a6', // rose
  '#a8c8f0', // sky
  '#f4dd9a', // butter
  '#b6e0b6', // mint
  '#d6b6ec', // lilac
  '#2e2e2e', // charcoal
] as const

export const EYE_COLORS = [
  '#4a3423', // brown
  '#2f5d8a', // blue
  '#3c7a4f', // green
  '#6b4a8a', // violet
  '#1c1c1c', // black
] as const

// Default hair pick per base — still fully changeable afterward, this
// just seeds a sensible starting point.
export const DEFAULT_HAIR_BY_BASE: Record<BaseGender, number> = {
  female: 0, // Waves
  male: 3, // Short crop
}

const STORAGE_KEY = 'jt-portfolio-characters-v2'
// Cap the collection so localStorage and the footer layout don't grow
// unbounded — oldest characters drop off once this is exceeded.
const MAX_CHARACTERS = 40

function isValidCharacter(value: unknown): value is Character {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return (
    typeof c.id === 'string' &&
    (c.base === 'female' || c.base === 'male') &&
    typeof c.hair === 'number' &&
    c.hair >= 0 &&
    c.hair < HAIR_STYLES.length &&
    typeof c.shirtColor === 'string' &&
    typeof c.eyeColor === 'string'
  )
}

export function loadCharacters(): Character[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidCharacter)
  } catch {
    return []
  }
}

function persist(characters: Character[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — the
    // character just won't persist across reloads, which is fine.
  }
  window.dispatchEvent(new Event('characters-updated'))
}

export function saveCharacter(
  data: Omit<Character, 'id' | 'createdAt'>,
): Character {
  const character: Character = {
    ...data,
    id: `char-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    createdAt: Date.now(),
  }
  const updated = [...loadCharacters(), character].slice(-MAX_CHARACTERS)
  persist(updated)
  return character
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