'use client'

import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react'
import { cn } from '@/lib/utils'

/**
 * A soft, hand-drawn-style cloud with a note inside.
 *
 * Look: outline only, chunky rounded puffs drawn in the same line as the
 * hero arrows (color, weight, rounded joins). No fill, so the page shows
 * through. Each cloud "breathes" slowly.
 *
 * Play:
 * - Hover (mouse/pen): the cloud leans and hops away from the cursor
 *   with a springy squish, and settles back when the cursor leaves.
 * - Click / tap: it dissipates into little puffs, stays gone for about a
 *   second, then puffs back together.
 * - Reduced motion: no breathing or dodging; a click is a quick fade
 *   out and back.
 */

type Shape = {
  d: string
  vb: [number, number, number, number] // tight bounds of the shape
  safe: { l: number; r: number; t: number; b: number } // text area insets, %
}

// Four different silhouettes, generated as scalloped outlines (bigger,
// rounder puffs on top, smaller flatter bumps along the bottom). Wide and
// low (about 1.75:1) so notes read in ~3 lines without making the hero tall.
const SHAPES: Shape[] = [
  {
    d: 'M256.9 115.6 A25.5 25.5 0 0 1 216.5 141.5 A51.6 51.6 0 0 1 138.7 149.8 A46.3 46.3 0 0 1 69.7 136.8 A18.1 18.1 0 0 1 43.1 115.6 A15.5 15.5 0 0 1 52.9 88.1 A27.3 27.3 0 0 1 99.3 65.9 A36.9 36.9 0 0 1 168.8 60.8 A32.2 32.2 0 0 1 227.7 75.3 A19.6 19.6 0 0 1 255.6 99.6 A8.5 8.5 0 0 1 256.9 115.6 Z',
    vb: [33, 35, 232, 132],
    safe: { l: 12.3, r: 11.4, t: 24.6, b: 15.3 },
  },
  {
    d: 'M260.0 110.0 A23.4 23.4 0 0 1 226.4 138.8 A51.9 51.9 0 0 1 146.2 150.0 A47.0 47.0 0 0 1 73.6 138.8 A19.8 19.8 0 0 1 42.4 118.3 A13.3 13.3 0 0 1 46.6 93.6 A25.4 25.4 0 0 1 88.5 70.2 A34.9 34.9 0 0 1 153.8 62.0 A32.6 32.6 0 0 1 214.7 71.2 A21.6 21.6 0 0 1 250.5 90.5 A11.5 11.5 0 0 1 260.0 110.0 Z',
    vb: [32, 39, 234, 128],
    safe: { l: 11.9, r: 11.0, t: 23.6, b: 15.8 },
  },
  {
    d: 'M252.9 119.7 A37.9 37.9 0 0 1 203.0 144.6 A53.6 53.6 0 0 1 124.4 148.8 A43.8 43.8 0 0 1 62.1 132.4 A15.3 15.3 0 0 1 44.0 110.0 A18.2 18.2 0 0 1 62.1 80.9 A34.9 34.9 0 0 1 124.4 59.5 A40.0 40.0 0 0 1 199.8 64.1 A27.1 27.1 0 0 1 245.3 87.2 A17.7 17.7 0 0 1 252.9 119.7 Z',
    vb: [36, 31, 228, 136],
    safe: { l: 11.9, r: 11.9, t: 25.6, b: 14.9 },
  },
  {
    d: 'M259.7 112.8 A20.9 20.9 0 0 1 229.1 137.8 A45.7 45.7 0 0 1 157.7 149.9 A47.8 47.8 0 0 1 82.3 141.5 A27.2 27.2 0 0 1 44.3 121.0 A12.9 12.9 0 0 1 44.3 96.8 A20.8 20.8 0 0 1 76.4 74.3 A31.5 31.5 0 0 1 134.7 62.5 A33.8 33.8 0 0 1 198.2 66.9 A25.7 25.7 0 0 1 243.3 84.6 A13.8 13.8 0 0 1 259.4 105.0 A4.1 4.1 0 0 1 259.7 112.8 Z',
    vb: [32, 38, 233, 130],
    safe: { l: 11.9, r: 10.6, t: 24.0, b: 16.3 },
  },
]

// Where the little puffs start (% of the cloud) and how far they drift.
const PUFFS = [
  { x: 30, y: 48, dx: -42, dy: -12, s: 44 },
  { x: 50, y: 32, dx: 0, dy: -38, s: 54 },
  { x: 70, y: 48, dx: 44, dy: -10, s: 44 },
  { x: 40, y: 70, dx: -26, dy: 26, s: 38 },
  { x: 62, y: 70, dx: 30, dy: 24, s: 40 },
  { x: 18, y: 62, dx: -50, dy: 12, s: 30 },
  { x: 84, y: 60, dx: 48, dy: 16, s: 30 },
]

type Phase = 'idle' | 'poof' | 'gone' | 'reform'

type Props = {
  label: string
  text: string
  /** Which silhouette (0–3). */
  shape?: number
  /** Mirror the silhouette. */
  flip?: boolean
  /** Seconds per breath, so neighbouring clouds don't breathe in sync. */
  breathe?: number
  /** Ref to the outer element (used by the hero to measure for arrows). */
  nodeRef?: Ref<HTMLDivElement>
  className?: string
  style?: CSSProperties
}

export function CloudNote({ label, text, shape = 0, flip, breathe = 7, nodeRef, className, style }: Props) {
  const s = SHAPES[shape % SHAPES.length]
  const [bx, by, bw, bh] = s.vb
  const [phase, setPhase] = useState<Phase>('idle')
  const [burst, setBurst] = useState(0)
  const dodgeRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const frame = useRef(0)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = timers.current
    return () => {
      t.forEach(clearTimeout)
      cancelAnimationFrame(frame.current)
    }
  }, [])

  // Lean and hop away from the cursor. The hit area doesn't move, so the
  // cloud stays "scared" while you hover and relaxes when you leave.
  const dodge = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || reduced.current || phase !== 'idle') return
    const box = e.currentTarget.getBoundingClientRect()
    const px = e.clientX
    const py = e.clientY
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const el = dodgeRef.current
      if (!el) return
      let dx = box.left + box.width / 2 - px
      let dy = box.top + box.height / 2 - py
      const len = Math.hypot(dx, dy) || 1
      dx /= len
      dy /= len
      el.style.transform = `translate(${(dx * 26).toFixed(1)}px, ${(dy * 16 - 6).toFixed(1)}px) rotate(${(dx * 5).toFixed(1)}deg) scale(0.97, 1.03)`
    })
  }
  const settle = () => {
    cancelAnimationFrame(frame.current)
    if (dodgeRef.current) dodgeRef.current.style.transform = ''
  }

  const poof = () => {
    if (phase !== 'idle') return
    settle()
    const r = reduced.current
    setBurst((b) => b + 1)
    setPhase('poof')
    timers.current.push(window.setTimeout(() => setPhase('gone'), r ? 200 : 520))
    timers.current.push(window.setTimeout(() => setPhase('reform'), r ? 1200 : 1520))
    timers.current.push(window.setTimeout(() => setPhase('idle'), r ? 1500 : 2300))
  }

  // Text area, mirrored along with the shape when flipped.
  const safe = flip ? { ...s.safe, l: s.safe.r, r: s.safe.l } : s.safe

  return (
    <div ref={nodeRef} className={cn('relative w-full', className)} style={style}>
      <div
        onPointerMove={dodge}
        onPointerLeave={settle}
        onClick={poof}
        className="relative cursor-pointer select-none [-webkit-tap-highlight-color:transparent]"
        style={{ aspectRatio: `${bw} / ${bh}` }}
      >
        <div
          ref={dodgeRef}
          className="absolute inset-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform"
        >
          <div
            className={cn(
              'absolute inset-0',
              phase === 'poof' && 'cloud-poof',
              phase === 'gone' && 'opacity-0',
              phase === 'reform' && 'cloud-reform',
            )}
          >
            <div
              className="cloud-breathe absolute inset-0"
              style={{ '--breathe-dur': `${breathe}s`, '--breathe-delay': `${-breathe * 0.37}s` } as CSSProperties}
            >
              <svg
                viewBox={`${bx} ${by} ${bw} ${bh}`}
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 size-full overflow-visible text-foreground/70',
                  flip && '-scale-x-100',
                )}
              >
                {/* Outline only, drawn exactly like the hero arrows: same
                    color, same 1.6px line (non-scaling, so it stays 1.6px
                    however big the cloud renders), rounded joins. */}
                <path
                  d={s.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div
              className="absolute flex flex-col items-center justify-center text-center"
              style={{
                left: `${safe.l + 2}%`,
                right: `${safe.r + 2}%`,
                top: `${safe.t + 1}%`,
                bottom: `${safe.b + 1}%`,
              }}
            >
              <p className="eyebrow text-muted-foreground">{label}</p>
              <p className="mt-1 text-[0.82rem] leading-snug text-foreground/85 lg:text-[0.86rem]">{text}</p>
            </div>
          </div>
        </div>

        {/* Little puffs that drift off when it dissipates. */}
        {phase === 'poof' && (
          <div key={burst} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
            {PUFFS.map((p, i) => (
              <span
                key={i}
                className="cloud-puff absolute rounded-full border-[1.6px] border-foreground/50"
                style={
                  {
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.s * 0.7,
                    height: p.s * 0.7,
                    '--dx': `${p.dx}px`,
                    '--dy': `${p.dy}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes cloud-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.025, 1.015);
          }
        }
        .cloud-breathe {
          transform-origin: 50% 70%;
          animation: cloud-breathe var(--breathe-dur, 7s) ease-in-out var(--breathe-delay, 0s) infinite;
        }
        @keyframes cloud-poof {
          to {
            opacity: 0;
            transform: scale(1.18);
            filter: blur(10px);
          }
        }
        .cloud-poof {
          animation: cloud-poof 0.52s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes cloud-reform {
          0% {
            opacity: 0;
            transform: scale(0.8);
            filter: blur(8px);
          }
          55% {
            opacity: 1;
            transform: scale(1.05);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .cloud-reform {
          animation: cloud-reform 0.78s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes cloud-puff {
          0% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.5);
          }
        }
        .cloud-puff {
          animation: cloud-puff 0.75s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
        }
        @keyframes cloud-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cloud-breathe {
            animation: none;
          }
          .cloud-poof {
            animation-duration: 0.2s;
          }
          .cloud-reform {
            animation: cloud-fade 0.3s both;
          }
          .cloud-puff {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}