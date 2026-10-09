'use client'

import { ArrowUp, Check, Copy, Download, Loader2, Send } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import { CharacterParade } from '@/components/character-parade'
import { ContactModal } from '@/components/contact-modal'
import { SocialLinks } from '@/components/social-links'

const EMAIL = 'jasminetan0510@gmail.com'

/**
 * Footer, on the hero's greige so the page opens and closes in one color.
 *
 * - Left: the tagline (Outfit), availability, and contact details
 *   (email with copy, résumé view/download, location, socials).
 * - Right: a short inline message form that sends through the same
 *   /api/contact route as the header's contact modal, so the visitor can
 *   reach out without leaving the page.
 * - Bottom: character parade, copyright, back to top.
 *
 * ContactModal stays mounted here so the header's "Get in touch" button
 * works on every page that renders the footer.
 */
export function SiteFooter() {
  const lenis = useLenis()

  function backToTop(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    if (lenis) lenis.scrollTo(0, { duration: 1.3 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="relative scroll-mt-20 bg-accent">
      <div className="mx-auto w-full max-w-5xl px-5 pt-10 pb-6 sm:px-8 sm:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-12">
          {/* Left: who + how to reach */}
          <div className="min-w-0">
            <h2 className="display max-w-lg text-2xl leading-[1.1] text-balance sm:text-3xl">
              Building for the people products forget.{' '}
              <span className="text-foreground/45">Want to build with me?</span>
            </h2>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/50" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Open to PM &amp; software engineering roles · Graduating June 2027
            </p>

            <dl className="mt-5 grid max-w-md gap-y-1.5 text-sm">
              <Row label="Email">
                <span className="flex min-w-0 items-center gap-1">
                  <a href={`mailto:${EMAIL}`} className="min-w-0 truncate font-medium hover:underline">
                    {EMAIL}
                  </a>
                  <CopyEmail />
                </span>
              </Row>
              <Row label="Résumé">
                <span className="flex items-center gap-1">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-goatcounter-click="footer-resume-view"
                    className="font-medium hover:underline"
                  >
                    View PDF
                  </a>
                  <a
                    href="/resume.pdf"
                    download="Jasmine-Tan-Resume.pdf"
                    data-goatcounter-click="footer-resume-download"
                    aria-label="Download résumé (PDF)"
                    title="Download PDF"
                    className={iconBtn}
                  >
                    <Download className="size-4" aria-hidden="true" />
                  </a>
                </span>
              </Row>
              <Row label="Based in">
                <span>Los Angeles &amp; Santa Barbara, CA</span>
              </Row>
              <Row label="Elsewhere">
                <SocialLinks className="-ml-2" />
              </Row>
            </dl>
          </div>

          {/* Right: inline message form */}
          <ContactForm />
        </div>

        {/* Saved characters hop in place along the bottom of the footer. */}
        <div className="mt-6">
          <CharacterParade />
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Jasmine Tan</p>
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

      <ContactModal />
    </footer>
  )
}

const iconBtn =
  'grid size-8 shrink-0 place-items-center rounded-full text-foreground/55 transition-colors hover:bg-background/60 hover:text-foreground'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3">
      <dt className="eyebrow text-[0.625rem] text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-foreground/85">{children}</dd>
    </div>
  )
}

/** One-click copy of the email address. */
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
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        data-goatcounter-click="email-copy"
        aria-label={copied ? 'Email copied' : 'Copy email address'}
        title={copied ? 'Copied!' : 'Copy'}
        className={iconBtn}
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied to clipboard' : ''}
      </span>
    </>
  )
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Short message form → POST /api/contact.
 * Sends { name, email, message, company }: `company` is the honeypot
 * (hidden from people; bots fill it in). If your route expects different
 * field names, match them in `body` below.
 */
function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const body = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      company: String(data.get('company') ?? ''),
    }
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Something went wrong. Try emailing me directly.')
      }
      setStatus('sent')
      form.reset()
      ;(window as unknown as { goatcounter?: { count: (o: object) => void } }).goatcounter?.count({
        path: 'footer-message-sent',
        event: true,
      })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const field =
    'w-full rounded-lg border border-foreground/15 bg-card/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors outline-none focus:border-foreground/40 focus:bg-card'

  if (status === 'sent') {
    return (
      <div className="flex flex-col justify-center rounded-xl border border-foreground/10 bg-card/70 p-4">
        <p className="display flex items-center gap-2 text-lg">
          <Check className="size-5" aria-hidden="true" />Thanks, it&apos;s on its way.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">I&apos;ll get back to you within a couple of days.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-3 w-fit text-sm font-medium text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2.5 rounded-xl border border-foreground/10 bg-card/50 p-4"
      aria-label="Send me a message"
    >
      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="sr-only" htmlFor="footer-name">Name</label>
        <input id="footer-name" name="name" required autoComplete="name" placeholder="Name" className={field} />
        <label className="sr-only" htmlFor="footer-email">Email</label>
        <input
          id="footer-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className={field}
        />
      </div>
      <label className="sr-only" htmlFor="footer-message">Message</label>
      <textarea
        id="footer-message"
        name="message"
        required
        rows={2}
        placeholder="Send a quick note: what are you working on?"
        className={`${field} resize-none`}
      />
      {/* Honeypot: hidden from people, bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="min-h-5 text-xs text-red-700">
          {status === 'error' ? error : ''}
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          data-goatcounter-click="footer-message-submit"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgb(0_0_0_/_0.5)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
        >
          {status === 'sending' ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  )
}