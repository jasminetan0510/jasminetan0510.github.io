'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { getProject } from '@/lib/projects'

/**
 * One teammate quote, set large, just above the footer's call to action:
 * the last thing a visitor reads before deciding to reach out. Pulled from
 * the project's data in lib/projects.ts, so it stays in sync with the
 * project page. Change PROJECT / QUOTE_INDEX to feature a different quote.
 *
 * Animation: scroll-linked word highlight. The quote starts faint, and each
 * word fills in to full ink as the quote scrolls up through the screen, so
 * it "reads itself" at the visitor's own pace. It runs only while scrolling
 * and reverses if you scroll back up.
 * - Server HTML / no JS: the quote is fully visible (no faint state).
 * - Reduced motion: fully visible, no effect.
 */
const PROJECT = 'ucsb-project-dining'
const QUOTE_INDEX = 0

const FAINT = 0.18 // starting opacity of unread words

export function PullQuote() {
  const project = getProject(PROJECT)
  const q = project?.quotes?.[QUOTE_INDEX]
  const quoteRef = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const el = quoteRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'))
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the quote's top reaches 85% down the screen, 1 when it
      // reaches 40% down. Measured on the top edge so it always finishes,
      // even though the quote sits near the end of the page.
      const start = vh * 0.85
      const end = vh * 0.4
      let progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      // At the very bottom of the page, always show the whole quote.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) progress = 1
      const lit = progress * words.length
      words.forEach((w, i) => {
        // Each word eases in over the span of ~1 word.
        const t = Math.min(1, Math.max(0, lit - i))
        w.style.opacity = String(FAINT + (1 - FAINT) * t)
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      words.forEach((w) => (w.style.opacity = ''))
    }
  }, [])

  if (!project || !q) return null
  const words = q.quote.split(/\s+/)

  return (
    <section aria-label="What a teammate said" className="bg-background py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <figure className="max-w-3xl">
          <p className="eyebrow text-muted-foreground">From a teammate</p>

          <blockquote
            ref={quoteRef}
            className="mt-5 text-2xl leading-snug font-light text-pretty text-foreground sm:text-[1.75rem]"          >
            <span aria-hidden="true" className="text-foreground/30">
              &ldquo;
            </span>
            {words.map((w, i) => (
              <span key={i} data-word className="transition-opacity duration-150">
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
            <span aria-hidden="true" className="text-foreground/30">
              &rdquo;
            </span>
          </blockquote>

          <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-foreground/25" />
            <span>{q.source}</span>
            <span aria-hidden="true" className="text-foreground/25">
              ·
            </span>
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-1 font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Read the case study
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}