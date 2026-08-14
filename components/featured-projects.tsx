'use client'

import { ArrowUpRight, FileText, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { cn } from '@/lib/utils'

const projects = [
  {
    name: 'Caliber',
    role: 'Software Engineer · Caliber Research Group, UCSB',
    status: 'Shipping fall 2026',
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
    },
  },
  {
    name: 'SciTrek Volunteer Scheduler',
    role: 'Lead Developer',
    status: 'Sole maintainer',
    summary:
      'An account-less volunteer scheduling platform for UCSB SciTrek\u2019s K-12 outreach program, with a three-role UX (participant, admin, organizer) and quarterly CSV module imports. Built to replace SignupGenius with something mobile-optimized and ad-free.',
    outcome:
      'Waitlist auto-promotion, scheduled reminder emails, and slot swaps. Now sole maintainer heading into a full-quarter dry run ahead of a program-wide launch this fall.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery/Redis', 'React', 'Vite'],
    image: '/images/project-scitrek.png',
    href: 'https://github.com/Anteater10/uni-volunteer-scheduler',
  },
  {
    name: 'KIT: Kitchen Inventory Tracking',
    role: 'Mobile Developer · CS184 team of 7',
    status: 'Team of 7',
    summary:
      'A cross-platform mobile app for real-time kitchen inventory management, built from scratch with a 7-person team. I ranked #3 on the team by commit volume and owned the home dashboard, notifications, and environmental-impact scoring for food waste.',
    outcome:
      'OCR receipt scanning and barcode lookup cut manual item entry to near-zero, backed by Supabase for storage and auth.',
    stack: ['React Native', 'Expo', 'FastAPI', 'Supabase'],
    image: '/images/project-ucsb-dining.png',
    href: 'https://github.com/ucsb-cs184-w26/team12-KIT',
  },
  {
    name: 'UCSB Project Dining',
    role: 'De Facto Lead · CS156 team of 6',
    status: 'Shipped',
    summary:
      'Extended a legacy UCSB dining-menu web app with new backend and frontend features. I ran biweekly retros and standups, led code reviews, and resolved merge conflicts for the team.',
    outcome:
      'Introduced a same-day PR-review norm that eliminated the review backlogs we\u2019d hit on a prior project \u2014 delivered 100% of committed work on schedule.',
    stack: ['React', 'Spring Boot'],
    image: '/images/project-kit.png',
    href: 'https://github.com/ucsb-cs156-f25/proj-dining-f25-05',
  },
  {
    name: 'yunie: Productivity Agent',
    role: 'Solo project',
    status: 'Resuming now',
    summary:
      'An AI-powered assistant enabling conversational task management, context-aware reminders, intelligent scheduling, and dynamic goal tracking.',
    outcome:
      'Full-stack, with persistent chat history and secure auth built in.',
    stack: ['React', 'Node.js', 'OpenAI API'],
    image: '/images/project-yunie.png',
    href: '#',
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

/**
 * One bento tile. `large` (only Caliber) gets the 2x2 slot, a bigger
 * headline, and an extra line of outcome copy — everything else stays
 * identical in structure so the grid reads as one consistent system.
 * Name/role/status/stack are always rendered (never gated behind
 * hover/focus) so the grid communicates on first glance; hover only
 * adds a lift + image zoom, it never reveals new information.
 */
function ProjectTile({
  project,
  large,
  onOpenCaseStudy,
}: {
  project: (typeof projects)[number]
  large: boolean
  onOpenCaseStudy: () => void
}) {
  return (
    <div
      className={cn(
        'paper-edge group relative overflow-hidden rounded-sm bg-muted transition-transform duration-300 hover:-translate-y-1',
        large && 'col-span-2 row-span-2',
      )}
    >
      <Image
        src={project.image}
        alt={`Placeholder artwork for ${project.name}`}
        fill
        sizes={
          large
            ? '(max-width: 1024px) 60vw, 480px'
            : '(max-width: 1024px) 30vw, 220px'
        }
        loading={large ? 'eager' : 'lazy'}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 sm:top-3 sm:right-3">
        {project.caseStudy ? (
          <button
            type="button"
            onClick={onOpenCaseStudy}
            aria-label={`Read the ${project.name} case study`}
            title="Read case study"
            className="inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-foreground transition hover:bg-white sm:size-8"
          >
            <FileText className="size-3.5 sm:size-4" aria-hidden="true" />
          </button>
        ) : null}
        {project.href !== '#' ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`View ${project.name} on GitHub`}
            title="View on GitHub"
            className="inline-flex size-7 items-center justify-center rounded-full border border-white/50 text-white backdrop-blur-sm transition hover:bg-white/15 sm:size-8"
          >
            <ArrowUpRight className="size-3.5 sm:size-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <span className="w-fit rounded-full bg-white/15 px-2 py-0.5 eyebrow text-[9px] text-white backdrop-blur-sm">
          {project.status}
        </span>
        <h3
          className={cn(
            'display mt-1.5 leading-tight text-white',
            large ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg',
          )}
        >
          {project.name}
        </h3>
        <p className="mt-0.5 eyebrow text-[10px] text-white/70">
          {project.role}
        </p>

        {large ? (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-white/85">
            {project.outcome}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-1">
          {project.stack.slice(0, large ? 4 : 2).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FeaturedProjects() {
  const [openCaseStudy, setOpenCaseStudy] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const caliber = projects[0]

  useEffect(() => {
    if (!openCaseStudy) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenCaseStudy(false)
    }
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [openCaseStudy])

  return (
    <section
      id="projects"
      className="relative scroll-mt-8 overflow-hidden bg-secondary py-14 sm:py-20"
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

        {/* Desktop / tablet: a static bento grid. Caliber (the flagship,
            with a full case study) gets the large 2x2 tile; the other
            four fill smaller tiles around it. Nothing here requires
            hover to be legible — name, role, status, and stack are
            always visible; hover just lifts the tile and zooms the
            image slightly. */}
        <div className="mt-8 hidden gap-2.5 sm:mt-10 sm:grid sm:h-[540px] sm:grid-cols-4 sm:grid-rows-2">
          {projects.map((project, index) => (
            <ProjectTile
              key={project.name}
              project={project}
              large={index === 0}
              onOpenCaseStudy={() => setOpenCaseStudy(true)}
            />
          ))}
        </div>

        {/* Mobile: stacked list, tap the header row to expand the full
            outcome + links in place. Stack chips are always visible
            (not gated behind the tap) so scanning doesn't require
            opening every row. */}
        <ul className="mt-8 flex flex-col gap-3 sm:hidden">
          {projects.map((project, index) => {
            const isOpen = active === index
            return (
              <li key={project.name}>
                <div className="paper-edge overflow-hidden rounded-sm bg-muted">
                  <button
                    type="button"
                    onClick={() => setActive(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="relative block h-40 w-full text-left"
                  >
                    <Image
                      src={project.image}
                      alt={`Placeholder artwork for ${project.name}`}
                      fill
                      sizes="100vw"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="eyebrow text-white/70">{project.role}</p>
                      <h3 className="display mt-1 text-xl text-white">
                        {project.name}
                      </h3>
                    </div>
                  </button>

                  <div className="flex flex-wrap gap-1.5 bg-card px-4 pt-3">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-foreground/75"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {isOpen ? (
                    <div className="flex flex-col gap-3 bg-card p-4 pt-3">
                      <span className="w-fit rounded-full bg-highlight/60 px-2.5 py-1 eyebrow text-[10px] text-foreground/80">
                        {project.status}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {project.outcome}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {project.caseStudy ? (
                          <button
                            type="button"
                            onClick={() => setOpenCaseStudy(true)}
                            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                          >
                            Read case study
                            <ArrowUpRight
                              className="size-3"
                              aria-hidden="true"
                            />
                          </button>
                        ) : null}
                        {project.href !== '#' ? (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-xs font-medium"
                          >
                            View GitHub
                            <ArrowUpRight
                              className="size-3"
                              aria-hidden="true"
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground/60">
                            link coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-3 bg-card" />
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        {/* Toolkit — folded in here instead of its own section/heading.
            Same scrolling-marquee card as before, just without the
            "01 Toolkit" title above it. */}
        <PaperCard className="relative mt-8 flex flex-col gap-4 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 sm:mt-10 sm:p-6">
          <Tape className="-top-3 right-10 rotate-2" />
          {skillGroups.map((group) => (
            <SkillRow key={group.label} label={group.label} items={group.items} />
          ))}
        </PaperCard>

        {openCaseStudy && caliber.caseStudy ? (
          <div
            className="journal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setOpenCaseStudy(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
              onClick={(event) => event.stopPropagation()}
              className="journal-panel paper-edge relative my-8 w-full max-w-2xl -rotate-[0.4deg] rounded-sm border border-border bg-card p-6 sm:my-0 sm:p-10"
            >
              <Tape className="-top-3 left-10 -rotate-3" label="case study" />

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpenCaseStudy(false)}
                aria-label="Close case study"
                className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>

              <p className="eyebrow text-muted-foreground">Case study</p>
              <h3
                id="case-study-title"
                className="mt-2 display text-3xl leading-[1.05] text-balance sm:text-4xl"
              >
                {caliber.name}
              </h3>

              <div className="mt-6 flex flex-col gap-5 text-[0.95rem] leading-relaxed text-foreground/85">
                <div>
                  <p className="eyebrow mb-1.5 text-primary">The problem</p>
                  <p className="max-w-prose">{caliber.caseStudy.problem}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5 text-primary">What I tried</p>
                  <p className="max-w-prose">{caliber.caseStudy.approach}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5 text-primary">What shipped</p>
                  <p className="max-w-prose">{caliber.caseStudy.shipped}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5 text-primary">
                    What I&apos;d do differently
                  </p>
                  <p className="max-w-prose">{caliber.caseStudy.reflection}</p>
                </div>
              </div>
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