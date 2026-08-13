import { PaperCard, Tape } from '@/components/scrapbook'
import { ParallaxBackdrop } from '@/components/parallax-backdrop'

export function Currently() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <ParallaxBackdrop variant="seabreeze" speed={0.12} />
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <PaperCard className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <Tape className="-top-3 left-8 -rotate-2" label="now" />
          <p className="eyebrow shrink-0 text-primary">Currently</p>
          <p className="text-sm text-foreground/85">
            <span className="font-medium">
              Software Engineer, Caliber Research Group
            </span>{' '}
            — building the team&apos;s PM ticket tracker and redesigning the
            LeetCode Autograder, ahead of a fall 2026 launch in UCSB&apos;s CS8
            and CS24.
          </p>
        </PaperCard>
      </div>
    </section>
  )
}