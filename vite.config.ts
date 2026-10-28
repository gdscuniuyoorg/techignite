import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    // Allow the apex and the tickets subdomain when testing locally.
    allowedHosts: ['techignite.net', '.techignite.net'],
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
        routes: ['/', '/about', '/agenda', '/hackathon', '/photos', '/speakers'],
      },
    }),
    // React's Vite plugin must run after Start's plugin.
    viteReact(),
  ],
});

