# Scope — Tech Ignite site

Last updated: 2026-10-19

## Shipped

- TanStack Start + TanStack Router migration (from Next.js 14 App Router).
- Tailwind CSS v4 with CSS-first theme in `src/styles/globals.css`.
- Strict TypeScript, ESLint 10 flat config, Prettier, CI workflow.
- Bun for local installs; `pnpm-lock.yaml` as the committed lockfile.
- Landing page and `tickets.` subdomain rendering preserved.

## Next candidates

- Visual regression or Playwright smoke test for `/` and the tickets host.
- Real FAQ content (currently placeholder in `src/constants/index.ts`).
- Replace native `<img>` with a hosted image CDN if optimisation is needed.
- Accessibility pass on the speakers carousel and mobile menu focus trap.
