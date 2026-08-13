import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { Reveal } from '@/components/reveal'

const skillGroups = [
  {
    label: 'Languages',
    items: ['C++', 'Python', 'JavaScript', 'HTML/CSS', 'SQL'],
    direction: 'left' as const,
    speed: 26,
  },
  {
    label: 'Frameworks & Tools',
    items: [
      'React',
      'React Native',
      'Flutter',
      'Node.js',
      'FastAPI',
      'Supabase',
      'OpenAI API',
      'Git/GitHub',
      'Webflow',
      'Figma',
      'Cypress',
    ],
    direction: 'right' as const,
    speed: 42,
  },
  {
    label: 'Project Management',
    items: [
      'Agile/Scrum',
      'Sprint Planning',
      'Risk Management',
      'Documentation & Reporting',
      'Notion',
      'Smartsheet',
      'ClickUp',
      'Jira',
    ],
    direction: 'left' as const,
    speed: 34,
  },
]

/**
 * One horizontally-scrolling row of skill chips. The item list is
 * duplicated enough times to comfortably overflow the lane — short
 * lists (like Languages) get more copies so the track never runs out
 * of content and shows dead space before looping. Direction alternates
 * per row (left/right) so the whole card feels like a quiet conveyor
 * rather than one flat scroll.
 */
function MarqueeRow({
  label,
  items,
  direction,
  speed,
}: {
  label: string
  items: string[]
  direction: 'left' | 'right'
  speed: number
}) {
  const copies = items.length <= 6 ? 4 : items.length <= 9 ? 3 : 2
  const distance = `-${100 / copies}%`

  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow w-24 shrink-0 text-muted-foreground sm:w-28">
        {label}
      </p>
      <div
        className="skills-marquee-mask relative flex-1 overflow-hidden"
        style={{
          ['--marquee-duration' as string]: `${speed}s`,
          ['--marquee-distance' as string]: distance,
        }}
      >
        <div
          className={
            direction === 'left'
              ? 'skills-marquee-track skills-marquee-left'
              : 'skills-marquee-track skills-marquee-right'
          }
        >
          {Array.from({ length: copies }).map((_, copy) => (
            <div
              key={copy}
              aria-hidden={copy !== 0}
              className="flex shrink-0 items-center gap-2 pr-2"
            >
              {items.map((item) => (
                <span
                  key={item}
                  className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/85"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <section className="relative scroll-mt-8 overflow-hidden py-16">
      <ParallaxBackdrop variant="cococream" speed={0.18} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            title="Toolkit"
            note="the full scan, not pieced together per project"
          />
        </Reveal>

        <PaperCard className="relative mt-8 flex flex-col gap-4 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
          <Tape className="-top-3 right-10 rotate-2" />
          {skillGroups.map((group) => (
            <MarqueeRow
              key={group.label}
              label={group.label}
              items={group.items}
              direction={group.direction}
              speed={group.speed}
            />
          ))}
        </PaperCard>

        {/* Scoped marquee styles — plain CSS so it works with no client JS. */}
        <style>{`
        .skills-marquee-mask {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 16px,
            black calc(100% - 16px),
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 16px,
            black calc(100% - 16px),
            transparent
          );
        }
        .skills-marquee-track {
          display: flex;
          width: max-content;
          animation-duration: var(--marquee-duration, 36s);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .skills-marquee-left {
          animation-name: skills-marquee-scroll-left;
        }
        .skills-marquee-right {
          animation-name: skills-marquee-scroll-right;
        }
        .skills-marquee-mask:hover .skills-marquee-track {
          animation-play-state: paused;
        }
        @keyframes skills-marquee-scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(var(--marquee-distance, -50%));
          }
        }
        @keyframes skills-marquee-scroll-right {
          from {
            transform: translateX(var(--marquee-distance, -50%));
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .skills-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
      </div>
    </section>
  )
}