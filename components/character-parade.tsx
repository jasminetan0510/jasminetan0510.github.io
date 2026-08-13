'use client'

import { useEffect, useMemo, useState } from 'react'
import { CharacterAvatar, AVATAR_ASPECT } from '@/components/character-avatar'
import { loadCharacters, type Character } from '@/lib/characters'

const CHAR_SIZE = 64 // px — was 40, sized up per request
const CHAR_HEIGHT = CHAR_SIZE * AVATAR_ASPECT
const GAP = 22 // px — minimum breathing room between characters
const SLOT_WIDTH = CHAR_SIZE + GAP

// Deterministic-ish pseudo-random per seed, so layout and timing stay
// stable across re-renders instead of reshuffling on every render.
function hashToRange(seed: string, min: number, max: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000
  }
  const t = hash / 100000
  return min + t * (max - min)
}

type PlacedCharacter = Character & { left: number }

/**
 * Assigns each character a horizontal slot with guaranteed spacing.
 * Each character's id picks a *preferred* slot (so it doesn't jump around
 * between renders); if that slot's taken, it linear-probes forward to the
 * next free one. Slots are `SLOT_WIDTH` apart, so two characters can never
 * overlap regardless of how many are added.
 */
function placeCharacters(
  characters: Character[],
  containerWidth: number,
): PlacedCharacter[] {
  if (containerWidth <= 0) return []
  const totalSlots = Math.max(1, Math.floor(containerWidth / SLOT_WIDTH))
  const taken = new Set<number>()

  return characters.map((character) => {
    const preferred = Math.floor(hashToRange(character.id, 0, totalSlots))
    let slot = preferred
    let attempts = 0
    while (taken.has(slot) && attempts < totalSlots) {
      slot = (slot + 1) % totalSlots
      attempts++
    }
    taken.add(slot)
    return { ...character, left: slot * SLOT_WIDTH }
  })
}

function IdleCharacter({
  character,
  reducedMotion,
}: {
  character: PlacedCharacter
  reducedMotion: boolean
}) {
  // Each character hops at its own speed and on its own offset, so the
  // whole row doesn't bounce in unison — reads as more alive.
  const duration = hashToRange(character.id + 'dur', 1.6, 2.6)
  const delay = -hashToRange(character.id + 'delay', 0, duration)
  const hopHeight = hashToRange(character.id + 'hop', 6, 12)

  return (
    <div
      className="absolute bottom-0"
      style={{
        left: character.left,
        width: CHAR_SIZE,
        height: CHAR_HEIGHT,
        animation: reducedMotion
          ? undefined
          : `character-bounce ${duration}s ease-in-out infinite`,
        animationDelay: reducedMotion ? undefined : `${delay}s`,
        ['--hop-height' as string]: `-${hopHeight}px`,
      }}
    >
      <CharacterAvatar
        base={character.base}
        hair={character.hair}
        shirtColor={character.shirtColor}
        eyeColor={character.eyeColor}
        size={CHAR_SIZE}
      />
    </div>
  )
}

/**
 * Meant to be rendered inside SiteFooter, near the bottom — not a
 * page-wide fixed overlay anymore. Reads saved characters from
 * localStorage (see lib/characters.ts) and idles each one in place with a
 * small staggered hop. New characters claim a random horizontal slot
 * that's guaranteed not to overlap an existing one (see placeCharacters
 * above). Listens for the 'characters-updated' event so a freshly saved
 * character appears immediately, no reload needed.
 */
export function CharacterParade() {
  // A plain useRef + effect-with-empty-deps only ever attaches the
  // observer on the very first render — but this component returns null
  // (rendering no container div at all) until a character exists, so
  // that first render often has nothing to attach to. Tracking the node
  // in state instead means the effect below re-fires whenever the div
  // actually mounts, whichever render that ends up being.
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(
    null,
  )
  const [characters, setCharacters] = useState<Character[]>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setCharacters(loadCharacters())
    function refresh() {
      setCharacters(loadCharacters())
    }
    window.addEventListener('characters-updated', refresh)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onMotionChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onMotionChange)

    return () => {
      window.removeEventListener('characters-updated', refresh)
      mq.removeEventListener('change', onMotionChange)
    }
  }, [])

  useEffect(() => {
    if (!containerNode) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(containerNode)
    return () => observer.disconnect()
  }, [containerNode])

  const placed = useMemo(
    () => placeCharacters(characters, containerWidth),
    [characters, containerWidth],
  )

  if (characters.length === 0) return null

  return (
    <div
      ref={setContainerNode}
      aria-hidden="true"
      className="pointer-events-none relative h-24 w-full overflow-hidden sm:h-28"
    >
      {placed.map((c) => (
        <IdleCharacter key={c.id} character={c} reducedMotion={reducedMotion} />
      ))}

      <style>{`
        @keyframes character-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(var(--hop-height, -8px));
          }
        }
      `}</style>
    </div>
  )
}