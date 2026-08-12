'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type Involvement = {
  name: string
  role: string
  blurb: string
  image: string
  href: string
}

// TODO: add more entries as you think of them, and drop matching images
// at these paths (public/images/involvement-*.jpg). Carousel works with
// any number of entries.
const involvements: Involvement[] = [
  {
    name: 'Taiwanese American Student Association',
    role: 'Internal Vice President · prev. Recruitment Chair, Events Chair',
    blurb:
      'Oversee ~25 staff and 10–12 interns — own the intern pipeline, mentor interns through their projects, and run staff ops including the annual retreat.',
    image: '/images/involvement-tasa.jpg',
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
]

export function Involvements() {
  const [index, setIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const active = involvements[index]

  function go(delta: number) {
    setIndex((prev) => (prev + delta + involvements.length) % involvements.length)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft') go(-1)
    if (event.key === 'ArrowRight') go(1)
  }

  function handlePointerDown(event: React.PointerEvent) {
    dragStartX.current = event.clientX
  }

  function handlePointerUp(event: React.PointerEvent) {
    if (dragStartX.current === null) return
    const delta = event.clientX - dragStartX.current
    // Swipe left/right — 40px threshold avoids triggering on a tiny drag/click.
    if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1)
    dragStartX.current = null
  }

  return (
    <section
      id="involvements"
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-5 py-16 sm:px-8"
    >
      <Reveal>
        <SectionHeading
          index="02"
          title="My involvements"
          note="outside the classroom"
        />
      </Reveal>

      <PaperCard className="mt-8 overflow-hidden p-4 sm:p-6">
        <Tape className="-top-3 left-10 -rotate-2" label="+" />

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Extracurricular involvements"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="relative touch-pan-y rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-muted sm:aspect-[21/9]">
            <Image
              src={active.image}
              alt={`${active.name} — ${active.role}`}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
              priority={index === 0}
            />

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous involvement"
              className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground backdrop-blur-sm transition-transform hover:-translate-x-0.5"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next involvement"
              className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground backdrop-blur-sm transition-transform hover:translate-x-0.5"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="display text-2xl">{active.name}</h3>
              <p className="eyebrow text-muted-foreground">{active.role}</p>
            </div>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {active.blurb}
            </p>
            <a
              href={active.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Visit website
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {involvements.map((item, i) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to ${item.name}`}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === index
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-border hover:bg-muted-foreground/40',
                )}
              />
            ))}
          </div>
        </div>
      </PaperCard>
    </section>
  )
}