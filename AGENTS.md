# AGENTS.md — Tech Ignite

Operational rules for AI agents working in this repository. These rules are
mandatory. If a request conflicts with them, stop and surface the conflict.

## 1. Project

Marketing site for **Tech Ignite** (`techignite.live`), the annual GDSC UNIUYO
flagship event.

| Concern     | Choice                                                         |
| ----------- | -------------------------------------------------------------- |
| Framework   | TanStack Start 1.x (Vite 8, full-document SSR, Nitro output)   |
| Router      | TanStack Router, file-based routes in `src/routes/`            |
| UI          | React 19, Tailwind CSS v4 (CSS-first config), Radix primitives |
| Language    | TypeScript 5.9, `strict` plus the extra checks listed below    |
| Lint/format | ESLint 10 flat config (`typescript-eslint` strict) + Prettier  |
| Node        | >= 22 (CI uses 24)                                             |

The `tickets.` subdomain is served by the same app: `src/routes/index.tsx`
reads the `Host` header on the server and renders the embedded Luma ticket
page instead of the landing page. Do not move that decision to the client.

## 2. Package manager

- **Canonical lockfile: `pnpm-lock.yaml`.** CI and deployments install with
  `pnpm install --frozen-lockfile`.
- **Local installs/runs use Bun** for speed: `bun install`, `bun run dev`.
- `bun.lock` / `bun.lockb` are git-ignored. Never commit them. Never commit
  `package-lock.json` or `yarn.lock`.
- When dependencies change, regenerate the lockfile with
  `pnpm install --lockfile-only` and commit `pnpm-lock.yaml` in the same
  change.
- Do not add dependencies that are not required by the task. Ask first.

## 3. Commands

```bash
bun install                  # local dependency install (fast)
pnpm install --lockfile-only # regenerate the committed lockfile
bun run dev                  # http://localhost:3000
bun run routes:generate      # regenerate src/routeTree.gen.ts
bun run typecheck            # tsc --noEmit (strict)
bun run lint                 # eslint .
bun run format               # prettier --write .
bun run check                # typecheck + lint + format:check
bun run build                # vite build (Nitro -> .output/)
bun run start                # node .output/server/index.mjs
```

`src/routeTree.gen.ts` is generated but **committed** so a clean checkout can
typecheck before the dev server has run.

## 4. Strict TypeScript policy (non-negotiable)

`tsconfig.json` must keep at least:

```jsonc
"strict": true,
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true,
"noImplicitOverride": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"allowUnreachableCode": false,
"allowUnusedLabels": false,
"useUnknownInCatchVariables": true,
"forceConsistentCasingInFileNames": true,
"isolatedModules": true
```

Rules:

1. **No weakening the config.** Never set `strict` to `false`, never disable
   the flags above, never add `// @ts-nocheck`. `skipLibCheck` stays `true`
   only because third-party declaration files are outside our control;
   do not use it to hide errors in our own code.
2. **No `any`.** Use `unknown` and narrow it. Explicit `any` requires a
   written justification in a comment and reviewer approval in the PR.
3. **No type assertions to silence errors.** `as` is allowed only when the
   value was already validated at a runtime boundary (parse, guard, schema),
   with a comment explaining why the assertion is safe.
4. **No `@ts-expect-error` / `@ts-ignore`** without a linked issue and a
   comment describing what will remove it.
5. **Validate at boundaries.** Server functions, request headers, `FormData`
   and URL/search state are untrusted input. Parse once, narrow, then pass
   typed values inward.
6. **Exhaustive handling.** Use `switch` with `satisfies never` or a
   discriminated-union check instead of unchecked index access.
7. **Errors are values.** `catch` variables are `unknown`; narrow before use.
8. `verbatimModuleSyntax` stays **disabled** (TanStack Start recommendation:
   it can leak server bundles into client output).
9. `typecheck` must pass with zero errors before any change is called done.
   Do not commit code that only "works at runtime".

## 5. Code conventions

- Path alias: `@/*` maps to `src/*`. Use it for cross-directory imports.
- Routes live in `src/routes/` and follow TanStack Router file naming
  (`index.tsx`, `__root.tsx`, `posts.$slug.tsx`). Route files export `Route`
  and may export the component; disable `react-refresh/only-export-components`
  only for route files.
- Shared UI lives in `src/components/{sections,molecules,ui}`; constants in
  `src/constants`; helpers in `src/lib`.
- Client-only state uses React hooks. Do not add `'use client'` — it is a
  Next.js directive and has no meaning here.
- Images are plain `<img>` with explicit `width`/`height` and meaningful
  `alt` text (empty `alt` for decoration). There is no Next image optimizer.
- External links are plain `<a>` with `rel="noopener noreferrer"` when
  `target="_blank"`.
- Tailwind v4 is configured in `src/styles/globals.css` (`@theme`), not in a
  `tailwind.config.ts`. Add design tokens there; never reintroduce a JS
  Tailwind config or PostCSS config.
- Prefer existing sections/components over new abstractions. Keep diffs
  minimal and reviewable.

## 6. Feature isolation

Decompose every request into separately deliverable features (`BE-*`,
`ML-*`, `FE-*`, `INFRA-*`, `DOCS-*`), each touching one layer and one
concern. Sequence backend → ML → frontend unless the user says otherwise.
Never hide a cross-layer fix inside another feature. If commits are requested,
use one commit per feature with a scope prefix (`feat(frontend):`,
`chore(infra):`, `docs:`) and never mix layers.

## 7. Agent Skills workflow

The installed skills (`~/.agents/skills`) are the gate for generated code.
Run only the skills a change needs, but never skip a mandatory gate:

```
idea → /scope → /audit → /architect → /develop → /check verify → /test → /check review → /document → /sync
```

- `/scope` fixes **what** to build; `/architect` writes load-bearing
  decisions to `docs/specs/`; `/develop` builds against that spec.
- If a build would require inventing an undecided design, stop and route to
  `/architect` (or record an **Assumed spec** and flag it).
- Every bug fix ends with a regression test (`/debug` → `/test`).
- `/check verify` proves behavior against the spec's acceptance criteria;
  `/check review` runs on a different model before a PR.
- State lives in files, not chat: `docs/scope/`, `docs/specs/`,
  `docs/reviews/`, `AGENTS.md`, tests.

Depth: Prototype = self-check; Alpha = + verify; Beta = + tests; GA = +
fresh-model review + docs.

## 8. Validation gate (before "done")

- [ ] `bun run typecheck` — zero errors
- [ ] `bun run lint` — zero errors
- [ ] `bun run format:check` — clean
- [ ] `bun run build` — succeeds
- [ ] `bun run dev` — affected route renders, including the `tickets.`
      subdomain path when touched
- [ ] Edited files re-read; no debug leftovers, secrets, or placeholder code
- [ ] Lockfile updated when dependencies changed

Report actual command output. Never claim a check passed without running it.

## 9. Safety and Git

- Work only inside this repository.
- Never commit secrets or `.env` files; flag any exposed credential.
- Never delete or overwrite code you were not asked to change.
- Destructive commands (`rm -rf`, force-push, history rewrites) require
  explicit confirmation.
- Only commit when asked. Review `git diff` before committing. Respect the
  existing branch strategy; never force-push shared branches.
- Do not commit generated build output (`.output/`, `dist/`), `node_modules`,
  or `bun.lock`.

## 10. Artifacts

| Artifact      | Path                    |
| ------------- | ----------------------- |
| Scope         | `docs/scope/`           |
| Specs         | `docs/specs/`           |
| Reviews       | `docs/reviews/`         |
| Human docs    | `README.md`, PR body    |
| Agent context | `AGENTS.md` (this file) |
