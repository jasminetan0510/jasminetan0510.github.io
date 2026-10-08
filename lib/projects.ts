/**
 * All project data, shared by the home-page grid (components/featured-
 * projects.tsx) and the case-study pages (app/projects/[slug]/page.tsx).
 *
 * Case studies follow the way PM recruiters read: what was wrong, what you
 * decided (and why), what happened, plus one concrete artifact.
 * `caseStudyDraft` is your notes in progress and is never rendered; rename
 * it to `caseStudy` to publish.
 */

export type Artifact =
  | { kind: 'metric'; value: string; label: string }
  | { kind: 'prd'; title: string; lines: string[] }
  | { kind: 'flow'; title: string; steps: string[] }
  | { kind: 'image'; src: string; alt: string; caption: string }

export type CaseStudy = {
  problem: string
  decision: string
  outcome: string
  artifact?: Artifact
  reflection?: string
}

export type Quote = { quote: string; source: string }

export type Project = {
  slug: string // URL: /projects/<slug>
  name: string
  role: string
  status: string
  device: 'laptop' | 'phone'
  tagline: string // one-line, high-level: shown on the floating card
  summary: string
  outcome: string
  stack: string[] // technical tags
  pm: string[] // product / PM tags
  image?: string // omit until you have a screenshot; a placeholder shows instead
  href?: string // GitHub / live link; omit and no link button renders
  caseStudy?: CaseStudy // rendered in the modal
  caseStudyDraft?: CaseStudy // your notes in progress; never rendered
  quotes?: Quote[] // teammate testimonials, shown on the project page
}

export const projects: Project[] = [
  {
    slug: 'appfolio-capstone',
    name: 'Tenant-Side Leasing Platform',
    role: 'Team Lead · UCSB × AppFolio Capstone, team of 5',
    tagline: 'A tenant-facing leasing app built with AppFolio, from kickoff to handoff.', // TODO: edit
    status: 'Fall 2026 \u2013 Winter 2027',
    device: 'laptop',
    summary:
      'A six-month industry capstone sponsored by AppFolio. Our five-person team is building a tenant-facing leasing app in Ruby on Rails on top of AppFolio\u2019s property API, with weekly check-ins with our AppFolio sponsor.',
    outcome:
      'UCSB\u2019s senior capstone, Fall 2026 \u2013 Winter 2027: a six-month build with AppFolio\u2019s industry sponsors on their property API.',
    stack: ['Ruby on Rails', 'AppFolio API'],
    pm: ['Sponsor management', 'Team leadership', 'Scoping'], // TODO: edit
    // TODO: add a screenshot, then: image: '/images/project-appfolio.png',
    // Document this one as you go, then rename to `caseStudy` to publish it.
    caseStudyDraft: {
      problem: 'TODO \u2014 what\u2019s painful about the tenant side of leasing today, in one or two sentences?',
      decision: 'TODO \u2014 the biggest scoping call you made with AppFolio, and why.',
      outcome: 'TODO \u2014 what shipped by the end, and one number if you have it.',
      artifact: {
        kind: 'prd',
        title: 'TODO \u2014 PRD excerpt: problem statement',
        lines: ['TODO \u2014 user', 'TODO \u2014 goal', 'TODO \u2014 success metric', 'TODO \u2014 out of scope'],
      },
    },
  },
  {
    slug: 'caliber',
    name: 'Caliber',
    role: 'Software Developer · Caliber Research Group, UCSB',
    tagline: 'A ticket tracker for a 20+ person team, plus an autograder redesign for 250+ students a quarter.',
    status: 'Shipping fall 2026',
    device: 'laptop',
    summary:
      'An AI-assisted course-planning and mastery-based-practice platform for university instruction, advised by Prof. Diba Mirza. I own two pieces of it: a project-management ticket tracker that coordinates a 20+ person team across 5 concurrent Caliber projects, and a redesign of the LeetCode Autograder\u2019s student submission flow and feedback interface.',
    outcome:
      'Tracker launching in the coming weeks; the autograder redesign launches fall 2026 in UCSB\u2019s CS8 and CS24 (250+ students/quarter). Contributed to platform work published at ACM ITiCSE \u201926.',
    stack: ['React', 'FastAPI', 'AI/LLM'],
    pm: ['Competitive analysis', 'Prototyping', 'Feedback loops'], // TODO: edit
    image: '/images/project-caliber.png',
    caseStudy: {
      problem:
        'The Caliber team had grown to 20+ people across 5 concurrent projects with no shared way to see who owned what. Work was getting tracked informally, which made it hard to tell what was in progress, blocked, or done. Separately, the LeetCode Autograder gave students a flat pass/fail with no breakdown of what actually went wrong.',
      // TODO: reword in your voice — lead with the call you made and why.
      decision:
        'We compared the tools the team already used (GitHub Projects for Kanban boards, Notion for dashboards), then prototyped our own tracker in Figma and built it. After demoing v1 at standup, we added project tags so one tracker could serve every project.',
      outcome:
        'A ticket tracker supporting creation, assignment, and self-claiming, with status, ownership, deadlines, and a change history \u2014 launching in the coming weeks for the whole 20+ person team. On the autograder side, restructured the 6-step grading pipeline into clear pass/fail breakdowns that separate what passed, what didn\u2019t, and what to fix, ahead of the fall 2026 launch.',
      // TODO: the 6-step submission pipeline makes a great artifact, e.g.
      // artifact: { kind: 'flow', title: 'Autograder submission pipeline', steps: ['…', '…'] },
      reflection:
        'If I were to rebuild this, I would implement different views, such as Calendar or Gallery to view all tickets, as well as different visualizations for basic progress tracking. We maintained a consistent TA and student feedback loop and implemented/revised features as requested.',
    },
  },
  {
    slug: 'ucsb-project-dining',
    name: 'UCSB Project Dining',
    role: 'Team Lead · CS156 team of 6',
    tagline: 'Live tracking and ratings for meals at UCSB dining commons, delivered 100% on schedule.',
    status: 'Fall 2025',
    device: 'laptop',
    summary:
      'A live tracking and rating app for meals at UCSB\u2019s dining commons. I led a 6-person team extending an inherited legacy dining-menu web app: ran biweekly retros and standups, led code reviews, and resolved merge conflicts for the team.',
    outcome:
      'Introduced a same-day PR-review norm that eliminated review backlogs \u2014 delivered 100% of committed work on schedule.',
    stack: ['React', 'Spring Boot'],
    pm: ['Agile ceremonies', 'Process design', 'Code review'], // TODO: edit
    // project-ucsb-dining.png belongs to UCSB Project Dining (not KIT)
    image: '/images/project-ucsb-dining.png',
    href: 'https://github.com/ucsb-cs156-f25/proj-dining-f25-05',
    quotes: [
      {
        quote:
          'She\u2019s the one who ends up coordinating and checking up on the team to make sure our work is on time. She was the one who set up the group chat so that our team has a means of communication.',
        source: 'Teammate, UCSB Project Dining',
      },
    ],
    caseStudyDraft: {
      problem: 'TODO \u2014 what was broken in the legacy app or the team\u2019s process?',
      decision: 'TODO \u2014 the same-day PR-review norm: why that, over other fixes?',
      outcome: 'TODO \u2014 100% of committed work on schedule; anything else?',
      artifact: { kind: 'metric', value: '100%', label: 'of committed work delivered on schedule' },
    },
  },
  {
    slug: 'scitrek-volunteer-scheduler',
    name: 'SciTrek Volunteer Scheduler',
    role: 'Lead Developer & Maintainer · SciTrek',
    tagline: 'An ad-free, account-less scheduler replacing SignUpGenius for K-12 science outreach.',
    status: 'Sole maintainer',
    device: 'laptop',
    summary:
      'An account-less volunteer scheduling platform for UCSB SciTrek\u2019s K-12 outreach program, with a three-role UX (participant, admin, organizer) and quarterly CSV module imports. Inherited from graduating developers and built to replace SignUpGenius with something mobile-optimized and ad-free.',
    // TODO: still no hard number — volunteer count or admin hours saved?
    outcome:
      'Waitlist auto-promotion, scheduled reminder emails, and slot swaps. Seeded a full quarter of realistic volunteer and school data to demo admin and organizer workflows for non-technical coordinators ahead of a program-wide launch.',
    stack: ['FastAPI', 'PostgreSQL', 'Celery/Redis', 'React', 'Vite'],
    pm: ['Role-based UX', 'Launch planning', 'Stakeholder demos'], // TODO: edit
    image: '/images/project-scitrek.png',
    href: 'https://github.com/Anteater10/uni-volunteer-scheduler',
    caseStudyDraft: {
      problem: 'TODO \u2014 what was broken about using SignUpGenius here?',
      decision: 'TODO \u2014 why account-less, and why these three roles?',
      outcome: 'TODO \u2014 what shipped, and one number if you have it.',
    },
  },
  {
    slug: 'yunie',
    name: 'yunie: Productivity Agent',
    role: 'Solo project',
    tagline: 'A conversational assistant for tasks, reminders, and goals.', // TODO: edit
    status: 'Resuming now',
    device: 'laptop',
    summary:
      'An AI-powered assistant enabling conversational task management, context-aware reminders, intelligent scheduling, and dynamic goal tracking.',
    outcome: 'Full-stack, with persistent chat history and secure auth built in.',
    stack: ['React', 'Node.js', 'OpenAI API'],
    pm: ['Product vision', 'Solo build'], // TODO: edit
    image: '/images/project-yunie.png',
    caseStudyDraft: {
      problem: 'TODO \u2014 what problem were you actually trying to solve for yourself?',
      decision: 'TODO \u2014 the main design or scope decision, and why.',
      outcome: 'TODO \u2014 what works today?',
    },
  },
  {
    slug: 'kit',
    name: 'KIT: Kitchen Inventory Tracking',
    role: 'Mobile Developer · CS184 team of 7',
    tagline: 'Scans receipts and tracks inventory to cut food waste and meal-planning mental load.',
    status: 'Winter 2026',
    device: 'phone',
    summary:
      'A cross-platform app that scans receipts and tracks kitchen inventory to cut food waste and reduce meal-planning mental load, built from scratch with a 7-person team. I owned the home dashboard and environmental-impact scoring, which power expiration alerts and recipe matching.',
    outcome:
      'OCR receipt scanning, barcode lookup, and recipe suggestions, backed by Supabase. 62 commits, #3 on the team by volume.',
    stack: ['React Native', 'Expo', 'FastAPI', 'Supabase'],
    pm: ['Feature ownership', 'Impact metrics', 'Cross-functional team'], // TODO: edit
    // project-kit.png belongs to KIT (not UCSB Project Dining)
    image: '/images/project-kit.png',
    href: 'https://github.com/ucsb-cs184-w26/team12-KIT',
    quotes: [
      {
        quote:
          'Consistently produced high-quality work that required minimal re-review, which greatly streamlined the team\u2019s workflow. Even after finishing her own tasks, she remained available to support other team members.',
        source: 'Teammate, KIT',
      },
      {
        quote:
          'Essential in handling the food waste aspect of our app. Went to class every day and participated meaningfully in discussion towards the progress of our app.',
        source: 'Teammate, KIT',
      },
    ],
    caseStudyDraft: {
      problem: 'TODO \u2014 what was broken about tracking kitchen inventory here?',
      decision: 'TODO \u2014 why OCR + barcode instead of manual entry first?',
      outcome: 'TODO \u2014 what shipped, in plain terms?',
    },
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}