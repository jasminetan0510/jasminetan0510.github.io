'use client'

import { ArrowDown, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { Reveal } from '@/components/reveal'
import { Tape } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

const HEADLINE = "Hi, I'm Jasmine :)"

/**
 * Types `text` out one character at a time. Set `start` to false to hold
 * off (e.g. until an earlier Reveal has finished), and `speed` in ms/char.
 */
function useTypewriter(
  text: string,
  { speed = 55, startDelay = 0, start = true } = {},
) {
  const [output, setOutput] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!start) return

    let charTimer: ReturnType<typeof setTimeout>
    const startTimer = setTimeout(() => {
      let i = 0
      const tick = () => {
        i += 1
        setOutput(text.slice(0, i))
        if (i < text.length) {
          charTimer = setTimeout(tick, speed)
        } else {
          setDone(true)
        }
      }
      tick()
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(charTimer)
    }
  }, [text, speed, startDelay, start])

  return { output, done }
}

/**
 * Hero + polaroid, combined into one file since the polaroid only ever
 * appears here. The "Currently" line now lives as a caption under the
 * photo itself, rather than its own card in the text column or its own
 * page section.
 */
export function Hero() {
  const [flipped, setFlipped] = useState(false)
  const [polaroidIn, setPolaroidIn] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)

    if (mq.matches) {
      // Skip the drop-in choreography entirely — show the final state.
      setPolaroidIn(true)
      return () => mq.removeEventListener('change', onChange)
    }

    // Let the text stagger (see Reveal delays below) lead, then have the
    // polaroid drop in after, so the eye has somewhere to land first.
    const t = setTimeout(() => setPolaroidIn(true), 450)
    return () => {
      clearTimeout(t)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  // Headline types out once the two Reveal items above it (delay 0, 90)
  // have finished settling in. 180ms matches the h1's own Reveal delay
  // so the wrapper fade and the first keystroke land together.
  const { output: typedHeadline, done: typingDone } = useTypewriter(HEADLINE, {
    speed: 55,
    startDelay: 180,
    start: !reducedMotion,
  })

  return (
    <header id="hero" className="relative overflow-hidden bg-accent">
      <ParallaxBackdrop variant="cococream" speed={0.22} />

      {/* Subtle static grain so the flat color block reads as paper/
          texture rather than a flat CSS fill. Static — no motion, so it's
          unaffected by prefers-reduced-motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* A couple of extra scrapbook stickers, floating at slightly
          different depths/rhythms from each other so the cluster reads
          as intentional rather than one lonely sticker. */}
      <Sparkles
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute top-28 right-[38%] size-5 -rotate-12 text-primary/50 sm:top-32',
          !reducedMotion && 'animate-sticker-float',
        )}
      />
      <Sparkles
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute bottom-24 left-[6%] size-4 rotate-6 text-primary/40',
          !reducedMotion && 'animate-sticker-float [animation-delay:1.1s]',
        )}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 pt-36 pb-16 sm:px-8 sm:pt-44 md:flex-row md:items-center md:justify-between md:gap-14">
        <div className="flex max-w-xl flex-col gap-6">
          <Reveal delay={0}>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              <span className="eyebrow text-muted-foreground">
                Open to PM &amp; Software Engineering roles
              </span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <p className="eyebrow text-muted-foreground">
              Jasmine Tan — Portfolio
            </p>
          </Reveal>

          <Reveal delay={180}>
            {/* aria-label carries the full string for screen readers /
                SEO so they don't read partial characters mid-type; the
                visible span is aria-hidden and is what actually animates. */}
            <h1
              aria-label={HEADLINE}
              className={cn(
                'display text-5xl leading-[0.95] text-balance sm:text-6xl lg:text-7xl',
                !reducedMotion && typingDone && 'animate-breathe',
              )}
            >
              <span aria-hidden="true">
                {reducedMotion ? HEADLINE : typedHeadline}
                {!reducedMotion && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'ml-0.5 -mb-[0.05em] inline-block h-[0.8em] w-[3px] align-middle bg-foreground/80',
                      typingDone && 'animate-caret-blink',
                    )}
                  />
                )}
              </span>
            </h1>
          </Reveal>

          {/* Shorter copy now, so this dropped a size step (was
              text-xl/2xl/1.75rem) and gained max-w + text-balance —
              that's what was pushing "back?" onto its own orphan line;
              balance lets the browser pick break points that keep the
              last line from being that short. */}
          <Reveal delay={280}>
            <p className="max-w-[36ch] text-balance font-sans text-lg leading-snug font-light text-muted-foreground sm:text-xl lg:text-2xl">
              My favorite problems sit between people and process: how can we
              build tech that gives time back?
            </p>
          </Reveal>

          {/* Hard offset "sticker" shadow instead of a plain pill — reads
              more like paper (matches the Tape language elsewhere) than a
              generic rounded CTA. */}
          <Reveal delay={480}>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[3px_3px_0_0_theme(colors.foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_0_theme(colors.foreground)] active:translate-y-0 active:shadow-[1px_1px_0_0_theme(colors.foreground)]"
              >
                See the work
                <ArrowDown
                  className="size-4 transition-transform duration-300 group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Polaroid photo — click to flip to a longer "currently" note.
            The short version now lives as a caption under the photo at
            all times (not just on flip), title bolded so it reads like a
            polaroid label. Outer div: one-time spring drop-in on mount
            (opacity/translate/scale only). Middle div: continuous idle
            sway once settled (rotate only, paused on hover). */}
        <div
          className={cn(
            'relative mx-auto w-[15rem] shrink-0 sm:w-[18rem]',
            'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            polaroidIn
              ? 'translate-y-0 scale-100 opacity-100'
              : '-translate-y-10 scale-90 opacity-0',
          )}
        >
          <div
            className={cn(
              polaroidIn && !reducedMotion && 'animate-polaroid-sway',
              'hover:[animation-play-state:paused]',
            )}
          >
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              aria-pressed={flipped}
              className={cn(
                'paper-edge group block w-full rounded-sm bg-card p-3 pb-4 text-left transition-transform duration-300 ease-out',
                flipped
                  ? 'rotate-1'
                  : '-rotate-2 hover:rotate-0 hover:scale-[1.02]',
              )}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {flipped ? (
                  <div className="flex h-full flex-col justify-center gap-2 p-4">
                    <p className="display text-xl leading-snug">
                      Currently preparing Caliber&apos;s project management platform and
                      SciTrek&apos;s volunteer scheduler for launch.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reaching 250+ undergraduate students beginning Fall 2026.
                    </p>
                  </div>
                ) : (
                  <Image
                    src="/images/headshot2.png"
                    alt="Jasmine Tan"
                    fill
                    sizes="(max-width: 640px) 240px, 264px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {/* Caption strip — always visible, independent of flip
                  state. Bolded title per your note; keep this short since
                  the polaroid is narrow (15rem on mobile). */}
              <p className="mt-2.5 text-[0.8rem] leading-snug text-foreground/80">
                <span className="font-semibold text-foreground">
                  Development Team
                </span>
                , Caliber Research Group
              </p>
              <p className="mt-1 eyebrow text-muted-foreground">
                {flipped ? 'click to flip back' : 'click for more →'}
              </p>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes polaroid-sway {
          0%,
          100% {
            transform: rotate(-1.5deg);
          }
          50% {
            transform: rotate(1.5deg);
          }
        }
        .animate-polaroid-sway {
          animation: polaroid-sway 6s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.015);
          }
        }
        .animate-breathe {
          display: inline-block;
          animation: breathe 6s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes sticker-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-sticker-float {
          animation: sticker-float 4.5s ease-in-out infinite;
        }

        @keyframes caret-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        .animate-caret-blink {
          animation: caret-blink 1s step-end infinite;
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-4deg);
          }
          75% {
            transform: rotate(4deg);
          }
        }
      `}</style>
    </header>
  )
}