import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ProjectImage, StatusChip, Tags } from '@/components/project-bits'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/scrapbook'
import { projects, type Project } from '@/lib/projects'

/** Deterministic 0–1 "random" from an index, identical on server and client. */
function rand(i: number, salt: number) {
  let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b)
  h ^= h >>> 15
  h = Math.imul(h, 0x2c1b3c6d)
  h ^= h >>> 12
  h = Math.imul(h, 0x297a2d39)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}
const r2 = (n: number) => Math.round(n * 100) / 100

// Per-card tilt and its own breathing rhythm, so the grid never moves in
// lockstep.
const LAYOUT = projects.map((_, i) => ({
  rot: r2((rand(i, 2) - 0.5) * 2),
  bobDur: r2(5.5 + rand(i, 4) * 3.5),
  bobDelay: r2(-rand(i, 5) * 7),
  bobX: r2((rand(i, 6) - 0.5) * 3),
  bobY: r2(3 + rand(i, 7) * 3),
}))

/**
 * Featured projects: every project visible at a glance (3 across on
 * desktop, 2 on tablets, 1 on phones). Each card tilts slightly and
 * breathes on its own rhythm, backlights on hover/focus, and links to its
 * own case-study page at /projects/<slug>.
 */
export function FeaturedProjects() {
  return (
    <section
      id="projects"
      className="relative scroll-mt-20 bg-sky py-10 sm:py-14"
    >
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Reveal>
            <SectionHeading title="Featured projects" />
          </Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-1">
            <p className="text-sm text-muted-foreground">Click any card for the full case study.</p>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="rounded-full bg-card px-2 py-0.5 text-foreground/75">tech</span>
              <span className="rounded-full border border-foreground/30 px-2 py-0.5 text-foreground/75">product</span>
            </span>
          </div>
        </div>

        <ul className="mt-7 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Reveal delay={(i % 3) * 80}>
                <ProjectCard project={project} layout={LAYOUT[i]} priority={i < 3} />
              </Reveal>
            </li>
          ))}
        </ul>

      </div>

      <style>{`
        @keyframes card-breathe {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: var(--bob-x, 0) calc(var(--bob-y, 4px) * -1);
          }
        }
        .card-breathe {
          animation: card-breathe var(--bob-dur, 6s) ease-in-out var(--bob-delay, 0s) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-breathe {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

function ProjectCard({
  project,
  layout,
  priority,
}: {
  project: Project
  layout: (typeof LAYOUT)[number]
  priority: boolean
}) {
  return (
    // Outer: slight tilt + its own breathing rhythm.
    <div
      className="card-breathe h-full"
      style={
        {
          rotate: `${layout.rot}deg`,
          '--bob-dur': `${layout.bobDur}s`,
          '--bob-delay': `${layout.bobDelay}s`,
          '--bob-x': `${layout.bobX}px`,
          '--bob-y': `${layout.bobY}px`,
        } as CSSProperties
      }
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group relative isolate block h-full outline-none"
      >
        {/* Backlight: soft warm "sunlight" behind the card on hover/focus. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              'radial-gradient(closest-side, oklch(0.96 0.06 88 / 0.95) 30%, oklch(0.94 0.05 85 / 0.5) 62%, transparent)',
          }}
        />

        <article className="paper-edge relative flex h-full flex-col overflow-hidden rounded-sm border border-foreground/10 bg-card transition-[translate,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_-18px_rgb(0_0_0_/_0.3)] group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <ProjectImage
              project={project}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
              priority={priority}
              className="transition-[filter,scale] duration-500 group-hover:scale-[1.03] group-hover:brightness-105"
            />
            <StatusChip status={project.status} className="absolute top-2.5 left-2.5" />
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <div>
              <h3 className="display text-lg leading-tight">{project.name}</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{project.role}</p>
            </div>
            <p className="line-clamp-2 text-[0.85rem] leading-snug text-foreground/85">{project.tagline}</p>
            <Tags project={project} compact className="pt-0.5" />
            {/* mt-auto pins this to the bottom so every card in a row lines up */}
            <span className="mt-auto inline-flex items-center gap-1.5 pt-1.5 text-[0.8rem] font-medium text-foreground/65 transition-colors group-hover:text-foreground">
              {project.caseStudy ? 'Read case study' : 'View project'}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </article>
      </Link>
    </div>
  )
}