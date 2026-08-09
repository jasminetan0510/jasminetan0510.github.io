/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pre-renders the whole site into static HTML/CSS/JS at build time —
  // required for GitHub Pages, which can only serve static files.
  output: 'export',

  images: {
    // Next's built-in image optimizer needs a live server to resize images
    // on request. GitHub Pages can't run that, so we serve images as-is.
    unoptimized: true,
  },
}

export default nextConfig
