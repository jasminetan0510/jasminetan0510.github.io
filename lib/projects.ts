/**
 * All project data, shared by the home-page grid (components/featured-
 * projects.tsx) and the case-study pages (app/projects/[slug]/page.tsx).
 *
 * Case studies follow the way PM recruiters read: what was wrong, what you
 * decided (and why), what happened, plus one concrete artifact.
 * `caseStudyDraft` is your work in progress. It is never shown on the live
 * site, but it IS shown (with a yellow "draft" banner) when you run the
 * site locally, so you can preview it while writing. Rename it to
 * `caseStudy` to publish.
 *
 * HOW TO WRITE EACH PART (aim for 2–4 sentences each):
 * - problem:    Who was struggling, with what, and why it mattered. One
 *               concrete detail (a number, a moment, a quote) beats an
 *               adjective.
 * - decision:   The key call YOU made, the alternatives you considered, and
 *               why you picked this one. Name the trade-off you accepted.
 * - outcome:    What shipped and what changed because of it. Lead with a
 *               number if you have one; say "in progress" honestly if not.
 * - artifact:   One concrete thing a PM would recognize: a metric, a PRD
 *               excerpt, a user flow, or a screenshot (see Artifact above).
 * - reflection: What you'd do differently or build next, and why.
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
  links?: { label: string; href: string }[] // extra links on the project page
  caseStudy?: CaseStudy // published: rendered on the project page
  caseStudyDraft?: CaseStudy // in progress: only shown when running locally (npm run dev)
  quotes?: Quote[] // teammate testimonials, shown on the project page
}

export const projects: Project[] = [
  {
    slug: 'appfolio-capstone',
    name: 'TenantFolio',
    role: 'Team Lead · UCSB × AppFolio Capstone (Project Apple Pie), team of 5',
    tagline: 'A tenant-first companion to AppFolio\u2019s leasing platform: find, save, and apply for a rental in one app.',
    status: 'Fall 2026 \u2013 Winter 2027',
    device: 'laptop',
    summary:
      'A tenant-side companion to AppFolio\u2019s leasing platform, built by our five-person team for UCSB\u2019s CS capstone with mentors from AppFolio. Renters can find properties, save listings with notes, upload application documents once, get AI-powered property recommendations, and keep in touch with property managers through lease signing.',
    outcome:
      'In progress, Fall 2026 \u2013 Winter 2027: built in Ruby on Rails on AppFolio\u2019s property API, run in Agile sprints with weekly sponsor check-ins.',
    stack: ['Ruby on Rails', 'AppFolio API', 'AI recommendations'],
    pm: ['Vision & success criteria', 'Sprint planning', 'Risk management'],
    links: [{ label: 'UCSB capstone team page', href: 'https://capstone.cs.ucsb.edu/teams.html' }],
    // TODO: add a screenshot, then: image: '/images/project-appfolio.png',
    // Pre-filled from the Project Overview doc (vision, success criteria,
    // risks). Fill in the TODOs as the project progresses.
    caseStudyDraft: {
      problem:
        'Renting a home is slow and stressful: tenants juggle many listings, submit the same information over and over, and wait on property managers for answers. AppFolio\u2019s leasing platform serves property managers well, but there was no equivalent experience built for tenants.',
      decision:
        'TODO \u2014 the biggest scoping call so far. Starting point from our risk plan: we chose to ship one simple recommendation approach (based on saved listings and notes) before attempting a chatbot, so AI scope creep couldn\u2019t eat into the core find \u2192 save \u2192 apply flow. What else did you consider, and what did you trade off?',
      outcome:
        'TODO \u2014 in progress (Fall 2026 \u2013 Winter 2027). Fill in at each milestone: what shipped this sprint, and how it maps to the success criteria below.',
      artifact: {
        kind: 'prd',
        title: 'Vision statement: success criteria',
        lines: [
          'A tenant can find, save, and apply for a listing in one app.',
          'Recommendations improve as users save listings and add notes.',
          'The codebase reflects good engineering practices: branches, pull requests, code reviews, and automated checks.',
        ],
      },
      reflection: 'TODO \u2014 fill in at the end of the project.',
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
      problem:
        'TODO \u2014 what was slowing the team down? (e.g. on a prior project, pull requests sat unreviewed and piled into a backlog). Add one concrete detail: how long PRs waited, or what it cost the team.',
      decision:
        'TODO \u2014 why a same-day PR-review norm, and not another fix (more reviewers, a review rotation, smaller PRs)? How did you get a team of 6 to adopt it?',
      outcome:
        'TODO \u2014 delivered 100% of committed work on schedule. What else changed: review turnaround, merge conflicts, how the team felt?',
      artifact: { kind: 'metric', value: '100%', label: 'of committed work delivered on schedule' },
      reflection: 'TODO \u2014 what would you change about how you ran retros, standups, or reviews?',
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
      problem:
        'TODO \u2014 what was broken about running SciTrek\u2019s volunteer sign-ups on SignUpGenius? (ads, no mobile view, admin busywork?) Who felt it most: volunteers, coordinators, or both?',
      decision:
        'TODO \u2014 why account-less sign-up, and why three roles (participant, admin, organizer)? What did you give up by not requiring accounts?',
      outcome:
        'TODO \u2014 what shipped (waitlist auto-promotion, reminders, slot swaps) and where it stands now (full-quarter dry run, program-wide launch). Add a number if you have one: volunteers, sessions, hours saved.',
      artifact: {
        kind: 'flow',
        title: 'TODO \u2014 volunteer sign-up flow',
        steps: ['TODO \u2014 step 1', 'TODO \u2014 step 2', 'TODO \u2014 step 3', 'TODO \u2014 step 4'],
      },
      reflection: 'TODO \u2014 what would you do differently, inheriting a codebase from graduating developers?',
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
      problem: 'TODO \u2014 what problem were you solving for yourself? Why weren\u2019t existing to-do or calendar apps enough?',
      decision: 'TODO \u2014 the main design or scope decision (e.g. conversation-first instead of lists), and why.',
      outcome: 'TODO \u2014 what works today, and what you\u2019re building next as you resume it.',
      artifact: { kind: 'image', src: '/images/project-yunie.png', alt: 'yunie interface', caption: 'TODO \u2014 one-line caption' },
      reflection: 'TODO \u2014 what building it solo taught you.',
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
      problem:
        'TODO \u2014 who struggles with kitchen inventory and food waste, and how? (forgotten groceries, typing items in by hand, meal-planning mental load)',
      decision:
        'TODO \u2014 why OCR receipt scanning + barcode lookup instead of manual entry first? You owned the home dashboard and environmental-impact scoring: why that scoring approach?',
      outcome:
        'TODO \u2014 what shipped: OCR scanning, barcode lookup, recipe suggestions, expiration alerts. 62 commits, #3 on a team of 7. Any user feedback or numbers?',
      artifact: {
        kind: 'flow',
        title: 'TODO \u2014 receipt to recipe',
        steps: ['Scan receipt', 'Items added to inventory', 'Expiration alert', 'Recipe suggestion'],
      },
      reflection: 'TODO \u2014 what would you change about the impact-scoring feature or the team\u2019s process?',
    },
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}