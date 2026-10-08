import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

/**
 * "What teammates say": three quotes as chat bubbles in a slim strip,
 * right after Experience, so the social proof sits next to the work it
 * vouches for. Bubbles alternate their "tail" corner and float gently.
 */
const QUOTES = [
  {
    source: 'Teammate, UCSB Project Dining',
    quote:
      'She\u2019s the one who ends up coordinating and checking up on the team to make sure our work is on time. She was the one who set up the group chat so that our team has a means of communication.',
  },
  {
    source: 'Teammate, KIT',
    quote:
      'Consistently produced high-quality work that required minimal re-review, which greatly streamlined the team\u2019s workflow. Even after finishing her own tasks, she remained available to support other team members.',
  },
  {
    source: 'Teammate, KIT',
    quote:
      'Essential in handling the food waste aspect of our app. Went to class every day and participated meaningfully in discussion towards the progress of our app.',
  },
]

export function TeammateQuotes() {
  return (
    <section id="voices" className="relative scroll-mt-8 bg-background py-10 sm:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading title="What teammates say" />
        </Reveal>

        <ul className="mt-7 grid gap-5 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <li key={i}>
              <Reveal delay={i * 90}>
                <figure
                  className={cn(
                    'quote-float flex h-full flex-col justify-between gap-3 rounded-2xl bg-foreground p-5',
                    i % 2 === 0 ? 'rounded-bl-md' : 'rounded-br-md',
                  )}
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <blockquote className="text-sm leading-relaxed text-card/90">&ldquo;{q.quote}&rdquo;</blockquote>
                  <figcaption className="eyebrow text-card/55">{q.source}</figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes quote-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .quote-float {
          animation: quote-float 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .quote-float {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}