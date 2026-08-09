'use client'

import { RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Sticker = {
  id: string
  label: string
  src: string
  x: number
  y: number
  rot: number
  z: number
}

// TODO: drop your own sticker images at these paths (any transparent PNG/SVG
// works well). Add or remove entries here to match what you actually have —
// this list drives both the starting board layout and the "add" tray below.
const trayOptions: { label: string; src: string }[] = [
  { label: 'star', src: '/images/stickers/star.png' },
  { label: 'heart', src: '/images/stickers/heart.png' },
  { label: 'sparkle', src: '/images/stickers/sparkle.png' },
  { label: 'coffee', src: '/images/stickers/coffee.png' },
  { label: 'flower', src: '/images/stickers/flower.png' },
  { label: 'smiley', src: '/images/stickers/smiley.png' },
]

const initialStickers: Sticker[] = [
  { id: 's1', label: 'star', src: '/images/stickers/star.png', x: 18, y: 24, rot: -8, z: 1 },
  { id: 's2', label: 'heart', src: '/images/stickers/heart.png', x: 52, y: 58, rot: 6, z: 2 },
  { id: 's3', label: 'sparkle', src: '/images/stickers/sparkle.png', x: 74, y: 22, rot: -3, z: 3 },
]

let nextId = 4

export function StickerBoard() {
  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const [stickers, setStickers] = useState<Sticker[]>(initialStickers)
  const [topZ, setTopZ] = useState(3)

  function bringToFront(id: string) {
    const z = topZ + 1
    setTopZ(z)
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, z } : s)))
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    sticker: Sticker,
  ) {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const pointerX = ((event.clientX - rect.left) / rect.width) * 100
    const pointerY = ((event.clientY - rect.top) / rect.height) * 100
    dragRef.current = {
      id: sticker.id,
      dx: pointerX - sticker.x,
      dy: pointerY - sticker.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    bringToFront(sticker.id)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const board = boardRef.current
    if (!drag || !board) return
    const rect = board.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100 - drag.dx
    const y = ((event.clientY - rect.top) / rect.height) * 100 - drag.dy
    setStickers((prev) =>
      prev.map((s) =>
        s.id === drag.id
          ? {
              ...s,
              x: Math.min(92, Math.max(4, x)),
              y: Math.min(88, Math.max(6, y)),
            }
          : s,
      ),
    )
  }

  function endDrag() {
    dragRef.current = null
  }

  function nudgeWithKeyboard(
    event: React.KeyboardEvent<HTMLDivElement>,
    sticker: Sticker,
  ) {
    const step = event.shiftKey ? 8 : 3
    const deltas: Record<string, [number, number]> = {
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
    }
    const delta = deltas[event.key]
    if (!delta) return
    event.preventDefault()
    setStickers((prev) =>
      prev.map((s) =>
        s.id === sticker.id
          ? {
              ...s,
              x: Math.min(92, Math.max(4, s.x + delta[0])),
              y: Math.min(88, Math.max(6, s.y + delta[1])),
            }
          : s,
      ),
    )
  }

  function addSticker(option: { label: string; src: string }) {
    const z = topZ + 1
    setTopZ(z)
    setStickers((prev) => [
      ...prev,
      {
        id: `s${nextId++}`,
        label: option.label,
        src: option.src,
        x: 30 + Math.random() * 40,
        y: 25 + Math.random() * 45,
        rot: Math.round(Math.random() * 20 - 10),
        z,
      },
    ])
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={boardRef}
        className="relative h-64 w-full touch-none overflow-hidden rounded-sm border border-dashed border-input bg-secondary/60 sm:h-72"
      >
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center display text-2xl text-foreground/15">
          drag things around
        </p>

        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            role="button"
            tabIndex={0}
            aria-label={`${sticker.label} sticker. Use arrow keys to move.`}
            onPointerDown={(event) => handlePointerDown(event, sticker)}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={(event) => nudgeWithKeyboard(event, sticker)}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              zIndex: sticker.z,
              rotate: `${sticker.rot}deg`,
            }}
            className={cn(
              'absolute flex cursor-grab items-center justify-center select-none active:cursor-grabbing',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative sticker, next/image is overkill */}
            <img
              src={sticker.src}
              alt={sticker.label}
              draggable={false}
              className="h-10 w-10 object-contain drop-shadow-sm sm:h-12 sm:w-12"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 eyebrow text-muted-foreground">add:</span>
        {trayOptions.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => addSticker(option)}
            className="inline-flex items-center gap-1.5 rounded-full border border-input px-2.5 py-1 text-xs transition-colors hover:bg-secondary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={option.src}
              alt=""
              className="h-4 w-4 object-contain"
            />
            {option.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setStickers(initialStickers)
            setTopZ(3)
          }}
          className="ml-auto inline-flex items-center gap-1.5 eyebrow text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          reset
        </button>
      </div>
    </div>
  )
}
