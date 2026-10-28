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
    tanstackStart({
      // Prerender all routes into static HTML so the site works on Apache
      // without a Node.js runtime.
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        failOnError: true,
      },
    }),
    // Nitro with 'static' preset outputs pure HTML/JS/CSS to .output/public/
    nitro({ preset: 'static' }),
    // React's Vite plugin must run after Start's plugin.
    viteReact(),
  ],
});
