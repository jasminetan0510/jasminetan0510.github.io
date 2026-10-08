'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { CloudNote } from '@/components/cloud-note'
import { ScrollCue } from '@/components/scroll-cue'
import { cn } from '@/lib/utils'

/**
 * Full-screen hero: headshot polaroid in the middle, with hand-drawn arrows
 * pointing at it from short notes about me.
 *
 * - Arrows are measured from the real layout (offsetLeft/Top, which ignore
 *   CSS transforms, so the entrance animation can't throw them off) and
 *   re-measured on resize. Wide screens only (lg+); below that the notes
 *   stack under the photo without arrows.
 * - Entrance + arrow drawing are CSS-only and key off html[data-booted],
 *   which the boot screen sets as it opens (rules live in globals.css).
 *   Repeat visits and reduced-motion visitors get the final state at once.
 */

type Blurb = {
  id: string
  side: 'left' | 'right'
  row: 'top' | 'bottom'
  label: string
  text: string
}

// Order matters for the mobile stack. Edit freely; keep each to ~2 lines.
const BLURBS: Blurb[] = [
  {
    id: 'studying',
    side: 'left',
    row: 'top',
    label: 'studying',
    text: 'Computer Science, Technology Management, and Science + Math Education at UCSB. Class of 2027.',
  },
  {
    id: 'building',
    side: 'right',
    row: 'top',
    label: 'building',
    text: 'Software developer at Caliber Research Group, building tools for 250+ students a quarter.',
  },
  {
    id: 'leading',
    side: 'left',
    row: 'bottom',
    label: 'leading',
    text: 'Team Lead on our UCSB × AppFolio capstone: a tenant-side leasing app in Ruby on Rails.',
  },
  {
    id: 'teaching',
    side: 'right',
    row: 'bottom',
    label: 'teaching',
    text: 'Private tutoring math and English since high school, helping over 20 students.',
  },
]

// Top notes sit at the top of their row and bottom notes at the bottom, so
// the four arrows fan out across the photo's full height instead of
// bunching in the middle. Margins push each note out by a different amount
// so the arrows vary in length and don't look stamped.
const PLACEMENT: Record<string, string> = {
  'left-top': 'lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-end lg:mr-0 xl:mr-2 lg:-rotate-2',
  'left-bottom': 'lg:col-start-1 lg:row-start-2 lg:self-end lg:justify-self-end lg:mr-6 xl:mr-8 lg:rotate-1',
  'right-top': 'lg:col-start-3 lg:row-start-1 lg:self-start lg:justify-self-start lg:ml-6 xl:ml-8 lg:rotate-2',
  'right-bottom': 'lg:col-start-3 lg:row-start-2 lg:self-end lg:justify-self-start lg:ml-0 xl:ml-2 lg:-rotate-1',
}

// Each note bobs on its own rhythm (duration, start offset, drift) so the
// group never moves in lockstep.
const FLOAT = [
  { dur: 6.2, delay: -1.3, x: 2, y: -6 },
  { dur: 7.1, delay: -3.8, x: -2, y: -5 },
  { dur: 5.6, delay: -0.4, x: -1.5, y: -7 },
  { dur: 6.7, delay: -2.6, x: 1.5, y: -5 },
]

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const r1 = (n: number) => Math.round(n * 10) / 10

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const blurbRefs = useRef<(HTMLDivElement | null)[]>([])
  const [arrows, setArrows] = useState<string[]>([])

  useIsoLayoutEffect(() => {
    const stage = stageRef.current
    const photo = photoRef.current
    if (!stage || !photo) return

    const measure = () => {
      if (stage.offsetWidth < 900) {
        setArrows([])
        return
      }
      const p = {
        l: photo.offsetLeft,
        r: photo.offsetLeft + photo.offsetWidth,
        t: photo.offsetTop,
        b: photo.offsetTop + photo.offsetHeight,
      }
      setArrows(
        BLURBS.map((b, i) => {
          const el = blurbRefs.current[i]
          if (!el) return ''
          const left = b.side === 'left'
          const top = b.row === 'top'
          // From the note's inner edge…
          const sx = left ? el.offsetLeft + el.offsetWidth + 12 : el.offsetLeft - 12
          const sy = el.offsetTop + el.offsetHeight * 0.5
          // …to the photo's edge, near its top or bottom so the four
          // arrowheads land well apart.
          const ex = left ? p.l - 12 : p.r + 12
          const ey = p.t + (p.b - p.t) * (top ? 0.2 : 0.8)
          // Bow the curve away from the middle so it reads hand-drawn.
          const cx = (sx + ex) / 2
          const cy = top ? Math.min(sy, ey) - 26 : Math.max(sy, ey) + 26
          const a = Math.atan2(ey - cy, ex - cx)
          const h = 10
          const h1 = [ex - h * Math.cos(a - 0.5), ey - h * Math.sin(a - 0.5)]
          const h2 = [ex - h * Math.cos(a + 0.5), ey - h * Math.sin(a + 0.5)]
          return (
            `M${r1(sx)} ${r1(sy)} Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)} ` +
            `M${r1(h1[0])} ${r1(h1[1])} L${r1(ex)} ${r1(ey)} L${r1(h2[0])} ${r1(h2[1])}`
          )
        }),
      )
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

  return (
    <header
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-accent"
    >
      <ParallaxBackdrop variant="cococream" speed={0.22} />

      {/* Subtle static grain so the flat color block reads as paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 pt-28 pb-28 sm:px-8 lg:gap-7 lg:pt-[5.75rem] lg:pb-[5.25rem] [@media(min-width:1024px)_and_(min-height:860px)]:gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="hero-enter inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1"
            style={delay(0)}
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            <span className="eyebrow text-muted-foreground">
              Open to PM &amp; Software Engineering roles
            </span>
          </div>
          <h1
            className="hero-enter display text-4xl leading-[0.95] text-balance sm:text-5xl [@media(min-width:1024px)_and_(min-height:860px)]:text-6xl"
            style={delay(80)}
          >
            Hi, I&apos;m Jasmine :)
          </h1>
          <p
            className="hero-enter max-w-xl text-balance font-sans text-base leading-snug font-light text-muted-foreground sm:text-lg lg:max-w-4xl"
            style={delay(160)}
          >
            My favorite problems sit between people and process: how can we build tech that gives time back?
          </p>
        </div>

        {/* Stage: photo in the middle column, notes left and right. */}
        <div
          ref={stageRef}
          className="relative grid w-full grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-2 lg:gap-x-16 lg:gap-y-2 xl:gap-x-20 [@media(min-width:1024px)_and_(min-height:860px)]:gap-y-8"
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden size-full overflow-visible text-foreground/70 lg:block"
          >
            {arrows.map((d, i) =>
              d ? (
                <path
                  key={BLURBS[i].id}
                  d={d}
                  pathLength={1}
                  className="hero-arrow"
                  style={delay(650 + i * 160)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null,
            )}
          </svg>

          <div
            ref={photoRef}
            className="hero-enter relative col-span-full w-[15rem] sm:w-[17rem] lg:w-[15rem] [@media(min-width:1024px)_and_(min-height:860px)]:w-[17rem] [@media(min-width:1024px)_and_(max-height:640px)]:w-[13rem] lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            style={delay(160)}
          >
            <div className="paper-edge rounded-sm bg-card p-3 pb-4 -rotate-1 transition-transform duration-300 hover:rotate-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src="/images/headshot2.png"
                  alt="Jasmine Tan"
                  fill
                  sizes="(max-width: 640px) 240px, 272px"
                  className="object-cover"
                  priority
                />
              </div>
              <p className="mt-2.5 text-center text-[0.8rem] leading-snug text-foreground/80">
                <span className="font-semibold text-foreground">currently:</span> leading our team building
                a tenant-side leasing app with AppFolio
              </p>
            </div>
          </div>

          {BLURBS.map((b, i) => {
            const f = FLOAT[i % FLOAT.length]
            return (
              <CloudNote
                key={b.id}
                nodeRef={(el) => {
                  blurbRefs.current[i] = el
                }}
                label={b.label}
                text={b.text}
                shape={i}
                flip={b.side === 'right'}
                breathe={f.dur + 1.3}
                className={cn(
                  'hero-enter hero-float max-w-[18rem] lg:max-w-[17rem] xl:max-w-[18rem] [@media(min-width:1024px)_and_(max-height:640px)]:max-w-[15rem]',
                  PLACEMENT[`${b.side}-${b.row}`],
                )}
                style={
                  {
                    ...delay(320 + i * 110),
                    '--float-dur': `${f.dur}s`,
                    '--float-delay': `${f.delay}s`,
                    '--float-x': `${f.x}px`,
                    '--float-y': `${f.y}px`,
                  } as CSSProperties
                }
              />
            )
          })}
        </div>

      </div>

      <ScrollCue />

      <style jsx global>{`
        @keyframes hero-float {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: var(--float-x, 0) var(--float-y, -6px);
          }
        }
        .hero-float {
          animation: hero-float var(--float-dur, 6s) ease-in-out var(--float-delay, 0s) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-float {
            animation: none;
          }
        }
      `}</style>
    </header>
  )
}