'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, type CSSProperties } from 'react'
import { ProjectImage } from '@/components/project-bits'
import { SectionHeading } from '@/components/scrapbook'
import { projects, type Project } from '@/lib/projects'

/**
 * Featured projects: a calm, even grid (3 across on desktop, 2 on tablets,
 * 1 on phones). No tilt or bobbing; the life comes from motion that
 * responds to the visitor:
 *
 * - Scroll reveal: as the grid enters the screen, cards rise and fade in
 *   one after another, and each image settles from a slight zoom + blur
 *   into focus. Plays once.
 * - Hover / keyboard focus: the card lifts a little, the image eases in,
 *   and the arrow slides up-right.
 *
 * Reduced motion: everything is simply visible, with no movement.
 * No JS (or before hydration): cards are visible; the reveal only hides
 * them once the script has confirmed it can animate them.
 */
export function FeaturedProjects() {
  const gridRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-reveal]'))
    // Only animate cards that start below the fold, so nothing already
    // on screen blinks out and back in.
    const below = cards.filter((c) => c.getBoundingClientRect().top > window.innerHeight)
    below.forEach((c) => c.setAttribute('data-reveal', 'pending'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-reveal', 'shown')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    )
    below.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <section id="projects" className="relative scroll-mt-20 bg-sky py-14 sm:py-20">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionHeading title="Featured projects" />
          <p className="pb-1 text-sm text-muted-foreground">Selected work, with case studies.</p>
        </div>

        <ul ref={gridRef} className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <li
              key={project.slug}
              data-reveal="idle"
              // Stagger by column so each row ripples left to right.
              style={{ '--stagger': `${(i % 3) * 90}ms` } as CSSProperties}
              className="project-reveal"
            >
              <ProjectCard project={project} index={i} priority={i < 3} />
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        /* Scroll reveal */
        .project-reveal {
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
            translate 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms);
        }
        .project-reveal .project-img {
          transition: scale 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
            filter 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms);
        }
        .project-reveal[data-reveal='pending'] {
          opacity: 0;
          translate: 0 24px;
        }
        .project-reveal[data-reveal='pending'] .project-img {
          scale: 1.06;
          filter: blur(6px);
        }
        @media (prefers-reduced-motion: reduce) {
          .project-reveal,
          .project-reveal .project-img {
            transition: none;
          }
        }
      `}</style>
    </section>
  )
}

function ProjectCard({ project, index, priority }: { project: Project; index: number; priority: boolean }) {
  const tags = [...project.stack.slice(0, 3), ...project.pm.slice(0, 1)]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card transition-[translate,box-shadow,border-color] duration-300 ease-out outline-none hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0_/_0.35)] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-foreground/10 bg-muted">
        <div className="project-img absolute inset-0">
          <ProjectImage
            project={project}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 320px"
            priority={priority}
            className="transition-[scale] duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Index + status, like a quiet label row */}
        <div className="flex items-center justify-between text-[11px] tracking-wide text-muted-foreground">
          <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-foreground/40" aria-hidden="true" />
            {project.status}
          </span>
        </div>

        <h3 className="display mt-3 flex items-start justify-between gap-3 text-xl leading-tight">
          {project.name}
          <ArrowUpRight
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-foreground/40 transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
          />
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{project.role}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/80">{project.tagline}</p>

        {/* Tags as quiet text, not pills: cleaner, and they never wrap into a wall */}
        <p className="mt-auto pt-4 text-xs text-muted-foreground">{tags.join(' · ')}</p>
      </div>
    </Link>
  )
}