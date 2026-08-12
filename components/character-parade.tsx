'use client'

import { useEffect, useState } from 'react'
import {
  ACCESSORY_OPTIONS,
  BASE_OPTIONS,
  HAIR_OPTIONS,
  OUTFIT_OPTIONS,
  loadCharacters,
  type Character,
} from '@/lib/characters'

// Deterministic-ish pseudo-random per character, based on its id, so the
// same character always gets the same speed/lane instead of re-randomizing
// (and jumping around) on every re-render.
function hashToRange(id: string, min: number, max: number) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000
  }
  const t = hash / 100000
  return min + t * (max - min)
}

function WalkingCharacter({ character }: { character: Character }) {
  const duration = hashToRange(character.id, 14, 26) // seconds to cross the screen
  const delay = -hashToRange(character.id + 'd', 0, duration) // negative = starts mid-walk, staggered
  const bottomOffset = hashToRange(character.id + 'b', 0, 14) // px, avoids a perfectly flat row
  const size = 40 // px

  const layers = [
    BASE_OPTIONS[character.base],
    OUTFIT_OPTIONS[character.outfit],
    HAIR_OPTIONS[character.hair],
    ACCESSORY_OPTIONS[character.accessory],
  ].filter((src): src is string => Boolean(src))

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        bottom: `${bottomOffset}px`,
        left: `-${size}px`,
        width: size,
        height: size,
        animation: `walk-across ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {layers.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 size-full [image-rendering:pixelated]"
        />
      ))}
    </div>
  )
}

/**
 * Fixed strip along the bottom of the viewport. Reads saved characters from
 * localStorage (per-visitor collection — see lib/characters.ts) and animates
 * each one walking left to right on a loop. Listens for the
 * 'characters-updated' event so a newly saved character appears immediately.
 */
export function CharacterParade() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setCharacters(loadCharacters())

    function refresh() {
      setCharacters(loadCharacters())
    }
    window.addEventListener('characters-updated', refresh)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)

    return () => {
      window.removeEventListener('characters-updated', refresh)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  if (characters.length === 0) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-14 overflow-hidden"
    >
      {reducedMotion ? (
        // Reduced motion: show them standing still in a row instead of animating.
        <div className="flex items-end gap-3 p-2">
          {characters.map((c) => {
            const layers = [
              BASE_OPTIONS[c.base],
              OUTFIT_OPTIONS[c.outfit],
              HAIR_OPTIONS[c.hair],
              ACCESSORY_OPTIONS[c.accessory],
            ].filter((src): src is string => Boolean(src))
            return (
              <div key={c.id} className="relative size-10">
                {layers.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="absolute inset-0 size-full [image-rendering:pixelated]"
                  />
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        characters.map((c) => <WalkingCharacter key={c.id} character={c} />)
      )}
    </div>
  )
}