import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { getProject } from '@/lib/projects'

/**
 * One teammate quote, set large, just above the footer's call to action:
 * the last thing a visitor reads before deciding to reach out. Pulled from
 * the project's data in lib/projects.ts, so it stays in sync with the
 * project page. Change PROJECT / QUOTE_INDEX to feature a different quote.
 */
const PROJECT = 'ucsb-project-dining'
const QUOTE_INDEX = 0

export function PullQuote() {
  const project = getProject(PROJECT)
  const q = project?.quotes?.[QUOTE_INDEX]
  if (!project || !q) return null

  return (
    <section aria-label="What a teammate said" className="bg-background py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <figure className="relative max-w-3xl pl-8 sm:pl-12">
            <span
              aria-hidden="true"
              className="display absolute -top-3 left-0 text-6xl leading-none text-foreground/20 sm:-top-5 sm:text-7xl"
            >
              &ldquo;
            </span>
            <blockquote className="text-xl leading-snug font-light text-balance text-foreground/90 sm:text-2xl">
              {q.quote}
            </blockquote>
            <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
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
        </Reveal>
      </div>
    </section>
  )
}