'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useRef, type CSSProperties } from 'react'
import { SectionHeading } from '@/components/scrapbook'
import { useStaggerReveal } from '@/lib/use-stagger-reveal'

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

/** "www.ucsbtasa.com/" → "ucsbtasa.com" for the card footer. */
const domain = (url: string) => new URL(url).hostname.replace(/^www\./, '')

/**
 * Involvements: same clean card language as Featured projects. 4 across on
 * desktop, 2 on tablets, 1 on phones. The whole card links to the
 * organization's site. Cards rise in with a staggered scroll reveal, and
 * lift on hover with the photo easing in.
 */
export function Involvements() {
  const gridRef = useRef<HTMLUListElement>(null)
  useStaggerReveal(gridRef)

  return (
    <section id="involvements" className="relative scroll-mt-20 bg-sky py-14 sm:py-20">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionHeading title="Involvements" />
          <p className="pb-1 text-sm text-muted-foreground">Leadership, service, and teaching.</p>
        </div>

        <ul ref={gridRef} className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {involvements.map((item, i) => (
            <li
              key={item.name}
              data-reveal="idle"
              className="stagger-reveal"
              style={{ '--stagger': `${(i % 4) * 90}ms` } as CSSProperties}
            >
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${item.name} (opens in a new tab)`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card transition-[translate,box-shadow,border-color] duration-300 ease-out outline-none hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0_/_0.35)] focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-foreground/10 bg-muted">
                  <div className="stagger-img absolute inset-0">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 240px"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {item.when ? (
                    <p className="text-[11px] tracking-wide text-muted-foreground">{item.when}</p>
                  ) : null}
                  <h3 className="display mt-1.5 text-lg leading-tight">{item.name}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{item.role}</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-foreground/80">{item.blurb}</p>

                  <span className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    {domain(item.href)}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-[translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .stagger-reveal {
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
            translate 0.7s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms);
        }
        .stagger-reveal .stagger-img {
          transition: scale 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms),
            filter 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--stagger, 0ms);
        }
        .stagger-reveal[data-reveal='pending'] { opacity: 0; translate: 0 24px; }
        .stagger-reveal[data-reveal='pending'] .stagger-img { scale: 1.06; filter: blur(6px); }
        @media (prefers-reduced-motion: reduce) {
          .stagger-reveal, .stagger-reveal .stagger-img { transition: none; }
        }
      `}</style>
    </section>
  )
}