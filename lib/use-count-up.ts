'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number counting up from 0 to `target` the first time the
 * returned ref scrolls into view, then stays put. Respects
 * prefers-reduced-motion (shows the final value immediately, no
 * animation) — same pattern as Reveal.
 */
export function useCountUp<T extends HTMLElement>(
  target: number,
  duration = 1200,
) {
  const ref = useRef<T | null>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setValue(target)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        const start = performance.now()
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          setValue(Math.round(target * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.unobserve(el)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return [ref, value] as const
}