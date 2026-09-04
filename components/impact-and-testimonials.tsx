'use client'

import { useState } from 'react'
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

// One entry per quote. `side` drives which way its chat bubble leans —
// alternating left/right/left, per your request, purely a visual
// rhythm (these are all "received" praise, not an actual back-and-forth
// conversation, so the side doesn't mean sender/recipient the way it
// would in a real messaging app).
const testimonialGroups = [
  {
    source: 'Teammate, UCSB Project Dining',
    side: 'left' as const,
    quotes: [
      'She\u2019s the one who ends up coordinating and checking up on the team to make sure our work is on time. She was the one who set up the group chat so that our team has a means of communication.',
    ],
  },
  {
    source: 'Teammate, KIT',
    side: 'right' as const,
    quotes: [
      'Consistently produced high-quality work that required minimal re-review, which greatly streamlined the team\u2019s workflow. Even after finishing her own tasks, she remained available to support other team members.',
    ],
  },
  {
    source: 'Teammate, KIT',
    side: 'left' as const,
    quotes: [
      'Essential in handling the food waste aspect of our app. Went to class every day and participated meaningfully in discussion towards the progress of our app.',
    ],
  },
]


// One unified list per category — every tool is either a small logo
// (if it has a confirmed Simple Icons entry) or a plain text chip
// (everything else: SQL, Smartsheet, Agile/Scrum-type skills with no
// brand mark). No separate marquee, no separate chip row duplicating
// the same tools — one flat wrapped list per category, sized to never
// need scrolling.
//
// Colors are just three opacity steps of the site's own ink color
// (--foreground), not new hues — same "consistent with the site"
// approach used everywhere else on the page.
type ToolEntry =
  | { type: 'logo'; name: string; slug: string }
  | { type: 'text'; name: string }

const CATEGORY_DOT_OPACITY = ['bg-foreground', 'bg-foreground/60', 'bg-foreground/35'] as const

const toolkitCategories: { label: string; items: ToolEntry[] }[] = [
  {
    label: 'Languages',
    items: [
      { type: 'logo', name: 'C++', slug: 'cplusplus' },
      { type: 'logo', name: 'Python', slug: 'python' },
      { type: 'logo', name: 'JavaScript', slug: 'javascript' },
      { type: 'logo', name: 'HTML', slug: 'html5' },
      { type: 'logo', name: 'CSS', slug: 'css' },
      { type: 'text', name: 'SQL' },
    ],
  },
  {
    label: 'Frameworks & Tools',
    items: [
      { type: 'logo', name: 'React', slug: 'react' },
      { type: 'text', name: 'React Native' },
      { type: 'logo', name: 'Flutter', slug: 'flutter' },
      { type: 'logo', name: 'Node.js', slug: 'nodedotjs' },
      { type: 'logo', name: 'FastAPI', slug: 'fastapi' },
      { type: 'logo', name: 'Supabase', slug: 'supabase' },
      { type: 'text', name: 'OpenAI API' },
      { type: 'logo', name: 'GitHub', slug: 'github' },
      { type: 'logo', name: 'Webflow', slug: 'webflow' },
      { type: 'logo', name: 'Figma', slug: 'figma' },
      { type: 'logo', name: 'Cypress', slug: 'cypress' },
    ],
  },
  {
    label: 'Project Management',
    items: [
      { type: 'text', name: 'Agile/Scrum' },
      { type: 'text', name: 'Sprint Planning' },
      { type: 'text', name: 'Risk Management' },
      { type: 'text', name: 'Documentation & Reporting' },
      { type: 'logo', name: 'Notion', slug: 'notion' },
      { type: 'text', name: 'Smartsheet' },
      { type: 'logo', name: 'ClickUp', slug: 'clickup' },
      { type: 'logo', name: 'Jira', slug: 'jira' },
    ],
  },
]

function StatItem({ stat }: { stat: Stat }) {
  const [ref, value] = useCountUp<HTMLDivElement>(stat.value)

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <p className="display text-3xl leading-none tabular-nums text-foreground sm:text-4xl">
        {stat.prefix}
        {value}
        {stat.suffix}
      </p>
      <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
      <p className="eyebrow text-muted-foreground">{stat.sublabel}</p>
    </div>
  )
}

/** Soft blurred glow poking out below a card's bottom edge. */
function CardGlow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-4 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-full bg-foreground/20 blur-2xl"
    />
  )
}

/**
 * One chip. If it's a logo item, tracks whether the image actually
 * loaded — `onError` flips `logoFailed`, which drops the <img> and
 * falls back to a plain text chip. This is what makes a future broken
 * CDN slug (like the OpenAI one just now) fail quietly instead of
 * showing a broken-image icon next to the name.
 */
function ToolChip({ item }: { item: ToolEntry }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = item.type === 'logo' && !logoFailed

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-secondary/70 px-2 py-0.5 text-[11px] text-foreground/85">
      {showLogo && item.type === 'logo' ? (
        <img
          src={`https://cdn.simpleicons.org/${item.slug}/1B1A17`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-3.5 w-3.5"
          onError={() => setLogoFailed(true)}
        />
      ) : null}
      {item.name}
    </span>
  )
}

/**
 * Simple grouped toolkit list — one row per category, each row a
 * plain flex-wrap of small logo badges and/or text chips. No scroll,
 * no animation, no custom geometry: everything is visible at once and
 * sized to fit within its card.
 */
function ToolkitList() {
  return (
    <div className="flex flex-col gap-4">
      {toolkitCategories.map((category, i) => (
        <div key={category.label}>
          <div className="mb-2 flex items-center gap-2">
            <span className={cn('size-2 rounded-full', CATEGORY_DOT_OPACITY[i])} />
            <p className="eyebrow text-foreground/70">{category.label}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {category.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-secondary/70 px-2 py-0.5 text-[11px] text-foreground/85"
              >
                {item.type === 'logo' ? (
                  <img
                    src={`https://cdn.simpleicons.org/${item.slug}/1B1A17`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-3.5 w-3.5"
                  />
                ) : null}
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Impact stats + testimonials + toolkit, as three separate rounded
 * panels sitting side by side inside the normal page container (no
 * more full-bleed — that idea got reverted). Each panel keeps its own
 * background color, just contained now instead of edge-to-edge:
 * Numbers = bg-foreground (dark), Voices = bg-secondary (light
 * greige), Toolkit = bg-accent (light warm taupe).
 *
 * Voices is redesigned as chat bubbles: each quote is a rounded bubble
 * that alternates left/right/left, with one corner flattened on the
 * side it "points" toward (bottom-left flat for left bubbles,
 * bottom-right flat for right bubbles) — the classic messaging-app
 * tail effect via asymmetric border radius, no extra SVG needed.
 */
export function ImpactAndTestimonials() {
  return (
    <section
      className="relative scroll-mt-8 overflow-hidden border-y border-border bg-background py-10 sm:py-14"
      id="impact"
    >
      <ParallaxBackdrop variant="cococream" speed={0.14} />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading index="02" title="Key Impact" />
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-3">
          {/* Panel 01 — Numbers */}
          <div className="rounded-3xl bg-foreground p-6 sm:p-7">
            <Reveal delay={60}>
              <p className="eyebrow mb-5 text-card/55">01 — Numbers</p>
            </Reveal>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={100 + i * 60}>
                  <PaperCard
                    className="animate-card-float relative overflow-visible rounded-xl border-transparent bg-card p-4 sm:p-5"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      boxShadow: '0 22px 30px -14px rgba(27, 26, 23, 0.25)',
                    }}
                  >
                    <CardGlow />
                    {i === 0 ? (
                      <Tape
                        className="-top-2.5 left-4 -rotate-2"
                        label="numbers"
                        tone="butter"
                      />
                    ) : null}
                    <StatItem stat={stat} />
                  </PaperCard>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Panel 02 — Voices, as chat bubbles */}
          <div className="rounded-3xl bg-secondary p-6 sm:p-7">
            <Reveal delay={80}>
              <p className="eyebrow mb-5 text-muted-foreground">02 — Voices</p>
            </Reveal>
            <div className="flex flex-col gap-3">
              {testimonialGroups.map((group, i) => {
                const isRight = group.side === 'right'
                return (
                  <Reveal key={`${group.source}-${i}`} delay={220 + i * 80}>
                    <div className={cn('flex', isRight ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'animate-card-float max-w-[85%] rounded-2xl bg-foreground p-4',
                          isRight ? 'rounded-br-md' : 'rounded-bl-md',
                        )}
                        style={{ animationDelay: `${1.1 + i * 0.3}s` }}
                      >
                        {group.quotes.map((quote, qi) => (
                          <p key={qi} className="line-clamp-4 text-sm leading-snug text-card/90">
                            &ldquo;{quote}&rdquo;
                          </p>
                        ))}
                        <p className="eyebrow mt-2 text-card/55">{group.source}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Panel 03 — Toolkit */}
          <div className="rounded-3xl bg-accent p-6 sm:p-7">
            <Reveal delay={100}>
              <p className="eyebrow mb-5 text-foreground/60">03 — Toolkit</p>
            </Reveal>
            <Reveal delay={320}>
              <PaperCard className="relative flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-5">
                <ToolkitList />
              </PaperCard>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes card-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
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