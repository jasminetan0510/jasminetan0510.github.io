import { Reveal } from '@/components/reveal'
import { SectionHeading, Tape } from '@/components/scrapbook'

/**
 * Education + teaching, styled as a graded worksheet: header line, ruled
 * paper, check marks down the left, teacher's margin notes on the right,
 * and an "A+" stamp. Replaces the CBLE card in Involvements.
 *
 * Every `TODO` is a spot for you to fill in. Entries render whatever is
 * there, so delete a field's text (not the key) to hide it.
 */

const EDUCATION = {
  school: 'UC Santa Barbara',
  college: 'Robert Mehrabian College of Engineering',
  rows: [
    ['Degree', 'B.S. Computer Science, Software Engineering Track'],
    ['Minor', 'Science & Mathematics Education'],
    ['Certificate', 'Technology Management'],
    ['Graduating', 'June 2027'],
    ['GPA', '3.63'],
    ['Honors', 'Regents Scholar, Engineering Honors, Dean’s Honor'],
    [
      'Coursework',
      'Advanced Applications Programming, Database Systems, Mobile App Development, Data Structures & Algorithms, Machine Learning, Computer Vision',
    ],
    ['Published', 'Contributed to Caliber work at ACM ITiCSE ’26'],
  ] as const,
}

type TeachingItem = {
  title: string
  org: string
  when: string
  body: string
  note: string // teacher's margin note
  href?: string
}

const TEACHING: TeachingItem[] = [
  {
    title: 'Tutor',
    org: 'Prodigy Tutorial',
    when: 'Since high school', // TODO: start year
    body: 'One-on-one math and English for middle and high schoolers, plus a group Python class. I write my own supplementary worksheets.',
    note: 'still going!',
  },
  {
    title: 'Community Based Literacy Endorsement',
    org: 'UCSB',
    when: 'TODO: years (part of the education minor)',
    body: '40+ hours across Power Hour, UCSB Club, and MTSS classrooms at Harding University Partnership School: small-group lessons, a college-access research project, and reading and writing support for 4th and 5th graders.',
    note: '3 quarters at Harding',
    href: 'https://www.cbleducation.org/programs',
  },
  {
    title: 'Volunteer instructor',
    org: 'SciTrek',
    when: 'TODO: years',
    body: 'Taught hands-on science modules in elementary classrooms.',
    note: 'now I maintain their volunteer scheduler',
  },
  {
    title: 'Founding member',
    org: 'Science for Kidz',
    when: 'TODO: years',
    body: 'TODO: one line on what Science for Kidz does and what you started or ran.',
    note: 'TODO',
  },
]

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="mt-1 size-5 shrink-0 -rotate-6 text-foreground/70"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5c2 1.4 3.3 2.8 4.6 4.8C11 12.6 15 8 20.5 4.5" />
    </svg>
  )
}

export function EducationTeaching({ index = '04' }: { index?: string }) {
  return (
    <section id="education" className="relative scroll-mt-8 bg-background py-10 sm:py-14">
      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading index={index} title="Education & teaching" />
        </Reveal>

        <Reveal delay={80}>
          <article className="paper-edge relative mt-8 rounded-sm bg-card sm:mt-10">
            <Tape className="-top-3 left-12 -rotate-3" />

            {/* Worksheet header line */}
            <div className="flex flex-wrap items-end gap-x-8 gap-y-1 border-b border-foreground/20 px-6 pt-7 pb-3 text-sm text-muted-foreground sm:px-10">
              <span>
                Name: <span className="font-medium text-foreground">Jasmine Tan</span>
              </span>
              <span>
                Subject: <span className="font-medium text-foreground">CS + education</span>
              </span>
            </div>

            {/* Grade stamp */}
            <div
              aria-hidden="true"
              className="display absolute top-4 right-5 grid size-14 rotate-12 place-items-center rounded-full border-2 border-foreground/60 text-xl text-foreground/75 sm:top-5 sm:right-8 sm:size-16 sm:text-2xl"
            >
              A+
            </div>

            <div className="grid gap-10 px-6 py-8 sm:px-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12">
              {/* Education */}
              <div>
                <h3 className="eyebrow text-muted-foreground">Education</h3>
                <p className="display mt-2 text-2xl leading-tight">{EDUCATION.school}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{EDUCATION.college}</p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[0.95rem]">
                  {EDUCATION.rows.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-foreground/90">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Teaching, on ruled paper with a margin column */}
              <div>
                <h3 className="eyebrow text-muted-foreground">Teaching</h3>
                <ul className="ruled mt-3 divide-y divide-transparent">
                  {TEACHING.map((t) => (
                    <li
                      key={t.org}
                      className="grid grid-cols-[auto_1fr] gap-x-3 py-3 sm:grid-cols-[auto_1fr_8.5rem]"
                    >
                      <Check />
                      <div className="min-w-0">
                        <p className="leading-snug">
                          <span className="font-semibold">{t.title}</span>
                          <span className="text-foreground/70">, </span>
                          {t.href ? (
                            <a
                              href={t.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="underline decoration-foreground/30 underline-offset-2 hover:decoration-foreground"
                            >
                              {t.org}
                            </a>
                          ) : (
                            t.org
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{t.when}</p>
                        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-foreground/85">
                          {t.body}
                        </p>
                      </div>
                      {/* Margin note: under the item on mobile, in the margin on sm+ */}
                      <p className="col-start-2 mt-2 -rotate-2 text-sm text-foreground/60 italic sm:col-start-3 sm:mt-1 sm:border-l sm:border-foreground/25 sm:pl-3">
                        ← {t.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}