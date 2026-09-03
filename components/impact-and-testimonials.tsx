'use client'

import { PaperCard, Tape } from '@/components/scrapbook'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
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

// Every card in this section is now the dark variant, so this just always
// renders the light-on-dark colors rather than toggling.
function StatItem({ stat }: { stat: Stat }) {
  const [ref, value] = useCountUp<HTMLDivElement>(stat.value)

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <p className="display text-4xl leading-none tabular-nums text-card sm:text-5xl">
        {stat.prefix}
        {value}
        {stat.suffix}
      </p>
      <p className="text-sm font-medium text-card/80">{stat.label}</p>
      <p className="eyebrow text-card/55">{stat.sublabel}</p>
    </div>
  )
}

/**
 * Impact stats + testimonials, combined into one section.
 *
 * Restructured for clearer separation from the sections around it:
 * - Background switches to bg-background (the site's base paper tone)
 *   instead of bg-accent, which the Hero also uses — sharing that color
 *   plus the same "cococream" parallax variant was why the two sections
 *   used to blend together with no visible seam.
 * - ParallaxBackdrop variant swapped to "seabreeze" so this section has
 *   its own texture instead of reusing the Hero's.
 * - Every card (stats + all three testimonials) is now the dark
 *   bg-foreground block — one consistent treatment instead of mixing
 *   light and dark cards.
 * - Dropped the "02 — the results, and the people who saw them happen"
 *   eyebrow/tagline row entirely; title now stands alone.
 */
export function ImpactAndTestimonials() {
  return (
    <section
      className="relative scroll-mt-8 overflow-hidden border-y border-border bg-background py-16 sm:py-24"
      id="impact"
    >
      <ParallaxBackdrop variant="seabreeze" speed={0.14} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <h2 className="display text-4xl leading-[1.02] text-balance sm:text-5xl">
            Key Impacts
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <PaperCard className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-transparent bg-foreground p-6 sm:mt-10 sm:grid-cols-4 sm:gap-x-8 sm:p-8">
            <Tape
              className="-top-3 left-10 -rotate-2"
              label="numbers"
              tone="butter"
            />
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </PaperCard>
        </Reveal>

        <ul className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 sm:grid-cols-3 sm:gap-7">
          {testimonialGroups.map((group, i) => (
            <li key={i}>
              <Reveal delay={180 + i * 100}>
                <PaperCard className="relative flex flex-col gap-4 border-transparent bg-foreground p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                  {i === 0 ? (
                    <Tape
                      className="-top-3 left-8 -rotate-2"
                      label="real"
                      tone="butter"
                    />
                  ) : null}

                  {group.quotes.map((quote, qi) => (
                    <p key={qi} className="text-sm leading-normal text-card/90">
                      &ldquo;{quote}&rdquo;
                    </p>
                  ))}

                  <p className="eyebrow text-card/55">{group.source}</p>
                </PaperCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}