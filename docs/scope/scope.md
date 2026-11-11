# Scope — Tech Ignite site

Last updated: 2026-11-11

## Shipped

- TanStack Start + TanStack Router migration (from Next.js 14 App Router).
- Tailwind CSS v4 with CSS-first theme in `src/styles/globals.css`.
- Strict TypeScript, ESLint 10 flat config, Prettier, CI workflow.
- Bun for local installs; `pnpm-lock.yaml` as the committed lockfile.
- Home page content cleared to an empty shell; `tickets.` subdomain preserved.

## Next candidates

- Build the new home page content.
- Visual regression or Playwright smoke test for `/` and the tickets host.
- Real FAQ content (currently placeholder in `src/constants/index.ts`).
- Replace native `<img>` with a hosted image CDN if optimisation is needed.
- Accessibility pass on the speakers carousel and mobile menu focus trap.

## At a glance

| #   | Feature                  | Phase  | Status      |
| --- | ------------------------ | ------ | ----------- |
| 1   | SEO and LLM optimization | Growth | in-progress |
| 2   | Build the /photos page   | Growth | planned     |

## Growth

### 1. SEO and LLM optimization · Alpha · in-progress

Make the site fully indexable and machine readable: per route titles, descriptions, canonicals and social cards, sitemap and robots rules, structured data, llms.txt for AI agents, and a copy pass for search intent.
**Done when:** every route serves unique title, description, canonical, OG and Twitter card meta; sitemap.xml, robots.txt allowing AI search and answer crawlers while disallowing training crawlers, and llms.txt exist and are served; JSON-LD structured data validates; copy pass is done; `/check verify` passes.

- [x] Design it (spec): `/architect SEO and LLM optimization`
- [ ] Build it: `/develop SEO and LLM optimization`
  - [ ] Shared SEO source: `src/utils/seo.ts`, origin, route table, JSON-LD builders (AC-1, AC-6)
  - [ ] Per route head tags plus JSON-LD, /photos and 404 noindex (AC-1, AC-2, AC-6, AC-11)
  - [ ] Server routes: /sitemap.xml, /robots.txt, /llms.txt, regenerate routeTree (AC-3, AC-4, AC-5)
  - [ ] Copy pass (six routes' titles and descriptions, heading tightening) plus webmanifest fix (AC-7, AC-8)
  - [ ] Verification: bun run check, build, smoke, curl and JSON-LD parse (AC-9, AC-10)
- [ ] Verify it: `/check verify SEO and LLM optimization`
      Spec 0002 · code in `src/utils/seo.ts`, `src/routes/`

### 2. Build the /photos page · needs a decision · from spec 0002

Build the real /photos page (currently a scaffold placeholder, noindex and hidden from search).
**Done when:** /photos renders real content with correct meta, is back in sitemap.xml, and its noindex is removed.

- [ ] Design it (spec): `/architect Build the /photos page`
