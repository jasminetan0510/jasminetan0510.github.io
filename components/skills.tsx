import { PaperCard, SectionHeading, Tape } from '@/components/scrapbook'
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

export function Skills() {
  return (
    <section className="mx-auto w-full max-w-5xl scroll-mt-8 px-5 py-16 sm:px-8">
      <Reveal>
        <SectionHeading
          index="02"
          title="Toolkit"
          note="the full scan, not pieced together per project"
        />
      </Reveal>

      <PaperCard className="relative mt-8 flex flex-col gap-5 p-5 sm:p-6">
        <Tape className="-top-3 right-10 rotate-2" />
        {skillGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <p className="eyebrow text-muted-foreground">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/85"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </PaperCard>
    </section>
  )
}