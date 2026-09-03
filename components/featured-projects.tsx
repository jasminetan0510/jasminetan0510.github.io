'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { cn } from '@/lib/utils'

type CaseStudy = {
  problem: string
  approach: string
  shipped: string
  reflection: string
}

const projects = [
  {
    name: 'Caliber',
    role: 'Software Engineer · Caliber Research Group, UCSB',
    status: 'Shipping fall 2026',
    device: 'laptop' as const,
    summary:
      'An AI-assisted course-planning and mastery-based-practice platform for university instruction, advised by Prof. Diba Mirza. I own two pieces of it: a project-management ticket tracker for the team\u2019s Software Engineering and AI groups, and a redesign of the LeetCode Autograder\u2019s student submission flow and feedback interface.',
    outcome:
      'Presented and published in the Proceedings of ITiCSE \u201926; launches fall 2026 in UCSB\u2019s CS8 and CS24 intro courses (250+ students/quarter).',
    stack: ['React', 'FastAPI', 'AI/LLM'],
    image: '/images/project-caliber.png',
    href: '#',
    caseStudy: {
      problem:
        'The Caliber team was growing across two groups (Software Engineering and AI) with no shared way to see who owned what. Work was getting tracked informally, which made it hard to tell what was in progress, blocked, or done. Separately, the LeetCode Autograder gave students a flat pass/fail with no breakdown of what actually went wrong.',
      approach:
        'At first, my project partner and I looked into existing tools we already used to manage our productivity and workload. This included GitHub Projects (Kanban boards and task organization), as well as Notion (dashboards with basic progress tracking and views). We used Figma to design a proof of concept, met separately to collaborate on design and functionality choices, and then built our tool off of this. We shared version 1 during our standup and received feedback that this tool is to be used across multiple projects, and so adding a project tag was necessary.',
      shipped:
        'A ticket tracker supporting creation, assignment, and self-claiming, with status, ownership, deadlines, and a change history \u2014 built for the team\u2019s day-to-day coordination. On the autograder side, restructured the submission flow into a clear 6-step pipeline and rebuilt the feedback UI to separate what passed, what didn\u2019t, and what to fix.',
      reflection:
        'If I were to rebuild this, I would implement different views, such as Calendar or Gallery to view all tickets, as well as different visualizations for basic progress tracking. We maintained a consistent TA and student feedback loop and implemented/revised features as requested.',
    } satisfies CaseStudy,
  },
  {
    name: 'UCSB Project Dining',
    role: 'De Facto Lead · CS156 team of 6',
    status: 'Shipped',
    device: 'laptop' as const,
    summary:
      'Extended a legacy UCSB dining-menu web app with new backend and frontend features. I ran biweekly retros and standups, led code reviews, and resolved merge conflicts for the team.',
    outcome:
      'Introduced a same-day PR-review norm that eliminated the review backlogs we\u2019d hit on a prior project \u2014 delivered 100% of committed work on schedule.',
    stack: ['React', 'Spring Boot'],
    image: '/images/project-kit.png',
    href: 'https://github.com/ucsb-cs156-f25/proj-dining-f25-05',
    caseStudyDraft: {
      problem: 'TODO — what was broken in the legacy app before your team touched it?',
      approach: 'TODO — what did you try, and why this stack?',
      shipped: 'TODO — what actually shipped, in plain terms?',
      reflection: 'TODO — what would you change, or what\u2019s next?',
    } satisfies CaseStudy,
  },
  {
    name: 'SciTrek Volunteer Scheduler',
    role: 'Lead Developer',
    status: 'Sole maintainer',
    device: 'laptop' as const,
    summary:
      'An account-less volunteer scheduling platform for UCSB SciTrek\u2019s K-12 outreach program, with a three-role UX (participant, admin, organizer) and quarterly CSV module imports. Built to replace SignupGenius with something mobile-optimized and ad-free.',
    // TODO: no hard number here yet — volunteer count, hours of admin
    // time saved vs. SignupGenius, or program size?
    outcome:
      'Waitlist auto-promotion, scheduled reminder emails, and slot swaps. Now sole maintainer heading into a full-quarter dry run ahead of a program-wide launch this fall.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery/Redis', 'React', 'Vite'],
    image: '/images/project-scitrek.png',
    href: 'https://github.com/Anteater10/uni-volunteer-scheduler',
    caseStudyDraft: {
      problem: 'TODO — what was broken about using SignupGenius here?',
      approach: 'TODO — what did you try, and why this stack?',
      shipped: 'TODO — what actually shipped, in plain terms?',
      reflection: 'TODO — what would you change, or what\u2019s next?',
    } satisfies CaseStudy,
  },
  {
    name: 'yunie: Productivity Agent',
    role: 'Solo project',
    status: 'Resuming now',
    device: 'laptop' as const,
    summary:
      'An AI-powered assistant enabling conversational task management, context-aware reminders, intelligent scheduling, and dynamic goal tracking.',
    // TODO: solo/personal project, so a stat is optional — but something
    // like "X modules" or a usage note would work if you want one.
    outcome: 'Full-stack, with persistent chat history and secure auth built in.',
    stack: ['React', 'Node.js', 'OpenAI API'],
    image: '/images/project-yunie.png',
    href: '#',
    caseStudyDraft: {
      problem: 'TODO — what problem were you actually trying to solve for yourself?',
      approach: 'TODO — what did you try, and why this stack?',
      shipped: 'TODO — what actually shipped, in plain terms?',
      reflection: 'TODO — what would you change, or what\u2019s next?',
    } satisfies CaseStudy,
  },
  {
    name: 'KIT: Kitchen Inventory Tracking',
    role: 'Mobile Developer · CS184 team of 7',
    status: 'Team of 7',
    device: 'phone' as const,
    summary:
      'A cross-platform mobile app for real-time kitchen inventory management, built from scratch with a 7-person team. I ranked #3 on the team by commit volume and owned the home dashboard, notifications, and environmental-impact scoring for food waste.',
    // TODO: "near-zero" is a claim, not a number — rough % or time-saved
    // figure for manual entry reduction?
    outcome:
      'OCR receipt scanning and barcode lookup cut manual item entry to near-zero, backed by Supabase for storage and auth.',
    stack: ['React Native', 'Expo', 'FastAPI', 'Supabase'],
    image: '/images/project-ucsb-dining.png',
    href: 'https://github.com/ucsb-cs184-w26/team12-KIT',
    caseStudyDraft: {
      problem: 'TODO — what was broken about tracking kitchen inventory here?',
      approach: 'TODO — what did you try, and why this stack?',
      shipped: 'TODO — what actually shipped, in plain terms?',
      reflection: 'TODO — what would you change, or what\u2019s next?',
    } satisfies CaseStudy,
  },
]

const skillGroups = [
  {
    label: 'Languages',
    items: ['C++', 'Python', 'JavaScript', 'HTML/CSS', 'SQL'],
  },
  {
    label: 'Frameworks & Tools',
    items: [
      'React',
      'React Native',
      'Flutter',
      'Node.js',
      'FastAPI',
      'Supabase',
      'OpenAI API',
      'Git/GitHub',
      'Webflow',
      'Figma',
      'Cypress',
    ],
  },
  {
    label: 'Project Management',
    items: [
      'Agile/Scrum',
      'Sprint Planning',
      'Risk Management',
      'Documentation & Reporting',
      'Notion',
      'Smartsheet',
      'ClickUp',
      'Jira',
    ],
  },
]

/**
 * One static row of skill chips, kept to a single line. Long rows
 * (Frameworks & Tools) scroll horizontally rather than wrapping —
 * wrapping pushed the last chip or two onto an orphaned second line,
 * which read worse than a deliberately scrollable row.
 */
function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow w-24 shrink-0 text-muted-foreground sm:w-28">
        {label}
      </p>
      <div className="skill-row-scroll flex flex-1 flex-nowrap gap-2 overflow-x-auto">
        {items.map((item) => (
          <span
            key={item}
            className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/85"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

type FrameProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

/** CSS-only phone mockup — no image asset needed, just bezel + notch. */
function PhoneFrame({ src, alt, className, priority }: FrameProps) {
  return (
    <div className={cn('relative mx-auto w-[95px] sm:w-[110px]', className)}>
      <div className="relative rounded-[2.2rem] border-[6px] border-foreground bg-foreground p-1.5 shadow-lg">
        <span className="absolute left-1/2 top-2.5 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-foreground/60" />
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-muted">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="240px"
            priority={priority}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

/** CSS-only browser/laptop mockup — chrome dots + a thin base bar. */
function LaptopFrame({ src, alt, className, priority }: FrameProps) {
  return (
    <div className={cn('relative mx-auto w-[320px] sm:w-[372px]', className)}>
      <div className="overflow-hidden rounded-t-lg border border-foreground/80 bg-foreground shadow-lg">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="size-1.5 rounded-full bg-card/40" />
          <span className="size-1.5 rounded-full bg-card/40" />
          <span className="size-1.5 rounded-full bg-card/40" />
        </div>
        <div className="relative aspect-[16/10] bg-muted">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 90vw, 420px"
            priority={priority}
            className="object-cover"
          />
        </div>
      </div>
      <div className="mx-6 h-1.5 rounded-b-md bg-foreground/80" />
    </div>
  )
}

const AUTO_ADVANCE_MS = 7000
const SWIPE_THRESHOLD = 50

/**
 * Featured projects carousel. Each slide is full-width (no fractional
 * peek widths, no nested-flex overflow risk) and slides via a plain
 * transform. The "peek" cue is now two thin, purely decorative strips
 * fixed at the left/right edges showing the adjacent project's name
 * rotated vertically — flat background + short text, so there's nothing
 * in them that can overflow regardless of how long a project's real
 * content gets. Clicking a strip navigates to that project.
 */
export function FeaturedProjects() {
  const [index, setIndex] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const dragStartX = useRef<number | null>(null)

  const total = projects.length
  const prevIndex = (index - 1 + total) % total
  const nextIndex = (index + 1) % total
  const activeDetailsProject = openIndex !== null ? projects[openIndex] : null

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Auto-advance: pauses on hover, while the details modal is open, and
  // is skipped entirely for reduced-motion. Re-arms every time `index`
  // changes (including from a manual nav), so it never fires right on
  // top of something someone just did.
  useEffect(() => {
    if (reducedMotion || isHovered || openIndex !== null) return
    const timer = setTimeout(() => goTo(index + 1), AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isHovered, openIndex, reducedMotion])

  useEffect(() => {
    if (openIndex === null) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenIndex(null)
    }
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [openIndex])

  function goTo(i: number) {
    setIndex(((i % total) + total) % total)
  }
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  function onCarouselKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') next()
    if (event.key === 'ArrowLeft') prev()
  }

  function onPointerDown(event: React.PointerEvent) {
    dragStartX.current = event.clientX
  }
  function onPointerUp(event: React.PointerEvent) {
    if (dragStartX.current === null) return
    const delta = event.clientX - dragStartX.current
    if (delta > SWIPE_THRESHOLD) prev()
    else if (delta < -SWIPE_THRESHOLD) next()
    dragStartX.current = null
  }

  return (
    <section
      id="projects"
      className="relative scroll-mt-8 overflow-hidden bg-secondary py-10 sm:py-14"
    >
      <ParallaxBackdrop variant="seabreeze" speed={0.14} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            title="Featured projects"
            note="the full lineup, no digging required"
          />
        </Reveal>

        {/* Tab strip — every project's number is always visible, so
            "there are 5 of these" reads at a glance. */}
        <div className="mt-8 flex items-center justify-between gap-4 sm:mt-10">
          <div className="flex flex-wrap gap-1.5">
            {projects.map((project, i) => (
              <button
                key={project.name}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${project.name}`}
                aria-current={i === index}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium tabular-nums transition-colors',
                  i === index
                    ? 'bg-foreground text-card'
                    : 'bg-card text-foreground/50 hover:text-foreground/80',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <p className="eyebrow shrink-0 text-muted-foreground">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
        </div>

        {/* Deck. The visible slide is always full-width — the two side
            strips are decorative overlays, not real fractional-width
            slides, so they can never cause the overflow issue the
            previous version had. */}
        <div
          className="relative mt-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            tabIndex={0}
            onKeyDown={onCarouselKeyDown}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="overflow-hidden pt-4 outline-none"
          >
            <div
              className={cn(
                'flex',
                !reducedMotion && 'transition-transform duration-500 ease-out',
              )}
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {projects.map((project, i) => {
                const Frame = project.device === 'phone' ? PhoneFrame : LaptopFrame

                return (
                  <div key={project.name} className="w-full shrink-0 px-10 sm:px-14">
                    <PaperCard className="relative flex flex-col items-center gap-4 p-5 sm:p-6">
                      <Tape className="-top-3 left-10 -rotate-2" label="viewing" />

                      <Frame
                        src={project.image}
                        alt={`Screenshot of ${project.name}`}
                        className="shrink-0"
                        priority={i === index}
                      />

                      <div className="flex w-full min-w-0 flex-col items-center gap-2 text-center">
                        <span className="w-fit rounded-full bg-secondary px-2.5 py-1 eyebrow text-[10px] text-foreground/70">
                          {project.status}
                        </span>
                        <h3 className="display text-xl leading-tight sm:text-2xl">
                          {project.name}
                        </h3>
                        <p className="eyebrow text-muted-foreground">{project.role}</p>
                        <p className="max-w-prose text-sm leading-relaxed text-foreground/80">
                          {project.outcome}
                        </p>

                        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground/75"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setOpenIndex(i)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5"
                          >
                            View details
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </button>
                          {project.href !== '#' ? (
                            <a
                              href={project.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1.5 rounded-full border border-input px-3.5 py-1.5 text-sm font-medium transition hover:bg-secondary"
                            >
                              GitHub
                              <ArrowUpRight className="size-3.5" aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground/60">
                              link coming soon
                            </span>
                          )}
                        </div>
                      </div>
                    </PaperCard>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Peek strips — flat bg-secondary panel + rotated eyebrow
              text naming the adjacent project. Purely decorative/nav,
              never renders real card content, so it can't overflow. */}
          <button
            type="button"
            onClick={prev}
            aria-label={`Previous project: ${projects[prevIndex].name}`}
            className="group absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-center overflow-hidden bg-secondary/85 backdrop-blur-sm transition hover:bg-secondary sm:w-14"
          >
            <span className="flex -rotate-90 items-center gap-1.5 whitespace-nowrap eyebrow text-foreground/55 transition group-hover:text-foreground">
              <ArrowLeft className="size-3 shrink-0" aria-hidden="true" />
              {projects[prevIndex].name}
            </span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={`Next project: ${projects[nextIndex].name}`}
            className="group absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-center overflow-hidden bg-secondary/85 backdrop-blur-sm transition hover:bg-secondary sm:w-14"
          >
            <span className="flex -rotate-90 items-center gap-1.5 whitespace-nowrap eyebrow text-foreground/55 transition group-hover:text-foreground">
              {projects[nextIndex].name}
              <ArrowRight className="size-3 shrink-0" aria-hidden="true" />
            </span>
          </button>
        </div>

        {/* Toolkit — folded in here instead of its own section/heading.
            Same scrolling-marquee card as before, just without the
            "01 Toolkit" title above it. */}
        <PaperCard className="relative mt-8 flex flex-col gap-4 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 sm:mt-10 sm:p-6">
          <Tape className="-top-3 right-10 rotate-2" />
          {skillGroups.map((group) => (
            <SkillRow key={group.label} label={group.label} items={group.items} />
          ))}
        </PaperCard>

        {/* Details modal — generalized to work for any project, not
            just Caliber. Summary + outcome + full stack always show;
            the problem/approach/shipped/reflection breakdown only
            renders when a real `caseStudy` exists (caseStudyDraft
            placeholders are intentionally never rendered here). */}
        {activeDetailsProject ? (
          <div
            className="journal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setOpenIndex(null)}
          >
            <div
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
              <h3
                id="project-details-title"
                className="mt-2 display text-3xl leading-[1.05] text-balance sm:text-4xl"
              >
                {activeDetailsProject.name}
              </h3>

              <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-foreground/85">
                {activeDetailsProject.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {activeDetailsProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground/75"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {activeDetailsProject.caseStudy ? (
                <div className="mt-6 flex flex-col gap-5 text-[0.95rem] leading-relaxed text-foreground/85">
                  <div>
                    <p className="eyebrow mb-1.5 text-primary">The problem</p>
                    <p className="max-w-prose">{activeDetailsProject.caseStudy.problem}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-1.5 text-primary">What I tried</p>
                    <p className="max-w-prose">{activeDetailsProject.caseStudy.approach}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-1.5 text-primary">What shipped</p>
                    <p className="max-w-prose">{activeDetailsProject.caseStudy.shipped}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-1.5 text-primary">
                      What I&apos;d do differently
                    </p>
                    <p className="max-w-prose">{activeDetailsProject.caseStudy.reflection}</p>
                  </div>
                </div>
              ) : null}

              {activeDetailsProject.href !== '#' ? (
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
      </div>

      <style>{`
        .skill-row-scroll {
          scrollbar-width: none;
        }
        .skill-row-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}