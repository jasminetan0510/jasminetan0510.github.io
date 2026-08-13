import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PaperCard, Tape } from '@/components/scrapbook'

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background px-5 py-16">
      <PaperCard className="paper-edge relative w-full max-w-md -rotate-1 p-6 text-center sm:p-8">
        <Tape
          className="-top-3 left-1/2 -translate-x-1/2 rotate-2"
          label="oops"
        />

        <p className="eyebrow text-muted-foreground">404</p>
        <h1 className="display mt-2 text-4xl leading-[1.05] text-balance sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Whatever you were looking for isn&apos;t here — maybe it got taped to
          a different page, or the link&apos;s just wrong.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the homepage
        </Link>
      </PaperCard>
    </main>
  )
}