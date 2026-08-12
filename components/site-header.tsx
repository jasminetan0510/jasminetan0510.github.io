import { Download } from 'lucide-react'

const navLinks = [
  { label: 'Projects', href: '#projects', num: '01' },
  { label: 'Involvements', href: '#involvements', num: '02' },
  { label: 'Playground', href: '#playground', num: '03' },
]

/**
 * Sticky top bar: wordmark + section nav on the left/center,
 * "Get in touch" (scrolls to the footer contact section) and a plain
 * "Download Resume" text link on the right.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#hero"
          className="eyebrow shrink-0 text-foreground transition-colors hover:text-primary"
        >
          jasmine.tan
        </a>

        <nav
          aria-label="Section navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="eyebrow flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-primary">{link.num}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href="/resume.pdf"
            download
            className="hidden items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Download Resume
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}