import type { Metadata, Viewport } from 'next'
import { Jost, Outfit } from 'next/font/google'
import Script from 'next/script'
import { CustomCursor } from '@/components/custom-cursor'
import { PersonJsonLd } from '@/components/person-jsonId'
import { SmoothScroll } from '@/components/smooth-scroll'
import { SoundProvider } from '@/components/sound-provider'
import { BOOT_SKIP_SCRIPT } from '@/lib/boot'
import './globals.css'

const _outfit = Outfit({
  subsets: ['latin'],
})
const _jost = Jost({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://jasminetan.dev'),
  // Canonical for the home page. Any other page should set its own.
  alternates: { canonical: '/' },
  title: 'Jasmine Tan — CS student & aspiring product manager',
  description:
    'Portfolio of Jasmine Tan: 4th-year computer science student minoring in science + mathematics education, building products that teach.',
  openGraph: {
    title: 'Jasmine Tan — CS student & aspiring product manager',
    description:
      'Projects, experiments, and writing from a 4th-year CS student headed into product management.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jasmine Tan — Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jasmine Tan — CS student & aspiring product manager',
    description:
      'Projects, experiments, and writing from a 4th-year CS student headed into product management.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f9f7ec',
}

// Runs before paint, before React hydrates.
// 1. Theme: always defaults to light regardless of OS preference; only
//    switches if the visitor explicitly toggled the lamp button (saved in
//    localStorage). Prevents a flash of the wrong theme.
// 2. Boot screen: on repeat visits in the same tab session (or with
//    reduced motion), marks <html> so the loading screen never flashes
//    and the hero renders in its final state. See lib/boot.ts.
const initScript = `
  (function () {
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
    ${BOOT_SKIP_SCRIPT}
  })();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning: the init script above adds the .dark class
    // and data-boot attributes before React hydrates, which is intentional.
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        {/* beforeInteractive runs this before hydration, same timing as a
            raw <script> tag, without React's "script tags are never
            executed when rendering on the client" warning. */}
        <Script
          id="init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: initScript }}
        />
        {/* No JS: skip the boot screen and show the hero as-is. */}
        <noscript>
          <style>
            {'.boot-screen{display:none!important}.hero-enter{opacity:1!important;transform:none!important}.hero-arrow{stroke-dashoffset:0!important}'}
          </style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <SoundProvider>
          <SmoothScroll />
          <CustomCursor />
          {children}
        </SoundProvider>
        <PersonJsonLd />
        {/* TODO: sign up at goatcounter.com (free), then replace YOURCODE
            with your site code. Until then this pings a site that doesn't
            exist, so either fill it in or comment it out. Click tracking:
            any element with data-goatcounter-click="name" is counted as
            an event (see the header + contact snippets). */}
        <Script
          id="goatcounter"
          strategy="afterInteractive"
          data-goatcounter="https://YOURCODE.goatcounter.com/count"
          src="https://gc.zgo.at/count.js"
        />
      </body>
    </html>
  )
}