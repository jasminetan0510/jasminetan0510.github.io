'use client'

import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'
import { Reveal } from '@/components/reveal'

const skillGroups = [
  {
    label: 'Languages',
    items: ['C++', 'Python', 'JavaScript', 'HTML/CSS', 'SQL'],
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
  },
]

// Logos for the scrolling strip below the skill chips. `slug` is the
// Simple Icons (simpleicons.org) name — served from their free CDN,
// tinted to match the site's ink color rather than each tool's brand
// color so 18 different logos don't turn into visual noise. Only tools
// confirmed to have a Simple Icons entry are included here; a few from
// skillGroups above (SQL, Smartsheet, Agile/Scrum-type skills) don't
// have a matching brand mark and are left out rather than risk a
// broken icon.
//
// TODO (later): once there are enough certificates to show, build a
// `certificateLogos` array in this same {name, slug} shape and swap it
// into the <LogoMarquee items={...} /> call below — everything else
// (the scroll animation, masking, sizing) stays the same.
const toolLogos = [
  { name: 'React', slug: 'react' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Python', slug: 'python' },
  { name: 'C++', slug: 'cplusplus' },
  { name: 'HTML5', slug: 'html5' },
  { name: 'CSS', slug: 'css' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'FastAPI', slug: 'fastapi' },
  { name: 'Flutter', slug: 'flutter' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'OpenAI', slug: 'openai' },
  { name: 'GitHub', slug: 'github' },
  { name: 'Webflow', slug: 'webflow' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Cypress', slug: 'cypress' },
  { name: 'Notion', slug: 'notion' },
  { name: 'ClickUp', slug: 'clickup' },
  { name: 'Jira', slug: 'jira' },
]

/**
 * One static row of skill chips, kept to a single line. Long rows
 * (Frameworks & Tools) scroll horizontally rather than wrapping —
 * wrapping pushed the last chip or two onto an orphaned second line,
 * which read worse than a deliberately scrollable row.
 */
function SkillRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex items-center gap-4">
      <p className="eyebrow w-24 shrink-0 text-muted-foreground sm:w-28">
        {label}
      </p>
      <div className="skill-row-scroll flex flex-1 flex-nowrap gap-2 overflow-x-auto">
        {items.map((item) => (
          <span
            key={item}
            className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/85"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Reusable scrolling logo strip. Duplicates `items` once so the CSS
 * animation can loop seamlessly (translate exactly -50% instead of
 * -100%, since the track is now twice the content's width). Built
 * generic on purpose — swap `items` for a certificates array later and
 * everything else (masking, speed, pause behavior) carries over as-is.
 */
function LogoMarquee({
  label,
  items,
}: {
  label: string
  items: { name: string; slug: string }[]
}) {
  const track = [...items, ...items]

  return (
    <div className="border-t border-border pt-4">
      <p className="eyebrow mb-3 text-muted-foreground">{label}</p>
      <div className="logo-marquee-mask overflow-hidden">
        <div className="animate-logo-marquee flex w-max items-center gap-10">
          {track.map((tool, i) => (
            <img
              key={`${tool.slug}-${i}`}
              src={`https://cdn.simpleicons.org/${tool.slug}/1B1A17`}
              alt={tool.name}
              title={tool.name}
              loading="lazy"
              className="h-6 w-auto shrink-0 opacity-60 grayscale transition hover:opacity-100 sm:h-7"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Toolkit — skill chips + scrolling logo strip. Previously folded into
 * the bottom of Featured Projects; pulled out into its own section
 * since it's really its own topic (what I know), not part of the
 * project showcase.
 */
export function Toolkit() {
  return (
    <section
      id="toolkit"
      className="relative scroll-mt-8 overflow-hidden bg-accent py-14 sm:py-20"
    >
      <ParallaxBackdrop variant="seabreeze" speed={0.14} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            title="Toolkit"
            // note="languages, frameworks, and the tools I reach for"
          />
        </Reveal>

        <Reveal delay={80}>
          <PaperCard className="relative mt-8 flex flex-col gap-4 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 sm:mt-10 sm:p-6">
            <Tape className="-top-3 right-10 rotate-2" />
            {skillGroups.map((group) => (
              <SkillRow key={group.label} label={group.label} items={group.items} />
            ))}
            <LogoMarquee label="Tools I've used" items={toolLogos} />
          </PaperCard>
        </Reveal>
      </div>

      <style>{`
        .skill-row-scroll {
          scrollbar-width: none;
        }
        .skill-row-scroll::-webkit-scrollbar {
          display: none;
        }

        .logo-marquee-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }

        @keyframes logo-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-logo-marquee {
          animation: logo-marquee 26s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-logo-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}