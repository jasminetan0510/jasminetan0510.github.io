import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { Reveal } from '@/components/reveal'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'

// Grouped by project rather than one-card-per-quote — the two KIT
// teammates share a card since they're speaking to the same project,
// which keeps the section shorter without cutting any voices.
const testimonialGroups = [
  {
    source: 'Teammate, UCSB Project Dining',
    quotes: [
      'She\u2019s the one who ends up coordinating and checking up on the team to make sure our work is on time. She was the one who set up the group chat so that our team has a means of communication.',
    ],
  },
  {
    source: 'Teammates, KIT',
    quotes: [
      'Consistently produced high-quality work that required minimal re-review, which greatly streamlined the team\u2019s workflow. Even after finishing her own tasks, she remained available to support other team members.',
      'Essential in handling the food waste aspect of our app. Went to class every day and participated meaningfully in discussion towards the progress of our app.',
    ],
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

        {/* items-start (not stretch) — cards keep their own natural
            height instead of both being forced to match whichever one
            has the most content. */}
        <ul className="mt-8 grid grid-cols-1 items-start gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-7">
          {testimonialGroups.map((group, i) => (
            <li key={group.source}>
              <Reveal delay={i * 100}>
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