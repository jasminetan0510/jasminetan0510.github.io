'use client'

import { Mail, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tape } from '@/components/scrapbook'

const OPEN_EVENT = 'open-contact-form'

/** Call this from anywhere (e.g. the header's "Get in touch" button) to
 * open the modal — avoids needing to lift open/close state through
 * props across files, since the trigger (header) and the modal itself
 * (mounted once in the footer) aren't otherwise related. */
export function openContactForm() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT))
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactModal() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const lenis = useLenis()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function onOpen() {
      setStatus('idle')
      setErrorMessage('')
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  // Same scroll-lock approach used for the Featured Projects case study
  // modal: body overflow:hidden + lenis.stop() aren't reliably enough on
  // their own, since Lenis drives scroll via its own wheel/touch
  // listeners rather than native scroll. The capture-phase interceptor
  // below stops those events before Lenis (or anything else) sees them,
  // with the modal's own panel allow-listed through so its contents
  // (and the scrollable page behind it) behave correctly.
  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()

    function blockBackgroundScroll(event: WheelEvent | TouchEvent) {
      const panel = panelRef.current
      if (panel && event.target instanceof Node && panel.contains(event.target)) return
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    window.addEventListener('wheel', blockBackgroundScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', blockBackgroundScroll, { passive: false, capture: true })

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
      lenis?.start()
      window.removeEventListener('wheel', blockBackgroundScroll, { capture: true })
      window.removeEventListener('touchmove', blockBackgroundScroll, { capture: true })
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, lenis])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()

    if (!name || !email || !message) {
      setStatus('error')
      setErrorMessage('All fields are required.')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong — please try again.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong — please try again.',
      )
    }
  }

  // Guarded on `mounted` (document doesn't exist during server render)
  // and `open` — renders nothing at all otherwise, not just a hidden
  // element, so it costs nothing on every page load until actually used.
  if (!mounted || !open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        onClick={(event) => event.stopPropagation()}
        className="paper-edge relative w-full max-w-md -rotate-[0.4deg] rounded-sm border border-border bg-card p-6 sm:p-8"
      >
        <Tape className="-top-3 left-8 -rotate-2" label="say hi" />

        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close contact form"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <h2 id="contact-form-title" className="display text-2xl leading-tight sm:text-3xl">
          Let&apos;s talk
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Send a message and I&apos;ll get back to you by email.
        </p>

        {status === 'success' ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-sm bg-secondary/60 p-5 text-center">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">Message sent — thank you!</p>
            <p className="text-xs text-muted-foreground">I&apos;ll reply as soon as I can.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-name" className="eyebrow text-muted-foreground">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-email" className="eyebrow text-muted-foreground">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="eyebrow text-muted-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                className="resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            {status === 'error' ? <p className="text-xs text-destructive">{errorMessage}</p> : null}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}