'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { Tape } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

/**
 * Paper wind chimes for the hero. Each tag is a real link (quick nav),
 * hung from a taped rod across the top of the screen. Cursor movement
 * acts as wind: tags swing on pendulum physics and, if sound is on,
 * ring a soft bell tone (C-major pentatonic, low → high, left → right).
 *
 * - Transforms are written straight to the DOM in rAF, so no React
 *   re-renders per frame.
 * - The loop pauses when the hero is off-screen or the tab is hidden.
 * - prefers-reduced-motion: tags hang still; links still work.
 * - Colors come from the theme tokens, so dark mode just works.
 */

type ChimeSpec = {
  label: string
  href: string
  x: number // pivot position along the rod (0–1 of hero width), desktop
  mx?: number // pivot position on mobile, if different
  length: number // string length in px at desktop size
  note: number // Hz
  tilt: number // resting tilt of the paper tag, degrees
  desktopOnly?: boolean
}

// Lengths are kept short so the whole chime band ends ~300px from the
// top on desktop, which is where the hero content starts (md:pt-[19rem]
// in hero.tsx). If you lengthen any of these, raise that padding too.
const CHIMES: ChimeSpec[] = [
  { label: 'projects', href: '#projects', x: 0.12, mx: 0.16, length: 70, note: 523.25, tilt: -2 },
  { label: 'teaching', href: '#education', x: 0.25, length: 125, note: 587.33, tilt: 1.5, desktopOnly: true },
  { label: 'impact', href: '#impact', x: 0.38, mx: 0.4, length: 160, note: 659.25, tilt: -1 },
  { label: 'résumé', href: '/resume.pdf', x: 0.5, mx: 0.64, length: 95, note: 783.99, tilt: 2 },
  { label: 'involvements', href: '#involvements', x: 0.63, length: 145, note: 880.0, tilt: -1.5, desktopOnly: true },
  { label: 'say hi', href: '#contact', x: 0.76, mx: 0.86, length: 110, note: 1046.5, tilt: 1 },
  { label: 'github', href: 'https://github.com/jasminetan0510', x: 0.88, length: 65, note: 1174.66, tilt: -2.5, desktopOnly: true },
]

const DESKTOP_MIN = 768 // keep in sync with Tailwind `md`
const MOBILE_SCALE = 0.62 // keep in sync with [--chime-scale:0.62] below
const TAG_OFFSET = 22 // px from string end to the tag's visual center
const DAMPING = 0.9 // 1/s
const BREEZE = 0.35 // ambient sway strength (rad/s²)
const PUSH = 14 // how hard cursor "wind" pushes (rad/s² per px/ms)
const RADIUS = 110 // px around a tag the cursor affects
const MAX_ANGLE = 1.1 // rad

type Props = {
  /** Pass the boolean from your sound-provider. Off by default. */
  soundOn?: boolean
  /** Distance from the top of the hero to the rod (clears the fixed header). */
  rodTop?: number
}

export function WindChimes({ soundOn = false, rodTop = 92 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const armRefs = useRef<(HTMLDivElement | null)[]>([])
  const soundRef = useRef(soundOn)
  const audioRef = useRef<AudioContext | null>(null)
  const sim = useRef({
    theta: Float32Array.from(CHIMES, (_, i) => (i % 2 ? 0.04 : -0.04)),
    omega: new Float32Array(CHIMES.length),
    lastRing: new Float64Array(CHIMES.length),
    reduced: false,
  })

  useEffect(() => {
    soundRef.current = soundOn
  }, [soundOn])

  const ring = (i: number, strength: number) => {
    if (!soundRef.current) return
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = (audioRef.current ??= new AC())
    if (ctx.state === 'suspended') void ctx.resume()

    const t = ctx.currentTime
    const out = ctx.createGain()
    out.gain.setValueAtTime(0.0001, t)
    out.gain.exponentialRampToValueAtTime(0.012 + 0.05 * strength, t + 0.01)
    out.gain.exponentialRampToValueAtTime(0.0001, t + 2.2)
    out.connect(ctx.destination)

    // Fundamental + two inharmonic partials ≈ a small metal chime.
    const partials: [number, number][] = [
      [1, 1],
      [2.76, 0.35],
      [5.4, 0.12],
    ]
    for (const [ratio, level] of partials) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = CHIMES[i].note * ratio
      g.gain.value = level
      osc.connect(g).connect(out)
      osc.start(t)
      osc.stop(t + 2.3)
    }
  }

  // Click / keyboard focus gives the tag a little flick.
  const nudge = (i: number) => {
    const s = sim.current
    if (!s.reduced) s.omega[i] += i % 2 ? 2.2 : -2.2
    const now = performance.now()
    if (now - s.lastRing[i] > 250) {
      s.lastRing[i] = now
      ring(i, 0.7)
    }
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const s = sim.current
    const n = CHIMES.length

    const paint = () => {
      for (let i = 0; i < n; i++) {
        const el = armRefs.current[i]
        if (el) el.style.transform = `rotate(${s.theta[i]}rad)`
      }
    }
    paint()

    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (s.reduced) return

    // Cursor tracking, in hero-local coordinates.
    let px = -1e5
    let py = -1e5
    let vx = 0 // px per ms
    let lastMove = 0
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const nx = e.clientX - r.left
      const ny = e.clientY - r.top
      const now = performance.now()
      if (lastMove && now - lastMove < 100) {
        vx = (nx - px) / Math.max(1, now - lastMove)
      }
      px = nx
      py = ny
      lastMove = now
    }

    let raf = 0
    let prev = performance.now()
    let onScreen = true

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000)
      prev = now
      const t = now / 1000
      const w = root.clientWidth
      const desktop = w >= DESKTOP_MIN
      const scale = desktop ? 1 : MOBILE_SCALE
      const gust = 0.55 + 0.45 * Math.sin(t * 0.13) // slow gusts

      for (let i = 0; i < n; i++) {
        const c = CHIMES[i]
        if (!desktop && c.desktopOnly) continue
        const L = c.length * scale
        const k = 2400 / Math.max(L, 40) // longer string → slower swing
        let alpha = -k * Math.sin(s.theta[i]) - DAMPING * s.omega[i]
        alpha +=
          BREEZE * gust * (0.6 * Math.sin(t * 0.7 + i * 0.9) + 0.4 * Math.sin(t * 1.9 + i * 2.3))

        if (Math.abs(vx) > 0.02) {
          const reach = L + TAG_OFFSET
          const pivotX = (desktop ? c.x : (c.mx ?? c.x)) * w
          const tipX = pivotX + reach * Math.sin(s.theta[i])
          const tipY = rodTop + reach * Math.cos(s.theta[i])
          const d = Math.hypot(px - tipX, py - tipY)
          if (d < RADIUS) {
            const f = (1 - d / RADIUS) ** 2
            alpha += vx * f * PUSH * Math.sqrt(160 / Math.max(L, 40))
            if (f > 0.25 && Math.abs(vx) > 0.6 && now - s.lastRing[i] > 350) {
              s.lastRing[i] = now
              ring(i, Math.min(1, Math.abs(vx) / 2.5))
            }
          }
        }

        s.omega[i] = Math.max(-7, Math.min(7, s.omega[i] + alpha * dt))
        s.theta[i] += s.omega[i] * dt
        if (Math.abs(s.theta[i]) > MAX_ANGLE) {
          s.theta[i] = Math.sign(s.theta[i]) * MAX_ANGLE
          s.omega[i] *= -0.3
        }
      }

      vx *= Math.pow(0.88, dt * 60) // wind dies down when the cursor stops
      paint()
      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (raf || !onScreen || document.hidden) return
      prev = performance.now()
      raf = requestAnimationFrame(step)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) start()
      else stop()
    })
    io.observe(root)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onMove, { passive: true })
    start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onMove)
    }
  }, [rodTop])

  useEffect(() => () => void audioRef.current?.close(), [])

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [--chime-scale:0.62] md:[--chime-scale:1]"
    >
      {/* The rod, taped to the "page" at both ends */}
      <div aria-hidden="true" className="absolute left-[6%] right-[6%]" style={{ top: rodTop - 2 }}>
        <div className="h-[3px] rounded-full bg-foreground/85" />
        <Tape className="-left-8 -top-2.5 -rotate-6" />
        <Tape className="-right-8 -top-2.5 rotate-[5deg]" />
      </div>

      <nav aria-label="Quick links">
        {CHIMES.map((c, i) => {
          const external = c.href.startsWith('http') || c.href.endsWith('.pdf')
          const len = `calc(${c.length}px * var(--chime-scale))`
          return (
            <div
              key={c.label}
              ref={(el) => {
                armRefs.current[i] = el
              }}
              className={cn(
                'absolute left-[calc(var(--mx)*100%)] w-0 origin-top will-change-transform md:left-[calc(var(--x)*100%)]',
                c.desktopOnly && 'hidden md:block',
              )}
              style={{ top: rodTop, '--x': c.x, '--mx': c.mx ?? c.x } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 w-px -translate-x-1/2 bg-foreground/55"
                style={{ height: len }}
              />
              <a
                href={c.href}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                onClick={() => nudge(i)}
                onFocus={() => nudge(i)}
                className="group pointer-events-auto absolute left-0 origin-top -translate-x-1/2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-accent"
                style={{ top: len, rotate: `${c.tilt}deg` }}
              >
                {/* hole punch where the string ties on */}
                <span
                  aria-hidden="true"
                  className="mx-auto -mb-[5px] block size-2 rounded-full border-[1.5px] border-foreground bg-accent"
                />
                <span className="block whitespace-nowrap rounded-sm border-[1.5px] border-foreground bg-card px-3.5 pt-2.5 pb-2 font-sans text-sm text-foreground shadow-[3px_3px_0_0_var(--color-foreground)] transition-[translate,box-shadow] duration-150 group-hover:-translate-y-px group-hover:shadow-[4px_4px_0_0_var(--color-foreground)] group-active:translate-y-px group-active:shadow-[1px_1px_0_0_var(--color-foreground)]">
                  {c.label}
                </span>
              </a>
            </div>
          )
        })}
      </nav>
    </div>
  )
}