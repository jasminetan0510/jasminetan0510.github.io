import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'

const testimonials = [
  {
    quote:
      'She\u2019s the one who ends up coordinating and checking up on the team to make sure our work is on time. She was the one who set up the group chat so that our team has a means of communication.',
    source: 'Teammate, UCSB Project Dining',
  },
  {
    quote:
      'Consistently produced high-quality work that required minimal re-review, which greatly streamlined the team\u2019s workflow. Even after finishing her own tasks, she remained available to support other team members.',
    source: 'Teammate, KIT',
  },
  {
    quote:
      'Essential in handling the food waste aspect of our app. Went to class every day and participated meaningfully in discussion towards the progress of our app.',
    source: 'Teammate, KIT',
  },
]

export function Testimonials() {
  return (
    <section className="relative scroll-mt-8 overflow-hidden bg-accent py-14 sm:py-20">
      <ParallaxBackdrop variant="cococream" speed={0.16} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            title="What people say"
            note="from the people who worked with me"
          />
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-3 sm:gap-7">
          {testimonials.map((t, i) => (
            <li key={i}>
              <Reveal delay={i * 100}>
                <PaperCard className="relative flex h-full flex-col gap-3 p-6 transition-transform duration-300 hover:-translate-y-1">
                  {i === 0 ? (
                    <Tape className="-top-3 left-8 -rotate-2" label="real" />
                  ) : null}
                  <p className="text-sm leading-relaxed text-foreground/85">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-auto eyebrow text-muted-foreground">
                    {t.source}
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