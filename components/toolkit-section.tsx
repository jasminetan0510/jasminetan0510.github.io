'use client'

import { useState } from 'react'
import { Reveal } from '@/components/reveal'
import { PaperCard, SectionHeading } from '@/components/scrapbook'
import { cn } from '@/lib/utils'

// One unified list per category — every tool is either a small logo (if
// it has a Simple Icons entry) or a plain text chip. Logos that fail to
// load fall back to a plain text chip automatically (see ToolChip).
type ToolEntry =
  | { type: 'logo'; name: string; slug: string }
  | { type: 'text'; name: string }

const CATEGORY_DOT_OPACITY = [
  'bg-foreground',
  'bg-foreground/70',
  'bg-foreground/45',
  'bg-foreground/25',
] as const

// Matches the résumé's skills section (Oct 2026), plus Ruby on Rails
// from the AppFolio capstone.
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
      { type: 'logo', name: 'Ruby on Rails', slug: 'rubyonrails' },
      { type: 'logo', name: 'Flutter', slug: 'flutter' },
      { type: 'logo', name: 'Node.js', slug: 'nodedotjs' },
      { type: 'logo', name: 'FastAPI', slug: 'fastapi' },
      { type: 'logo', name: 'Supabase', slug: 'supabase' },
      { type: 'logo', name: 'GitHub', slug: 'github' },
      { type: 'logo', name: 'Webflow', slug: 'webflow' },
      { type: 'logo', name: 'Figma', slug: 'figma' },
      { type: 'logo', name: 'Cypress', slug: 'cypress' },
    ],
  },
  {
    label: 'AI & Data',
    items: [
      { type: 'logo', name: 'Claude Code', slug: 'claude' },
      { type: 'logo', name: 'Cursor', slug: 'cursor' },
      { type: 'text', name: 'OpenAI API' },
    ],
  },
  {
    label: 'Project Management',
    items: [
      { type: 'text', name: 'Agile/Scrum' },
      { type: 'text', name: 'Sprint Planning' },
      { type: 'text', name: 'Documentation & Reporting' },
      { type: 'logo', name: 'Notion', slug: 'notion' },
      { type: 'text', name: 'Smartsheet' },
      { type: 'logo', name: 'ClickUp', slug: 'clickup' },
      { type: 'logo', name: 'Jira', slug: 'jira' },
    ],
  },
]

/**
 * One chip. If it's a logo item, tracks whether the image actually
 * loaded — `onError` flips `logoFailed`, which drops the <img> and falls
 * back to a plain text chip, so a bad CDN slug fails quietly instead of
 * showing a broken-image icon.
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

/** Grouped toolkit list: one row per category, everything visible at once. */
function ToolkitList() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {toolkitCategories.map((category, i) => (
        <div key={category.label}>
          <div className="mb-2 flex items-center gap-2">
            <span className={cn('size-2 rounded-full', CATEGORY_DOT_OPACITY[i % CATEGORY_DOT_OPACITY.length])} />
            <p className="eyebrow text-foreground/70">{category.label}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {category.items.map((item) => (
              <ToolChip key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Toolkit as its own section (used on /about). */
export function ToolkitSection() {
  return (
    <section id="toolkit" className="relative scroll-mt-8 bg-sky py-10 sm:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading title="Toolkit" />
        </Reveal>
        <Reveal delay={80}>
          <PaperCard className="mt-7 rounded-xl bg-card p-6 sm:p-7">
            <ToolkitList />
          </PaperCard>
        </Reveal>
      </div>
    </section>
  )
}