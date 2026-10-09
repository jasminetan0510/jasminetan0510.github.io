'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ScrollCue } from '@/components/scroll-cue'
import { cn } from '@/lib/utils'

/**
 * Hero: clean and typographic. Name set large, one line about what drives
 * the work, an education row, and the polaroid headshot.
 *
 * Layout
 * - Desktop (lg+): text on the left, polaroid on the right.
 * - Phones/tablets: a small polaroid first, then the text, everything
 *   left-aligned in one column. Nothing absolutely positioned except the
 *   scroll cue, so nothing can overlap on short or narrow screens.
 *
 * The entrance (.hero-enter, staggered with --d) waits for the boot screen
 * to open; the CSS lives in globals.css.
 */

const TAGLINE =
  'My favorite problems sit between people and process: how can we build tech that gives time back?'

// Education row. Edit labels/values freely; it wraps to a 2×2 grid on phones.
const EDUCATION = [
  { label: 'Major', value: 'B.S. Computer Science', sub: 'Software Engineering Track' },
  { label: 'Minor', value: 'Science & Mathematics Education' },
  { label: 'Certificate', value: 'Technology Management (TMP)' },
  { label: 'Class of', value: 'June 2027' },
]

const CURRENTLY = 'leading our team building TenantFolio, a tenant-side leasing app with AppFolio'

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Hero() {
  return (
    <header id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-accent">
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 pt-24 pb-28 sm:px-8 sm:pt-28 lg:pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          {/* Polaroid: small and first on mobile, larger and on the right on desktop */}
          <figure
            className="hero-enter w-36 justify-self-start sm:w-44 lg:order-2 lg:w-64 lg:justify-self-end"
            style={d(160)}
          >
            <div className="paper-edge -rotate-2 rounded-sm bg-card p-2 pb-3 transition-transform duration-300 hover:rotate-0 lg:p-3 lg:pb-4">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src="/images/headshot2.png"
                  alt="Jasmine Tan"
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 256px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-2 hidden text-center text-[0.75rem] leading-snug text-foreground/75 lg:block">
                <span className="font-semibold text-foreground">currently:</span> {CURRENTLY}
              </figcaption>
            </div>
          </figure>

          <div className="min-w-0 lg:order-1">
            <div
              className="hero-enter inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1"
              style={d(0)}
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              <span className="eyebrow text-[0.625rem] text-muted-foreground sm:text-[0.6875rem]">
                Open to PM &amp; SWE roles
              </span>
            </div>

            <h1
              className="hero-enter display mt-5 text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.95] tracking-tight"
              style={d(80)}
            >
              Jasmine Tan<span className="text-foreground/40">.</span>
            </h1>

            <p
              className="hero-enter mt-5 max-w-xl text-pretty text-base leading-relaxed font-light text-muted-foreground sm:text-lg"
              style={d(220)}
            >
              {TAGLINE}
            </p>

            {/* Currently: shown here on mobile (on desktop it's the polaroid caption) */}
            <p className="hero-enter mt-3 text-sm text-foreground/75 lg:hidden" style={d(260)}>
              <span className="font-semibold text-foreground">Currently:</span> {CURRENTLY}
            </p>

            {/* Education */}
            <div className="hero-enter mt-8 border-t border-foreground/10 pt-6" style={d(320)}>
              <p className="display text-lg leading-tight sm:text-xl">UC Santa Barbara</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-x-0">
                {EDUCATION.map((e, i) => (
                  <div
                    key={e.label}
                    className={cn('min-w-0', i > 0 && 'sm:border-l sm:border-foreground/10 sm:pl-5', i < 3 && 'sm:pr-5')}
                  >
                    <dt className="eyebrow text-[0.625rem] text-muted-foreground">{e.label}</dt>
                    <dd className="mt-1 text-sm leading-snug text-foreground/90">
                      {e.value}
                      {e.sub ? <span className="block text-xs text-muted-foreground">{e.sub}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <ScrollCue />
    </header>
  )
}