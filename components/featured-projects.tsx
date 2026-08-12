'use client'

import { ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'

const projects = [
  {
    name: 'Caliber',
    role: 'Software Engineer · Caliber Research Group, UCSB',
    status: 'Shipping fall 2026',
    summary:
      'An AI-assisted course-planning and mastery-based-practice platform for university instruction, advised by Prof. Diba Mirza. I own two pieces of it: a project-management ticket tracker for the team\u2019s Software Engineering and AI groups, and a redesign of the LeetCode Autograder\u2019s student submission flow and feedback interface.',
    outcome:
      'Outcome: presented and published in the Proceedings of the 31st ACM Conference on Innovation and Technology in Computer Science Education (ITiCSE \u201926); launches fall 2026 in UCSB\u2019s CS8 and CS24 intro courses (250+ students/quarter).',
    stack: ['React', 'FastAPI', 'AI/LLM'],
    image: '/images/project-caliber.png',
    // TODO: add the real repo link once you have it (private research repo?)
    href: '#',
    tilt: '-rotate-1',
    // Case study — only Caliber has one right now. The bracketed [TODO]
    // lines are real gaps: I only have the facts, not the story. Replace
    // them with what actually happened before this goes out publicly.
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
      'Outcome: waitlist auto-promotion, scheduled reminder emails, and slot swaps. Now sole maintainer heading into a full-quarter dry run ahead of a program-wide launch this fall.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery/Redis', 'React', 'Vite'],
    image: '/images/project-scitrek.png',
    href: 'https://github.com/Anteater10/uni-volunteer-scheduler',
    tilt: 'rotate-1',
  },
  {
    name: 'KIT: Kitchen Inventory Tracking',
    role: 'Mobile Developer · CS184 team of 7',
    status: 'Team of 7',
    summary:
      'A cross-platform mobile app for real-time kitchen inventory management, built from scratch with a 7-person team. I ranked #3 on the team by commit volume and owned the home dashboard, notifications, and environmental-impact scoring for food waste.',
    outcome:
      'Outcome: OCR receipt scanning and barcode lookup cut manual item entry to near-zero, backed by Supabase for storage and auth.',
    stack: ['React Native', 'Expo', 'FastAPI', 'Supabase'],
    image: '/images/project-ucsb-dining.png',
    href: 'https://github.com/ucsb-cs184-w26/team12-KIT',
    tilt: '-rotate-1',
  },
  {
    name: 'UCSB Project Dining',
    role: 'De Facto Lead · CS156 team of 6',
    status: 'Shipped',
    summary:
      'Extended a legacy UCSB dining-menu web app with new backend and frontend features. I ran biweekly retros and standups, led code reviews, and resolved merge conflicts for the team.',
    outcome:
      'Outcome: introduced a same-day PR-review norm that eliminated the review backlogs we\u2019d hit on a prior project \u2014 delivered 100% of committed work on schedule.',
    stack: ['React', 'Spring Boot'],
    image: '/images/project-kit.png',
    href: 'https://github.com/ucsb-cs156-f25/proj-dining-f25-05',
    tilt: 'rotate-1',
  },
  {
    name: 'yunie: Productivity Agent',
    role: 'Solo project',
    status: 'Resuming now',
    summary:
      'An AI-powered assistant enabling conversational task management, context-aware reminders, intelligent scheduling, and dynamic goal tracking.',
    outcome:
      'Outcome: full-stack, with persistent chat history and secure auth built in.',
    stack: ['React', 'Node.js', 'OpenAI API'],
    image: '/images/project-yunie.png',
    // TODO: add your GitHub link for this repo
    href: '#',
    tilt: '-rotate-1',
  },
]

export function FeaturedProjects() {
  const [openCaseStudy, setOpenCaseStudy] = useState(false)
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
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-5 py-16 sm:px-8"
    >
      <Reveal>
        <SectionHeading
          index="02"
          title="Featured projects"
          note="what changed because of it"
        />
      </Reveal>

      <ul className="mt-8 flex flex-col gap-6">
        {projects.map((project, index) => (
          <li key={project.name}>
            <Reveal delay={index * 80}>
            <PaperCard
              className={`group flex flex-col gap-5 p-4 transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:p-5 ${project.tilt} hover:rotate-0`}
            >
              <Tape
                className="-top-3 left-10 -rotate-2"
                label={`0${index + 1}`}
              />

              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-sm bg-muted sm:aspect-square sm:w-40">
                <Image
                  src={project.image}
                  alt={`Placeholder artwork for ${project.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <h3 className="display text-2xl">{project.name}</h3>
                  <p className="eyebrow text-muted-foreground">
                    {project.role}
                  </p>
                  <span className="rounded-full bg-highlight/60 px-2 py-0.5 eyebrow text-[10px] text-foreground/80">
                    {project.status}
                  </span>
                </div>

                <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>

                <p className="max-w-prose border-l-2 border-highlight bg-highlight/25 py-1 pl-3 text-sm leading-relaxed font-medium">
                  {project.outcome}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border px-2 py-0.5 eyebrow text-[10px] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                  {project.caseStudy ? (
                    <button
                      type="button"
                      onClick={() => setOpenCaseStudy(true)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Read the full story
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                  {project.href !== '#' ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      View on GitHub
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="ml-auto eyebrow text-muted-foreground/60">
                      link coming soon
                    </span>
                  )}
                </div>
              </div>
            </PaperCard>
            </Reveal>
          </li>
        ))}
      </ul>

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
    </section>
  )
}