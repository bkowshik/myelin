// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Static output: every entry page is pre-rendered to HTML at build time.
// The Vercel adapter is included so deploys pick up Vercel-specific build
// hints (image optimisation, headers) even though no SSR is needed.
export default defineConfig({
  site: 'https://myelin.example',
  output: 'static',
  adapter: vercel(),

  // Astro 6 Fonts API: a serif used everywhere on the site.
  // Source Serif 4 for body, with italic for the date label.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      weights: [400, 500],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Astro now prefetches links by default; opt-in via data-astro-prefetch
  // is still respected and we use it explicitly on prev/next.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
