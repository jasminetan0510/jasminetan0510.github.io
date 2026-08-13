'use client'

import { ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'

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
        '[TODO: what did you actually try first? Did you look at existing tools before deciding to build one? Was there a version 1 that didn\u2019t work? This is the part only you can fill in \u2014 it\u2019s the most convincing part of a case study to a PM/SWE reader.]',
      shipped:
        'A ticket tracker supporting creation, assignment, and self-claiming, with status, ownership, deadlines, and a change history \u2014 built for the team\u2019s day-to-day coordination. On the autograder side, restructured the submission flow into a clear 6-step pipeline and rebuilt the feedback UI to separate what passed, what didn\u2019t, and what to fix.',
      reflection:
        '[TODO: what would you change if you rebuilt this? Was there a TA/student feedback loop? Anything you shipped that you\u2019d now reconsider? Even one honest sentence here does more for credibility than a polished one that isn\u2019t true.]',
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
    direction: 'left' as const,
    speed: 26,
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
    direction: 'right' as const,
    speed: 42,
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
    direction: 'left' as const,
    speed: 34,
  },
]

/**
 * One horizontally-scrolling row of skill chips. The item list is
 * duplicated enough times to comfortably overflow the lane — short
 * lists (like Languages) get more copies so the track never runs out
 * of content and shows dead space before looping. Direction alternates
 * per row (left/right) so the whole card feels like a quiet conveyor
 * rather than one flat scroll.
 */
function MarqueeRow({
  label,
  items,
  direction,
  speed,
}: {
  label: string
  items: string[]
  direction: 'left' | 'right'
  speed: number
}) {
  const copies = items.length <= 6 ? 4 : items.length <= 9 ? 3 : 2
  const distance = `-${100 / copies}%`

  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow w-24 shrink-0 text-muted-foreground sm:w-28">
        {label}
      </p>
      <div
        className="skills-marquee-mask relative flex-1 overflow-hidden"
        style={{
          ['--marquee-duration' as string]: `${speed}s`,
          ['--marquee-distance' as string]: distance,
        }}
      >
        <div
          className={
            direction === 'left'
              ? 'skills-marquee-track skills-marquee-left'
              : 'skills-marquee-track skills-marquee-right'
          }
        >
          {Array.from({ length: copies }).map((_, copy) => (
            <div
              key={copy}
              aria-hidden={copy !== 0}
              className="flex shrink-0 items-center gap-2 pr-2"
            >
              {items.map((item) => (
                <span
                  key={item}
                  className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/85"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FeaturedProjects() {
  const [openCaseStudy, setOpenCaseStudy] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
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
            index="01"
            title="Featured projects"
            note="hover a card to open it"
          />
        </Reveal>

        {/* Desktop / tablet: horizontal expanding gallery, CR7-style —
            narrow image columns that grow into a full info panel on
            hover, while the rest compress to make room. */}
        <div className="mt-8 hidden h-[540px] gap-2.5 sm:mt-10 sm:flex">
          {projects.map((project, index) => {
            const isOpen = hovered === index || active === index
            const isCompressed =
              (hovered !== null && hovered !== index) ||
              (hovered === null && active !== null && active !== index)

            return (
              <div
                key={project.name}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onClick={() =>
                  setActive((prev) => (prev === index ? null : index))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive((prev) => (prev === index ? null : index))
                  }
                }}
                style={{ flexGrow: isOpen ? 5 : isCompressed ? 0.55 : 1 }}
                className="paper-edge group relative min-w-0 cursor-pointer overflow-hidden rounded-sm bg-muted outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={project.image}
                  alt={`Placeholder artwork for ${project.name}`}
                  fill
                  sizes="(max-width: 1024px) 40vw, 420px"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="eyebrow text-white/70">{project.role}</p>
                  <h3 className="display mt-1 text-xl leading-tight text-white sm:text-2xl">
                    {project.name}
                  </h3>

                  <div
                    className={
                      isOpen
                        ? 'mt-3 flex max-h-56 flex-col gap-3 opacity-100 transition-all duration-500'
                        : 'pointer-events-none mt-0 flex max-h-0 flex-col gap-3 overflow-hidden opacity-0 transition-all duration-300'
                    }
                  >
                    <span className="w-fit rounded-full bg-white/15 px-2.5 py-1 eyebrow text-[10px] text-white backdrop-blur-sm">
                      {project.status}
                    </span>
                    <p className="text-sm leading-relaxed text-white/85">
                      {project.outcome}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {project.caseStudy ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenCaseStudy(true)
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground transition hover:-translate-y-0.5"
                        >
                          Read case study
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </button>
                      ) : null}
                      {project.href !== '#' ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-full border border-white/40 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
                        >
                          View GitHub
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="text-xs text-white/50">
                          link coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: hover doesn't exist on touch, so fall back to a
            simple stacked list — tap the header row to expand a card
            in place instead of relying on a five-way horizontal squeeze
            that would be unreadably thin on a phone. */}
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

                  {isOpen ? (
                    <div className="flex flex-col gap-3 bg-card p-4">
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
                  ) : null}
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
            <MarqueeRow
              key={group.label}
              label={group.label}
              items={group.items}
              direction={group.direction}
              speed={group.speed}
            />
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
        .skills-marquee-mask {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 16px,
            black calc(100% - 16px),
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 16px,
            black calc(100% - 16px),
            transparent
          );
        }
        .skills-marquee-track {
          display: flex;
          width: max-content;
          animation-duration: var(--marquee-duration, 36s);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .skills-marquee-left {
          animation-name: skills-marquee-scroll-left;
        }
        .skills-marquee-right {
          animation-name: skills-marquee-scroll-right;
        }
        .skills-marquee-mask:hover .skills-marquee-track {
          animation-play-state: paused;
        }
        @keyframes skills-marquee-scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(var(--marquee-distance, -50%));
          }
        }
        @keyframes skills-marquee-scroll-right {
          from {
            transform: translateX(var(--marquee-distance, -50%));
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .skills-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}