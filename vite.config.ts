import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    // Allow the apex, the admin subdomain, and local hosts.
    allowedHosts: ['techignite.net', '.techignite.net', 'localhost', '.localhost'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Nitro with 'static' preset outputs pure HTML/JS/CSS to .output/public/.
    // Every route must be listed explicitly so the prerenderer generates HTML
    // for each page (crawlLinks alone misses routes behind client-side <Link>).
    nitro({
      preset: 'static',
      prerender: {
        crawlLinks: true,
        routes: [
          '/',
          '/about',
          '/agenda',
          '/apply',
          '/auth',
          '/dashboard',
          '/dashboard/submissions',
          '/dashboard/team',
          '/hackathon',
          '/photos',
          '/speakers',
          // The admin app is a single client-rendered shell. Apache serves this
          // prerendered page for every /admin/* URL; the router resolves the
          // child route after hydration. Prerendering each child would emit
          // empty files because their validateSearch redirects to canonical
          // query strings.
          '/admin',
          // Dynamic invite links (/team/<id>/onboarding?token=…) cannot be
          // prerendered per team. This placeholder gives Apache a chromeless
          // shell to serve before the router hydrates the real invite.
          '/team/invite/onboarding',
          '/sitemap.xml',
          '/robots.txt',
          '/llms.txt',
        ],
      },
    }),
    // React's Vite plugin must run after Start's plugin.
    viteReact(),
  ],
});
