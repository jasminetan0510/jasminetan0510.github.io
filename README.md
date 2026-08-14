# Jasmine Tan — Portfolio

Personal portfolio site. Next.js (App Router) + TypeScript + Tailwind v4,
configured for static export and hosted on GitHub Pages at jasminetan.dev.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000

## Build a static export (what GitHub Pages actually serves)

```
npm run build
```

Output goes to /out. Preview it with: npm run preview

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes automatically to GitHub Pages. No manual export/upload step needed.

## Component files to sync into the repo

These were redesigned/added in chat and need to be copied into your actual
`components/` (and `app/`) folders — they aren't wired in automatically.

- `components/sound-provider.tsx` — **new.** Global sound-fx context
  (replaces the old background-music toggle). Wrap your root layout's
  `{children}` in `<SoundProvider>` so `SiteHeader` and `UtilityRail` share
  the same on/off state.
- `components/utility-rail.tsx` — audio toggle now controls sound fx, not
  background music. No more ambient-audio `<audio>` element.
- `components/site-header.tsx` — Projects / Involvements / Playground links
  now call `playClick()` from `useSound()`.
- `app/layout.tsx` — theme-init script moved to `next/script` with
  `strategy="beforeInteractive"` (fixes a console warning), and wraps
  `{children}` in `SoundProvider`.
- `components/hero.tsx` — staggered entrance animation, polaroid drop-in +
  idle sway, two extra floating stickers, subtle grain texture.
- `components/featured-projects.tsx` — replaced the hover-to-expand
  gallery with a static bento grid; toolkit chips no longer auto-scroll
  (see below).
- `components/involvements.tsx` — replaced the one-at-a-time carousel with
  a single row of 4 gallery cards; added the CBLE entry.
- `components/impact-and-testimonials.tsx` — **new, replaces both**
  `impact-stats.tsx` and `testimonials.tsx`. Delete those two files and
  swap their usage in `page.tsx` for `<ImpactAndTestimonials />`.

## Assets you still need to add

- `public/images/paper-texture.jpg` — your wrinkled-paper background image.
  Referenced in `app/globals.css` on the `body` selector. Any large (1600px+)
  jpg/png works; it's set to `cover` + `fixed` so it fills the viewport.

- `public/images/polaroid-portrait.png` — your photo (square-ish, 500px+)

- `public/audio/click.wav` — **new.** UI click sound, played on the three
  star nav links. Referenced by path in `components/sound-provider.tsx` —
  keep it in `/public`, not `/lib`, since Next's default asset loader
  doesn't handle audio imports from arbitrary source folders.

- `public/images/stickers/` — your own sticker images. The sticker board
  currently expects these exact filenames (see
  `components/playground/sticker-board.tsx`):
  star.png, heart.png, sparkle.png, coffee.png, flower.png, smiley.png
  Rename the array in that file if your filenames differ, or add/remove entries.

- Project images (optional, site works without them, just shows broken image icon):
  `public/images/project-caliber.png`
  `public/images/project-scitrek.png`
  `public/images/project-kit.png`
  `public/images/project-ucsb-dining.png`
  `public/images/project-yunie.png`

  ⚠️ Worth double-checking: in `featured-projects.tsx`, the KIT project
  entry points at `project-ucsb-dining.png` and the UCSB Project Dining
  entry points at `project-kit.png` — these look swapped. Confirm which
  image is actually which before uploading, or fix the filenames in the
  data array.

- Involvement images (site works without them, just shows broken image icon):
  `public/images/involvement-tasa.JPG`
  `public/images/involvement-psr.jpg`
  `public/images/involvement-dls.jpg`
  `public/images/involvement-cble.jpg` — **new,** for the CBLE card

- Favicons (optional): `public/icon-light-32x32.png`, `icon-dark-32x32.png`,
  `icon.svg`, `apple-icon.png`

## Still-placeholder links

- Caliber project card: GitHub link is "#" (probably a private research repo —
  add the real URL in `components/featured-projects.tsx` if it should be public)
- yunie project card: same, add your repo URL once you're back in it
- SciTrek's linked repo (github.com/Anteater10/uni-volunteer-scheduler) is your
  former teammate's account, not yours — worth deciding if you want to fork it
  to your own GitHub before linking it publicly on your portfolio