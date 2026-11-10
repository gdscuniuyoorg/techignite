# 0004. Team dashboard API integration

**Date**: 2026-11-09
**Status**: In progress — FE-1/FE-2 implemented; D2/D3/D6 ratified 2026-11-09

## Summary

Replace the mock data in the team dashboard (`/dashboard`, `/dashboard/submissions`,
`/dashboard/team`) with the live hackathon platform API described by the draft
OpenAPI v1.0.0. Covers team auth, team profile, submission editing and locking,
plus the contract gaps that currently block the Overview, Submissions, and Team
Members screens.

## Context

- The dashboard was built against `src/features/dashboard/data.ts`; nothing is
  fetched or persisted yet.
- The draft API exposes: `POST /api/auth/register`, `POST /api/auth/login`,
  `GET /api/auth/me`, `GET|PATCH /api/teams`, `PATCH /api/teams/repo`,
  `POST /api/teams/submit`, plus admin team routes.
- Existing patterns to mirror:
  - `src/lib/api.ts` — public applications client (ky, defensive error mapping).
  - `src/lib/admin-api.ts` — cookie auth, `expectData`/`map*` runtime narrowing.
  - `src/lib/query-client.ts` — TanStack Query defaults and per-request SSR client.
- `/auth` currently fakes success (`FIXME(auth-backend)`) and redirects to
  `/dashboard`; `HackathonLogin` has the same placeholder.

## Contract gaps (must resolve before wiring)

| #   | Gap                                                                  | Impact                                          | Proposal                                                                     |
| --- | -------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| G1  | `GET /api/teams` response body is untyped (`data: {}`)               | Cannot map fields safely                        | Backend documents the team payload (members, repoUrl, submission status)     |
| G2  | No team-member endpoints                                             | Team Members screen has no data source          | Add `GET/POST/DELETE /api/teams/members`, or include members in `/api/teams` |
| G3  | No hackathon vs project submission split                             | Current two-group UI cannot be honest           | One submission per team; hackathon group becomes informational/removed (D2)  |
| G4  | `PATCH /api/teams` has no `videoUrl`                                 | Demo video field cannot persist                 | Add `videoUrl` to the patch schema, or drop the field                        |
| G5  | No dashboard stats, checklist, or timeline endpoints                 | Overview aggregates must be derived or dropped  | Derive from team payload + fixed event config; drop timeline for v1          |
| G6  | `securitySchemes` sits at the document root, not `components`        | Spec is invalid OpenAPI; tooling will reject it | Move it under `components.securitySchemes` (docs-only fix)                   |
| G7  | Login returns a bearer JWT, unlike admin's HTTP-only cookie          | Token storage/security model must be chosen     | `sessionStorage` + `Authorization: Bearer` (D1)                              |
| G8  | Team status enum (`ACTIVE/PENDING/REJECTED/LOCKED`) ≠ UI status enum | Status badges and gating would lie              | Explicit mapping table (D4)                                                  |

## Feature plan

Sequencing: confirm the contract (BE-1) → FE-1 → FE-2 → FE-3 → FE-4/FE-5 → FE-6.
Each feature is independently deliverable and validated.

### BE-1 · Contract confirmation (backend / docs)

- Publish typed response examples for `/api/auth/me`, `/api/teams`,
  `/api/teams/submit`, including members, repo, and submission timestamps.
- Decide G2 and G3 (members source, one-vs-many submissions).
- Fix G6 and add `videoUrl` (G4) if retained.
- **Done when**: the frontend can map every field it renders without guessing.

### FE-1 · Team API client and session

- New `src/lib/team-api.ts`: ky client pointed at `VITE_API_BASE_URL`
  (default `https://api.techignite.net/`), bearer header, runtime-validated
  mappers (`expectData` pattern), typed payloads, `teamErrorMessage`.
- New `src/lib/team-session.ts`: token read/write/clear, `getSession()` via
  `/api/auth/me`, `login()`, `logout()`.
- Reuse `query-client.ts` with generic query defaults (rename/extend, no
  admin-only naming).
- **Done when**: typecheck passes and each mapper has a narrow fallback.

### FE-2 · Auth wiring and route guard

- `POST /api/auth/login` from `/auth`; persist token; hydrate session; redirect
  to `/dashboard`.
- `beforeLoad` guard on `/dashboard*`: no token or `401` → `/auth`.
- Logout in the dashboard shell; clear token and query cache.
- Remove the two `FIXME(auth-backend)` placeholders.
- **Done when**: wrong credentials show a message, refresh keeps the session,
  direct `/dashboard` without a token lands on `/auth`, mid-session `401` signs out.

### FE-3 · Dashboard data layer

- Replace `MOCK_*` reads with query hooks: `useSession`, `useTeamProfile`,
  `useSubmissionStatus`.
- Typed view models for stats/checklist derived from the team payload.
- **Done when**: no dashboard component imports mock constants; loading, empty,
  and error states exist for each route.

### FE-4 · Overview (live)

- Stat cards: submission status, deadline (constant), team seats, checklist
  completion (derived).
- Keep the status stepper, driven by the real status mapping (D4).
- Drop the activity timeline unless the backend exposes timestamps (G5).
- **Done when**: every number traces to an API field or a documented constant.

### FE-5 · Application Submissions (live)

- Detail card renders `GET /api/teams` (title, description, stack, demo, repo).
- Dialog saves via `PATCH /api/teams` + `PATCH /api/teams/repo`.
- Submit → confirmation → `POST /api/teams/submit`; lock the form on `LOCKED`.
- **Done when**: edits survive reload, submit locks the team, and `403` is shown
  as a locked state rather than a generic error.

### FE-6 · Team Members

- If G2 lands: list/invite/remove with confirmation dialogs.
- If not: read-only roster from `/api/teams` when present, otherwise hide the
  section behind a "coming soon" state instead of fake names.
- **Done when**: no invented members are rendered.

## Decisions (D2/D3/D6 ratified 2026-11-09; D1/D4/D5 assumed)

- **D1 — Token storage**: `sessionStorage`, `Authorization: Bearer`, cleared on
  logout and on `401`. Rationale: no refresh endpoint; limits persistence.
  Trade-off: readable by XSS. Cookie auth would need a backend change.
- **D2 — Submission model (ratified)**: one project submission per team
  (`/api/teams`). The "Hackathon Submissions" group becomes a read-only info
  card; "Project Submissions" is the real, judged submission.
- **D3 — Team members (ratified)**: wait for BE-1; do not invent members
  client-side. The screen shows a coming-soon state until the API exposes them.
- **D4 — Status mapping**: `ACTIVE` + no `submittedAt` → `draft`;
  `LOCKED` → `submitted`; `PENDING` → `under_review`; `REJECTED` → `rejected`.
- **D5 — Deadline**: fixed event constant (18 Nov 2026, 11:59 PM WAT) in
  `src/constants`, not an API field.
- **D6 — Local development (ratified)**: `.env.local` with
  `VITE_API_BASE_URL=http://localhost:3030/`; backend CORS must allow
  `http://localhost:3000`.

## Validation

- `bun run typecheck`, `bun run lint`, `bun run format:check`, `bun run build`,
  `bun run smoke`.
- Manual against the local API: register → login → edit profile → connect repo →
  submit → reload (locked) → sign out → deep link guard.
- Error paths: wrong password, expired token, `403` after submit, network timeout.

## Non-goals (v1)

- Admin area changes (already shipped, spec 0003).
- Judging/scoring screens, payments, email campaigns for teams.
- Offline caching or multi-tab sync.

## Open questions

1. Does `GET /api/teams` include members, `repoUrl`, `videoUrl`, and submission
   timestamps? Can the backend publish the exact JSON?
2. Keep the hackathon/project grouping, or collapse to a single judged project
   submission (D2)?
3. Add `videoUrl` to `PATCH /api/teams`, or remove the demo-video field (G4)?
4. Is the local API (`localhost:3030`) available for end-to-end verification?
