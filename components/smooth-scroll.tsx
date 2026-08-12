'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import 'lenis/dist/lenis.css'

/**
 * Site-wide smooth scroll. Renders nothing visible — it hijacks native
 * scroll on <html> and interpolates it with easing, giving the eased,
 * slightly "settling" scroll feel instead of an instant jump per wheel tick.
 * Disabled entirely if the visitor has prefers-reduced-motion set.
 */
export function SmoothScroll() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setEnabled(!mq.matches)
    const onChange = () => setEnabled(!mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (!enabled) return null

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        smoothWheel: true,
        // Eased "settle" toward the target — this is what gives the
        // slightly sticky/buttery feel rather than a linear scroll.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    />
  )
}