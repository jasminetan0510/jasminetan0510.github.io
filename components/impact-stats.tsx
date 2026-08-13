'use client'

import { PaperCard, Tape } from '@/components/scrapbook'
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

export function ImpactStats() {
  return (
    <section className="relative overflow-hidden bg-accent py-10 sm:py-14">
      <ParallaxBackdrop variant="cococream" speed={0.14} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <PaperCard className="relative grid grid-cols-2 gap-x-6 gap-y-8 p-6 sm:grid-cols-4 sm:gap-x-8 sm:p-8">
            <Tape className="-top-3 left-10 -rotate-2" label="numbers" />
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </PaperCard>
        </Reveal>
      </div>
    </section>
  )
}