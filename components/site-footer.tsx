'use client'

import { ArrowUp, Check, Copy, Download } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import { CharacterParade } from '@/components/character-parade'
import { ContactModal } from '@/components/contact-modal'
import { SocialLinks } from '@/components/social-links'

const EMAIL = 'jasminetan0510@gmail.com'

/**
 * Footer: compact and quiet.
 *
 * - Headline + a short line of context.
 * - Actions: the email address with a one-click copy button, and Résumé.
 *   (The contact form is one click away in the header, so no second
 *   "Get in touch" button here.)
 * - Bottom row: copyright, social icons, back to top.
 * - No dividers, tape, or backdrop: it sits on the same ivory as the
 *   sections above, so the page flows straight into it.
 *
 * ContactModal is mounted here, so the header's "Get in touch" works on
 * every page that renders the footer (home and every project page).
 */
export function SiteFooter() {
  const lenis = useLenis()

  function backToTop(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    if (lenis) lenis.scrollTo(0, { duration: 1.3 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="relative scroll-mt-8 bg-background">
      <div className="relative mx-auto w-full max-w-5xl px-5 pt-8 pb-6 sm:px-8 sm:pt-10">
        <h2 className="display max-w-2xl text-2xl leading-[1.1] text-balance sm:text-3xl">
          Open to PM &amp; software engineering roles — let&apos;s build something.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Graduating June 2027 · Based in Los Angeles &amp; Santa Barbara
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <CopyEmail />

          <a
            href="/resume.pdf"
            download
            data-goatcounter-click="footer-resume"
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Download className="size-4" aria-hidden="true" />
            Resume
          </a>
        </div>

        {/* Saved characters hop in place along the bottom of the footer. */}
        <div className="mt-8">
          <CharacterParade />
        </div>

        <div className="mt-5 flex flex-col-reverse items-start gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jasmine Tan</p>
          <div className="flex items-center gap-3">
            <SocialLinks />
            <a
              href="#top"
              onClick={backToTop}
              className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-foreground"
            >
              Back to top
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <ContactModal />
    </footer>
  )
}

/** The email address as a quiet pill, with a one-click copy button. */
function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard blocked (e.g. insecure context): fall back to mail app.
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <span className="inline-flex items-center rounded-full border border-input pl-4 text-sm">
      <a href={`mailto:${EMAIL}`} className="py-2 font-medium hover:underline">
        {EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        data-goatcounter-click="email-copy"
        aria-label={copied ? 'Email copied' : 'Copy email address'}
        className="ml-1.5 grid size-9 place-items-center rounded-full text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied to clipboard' : ''}
      </span>
    </span>
  )
}