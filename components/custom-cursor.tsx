'use client'

import { useEffect, useRef, useState } from 'react'

// TODO: replace with your own cursor image. A small transparent PNG works
// best. CURSOR_SIZE is the on-screen display size in px — the source file
// can be higher-res than that for retina screens, it'll just get scaled down.
const CURSOR_SRC = '/images/cursor.png'
const CURSOR_SIZE = 121

export function CustomCursor() {
  const posRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // Only enable on devices with a real mouse/trackpad. Touch devices have
    // no cursor concept, so there's nothing to replace there.
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    setEnabled(hasFinePointer)
    if (!hasFinePointer) return

    function handleMove(e: PointerEvent) {
      const el = posRef.current
      if (!el) return
      // Raw position, no smoothing/lag — matches native cursor responsiveness.
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    function handleOver(e: PointerEvent) {
      const target = e.target as HTMLElement
      setHovering(
        Boolean(target.closest('a, button, [role="button"], input, textarea')),
      )
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerover', handleOver)
    document.documentElement.classList.add('custom-cursor-active')

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={posRef}
      style={{ transform: 'translate(-100px, -100px)' }}
      className="pointer-events-none fixed top-0 left-0 z-100"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CURSOR_SRC}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          // Centers the image on the actual pointer position (the "hotspot").
          // Change this if you want a different point on the image — e.g. an
          // arrow tip — to be the real click point instead of dead center.
          transform: `translate(-50%, -50%) scale(${hovering ? 1.25 : 1})`,
        }}
        className="[image-rendering:pixelated] transition-transform duration-150 ease-out"
      />
    </div>
  )
}