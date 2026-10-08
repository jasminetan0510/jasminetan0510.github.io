'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { PaperCard, SectionHeading } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type Involvement = {
  name: string
  role: string
  when?: string
  blurb: string
  image: string
  href: string
}

const involvements: Involvement[] = [
  {
    name: 'Taiwanese American Student Association',
    role: 'Internal Vice President · prev. Recruitment Chair, Events Chair, Intern',
    when: 'Sep 2023 – present',
    blurb:
      'Oversee ~25 staff and 10–12 interns and own the intern pipeline end to end. As Recruitment Chair, built a mentorship program matching 150+ members; as Events Chair, planned 100+ attendee campus events.',
    image: '/images/involvement-tasa.JPG',
    href: 'https://www.ucsbtasa.com/',
  },
  {
    name: 'Phi Sigma Rho Sorority',
    role: 'Vice President of Administration',
    // when: 'TODO',
    blurb:
      'Run internal operations, documentation, and governance for a ~30-member chapter of a nationally recognized engineering sorority.',
    image: '/images/involvement-psr.jpg',
    href: 'https://ucsantabarbara.phisigmarho.org/',
  },
  {
    name: 'UCSB Distribution & Logistics Services',
    role: 'Team Lead, Surplus Sales Program',
    when: 'Jun 2024 – present',
    blurb:
      'Earned the 2025 Sustainability Award (ULSCA/ARCUMS) for leading the FM Yard Moving Sale × Surplus Sales project: 85 tons of waste diverted, $234K in revenue, and 260+ sales.',
    image: '/images/involvement-dls.jpg',
    href: 'https://www.dls.ucsb.edu/',
  },
  {
    name: 'Community Based Literacy Endorsement',
    role: 'Volunteer Instructor · Harding University Partnership School',
    blurb:
      'Three quarters with 4th/5th graders at Harding: led small-group landforms lessons, co-ran a college-access research project on UCSB housing, and served as a classroom aide for reading and writing support.',
    image: '/images/involvement-cble.png',
    href: 'https://www.cbleducation.org/programs',
  },
]

/**
 * All involvements in one gallery row of 4 on desktop (2 on tablets, 1 on
 * phones) — nothing hidden behind a carousel. A slight alternating tilt
 * keeps the row from feeling like a rigid product layout.
 */
export function Involvements() {
  return (
    <section id="involvements" className="relative scroll-mt-20 bg-sky py-10 sm:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading title="My involvements" />
        </Reveal>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {involvements.map((item, index) => (
            <Reveal key={item.name} delay={index * 90}>
              <PaperCard
                className={cn(
                  'group flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:rotate-0',
                  index % 2 === 0 ? 'sm:-rotate-1' : 'sm:rotate-1',
                )}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={`${item.name} — ${item.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
                  <h3 className="display line-clamp-2 text-lg leading-tight">{item.name}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {item.role}
                    {item.when ? <span className="text-foreground/50"> · {item.when}</span> : null}
                  </p>
                  <p className="mt-1 line-clamp-4 text-sm leading-relaxed text-foreground/80">{item.blurb}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-auto inline-flex w-fit items-center gap-1 pt-2 text-sm font-medium text-primary hover:underline"
                  >
                    Visit website
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </PaperCard>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}