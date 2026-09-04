'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { cn } from '@/lib/utils'

type Involvement = {
  name: string
  role: string
  blurb: string
  image: string
  href: string
}

const involvements: Involvement[] = [
  {
    name: 'Taiwanese American Student Association',
    role: 'Internal Vice President · prev. Recruitment Chair, Events Chair',
    blurb:
      'Oversee ~25 staff and 10–12 interns — own the intern pipeline, mentor interns through their projects, and run staff ops including the annual retreat.',
    image: '/images/involvement-tasa.JPG',
    href: 'https://www.ucsbtasa.com/',
  },
  {
    name: 'Phi Sigma Rho Sorority',
    role: 'Vice President of Administration',
    blurb:
      'Run internal operations, documentation, and governance for a ~30-member chapter of a nationally recognized engineering sorority.',
    image: '/images/involvement-psr.jpg',
    href: 'https://ucsantabarbara.phisigmarho.org/',
  },
  {
    name: 'UCSB Distribution & Logistical Services',
    role: 'Team Lead',
    blurb:
      'Earned the 2025 Sustainability Award (National Joint ULSCA/ARCUMS Conference) for leading the FM Yard Moving Sale x Surplus Sales project — diverting 85 tons of waste, generating $234K in revenue, and completing 260+ sales.',
    image: '/images/involvement-dls.jpg',
    href: 'https://www.dls.ucsb.edu/',
  },
  {
    name: 'Community-Based Literacies (CBLE)',
    role: 'Volunteer Instructor · Harding University Partnership School',
    blurb:
      'Three quarters with 4th/5th graders at Harding: led small-group landforms lessons, co-ran a college-access research project on UCSB housing, and served as a classroom aide for reading and writing support.',
    image: '/images/involvement-cble.png',
    href: 'https://www.cbleducation.org/programs',
  },
]

/**
 * All involvements as a single gallery in one row of 4 — nothing is
 * hidden behind a carousel or requires paging through. A slight
 * alternating tilt (matching the scrapbook motif used elsewhere) keeps
 * the row from feeling like a rigid product layout.
 */
export function Involvements() {
  return (
    <section
      id="involvements"
      className="relative scroll-mt-8 overflow-hidden bg-secondary py-14 sm:py-20"
    >
      <ParallaxBackdrop variant="seabreeze" speed={0.16} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            title="My involvements"
          />
        </Reveal>

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-4">
          {involvements.map((item, index) => (
            <Reveal key={item.name} delay={index * 90}>
              <PaperCard
                className={cn(
                  'group flex h-full flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1 hover:rotate-0',
                  index % 2 === 0 ? 'sm:-rotate-1' : 'sm:rotate-1',
                )}
              >
                {index === 0 ? (
                  <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
                ) : null}

                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={`${item.name} — ${item.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
                  <h3 className="display line-clamp-2 text-lg leading-tight sm:text-xl">
                    {item.name}
                  </h3>
                  <p className="eyebrow line-clamp-1 text-muted-foreground">
                    {item.role}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {item.blurb}
                  </p>
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