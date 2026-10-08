'use client'

import { ArrowRight, ArrowUpRight, Pause, Play, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
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
  image: string
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
    // project-appfolio.png belongs to the AppFolio capstone. Add it before deploying.
    image: '/images/project-appfolio.png',
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
/*  Lazy river layout                                                  */
/* ------------------------------------------------------------------ */

const SPEED = 24 // px per second: alive, but slow enough to read at a glance
const COPIES = 3 // the list is repeated so the river loops seamlessly

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

// Per-card stagger: vertical offset, tilt, spacing, and its own bob rhythm.
const LAYOUT = projects.map((_, i) => ({
  y: Math.round(rand(i, 1) * 64),
  rot: r2((rand(i, 2) - 0.5) * 2.6),
  gap: 28 + Math.round(rand(i, 3) * 44),
  bobDur: r2(5.5 + rand(i, 4) * 3.5),
  bobDelay: r2(-rand(i, 5) * 7),
  bobX: r2((rand(i, 6) - 0.5) * 6),
  bobY: r2(5 + rand(i, 7) * 6),
}))

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Featured projects as a "lazy river": cards drift right-to-left across the
 * full width, each at its own height and tilt, each bobbing on its own
 * rhythm. Hovering (or focusing) a card eases the river to a stop and
 * backlights the card; clicking opens the case study.
 *
 * - Drag or swipe the river to browse. A drag never counts as a click.
 * - Pause button (WCAG 2.2.2: moving content needs a way to stop it).
 * - Reduced motion: no drift or bob; the row becomes a normal
 *   horizontally scrollable strip.
 * - Only the first copy of the list is in the tab order / accessibility
 *   tree; the repeats are visual only. Tabbing to a card scrolls it into
 *   view.
 * - The case-study modal traps focus, closes on Escape, and returns focus
 *   to the card that opened it.
 */
export function FeaturedProjects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const setRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Everything the animation loop reads lives in one ref, so hovering,
  // dragging, etc. never re-render React.
  const river = useRef({
    offset: 0,
    speed: SPEED,
    width: 1,
    pendingShift: 0,
    hovered: false,
    focused: false,
    paused: false,
    modal: false,
    drag: null as null | { id: number; x: number; moved: number; captured: boolean },
    suppressClick: false,
  })

  const activeDetailsProject = openIndex !== null ? projects[openIndex] : null

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    river.current.paused = paused
  }, [paused])
  useEffect(() => {
    river.current.modal = openIndex !== null
  }, [openIndex])

  // The river loop.
  useEffect(() => {
    if (reducedMotion) return
    const viewport = viewportRef.current
    const track = trackRef.current
    const set = setRef.current
    if (!viewport || !track || !set) return
    const r = river.current

    const measure = () => {
      r.width = Math.max(1, set.offsetWidth)
    }
    measure()
    // Start with the first card just inside the left edge.
    r.offset = r.width - 40
    const ro = new ResizeObserver(measure)
    ro.observe(set)

    let raf = 0
    let last = 0
    let onScreen = true

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      const stopped = r.paused || r.hovered || r.focused || r.modal || r.drag !== null
      // Ease in and out of stops so it glides rather than snaps.
      r.speed += ((stopped ? 0 : SPEED) - r.speed) * (1 - Math.exp(-dt * 3))
      r.offset += r.speed * dt
      if (r.pendingShift) {
        const step = r.pendingShift * (1 - Math.exp(-dt * 10))
        r.offset += step
        r.pendingShift = Math.abs(r.pendingShift - step) < 0.5 ? 0 : r.pendingShift - step
      }
      const x = ((r.offset % r.width) + r.width) % r.width
      track.style.transform = `translate3d(${-x}px, 0, 0)`
      raf = requestAnimationFrame(frame)
    }
    const start = () => {
      if (raf || !onScreen || document.hidden) return
      last = 0
      raf = requestAnimationFrame(frame)
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
    io.observe(viewport)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      track.style.transform = ''
    }
  }, [reducedMotion])

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
    if (river.current.suppressClick) return
    returnFocusRef.current = el
    setOpenIndex(i)
  }

  // Tabbing to a card: glide the river so the card is fully in view.
  function bringIntoView(el: HTMLElement) {
    const r = river.current
    const viewport = viewportRef.current
    if (reducedMotion || !viewport) return
    const vp = viewport.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    const pad = 32
    let shift = 0
    if (box.left < vp.left + pad) shift = box.left - (vp.left + pad)
    else if (box.right > vp.right - pad) shift = box.right - (vp.right - pad)
    // Visually identical copies repeat every `width` px; take the shortest way.
    shift = ((((shift + r.width / 2) % r.width) + r.width) % r.width) - r.width / 2
    r.pendingShift = shift
  }

  // Drag / swipe to browse. Pointer capture only starts once it's clearly a
  // drag, so a plain click or tap still reaches the card.
  function onPointerDown(e: React.PointerEvent) {
    if (reducedMotion || (e.pointerType === 'mouse' && e.button !== 0)) return
    river.current.drag = { id: e.pointerId, x: e.clientX, moved: 0, captured: false }
    river.current.suppressClick = false
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = river.current.drag
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    d.x = e.clientX
    d.moved += Math.abs(dx)
    if (d.moved > 6 && !d.captured) {
      d.captured = true
      viewportRef.current?.setPointerCapture(e.pointerId)
    }
    if (d.captured) river.current.offset -= dx
  }
  function endDrag(e: React.PointerEvent) {
    const d = river.current.drag
    if (!d || d.id !== e.pointerId) return
    river.current.suppressClick = d.captured
    river.current.drag = null
    // Let the click that follows this pointerup see suppressClick, then reset.
    setTimeout(() => (river.current.suppressClick = false), 0)
  }

  const copies = reducedMotion ? 1 : COPIES

  return (
    <section id="projects" className="relative scroll-mt-8 overflow-hidden bg-secondary py-10 sm:py-14">
      <ParallaxBackdrop variant="seabreeze" speed={0.14} />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading index="01" title="Featured projects" />
        </Reveal>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-sm text-muted-foreground">
            {reducedMotion ? 'Scroll sideways to browse.' : 'Hover a card to stop it, or drag to browse.'} Click
            any card for the full case study.
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="rounded-full bg-card px-2 py-0.5 text-foreground/75">tech</span>
              <span className="rounded-full border border-foreground/30 px-2 py-0.5 text-foreground/75">product</span>
            </span>
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Resume moving projects' : 'Pause moving projects'}
                className="inline-flex size-8 items-center justify-center rounded-full bg-card text-foreground/70 transition-colors hover:text-foreground"
              >
                {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* The river: full-bleed, edges faded so cards drift in and out. */}
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'relative mt-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]',
          reducedMotion ? 'snap-x overflow-x-auto' : 'touch-pan-y overflow-hidden select-none',
        )}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {Array.from({ length: copies }, (_, copy) => (
            <div
              key={copy}
              ref={copy === 0 ? setRef : undefined}
              aria-hidden={copy > 0 ? true : undefined}
              className="flex shrink-0 items-start px-0 pt-12 pb-16"
              style={copy === 0 && reducedMotion ? { paddingLeft: 32 } : undefined}
            >
              {projects.map((project, i) => (
                <RiverCard
                  key={project.name}
                  project={project}
                  layout={LAYOUT[i]}
                  interactive={copy === 0}
                  eagerImage={copy === 0}
                  onOpen={(el) => openDetails(i, el)}
                  onHover={(h) => (river.current.hovered = h)}
                  onFocusChange={(f, el) => {
                    river.current.focused = f
                    if (f && el) bringIntoView(el)
                  }}
                />
              ))}
            </div>
          ))}
        </div>
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
            <Tape className="-top-3 left-10 -rotate-3" label={activeDetailsProject.status} />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Close project details"
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <p className="eyebrow text-muted-foreground">{activeDetailsProject.role}</p>
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
        @keyframes river-bob {
          0%,
          100% {
            translate: 0 0;
          }
          50% {
            translate: var(--bob-x, 0) calc(var(--bob-y, 6px) * -1);
          }
        }
        .river-bob {
          animation: river-bob var(--bob-dur, 6s) ease-in-out var(--bob-delay, 0s) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .river-bob {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

function Tags({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {project.stack.map((t) => (
        <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground/75">
          {t}
        </span>
      ))}
      {project.pm.map((t) => (
        <span key={t} className="rounded-full border border-foreground/30 px-2.5 py-1 text-xs text-foreground/75">
          {t}
        </span>
      ))}
    </div>
  )
}

type RiverCardProps = {
  project: Project
  layout: (typeof LAYOUT)[number]
  interactive: boolean
  eagerImage: boolean
  onOpen: (el: HTMLElement) => void
  onHover: (hovered: boolean) => void
  onFocusChange: (focused: boolean, el?: HTMLElement) => void
}

function RiverCard({ project, layout, interactive, eagerImage, onOpen, onHover, onFocusChange }: RiverCardProps) {
  return (
    // Outer: stagger (height, spacing, tilt) + its own bob rhythm.
    <div
      className="river-bob shrink-0 snap-start"
      style={
        {
          marginTop: layout.y,
          marginRight: layout.gap,
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
        tabIndex={interactive ? undefined : -1}
        onClick={(e) => onOpen(e.currentTarget)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && onHover(false)}
        onFocus={(e) => onFocusChange(true, e.currentTarget)}
        onBlur={() => onFocusChange(false)}
        aria-label={interactive ? `${project.name}: ${project.tagline} Open case study.` : undefined}
        className="group relative isolate block w-[18.5rem] text-left outline-none sm:w-[20rem]"
      >
        {/* Backlight: a warm glow that fades up behind the card on hover/focus. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in oklch, var(--card) 70%, white) 35%, color-mix(in oklch, var(--card) 40%, transparent) 70%, transparent)',
          }}
        />

        <div className="paper-edge relative rounded-sm bg-card transition-[translate,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_rgb(0_0_0_/_0.35)] group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-ring">
          <Tape className="-top-3 left-6 z-10 -rotate-2" label={project.status} />

          <div className="relative aspect-[16/10] overflow-hidden rounded-t-sm bg-muted">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="320px"
              loading={eagerImage ? 'eager' : 'lazy'}
              draggable={false}
              className={cn(
                'transition-[filter,scale] duration-500 group-hover:scale-[1.03] group-hover:brightness-105',
                project.device === 'phone' ? 'object-contain p-3' : 'object-cover',
              )}
            />
          </div>

          <div className="flex flex-col gap-2 p-4">
            <div>
              <h3 className="display text-xl leading-tight">{project.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{project.role}</p>
            </div>
            <p className="text-sm leading-snug text-foreground/85">{project.tagline}</p>
            <Tags project={project} className="pt-0.5" />
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
              {project.caseStudy ? 'Read case study' : 'View details'}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}