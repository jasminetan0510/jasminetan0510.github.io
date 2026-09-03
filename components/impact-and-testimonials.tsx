'use client'

import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
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
 * Soft blurred ellipse poking out below a card's bottom edge — reads as
 * the card being lit from underneath. Needs the card itself to NOT clip
 * overflow (PaperCard doesn't by default), or this gets cut off flush
 * with the card's bottom edge instead of glowing past it.
 */
function CardGlow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-5 left-1/2 h-10 w-[85%] -translate-x-1/2 rounded-full bg-card/45 blur-3xl"
    />
  )
}

/**
 * Impact stats + testimonials, combined into one section.
 *
 * Each stat now gets its own card (previously all four lived inside one
 * shared PaperCard) — matches how the testimonials already work, one
 * card per item, and gives each number its own glow/float instead of
 * one block doing it for all four at once. Every card: rounded further
 * (rounded-2xl), a soft glow underneath, and a slow staggered float so
 * they read as alive rather than static — staggered per-card delay so
 * they don't all bob in unison. Gaps opened up throughout so the extra
 * cards don't feel cramped.
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
          <SectionHeading index="01" title="Key Impact" />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:mt-12 sm:grid-cols-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={80 + i * 60}>
              <PaperCard
                className="animate-card-float relative overflow-visible rounded-2xl border-transparent bg-foreground p-5"
                style={{
                  animationDelay: `${i * 0.35}s`,
                  boxShadow: '0 32px 40px -16px rgba(246, 241, 230, 0.55)',
                }}
              >
                <CardGlow />
                {i === 0 ? (
                  <Tape
                    className="-top-3 left-6 -rotate-2"
                    label="numbers"
                    tone="butter"
                  />
                ) : null}
                <StatItem stat={stat} />
              </PaperCard>
            </Reveal>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-1 items-start gap-6 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          {testimonialGroups.map((group, i) => (
            <li key={i}>
              <Reveal delay={360 + i * 100}>
                <PaperCard
                  className="animate-card-float relative flex flex-col gap-4 overflow-visible rounded-2xl border-transparent bg-foreground p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
                  style={{
                    animationDelay: `${1.2 + i * 0.35}s`,
                    boxShadow: '0 32px 40px -16px rgba(246, 241, 230, 0.55)',
                  }}
                >
                  <CardGlow />
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

      <style>{`
        @keyframes card-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        .animate-card-float {
          animation: card-float 5.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-card-float {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}