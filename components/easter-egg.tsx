'use client'

import { useEffect, useState } from 'react'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const BURST_IMAGES = [
  '/images/stickers/star.png',
  '/images/stickers/heart.png',
  '/images/stickers/sparkle.png',
  '/images/stickers/flower.png',
  '/images/stickers/smiley.png',
]

type Piece = {
  id: number
  src: string
  left: number
  delay: number
  duration: number
  drift: number
  rotate: number
}

let nextId = 0

export function EasterEgg() {
  const [progress, setProgress] = useState(0)
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const expected = KONAMI[progress]
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === expected) {
        const next = progress + 1
        if (next === KONAMI.length) {
          triggerBurst()
          setProgress(0)
        } else {
          setProgress(next)
        }
      } else {
        // Allow the sequence to restart on the same key that would've
        // been step 1, instead of requiring a totally clean slate.
        setProgress(key === KONAMI[0] ? 1 : 0)
      }
    }

    function triggerBurst() {
      const newPieces: Piece[] = Array.from({ length: 24 }, () => ({
        id: nextId++,
        src: BURST_IMAGES[Math.floor(Math.random() * BURST_IMAGES.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.2,
        drift: Math.random() * 80 - 40,
        rotate: Math.random() * 360,
      }))
      setPieces((prev) => [...prev, ...newPieces])
      window.setTimeout(() => {
        setPieces((prev) =>
          prev.filter((p) => !newPieces.some((np) => np.id === p.id)),
        )
      }, 4000)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [progress])

  if (pieces.length === 0) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-90 overflow-hidden"
    >
      {pieces.map((p) => (
        <img
          key={p.id}
          src={p.src}
          alt=""
          draggable={false}
          style={{
            left: `${p.left}%`,
            top: '-40px',
            animation: `easter-egg-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            // Custom properties consumed by the keyframe below.
            ['--drift' as string]: `${p.drift}px`,
            ['--rotate' as string]: `${p.rotate}deg`,
          }}
          className="absolute size-8 [image-rendering:pixelated]"
        />
      ))}
    </div>
  )
}