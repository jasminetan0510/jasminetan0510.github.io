import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import type { Artifact, Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

/**
 * Small pieces shared by the home-page project grid and the case-study
 * pages. No client-only code, so they work in server components too.
 */

/** Tech tags filled, product tags outlined. `compact` (on the cards) shows
 *  at most 3 tech + 2 product tags at a smaller size. */
export function Tags({ project, className, compact }: { project: Project; className?: string; compact?: boolean }) {
  const stack = compact ? project.stack.slice(0, 3) : project.stack
  const pm = compact ? project.pm.slice(0, 2) : project.pm
  const size = compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {stack.map((t) => (
        <span key={t} className={cn('rounded-full bg-secondary text-foreground/75', size)}>
          {t}
        </span>
      ))}
      {pm.map((t) => (
        <span key={t} className={cn('rounded-full border border-foreground/25 text-foreground/75', size)}>
          {t}
        </span>
      ))}
    </div>
  )
}

/** Small, quiet date/status label. */
export function StatusChip({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center whitespace-nowrap rounded-full bg-card px-2.5 py-0.5 text-[11px] font-medium text-foreground/70 shadow-sm ring-1 ring-foreground/10',
        className,
      )}
    >
      {status}
    </span>
  )
}

/** The project's screenshot, or a neutral placeholder if there isn't one yet. */
export function ProjectImage({
  project,
  sizes,
  priority,
  className,
}: {
  project: Project
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (!project.image) {
    return (
      <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_oklch,var(--foreground)_5%,transparent)_10px_20px)] text-xs text-muted-foreground">
        screens coming soon
      </div>
    )
  }
  return (
    <Image
      src={project.image}
      alt={`Screenshot of ${project.name}`}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(project.device === 'phone' ? 'object-contain p-2.5' : 'object-cover', className)}
    />
  )
}

/** The one concrete artifact in a case study. */
export function ArtifactView({ artifact }: { artifact: Artifact }) {
  switch (artifact.kind) {
    case 'metric':
      return (
        <div className="rounded-sm border border-border bg-secondary/60 px-5 py-4">
          <p className="display text-4xl leading-none">{artifact.value}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{artifact.label}</p>
        </div>
      )
    case 'prd':
      return (
        <figure className="rounded-sm border border-border bg-background px-5 py-4">
          <figcaption className="text-sm font-semibold">{artifact.title}</figcaption>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-foreground/80">
            {artifact.lines.map((line) => (
              <li key={line} className="border-l-2 border-foreground/20 pl-3">
                {line}
              </li>
            ))}
          </ul>
        </figure>
      )
    case 'flow':
      return (
        <figure>
          <figcaption className="text-sm font-semibold">{artifact.title}</figcaption>
          <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
            {artifact.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-1.5">
                <span className="rounded-full border border-border bg-background px-3 py-1">
                  <span className="mr-1.5 tabular-nums text-muted-foreground">{i + 1}</span>
                  {step}
                </span>
                {i < artifact.steps.length - 1 && (
                  <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </figure>
      )
    case 'image':
      return (
        <figure>
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-border bg-muted">
            <Image src={artifact.src} alt={artifact.alt} fill sizes="640px" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-sm text-muted-foreground">{artifact.caption}</figcaption>
        </figure>
      )
  }
}