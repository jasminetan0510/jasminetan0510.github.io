import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SkipBoot } from '@/components/boot-screen'
import { ArtifactView, ProjectImage, StatusChip, Tags } from '@/components/project-bits'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getProject, projects } from '@/lib/projects'

/**
 * One page per project at /projects/<slug>, so each case study has its own
 * shareable link, shows up in search, and has room for real artifacts.
 * Pages are generated at build time from lib/projects.ts.
 */

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  const title = `${project.name} — Jasmine Tan`
  return {
    title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.tagline,
      type: 'article',
      url: `/projects/${project.slug}`,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const i = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]
  const cs = project.caseStudy

  return (
    <>
      <SkipBoot />
      <SiteHeader />
      <main className="bg-background">
        {/* Header band */}
        <section className="bg-sky pt-28 pb-10 sm:pt-32 sm:pb-14">
          <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              All projects
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <StatusChip status={project.status} />
              <p className="text-sm text-muted-foreground">{project.role}</p>
            </div>
            <h1 className="display mt-3 text-4xl leading-[1.02] text-balance sm:text-5xl">{project.name}</h1>
            <p className="mt-4 max-w-prose text-lg leading-snug font-light text-foreground/80 sm:text-xl">
              {project.tagline}
            </p>
            <Tags project={project} className="mt-5" />
          </div>
        </section>

        <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="paper-edge relative aspect-[16/9] overflow-hidden rounded-sm border border-foreground/10 bg-muted">
            <ProjectImage project={project} sizes="(max-width: 768px) 100vw, 720px" priority />
          </div>

          <div className="mt-10 flex flex-col gap-9 text-[1.02rem] leading-relaxed text-foreground/85">
            <CaseSection title="Overview">
              <p>{project.summary}</p>
              <p className="mt-3">{project.outcome}</p>
            </CaseSection>

            {cs ? (
              <>
                <CaseSection title="The problem">
                  <p>{cs.problem}</p>
                </CaseSection>
                <CaseSection title="The decision">
                  <p>{cs.decision}</p>
                </CaseSection>
                <CaseSection title="The outcome">
                  <p>{cs.outcome}</p>
                </CaseSection>
                {cs.artifact ? (
                  <CaseSection title="Artifact">
                    <ArtifactView artifact={cs.artifact} />
                  </CaseSection>
                ) : null}
                {cs.reflection ? (
                  <CaseSection title="What I'd do differently">
                    <p>{cs.reflection}</p>
                  </CaseSection>
                ) : null}
              </>
            ) : (
              <p className="rounded-sm border border-dashed border-foreground/20 px-5 py-4 text-sm text-muted-foreground">
                The full case study for this project is in progress.
              </p>
            )}
          </div>

          {project.quotes?.length ? (
            <section className="mt-12">
              <h2 className="eyebrow mb-4 text-primary">What teammates said</h2>
              <div className="flex flex-col gap-3">
                {project.quotes.map((q, qi) => (
                  <figure
                    key={qi}
                    className={
                      'max-w-[90%] rounded-2xl bg-foreground p-5 ' +
                      (qi % 2 === 0 ? 'self-start rounded-bl-md' : 'self-end rounded-br-md')
                    }
                  >
                    <blockquote className="text-[0.95rem] leading-relaxed text-card/90">
                      &ldquo;{q.quote}&rdquo;
                    </blockquote>
                    <figcaption className="eyebrow mt-2.5 text-card/55">{q.source}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-10 inline-flex items-center gap-1.5 rounded-full border border-input px-4 py-2 text-sm font-medium transition hover:bg-secondary"
            >
              View on GitHub
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}

          {/* Previous / next project */}
          <nav aria-label="More projects" className="mt-14 grid gap-4 sm:grid-cols-2">
            <Link
              href={`/projects/${prev.slug}`}
              className="group rounded-sm border border-foreground/10 bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="size-3" aria-hidden="true" /> Previous
              </span>
              <span className="display mt-1 block text-lg leading-tight">{prev.name}</span>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="group rounded-sm border border-foreground/10 bg-card p-4 text-right transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                Next <ArrowRight className="size-3" aria-hidden="true" />
              </span>
              <span className="display mt-1 block text-lg leading-tight">{next.name}</span>
            </Link>
          </nav>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}

function CaseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow mb-2 text-primary">{title}</h2>
      {children}
    </section>
  )
}