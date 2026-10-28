# techignite.net

Source code for **Tech Ignite**, the annual GDSC UNIUYO flagship event.

Built with [TanStack Start](https://tanstack.com/start) (React 19, Vite 8),
Tailwind CSS v4, and a strict TypeScript + ESLint + Prettier toolchain.

## Requirements

- Node.js >= 22 (CI uses 24)
- [Bun](https://bun.sh) for fast local installs/runs
- [pnpm](https://pnpm.io) only when you need to update the committed lockfile

## Getting started

```bash
bun install
bun run dev          # http://localhost:3000
```

The repository commits `pnpm-lock.yaml` only. `bun.lock` is git-ignored.
After changing dependencies, regenerate the canonical lockfile:

```bash
pnpm install --lockfile-only
```

## Scripts

| Command                   | Description                                   |
| ------------------------- | --------------------------------------------- |
| `bun run dev`             | Start the Vite dev server on port 3000        |
| `bun run build`           | Production build (Nitro output in `.output/`) |
| `bun run start`           | Run the built Node server                     |
| `bun run preview`         | Preview the production build                  |
| `bun run routes:generate` | Regenerate `src/routeTree.gen.ts`             |
| `bun run typecheck`       | `tsc --noEmit` with strict checks             |
| `bun run lint`            | ESLint 10 flat config                         |
| `bun run format`          | Prettier (with Tailwind class sorting)        |
| `bun run check`           | Typecheck + lint + format check               |
| `bun run smoke`           | Smoke-test the built server (`/` + CSS)       |

## Structure

```text
src/
  routes/            # TanStack Router file-based routes
    __root.tsx       # document shell (head, Luma script)
    index.tsx        # empty home shell + tickets subdomain branch
  components/
    sections/        # page sections (Hero, Speakers, ...)
    molecules/       # shared composed UI
    ui/              # Radix-based primitives
  constants/         # event content
  lib/               # utilities
  styles/globals.css # Tailwind v4 theme and design tokens
public/              # static assets (images, icons, fonts)
```

## Fonts

- **Google Sans** — `@fontsource-variable/google-sans` (OFL-1.1), used for
  body and UI text.
- **Product Sans** — proprietary; not available on Fontsource. The TTFs in
  `public/custom-font/product-sans/` are self-hosted and applied with the
  `font-product-sans` utility.

## Subdomains

The root route reads the `Host` header on the server. Requests where the host
starts with `tickets.` render the embedded Luma ticket page instead of the
home page. This requires a server runtime (Nitro output), not static
hosting.

## Deployment

`bun run build` emits a Nitro Node server at `.output/server/index.mjs`.
Run it with `bun run start` (or `node .output/server/index.mjs`). Nitro
supports Node, Vercel, Netlify, Railway, and other targets; configure the
preset in `vite.config.ts` if your host needs one.

## Contributing

Read [`AGENTS.md`](./AGENTS.md) before making changes. Typecheck, lint,
format, and build must pass before a change is considered complete.
