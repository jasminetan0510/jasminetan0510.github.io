'use client'

import { useEffect, useRef } from 'react'

/**
 * A number that counts up when it scrolls into view, without ever putting
 * a wrong number in the HTML:
 * - Server HTML (crawlers, link previews, no-JS) always has the final value.
 * - Screen readers get the final value from an sr-only copy; the animated
 *   digits are aria-hidden.
 * - Only animates if the number starts off-screen and motion is allowed.
 */
type Props = {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export function CountUp({ value, prefix = '', suffix = '', duration = 1400, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const final = `${prefix}${fmt(value)}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return // already visible: leave it

    el.textContent = `${prefix}${fmt(0)}${suffix}`
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          el.textContent = `${prefix}${fmt(value * (1 - Math.pow(1 - t, 3)))}${suffix}`
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      el.textContent = final
    }
  }, [value, prefix, suffix, duration, final])

  return (
    <span className={className}>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {final}
      </span>
    </span>
  )
}