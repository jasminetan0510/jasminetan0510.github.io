import { Download, Linkedin, Mail } from 'lucide-react'
import { CharacterParade } from '@/components/character-parade'
import { GithubMark, Tape } from '@/components/scrapbook'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'

const EMAIL = 'jasminetan0510@gmail.com'
const GITHUB_USER = 'jasminetan0510'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jasminetan555'

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative scroll-mt-8 overflow-hidden bg-[#faf7f2]"
    >
      <ParallaxBackdrop variant="cococream" speed={0.1} />
      <div className="relative mx-auto w-full max-w-5xl px-5 pt-14 pb-24 sm:px-8 sm:pt-20 sm:pb-28">
        <div className="relative border-t border-border pt-12 sm:pt-14">
          <Tape
            className="-top-3 left-1/2 -translate-x-1/2 rotate-1"
            label="fin"
          />

          <h2 className="display text-3xl text-balance sm:text-4xl">
            Open to PM &amp; software engineering roles — let&apos;s build
            something.
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <Mail className="size-4" aria-hidden="true" />
              {EMAIL}
            </a>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition hover:bg-secondary active:scale-95"
            >
              <GithubMark className="size-4" />
              github.com/{GITHUB_USER}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition hover:bg-secondary active:scale-95"
            >
              <Linkedin className="size-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition hover:bg-secondary active:scale-95"
            >
              <Download className="size-4" aria-hidden="true" />
              Download Resume
            </a>
          </div>

          <p className="mt-10 eyebrow text-muted-foreground">
            Jasmine Tan · built and taped together in 2026
          </p>
        </div>

        {/* Saved characters hop in place along the bottom of the footer
            instead of walking across the whole page. */}
        <CharacterParade />
      </div>
    </footer>
  )
}