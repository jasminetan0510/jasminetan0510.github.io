'use client'

import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { SectionHeading } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

/**
 * Case studies follow the way PM recruiters read: what was wrong, what you
 * decided (and why), what happened, plus one concrete artifact.
 */
type Artifact =
  | { kind: 'metric'; value: string; label: string }
  | { kind: 'prd'; title: string; lines: string[] }
  | { kind: 'flow'; title: string; steps: string[] }
  | { kind: 'image'; src: string; alt: string; caption: string }

type CaseStudy = {
  problem: string
  decision: string
  outcome: string
  artifact?: Artifact
  reflection?: string
}

type Project = {
  name: string
  role: string
  status: string
  device: 'laptop' | 'phone'
  tagline: string // one-line, high-level: shown on the floating card
  summary: string
  outcome: string
  stack: string[] // technical tags
  pm: string[] // product / PM tags
  image?: string // omit until you have a screenshot; a placeholder shows instead
  href?: string // GitHub / live link; omit and no link button renders
  caseStudy?: CaseStudy // rendered in the modal
  caseStudyDraft?: CaseStudy // your notes in progress; never rendered
}

const projects: Project[] = [
  {
    name: 'Tenant-Side Leasing Platform',
    role: 'Team Lead · UCSB × AppFolio Capstone, team of 5',
    tagline: 'A tenant-facing leasing app built with AppFolio, from kickoff to handoff.', // TODO: edit
    status: 'Fall 2026 \u2013 Winter 2027',
    device: 'laptop',
    summary:
      'A six-month industry capstone sponsored by AppFolio. Our five-person team is building a tenant-facing leasing app in Ruby on Rails on top of AppFolio\u2019s property API, with weekly check-ins with our AppFolio sponsor.',
    outcome:
      'UCSB\u2019s senior capstone, Fall 2026 \u2013 Winter 2027: a six-month build with AppFolio\u2019s industry sponsors on their property API.',
    stack: ['Ruby on Rails', 'AppFolio API'],
    pm: ['Sponsor management', 'Team leadership', 'Scoping'], // TODO: edit
    // TODO: add a screenshot, then: image: '/images/project-appfolio.png',
    // Document this one as you go, then rename to `caseStudy` to publish it.
    caseStudyDraft: {
      problem: 'TODO \u2014 what\u2019s painful about the tenant side of leasing today, in one or two sentences?',
      decision: 'TODO \u2014 the biggest scoping call you made with AppFolio, and why.',
      outcome: 'TODO \u2014 what shipped by the end, and one number if you have it.',
      artifact: {
        kind: 'prd',
        title: 'TODO \u2014 PRD excerpt: problem statement',
        lines: ['TODO \u2014 user', 'TODO \u2014 goal', 'TODO \u2014 success metric', 'TODO \u2014 out of scope'],
      },
    },
  },
  {
    name: 'Caliber',
    role: 'Software Developer · Caliber Research Group, UCSB',
    tagline: 'A ticket tracker for a 20+ person team, plus an autograder redesign for 250+ students a quarter.',
    status: 'Shipping fall 2026',
    device: 'laptop',
    summary:
      'An AI-assisted course-planning and mastery-based-practice platform for university instruction, advised by Prof. Diba Mirza. I own two pieces of it: a project-management ticket tracker that coordinates a 20+ person team across 5 concurrent Caliber projects, and a redesign of the LeetCode Autograder\u2019s student submission flow and feedback interface.',
    outcome:
      'Tracker launching in the coming weeks; the autograder redesign launches fall 2026 in UCSB\u2019s CS8 and CS24 (250+ students/quarter). Contributed to platform work published at ACM ITiCSE \u201926.',
    stack: ['React', 'FastAPI', 'AI/LLM'],
    pm: ['Competitive analysis', 'Prototyping', 'Feedback loops'], // TODO: edit
    image: '/images/project-caliber.png',
    caseStudy: {
      problem:
        'The Caliber team had grown to 20+ people across 5 concurrent projects with no shared way to see who owned what. Work was getting tracked informally, which made it hard to tell what was in progress, blocked, or done. Separately, the LeetCode Autograder gave students a flat pass/fail with no breakdown of what actually went wrong.',
      // TODO: reword in your voice — lead with the call you made and why.
      decision:
        'We compared the tools the team already used (GitHub Projects for Kanban boards, Notion for dashboards), then prototyped our own tracker in Figma and built it. After demoing v1 at standup, we added project tags so one tracker could serve every project.',
      outcome:
        'A ticket tracker supporting creation, assignment, and self-claiming, with status, ownership, deadlines, and a change history \u2014 launching in the coming weeks for the whole 20+ person team. On the autograder side, restructured the 6-step grading pipeline into clear pass/fail breakdowns that separate what passed, what didn\u2019t, and what to fix, ahead of the fall 2026 launch.',
      // TODO: the 6-step submission pipeline makes a great artifact, e.g.
      // artifact: { kind: 'flow', title: 'Autograder submission pipeline', steps: ['…', '…'] },
      reflection:
        'If I were to rebuild this, I would implement different views, such as Calendar or Gallery to view all tickets, as well as different visualizations for basic progress tracking. We maintained a consistent TA and student feedback loop and implemented/revised features as requested.',
    },
  },
  {
    name: 'UCSB Project Dining',
    role: 'Team Lead · CS156 team of 6',
    tagline: 'Live tracking and ratings for meals at UCSB dining commons, delivered 100% on schedule.',
    status: 'Fall 2025',
    device: 'laptop',
    summary:
      'A live tracking and rating app for meals at UCSB\u2019s dining commons. I led a 6-person team extending an inherited legacy dining-menu web app: ran biweekly retros and standups, led code reviews, and resolved merge conflicts for the team.',
    outcome:
      'Introduced a same-day PR-review norm that eliminated review backlogs \u2014 delivered 100% of committed work on schedule.',
    stack: ['React', 'Spring Boot'],
    pm: ['Agile ceremonies', 'Process design', 'Code review'], // TODO: edit
    // project-ucsb-dining.png belongs to UCSB Project Dining (not KIT)
    image: '/images/project-ucsb-dining.png',
    href: 'https://github.com/ucsb-cs156-f25/proj-dining-f25-05',
    caseStudyDraft: {
      problem: 'TODO \u2014 what was broken in the legacy app or the team\u2019s process?',
      decision: 'TODO \u2014 the same-day PR-review norm: why that, over other fixes?',
      outcome: 'TODO \u2014 100% of committed work on schedule; anything else?',
      artifact: { kind: 'metric', value: '100%', label: 'of committed work delivered on schedule' },
    },
  },
  {
    name: 'SciTrek Volunteer Scheduler',
    role: 'Lead Developer & Maintainer · SciTrek',
    tagline: 'An ad-free, account-less scheduler replacing SignUpGenius for K-12 science outreach.',
    status: 'Sole maintainer',
    device: 'laptop',
    summary:
      'An account-less volunteer scheduling platform for UCSB SciTrek\u2019s K-12 outreach program, with a three-role UX (participant, admin, organizer) and quarterly CSV module imports. Inherited from graduating developers and built to replace SignUpGenius with something mobile-optimized and ad-free.',
    // TODO: still no hard number — volunteer count or admin hours saved?
    outcome:
      'Waitlist auto-promotion, scheduled reminder emails, and slot swaps. Seeded a full quarter of realistic volunteer and school data to demo admin and organizer workflows for non-technical coordinators ahead of a program-wide launch.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery/Redis', 'React', 'Vite'],
    pm: ['Role-based UX', 'Launch planning', 'Stakeholder demos'], // TODO: edit
    image: '/images/project-scitrek.png',
    href: 'https://github.com/Anteater10/uni-volunteer-scheduler',
    caseStudyDraft: {
      problem: 'TODO \u2014 what was broken about using SignUpGenius here?',
      decision: 'TODO \u2014 why account-less, and why these three roles?',
      outcome: 'TODO \u2014 what shipped, and one number if you have it.',
    },
  },
  {
    name: 'yunie: Productivity Agent',
    role: 'Solo project',
    tagline: 'A conversational assistant for tasks, reminders, and goals.', // TODO: edit
    status: 'Resuming now',
    device: 'laptop',
    summary:
      'An AI-powered assistant enabling conversational task management, context-aware reminders, intelligent scheduling, and dynamic goal tracking.',
    outcome: 'Full-stack, with persistent chat history and secure auth built in.',
    stack: ['React', 'Node.js', 'OpenAI API'],
    pm: ['Product vision', 'Solo build'], // TODO: edit
    image: '/images/project-yunie.png',
    caseStudyDraft: {
      problem: 'TODO \u2014 what problem were you actually trying to solve for yourself?',
      decision: 'TODO \u2014 the main design or scope decision, and why.',
      outcome: 'TODO \u2014 what works today?',
    },
  },
  {
    name: 'KIT: Kitchen Inventory Tracking',
    role: 'Mobile Developer · CS184 team of 7',
    tagline: 'Scans receipts and tracks inventory to cut food waste and meal-planning mental load.',
    status: 'Winter 2026',
    device: 'phone',
    summary:
      'A cross-platform app that scans receipts and tracks kitchen inventory to cut food waste and reduce meal-planning mental load, built from scratch with a 7-person team. I owned the home dashboard and environmental-impact scoring, which power expiration alerts and recipe matching.',
    outcome:
      'OCR receipt scanning, barcode lookup, and recipe suggestions, backed by Supabase. 62 commits, #3 on the team by volume.',
    stack: ['React Native', 'Expo', 'FastAPI', 'Supabase'],
    pm: ['Feature ownership', 'Impact metrics', 'Cross-functional team'], // TODO: edit
    // project-kit.png belongs to KIT (not UCSB Project Dining)
    image: '/images/project-kit.png',
    href: 'https://github.com/ucsb-cs184-w26/team12-KIT',
    caseStudyDraft: {
      problem: 'TODO \u2014 what was broken about tracking kitchen inventory here?',
      decision: 'TODO \u2014 why OCR + barcode instead of manual entry first?',
      outcome: 'TODO \u2014 what shipped, in plain terms?',
    },
  },
]

/** The one concrete artifact in a case study. */
function ArtifactView({ artifact }: { artifact: Artifact }) {
  switch (artifact.kind) {
    case 'metric':
      return (
        <div className="rounded-sm border border-border bg-secondary/60 px-5 py-4">
          <p className="display text-4xl leading-none">{artifact.value}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{artifact.label}</p>
        </div>
      )
    case 'prd':
      return (
        <figure className="rounded-sm border border-border bg-background px-5 py-4">
          <figcaption className="text-sm font-semibold">{artifact.title}</figcaption>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-foreground/80">
            {artifact.lines.map((line) => (
              <li key={line} className="border-l-2 border-foreground/20 pl-3">
                {line}
              </li>
            ))}
          </ul>
        </figure>
      )
    case 'flow':
      return (
        <figure>
          <figcaption className="text-sm font-semibold">{artifact.title}</figcaption>
          <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
            {artifact.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className="rounded-full border border-border bg-background px-3 py-1">
                  <span className="mr-1.5 tabular-nums text-muted-foreground">{i + 1}</span>
                  {step}
                </span>
                {i < artifact.steps.length - 1 && (
                  <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </figure>
      )
    case 'image':
      return (
        <figure>
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border bg-muted">
            <Image src={artifact.src} alt={artifact.alt} fill sizes="640px" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-sm text-muted-foreground">{artifact.caption}</figcaption>
        </figure>
      )
  }
}


/* ------------------------------------------------------------------ */
/*  Grid layout                                                        */
/* ------------------------------------------------------------------ */

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

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Featured projects: every project visible at a glance in a grid (3 across
 * on desktop, so 2 rows of 3; 2 across on tablets; 1 on phones). Each card
 * tilts slightly and breathes on its own rhythm. Hovering or focusing a
 * card backlights it; clicking opens the case study.
 *
 * The case-study modal traps focus, closes on Escape, and returns focus to
 * the card that opened it. Reduced motion: the breathing stops.
 */
export function FeaturedProjects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const activeDetailsProject = openIndex !== null ? projects[openIndex] : null

  // Modal: scroll lock, Escape, focus trap, focus return.
  useEffect(() => {
    if (openIndex === null) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenIndex(null)
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      returnFocusRef.current?.focus({ preventScroll: true })
    }
  }, [openIndex])

  function openDetails(i: number, el: HTMLElement) {
    returnFocusRef.current = el
    setOpenIndex(i)
  }

  return (
    <section id="projects" className="relative scroll-mt-8 bg-sky py-10 sm:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading index="01" title="Featured projects" />
        </Reveal>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-sm text-muted-foreground">Click any card for the full case study.</p>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="rounded-full bg-card px-2 py-0.5 text-foreground/75">tech</span>
            <span className="rounded-full border border-foreground/30 px-2 py-0.5 text-foreground/75">product</span>
          </span>
        </div>

        <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <li key={project.name}>
              <Reveal delay={(i % 3) * 80}>
                <ProjectCard
                  project={project}
                  layout={LAYOUT[i]}
                  eagerImage={i < 3}
                  onOpen={(el) => openDetails(i, el)}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* Details modal. Summary + tags always show; the problem →
          decision → outcome breakdown only renders for a real `caseStudy`
          (drafts are never rendered). */}
      {activeDetailsProject ? (
        <div
          className="journal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            onClick={(event) => event.stopPropagation()}
            className="journal-panel paper-edge relative my-8 w-full max-w-2xl -rotate-[0.4deg] rounded-sm border border-border bg-card p-6 sm:my-0 sm:p-10"
          >

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close project details"
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={activeDetailsProject.status} />
              <p className="text-sm text-muted-foreground">{activeDetailsProject.role}</p>
            </div>
            <h3 id="project-details-title" className="mt-2 display text-3xl leading-[1.05] text-balance sm:text-4xl">
              {activeDetailsProject.name}
            </h3>

            <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-foreground/85">
              {activeDetailsProject.summary}
            </p>
            <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-foreground/85">
              {activeDetailsProject.outcome}
            </p>

            <Tags project={activeDetailsProject} className="mt-4" />

            {activeDetailsProject.caseStudy ? (
              <div className="mt-6 flex flex-col gap-5 text-[0.95rem] leading-relaxed text-foreground/85">
                <div>
                  <p className="eyebrow mb-1.5 text-primary">The problem</p>
                  <p className="max-w-prose">{activeDetailsProject.caseStudy.problem}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5 text-primary">The decision</p>
                  <p className="max-w-prose">{activeDetailsProject.caseStudy.decision}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5 text-primary">The outcome</p>
                  <p className="max-w-prose">{activeDetailsProject.caseStudy.outcome}</p>
                </div>
                {activeDetailsProject.caseStudy.artifact ? (
                  <div>
                    <p className="eyebrow mb-2 text-primary">Artifact</p>
                    <ArtifactView artifact={activeDetailsProject.caseStudy.artifact} />
                  </div>
                ) : null}
                {activeDetailsProject.caseStudy.reflection ? (
                  <div>
                    <p className="eyebrow mb-1.5 text-primary">What I&apos;d do differently</p>
                    <p className="max-w-prose">{activeDetailsProject.caseStudy.reflection}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeDetailsProject.href ? (
              <a
                href={activeDetailsProject.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-input px-4 py-2 text-sm font-medium transition hover:bg-secondary"
              >
                View on GitHub
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <style jsx global>{`
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

/** Tech tags filled, product tags outlined. `compact` (on the floating
 *  cards) shows at most 3 tech + 2 product tags at a smaller size; the modal
 *  shows them all. */
function Tags({ project, className, compact }: { project: Project; className?: string; compact?: boolean }) {
  const stack = compact ? project.stack.slice(0, 3) : project.stack
  const pm = compact ? project.pm.slice(0, 2) : project.pm
  const size = compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {stack.map((t) => (
        <span key={t} className={cn('rounded-full bg-secondary text-foreground/75', size)}>
          {t}
        </span>
      ))}
      {pm.map((t) => (
        <span key={t} className={cn('rounded-full border border-foreground/25 text-foreground/75', size)}>
          {t}
        </span>
      ))}
    </div>
  )
}

/** Small, quiet date/status label. Replaces the taped labels, which
 *  wrapped onto several lines for longer statuses. */
function StatusChip({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center whitespace-nowrap rounded-full bg-card px-2.5 py-0.5 text-[11px] font-medium text-foreground/70 shadow-sm ring-1 ring-foreground/10',
        className,
      )}
    >
      {status}
    </span>
  )
}

type ProjectCardProps = {
  project: Project
  layout: (typeof LAYOUT)[number]
  eagerImage: boolean
  onOpen: (el: HTMLElement) => void
}

function ProjectCard({ project, layout, eagerImage, onOpen }: ProjectCardProps) {
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
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        aria-label={`${project.name}: ${project.tagline} Open case study.`}
        className="group relative isolate block h-full w-full text-left outline-none"
      >
        {/* Backlight: soft warm "sunlight" that fades up behind the card on
            hover/focus. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              'radial-gradient(closest-side, oklch(0.96 0.06 88 / 0.95) 30%, oklch(0.94 0.05 85 / 0.5) 62%, transparent)',
          }}
        />

        <div className="paper-edge relative flex h-full flex-col overflow-hidden rounded-sm border border-foreground/10 bg-card transition-[translate,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_-18px_rgb(0_0_0_/_0.3)] group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            {project.image ? (
              <Image
                src={project.image}
                alt=""
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
                loading={eagerImage ? 'eager' : 'lazy'}
                className={cn(
                  'transition-[filter,scale] duration-500 group-hover:scale-[1.03] group-hover:brightness-105',
                  project.device === 'phone' ? 'object-contain p-2.5' : 'object-cover',
                )}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_oklch,var(--foreground)_5%,transparent)_10px_20px)] text-xs text-muted-foreground">
                screens coming soon
              </div>
            )}
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
              {project.caseStudy ? 'Read case study' : 'View details'}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}