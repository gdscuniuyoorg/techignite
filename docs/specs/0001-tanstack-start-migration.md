# Spec 0001 — Migrate to TanStack Start with strict tooling

Status: implemented (pending `/check verify` against a running server)
Owner: frontend / infra
Date: 2026-10-19

## Context

The site was a Next.js 14 App Router application. The brief: move the
project to TanStack Start, adopt current agent rules, and adopt a modern
lint/format pipeline with strict TypeScript. Local installs must use Bun for
speed, while the committed lockfile stays `pnpm-lock.yaml` so CI and hosts
use pnpm.

## Load-bearing decisions

| Decision              | Choice                                                                                                    | Why                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Framework             | TanStack Start 1.169 + TanStack Router 1.170 (Vite 8)                                                     | Requested migration; file-based routes mirror App Router                                      |
| React                 | React 19.3                                                                                                | Current Start/Bun guidance; required by latest tooling                                        |
| Styling               | Tailwind CSS 4.3 via `@tailwindcss/vite`, CSS-first config                                                | Latest major; removes JS/PostCSS configs                                                      |
| TypeScript            | 5.9 with `strict` + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, unused/return/switch checks | "Strict TypeScript checks"; 5.9 is the newest release supported by `typescript-eslint`        |
| Lint                  | ESLint 10 flat config, `typescript-eslint` strict-type-checked                                            | Type-aware, current standard                                                                  |
| Format                | Prettier 3 + `prettier-plugin-tailwindcss`                                                                | Single formatting authority                                                                   |
| Build output          | Nitro Node server (`.output/`)                                                                            | Portable; Vercel/Netlify/Railway/Node all supported                                           |
| Local package manager | Bun                                                                                                       | Speed, per request                                                                            |
| Committed lockfile    | `pnpm-lock.yaml` only                                                                                     | Per request; CI uses `--frozen-lockfile`                                                      |
| Fonts                 | `@fontsource-variable/google-sans` + local `@font-face` for Product Sans                                  | Google Sans is OFL and on Fontsource; Product Sans is proprietary, so the committed TTFs stay |
| Images                | Native `<img>` with explicit dimensions                                                                   | Start has no image optimizer; assets are already sized                                        |
| Scripts               | Plain async `<script>` for the Luma checkout widget                                                       | Replaces `next/script`                                                                        |

## Route/behavior contract

| Path                                   | Behavior                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/` on the apex host                   | Empty `<main>` (all landing content removed); no footer in the root layout                                              |
| `/` when `Host` starts with `tickets.` | Navbar (ticket mode) + embedded Luma ticket page; no footer                                                             |
| Any host                               | Document head sets title `Tech Ignite` and description `Built by GDSC Uniuyo`; favicons and web manifest from `public/` |

Existing anchors (`#About`, `#Speakers`, `#Sponsors`), outbound links,
registration CTAs, and the hackathon link must keep working. No visual
redesign is in scope.

## File mapping

| Before                                                                                               | After                    |
| ---------------------------------------------------------------------------------------------------- | ------------------------ |
| `app/layout.tsx`                                                                                     | `src/routes/__root.tsx`  |
| `app/page.tsx`                                                                                       | `src/routes/index.tsx`   |
| `app/globals.css`                                                                                    | `src/styles/globals.css` |
| `components/`                                                                                        | `src/components/`        |
| `constants/`                                                                                         | `src/constants/`         |
| `lib/`                                                                                               | `src/lib/`               |
| `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `.eslintrc.json`, `package-lock.json` | removed                  |

## Acceptance criteria

1. `bun run typecheck` exits 0 with the strict flags above.
2. `bun run lint` exits 0 under ESLint 10 flat config.
3. `bun run format:check` exits 0.
4. `bun run build` produces `.output/server/index.mjs`.
5. `bun run dev` serves `/` with an empty main element; requesting
   `/` with `Host: tickets.techignite.net` renders the ticket iframe.
6. No `next/*` imports, no `'use client'`, no Tailwind JS config remain.
7. `pnpm install --frozen-lockfile` succeeds from a clean checkout.
8. `bun.lock` is absent from the repository and git-ignored.
9. `AGENTS.md` documents commands, strict TS policy, and the validation gate.

## Validation log

Run on 2026-10-19 (Node 24.12.0, Bun 1.3.13, pnpm 10.27.0):

| Check                                                | Result                                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `bun run typecheck`                                  | pass, 0 errors                                                                |
| `bun run lint`                                       | pass, 0 errors                                                                |
| `bun run format:check`                               | pass                                                                          |
| `bun run build`                                      | pass, `.output/server/index.mjs` emitted                                      |
| Weakened tsconfig flags                              | pass, ESLint/Prettier added, zero rule disables in `src/`                     |
| `next/*` imports, `'use client'`, Tailwind JS config | none remain                                                                   |
| `pnpm install --lockfile-only --frozen-lockfile`     | pass (lockfile v9.0 in sync)                                                  |
| `bun.lock` absent and git-ignored                    | pass                                                                          |
| Apex `GET /` (`Host: techignite.net`)                | 200, `<title>Tech Ignite</title>`, landing sections present                   |
| Ticket `GET /` (`Host: tickets.techignite.net`)      | 200, Luma iframe present, landing sections absent                             |
| CSS/font/static assets                               | 200 (`globals-*.css`, Product Sans `.ttf`, `/icons/wavy.svg`, speaker images) |

Known notes:

- TypeScript is pinned to 5.9.3 because `typescript-eslint@8.72` supports
  `<6.1.0`; TS 7 also removed `baseUrl`. Strictness flags are unaffected.
- `eslint-plugin-jsx-a11y@6.10.2` declares ESLint <=9 as a peer but runs
  cleanly on ESLint 10; lint output is the source of truth.
- `@vitejs/plugin-react` is declared as `^6.1.1`; the lockfile pins the
  currently published 6.1.2.
- Home page content is intentionally empty as of this change; all section
  components remain in `src/components/sections` for reuse.
