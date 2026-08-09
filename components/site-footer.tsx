import { Download, Linkedin, Mail } from 'lucide-react'
import { GithubMark, Tape } from '@/components/scrapbook'

const EMAIL = 'jasminetan0510@gmail.com'
const GITHUB_USER = 'jasminetan0510'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jasminetan555'

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="mx-auto w-full max-w-5xl scroll-mt-8 px-5 pt-8 pb-16 sm:px-8"
    >
      <div className="relative border-t border-border pt-10">
        <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-1" label="fin" />

        <h2 className="display text-3xl text-balance sm:text-4xl">
          Say hello — I reply fast.
        </h2>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Mail className="size-4" aria-hidden="true" />
            {EMAIL}
          </a>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <GithubMark className="size-4" />
            github.com/{GITHUB_USER}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Linkedin className="size-4" aria-hidden="true" />
            LinkedIn
          </a>
          {/* Points at public/resume.pdf — download attribute forces a
              direct download instead of just navigating to the PDF. */}
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" aria-hidden="true" />
            Download Resume
          </a>
        </div>

        <p className="mt-8 eyebrow text-muted-foreground">
          Jasmine Tan · built and taped together in 2026
        </p>
      </div>
    </footer>
  )
}