import { Download, Linkedin, Mail } from 'lucide-react'
import { GithubMark } from '@/components/scrapbook'

const EMAIL = 'jasminetan0510@gmail.com'
const GITHUB_USER = 'jasminetan0510'
const LINKEDIN_URL = 'https://www.linkedin.com/in/jasminetan555'

/**
 * Quick-access contact buttons, top-right. Same button set is mirrored in
 * SiteFooter at the bottom of the page — keep both in sync if you edit one.
 */
export function SiteHeader() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-6 sm:px-8">
      <nav
        aria-label="Quick contact links"
        className="flex flex-wrap items-center justify-center gap-2 sm:justify-end"
      >
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:text-sm"
        >
          <Mail className="size-3.5" aria-hidden="true" />
          Email
        </a>
        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary sm:text-sm"
        >
          <GithubMark className="size-3.5" />
          GitHub
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary sm:text-sm"
        >
          <Linkedin className="size-3.5" aria-hidden="true" />
          LinkedIn
        </a>
        {/* Points at public/resume.pdf — download attribute forces a
            direct download instead of just navigating to the PDF. */}
        <a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary sm:text-sm"
        >
          <Download className="size-3.5" aria-hidden="true" />
          Resume
        </a>
      </nav>
    </div>
  )
}