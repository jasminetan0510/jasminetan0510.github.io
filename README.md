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

## Assets you still need to add

- public/images/paper-texture.jpg — your wrinkled-paper background image.
  Referenced in app/globals.css on the `body` selector. Any large (1600px+)
  jpg/png works; it's set to `cover` + `fixed` so it fills the viewport.

- public/images/polaroid-portrait.png — your photo (square-ish, 500px+)

- public/images/stickers/ — your own sticker images. The sticker board
  currently expects these exact filenames (see components/playground/sticker-board.tsx):
  star.png, heart.png, sparkle.png, coffee.png, flower.png, smiley.png
  Rename the array in that file if your filenames differ, or add/remove entries.

- Project images (optional, site works without them, just shows broken image icon):
  public/images/project-classroom-tool.png
  public/images/project-campus-app.png
  public/images/project-research-dashboard.png

- Favicons (optional): public/icon-light-32x32.png, icon-dark-32x32.png,
  icon.svg, apple-icon.png

## Still-placeholder links

- Caliber project card: GitHub link is "#" (probably a private research repo —
  add the real URL in components/featured-projects.tsx if it should be public)
- yunie project card: same, add your repo URL once you're back in it
- SciTrek's linked repo (github.com/Anteater10/uni-volunteer-scheduler) is your
  former teammate's account, not yours — worth deciding if you want to fork it
  to your own GitHub before linking it publicly on your portfolio
