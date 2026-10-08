import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

/**
 * Compact roles timeline, newest first, so recruiters can skim every role
 * in one place. Mirrors the résumé (Oct 2026).
 */

type Role = {
  role: string
  org: string
  when: string
  current?: boolean
  blurb: string
  tags?: string[]
}

const ROLES: Role[] = [
  {
    role: 'Team Lead',
    org: 'UCSB × AppFolio Capstone',
    when: 'Fall 2026 – Winter 2027',
    current: true,
    blurb:
      'Leading a five-person team building a tenant-side leasing app on AppFolio’s property API, with weekly sponsor check-ins.',
    tags: ['Ruby on Rails', 'Team leadership'],
  },
  {
    role: 'Software Developer',
    org: 'Caliber Research Group, UCSB',
    when: 'Jun 2026 – present',
    current: true,
    blurb:
      'Building a ticket tracker that coordinates a 20+ person team across 5 concurrent projects, and redesigned the LeetCode Autograder’s 6-step submission pipeline ahead of its fall 2026 launch to 250+ students a quarter. Contributed to platform work published at ACM ITiCSE ’26.',
    tags: ['React', 'FastAPI', 'AI/LLM'],
  },
  {
    role: 'Lead Developer & Maintainer',
    org: 'SciTrek',
    when: 'Feb 2026 – present',
    current: true,
    blurb:
      'Sole maintainer of a volunteer-scheduling platform for K-12 outreach, inherited from graduating developers to replace SignUpGenius. Seeded a full quarter of realistic data to demo workflows for non-technical coordinators ahead of a program-wide launch.',
    tags: ['FastAPI', 'PostgreSQL', 'React'],
  },
  {
    role: 'Team Lead, Surplus Sales Program',
    org: 'UCSB Distribution & Logistics Services',
    when: 'Jun 2024 – present',
    current: true,
    blurb:
      'Led the FM Yard Moving Sale × Surplus Sales project: 85 tons of waste diverted and $234K in revenue across 260+ sales (75% first-time buyers), winning the 2025 ULSCA/ARCUMS Sustainability Award. Built Smartsheet automation and KPI dashboards for sustainability operations.',
    tags: ['Smartsheet', 'KPI dashboards'],
  },
  {
    role: 'Technical Project Management Intern',
    org: 'Reverge Studios',
    when: 'Jun – Aug 2022',
    blurb:
      'Standardized ClickUp documentation across 4 project spaces, including a bug and feature reporting procedure adopted team-wide, and built Cypress test coverage for POST/DELETE API endpoints.',
    tags: ['ClickUp', 'Cypress', 'QA'],
  },
]

export function ExperienceTimeline({ index = '02' }: { index?: string }) {
  return (
    <section id="experience" className="relative scroll-mt-8 bg-background py-10 sm:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading index={index} title="Experience" />
        </Reveal>

        <ol className="relative mt-8 sm:mt-10">
          {/* the spine */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] w-px bg-foreground/20 md:left-[calc(9.5rem+5px)]"
          />
          {ROLES.map((r, i) => (
            <li key={`${r.org}-${r.role}`}>
              <Reveal delay={i * 70}>
                <div className="relative grid gap-1 pb-8 pl-8 last:pb-0 md:grid-cols-[9.5rem_1fr] md:gap-x-8 md:pl-0">
                  <p className="text-sm tabular-nums text-muted-foreground md:pt-0.5 md:text-right md:pr-6">
                    {r.when}
                  </p>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-foreground md:left-[9.5rem]',
                      r.current ? 'bg-foreground' : 'bg-background',
                    )}
                  />
                  <div className="md:pl-8">
                    <h3 className="display text-lg leading-snug sm:text-xl">
                      {r.role}
                      <span className="font-sans font-normal text-foreground/70">, {r.org}</span>
                    </h3>
                    <p className="mt-1 max-w-prose text-[0.95rem] leading-relaxed text-foreground/80">
                      {r.blurb}
                    </p>
                    {r.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground/75"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}