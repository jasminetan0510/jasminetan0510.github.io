'use client'

import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { Reveal } from '@/components/reveal'
import { useCountUp } from '@/lib/use-count-up'

type Stat = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  sublabel: string
}

// Pulled from what's already written elsewhere on the site (Caliber,
// Featured Projects, Involvements) — no new numbers invented here.
const stats: Stat[] = [
  {
    value: 250,
    suffix: '+',
    label: 'students / quarter',
    sublabel: 'Caliber — launching fall 2026',
  },
  {
    value: 85,
    suffix: ' tons',
    label: 'waste diverted',
    sublabel: 'DLS Sustainability Award, 2025',
  },
  {
    value: 234,
    prefix: '$',
    suffix: 'K',
    label: 'revenue generated',
    sublabel: 'DLS Yard Moving Sale',
  },
  {
    value: 25,
    suffix: '+',
    label: 'staff & interns led',
    sublabel: 'TASA, Internal VP',
  },
]

// One card per quote.
const testimonialGroups = [
  {
    source: 'Teammate, UCSB Project Dining',
    quotes: [
      'She\u2019s the one who ends up coordinating and checking up on the team to make sure our work is on time. She was the one who set up the group chat so that our team has a means of communication.',
    ],
  },
  {
    source: 'Teammate, KIT',
    quotes: [
      'Consistently produced high-quality work that required minimal re-review, which greatly streamlined the team\u2019s workflow. Even after finishing her own tasks, she remained available to support other team members.',
    ],
  },
  {
    source: 'Teammate, KIT',
    quotes: [
      'Essential in handling the food waste aspect of our app. Went to class every day and participated meaningfully in discussion towards the progress of our app.',
    ],
  },
]

function StatItem({ stat }: { stat: Stat }) {
  const [ref, value] = useCountUp<HTMLDivElement>(stat.value)

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <p className="display text-4xl leading-none tabular-nums sm:text-5xl">
        {stat.prefix}
        {value}
        {stat.suffix}
      </p>
      <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
      <p className="eyebrow text-muted-foreground">{stat.sublabel}</p>
    </div>
  )
}

/**
 * Impact stats + testimonials, combined into one section — the numbers
 * and the people vouching for them belong to the same story, so they
 * no longer need their own separate section header and padding each.
 */
export function ImpactAndTestimonials() {
  return (
    <section className="relative scroll-mt-8 overflow-hidden bg-accent py-14 sm:py-20" id="impact">
      <ParallaxBackdrop variant="cococream" speed={0.14} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            title="Key Impacts"
            note="the results, and the people who saw them happen"
          />
        </Reveal>

        <Reveal delay={80}>
          <PaperCard className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-8 p-6 sm:mt-10 sm:grid-cols-4 sm:gap-x-8 sm:p-8">
            <Tape className="-top-3 left-10 -rotate-2" label="numbers" />
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </PaperCard>
        </Reveal>

        <ul className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 sm:grid-cols-3 sm:gap-7">
          {testimonialGroups.map((group, i) => (
            <li key={i}>
              <Reveal delay={180 + i * 100}>
                <PaperCard className="relative flex flex-col gap-4 p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                  {i === 0 ? (
                    <Tape className="-top-3 left-8 -rotate-2" label="real" />
                  ) : null}

                  {group.quotes.map((quote, qi) => (
                    <p
                      key={qi}
                      className="text-sm leading-normal text-foreground/85"
                    >
                      &ldquo;{quote}&rdquo;
                    </p>
                  ))}

                  <p className="eyebrow text-muted-foreground">
                    {group.source}
                  </p>
                </PaperCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}