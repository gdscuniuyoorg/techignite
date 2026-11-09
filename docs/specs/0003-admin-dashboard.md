# 0003. Hackathon admin dashboard (admin.techignite.net)

**Date**: 2026-11-05
**Status**: Accepted (ratified 2026-11-05 — see Decisions log)

## Summary

Build the admin dashboard for the Tech Ignite '26 hackathon into this TanStack Start app as an `/admin` area, served on the `admin.techignite.net` subdomain and redirected from `techignite.net/admin`. It consumes the already-implemented admin API at `https://api.techignite.net` (Express + TypeORM + MySQL, separate repo `~/Desktop/techignite-backend`). Scope for v1: admin auth shell, dashboard stats, submission review, LiteHosting coupon management, and email/campaign tooling. No backend changes are required for v1 beyond environment configuration (see Context).

## Context

The hackathon platform backend is feature-complete for admin needs. The admin frontend does not exist; organizers currently operate via raw API/Postman. The public site is a TanStack Start (React 19, Vite 8, Nitro) app with file-based routes and a host-aware root (`tickets.` subdomain pattern in `src/routes/index.tsx`), so the admin area can reuse the same host-switching mechanism.

Forces at play:

- **Auth is cookie-only from the browser's perspective.** `POST /api/admin/login` validates credentials, requires `role === 'admin'`, and sets an HTTP-only `authToken` cookie. The JWT is **not** returned in the response body. The cookie is only sent cross-subdomain if the backend sets `COOKIE_DOMAIN=.techignite.net`, and the browser only accepts cross-origin credentialed responses if `https://admin.techignite.net` is present in the backend `CORS_ORIGIN` allowlist (CORS is `credentials: true` with an explicit origin list). Subdomains are same-site, so `SameSite=Lax` is sufficient.
- **Every admin endpoint is gated** by `authMiddleware` + `requirePermission(...)` (e.g. `MANAGE_COUPONS`, `MANAGE_CAMPAIGNS`, `VIEW_SUBMISSIONS`). A valid cookie with a non-admin/insufficient role yields 403, not 401.
- The admin surface must never be indexed: `noindex`, absent from sitemap.xml, and excluded from all public SEO artifacts (spec 0002).
- LiteHosting coupons are allocation-based: an inventory (max 20 slots, fixed rule in the backend) is allocated to teams by `teamId` with a coupon code; allocations are marked used. Redemption reporting is not a backend concept in v1.
- The event back office is low-traffic; no realtime or multi-tab sync is required.

Consequences of not deciding: organizers keep using Postman/curl for sensitive operations (coupon allocation, finalist invites, campaign sends) with no audit-friendly UI, no guard rails, and high error risk on irreversible actions (email sends).

## Admin API contract (extracted from `openapi.json`, v1.0.0)

Base URL: `https://api.techignite.net`. Auth: HTTP-only `authToken` cookie (browser) or `Authorization: Bearer <JWT>`. Response envelope: `{ success: boolean, message?: string, data?: ..., pagination?: { total, limit, offset } }`. List endpoints are paginated with `limit`/`offset` (submissions default 10, campaigns 20, subscribers 50, coupon inventory 20).

**Auth & admin**

| Method | Path                                                                    | Purpose                                                                                    | Permission |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| POST   | `/api/admin/login`                                                      | Admin login (public); sets cookie; body `{ email, password }`; 200 / 401 / 403 (non-admin) | —          |
| GET    | `/api/admin/stats`                                                      | Dashboard statistics                                                                       | admin      |
| GET    | `/api/auth/logout` (or POST)                                            | Clear cookie — verify exact route in `authRoutes.ts` before FE-1                           | —          |
| GET    | `/api/admin/exports/{applications,teams,submissions,subscribers,users}` | CSV exports                                                                                | admin      |
| GET    | `/api/admin/exports/campaign-recipients/{campaignId}`                   | Campaign recipients CSV                                                                    | admin      |
| POST   | `/api/admin/reminders/submission` · `/api/admin/reminders/onboarding`   | Trigger reminder emails                                                                    | admin      |

**Submissions**

| Method | Path                                              | Purpose                                          |
| ------ | ------------------------------------------------- | ------------------------------------------------ |
| GET    | `/api/submissions?teamId=&status=&limit=&offset=` | List submissions (admin)                         |
| GET    | `/api/submissions/{id}`                           | Submission detail                                |
| PATCH  | `/api/submissions/{id}/review`                    | Body `{ status, reviewerNotes? }` — admin review |
| DELETE | `/api/submissions/{id}`                           | Delete submission (admin)                        |
| GET    | `/api/admin/exports/submissions`                  | CSV export                                       |

**Coupons (LiteHosting)**

| Method | Path                                    | Purpose                                                                                  |
| ------ | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| POST   | `/api/coupons/inventory`                | Create inventory; body `{ totalSlots? (1–20, default 20), provider? }`; 201              |
| GET    | `/api/coupons/inventory?limit=&offset=` | List inventory                                                                           |
| GET    | `/api/coupons/inventory/{id}`           | Inventory detail                                                                         |
| POST   | `/api/coupons/allocate`                 | Body `{ inventoryId (uuid), teamId (uuid), couponCode? }`; transactional (row lock); 201 |
| PATCH  | `/api/coupons/{allocationId}/use`       | Mark allocation used; 200                                                                |

Note: `getTeamCoupons` exists in the backend controller but is **not routed** — there is no per-team allocation list endpoint in v1. Allocation lists must come from inventory detail or be omitted.

**Email & campaigns**

| Method | Path                                                                                     | Purpose                                                                                                                                                                                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/email/templates`                                                                   | List valid template IDs                                                                                                                                                                                                                                                 |
| POST   | `/api/email/send`                                                                        | `{ to, template, templateData? }`; template enum: welcome, confirm-email, reset-password, application-received, application-accepted, application-rejected, application-waitlisted, team-onboarding, submission-received, finalist-announcement, generic-campaign, test |
| POST   | `/api/email/send-batch`                                                                  | `{ recipients: [{ to, template, templateData? }] }`                                                                                                                                                                                                                     |
| GET    | `/api/campaigns?status=&isTemplate=&limit=&offset=`                                      | List campaigns                                                                                                                                                                                                                                                          |
| GET    | `/api/campaigns/{id}`                                                                    | Campaign detail                                                                                                                                                                                                                                                         |
| POST   | `/api/campaigns`                                                                         | `{ name, subject, content, htmlContent?, audience?, customRecipients?, scheduledFor?, isTemplate? }`; 201                                                                                                                                                               |
| PATCH  | `/api/campaigns/{id}`                                                                    | Update draft/scheduled campaign                                                                                                                                                                                                                                         |
| DELETE | `/api/campaigns/{id}`                                                                    | Delete campaign                                                                                                                                                                                                                                                         |
| POST   | `/api/campaigns/{id}/send`                                                               | Send now                                                                                                                                                                                                                                                                |
| POST   | `/api/campaigns/{id}/test-send`                                                          | `{ email, name? }`                                                                                                                                                                                                                                                      |
| POST   | `/api/campaigns/{id}/cancel`                                                             | Cancel scheduled campaign                                                                                                                                                                                                                                               |
| GET    | `/api/campaigns/{id}/recipients`                                                         | Recipient list                                                                                                                                                                                                                                                          |
| GET    | `/api/campaigns/subscribers?unsubscribed=&limit=&offset=`                                | Subscriber list                                                                                                                                                                                                                                                         |
| POST   | `/api/campaigns/finalist-invite`                                                         | Bulk finalist invitations                                                                                                                                                                                                                                               |
| GET    | `/api/admin/exports/subscribers` · `/api/admin/exports/campaign-recipients/{campaignId}` | CSV exports                                                                                                                                                                                                                                                             |

**Applications (needed for context in review flows)**

| Method | Path                             | Purpose                              |
| ------ | -------------------------------- | ------------------------------------ |
| GET    | `/api/applications?...`          | List applications (admin)            |
| PATCH  | `/api/applications/{id}/status`  | Update status (sends decision email) |
| PATCH  | `/api/applications/batch/update` | Batch status update                  |
| GET    | `/api/applications/export/csv`   | CSV export                           |

**OpenAPI caveats** (verified against source, not just the spec file): response bodies are mostly untyped in `openapi.json` (`"description"` only). Frontend types must be derived from the controllers/entities (e.g. `src/entities/CouponInventory.ts`, `ProjectSubmission.ts`, `EmailCampaign.ts`), not from the spec. Treat the OpenAPI file as a route index.

## Requirements

**User stories**:

- As an organizer, I want to sign in at `admin.techignite.net` so that I never handle credentials in Postman or share them in chat.
- As an organizer, I want to see headline stats (applications, teams, submissions, coupons, campaigns) so that I know the state of the hackathon at a glance.
- As a reviewer, I want to list and filter submissions, open one, and record a review decision with notes so that judging is traceable.
- As an organizer, I want to create LiteHosting coupon inventory, allocate coupons to teams, and mark allocations used so that the 20-coupon sponsor benefit is auditable.
- As an organizer, I want to send template emails, run test sends, and manage campaigns (create/schedule/send/cancel) so that participant communication doesn't require a developer.
- As the site owner, I want `techignite.net/admin` to redirect to `admin.techignite.net` so there is exactly one canonical admin origin.

**Acceptance criteria** (the contract; each independently checkable):

- **AC-1**: `https://admin.techignite.net/` serves the admin app; `https://techignite.net/admin` (and any `/admin/*` path) returns a 301 redirect to the same path on `admin.techignite.net`. Both behaviours are covered by the host-aware root and verifiable with curl.
- **AC-2**: Unauthenticated requests to any `/admin/*` route render the login screen (or redirect to it); no admin data is fetched before auth resolves. `POST /api/admin/login` with invalid credentials shows the backend's 401 message inline; a 403 (non-admin) shows "not authorised" distinctly.
- **AC-3**: After login, the HTTP-only `authToken` cookie authenticates subsequent API calls from the browser via `credentials: 'include'`. Logging out clears the session and returns to the login screen. (Depends on backend env: `COOKIE_DOMAIN=.techignite.net` and `CORS_ORIGIN` including `https://admin.techignite.net` — see Open decisions.)
- **AC-4**: The dashboard overview renders stats from `GET /api/admin/stats` (or a graceful empty/error state if the endpoint shape is unexpected) with no hardcoded numbers.
- **AC-5**: Submissions list supports `status` filter and `limit`/`offset` pagination; detail view shows all submission fields; the review action (`PATCH /api/submissions/{id}/review`) requires an explicit status selection and optional notes; destructive actions (delete) require a confirm dialog.
- **AC-6**: Coupon section: create inventory (slots clamped 1–20, provider optional), list inventory with available/allocated counts, allocate to a team by `teamId` + coupon code, mark an allocation used. Allocation failures (sold out, 404) surface the backend message. No per-team allocation roster is promised (no routed endpoint).
- **AC-7**: Email section: list templates from `GET /api/email/templates`; send a single template email; batch send; campaign list + detail + create + update + delete + send now + test-send + cancel scheduled. Every send action has a confirmation step showing recipient count/target; test-send is the default safe path. Email bodies are never rendered as unsanitised HTML in the admin UI unless sanitised first.
- **AC-8**: All admin routes ship `noindex` (meta robots), are absent from sitemap.xml and llms.txt, and the admin origin is disallowed in robots.txt for crawlers (or the layout is host-gated and noindexed — pick one in the design).
- **AC-9**: Admin API client is a single typed module (`src/lib/admin-api.ts`) mirroring `src/lib/api.ts` conventions (ky, 15s timeout, defensive error narrowing). Types derive from backend entities; no `any`; every response narrowed at the boundary.
- **AC-10**: `bun run typecheck`, `bun run lint`, `bun run format:check`, `bun run build`, `bun run smoke` all pass with zero errors. Admin routes are covered by the smoke script or an added check.
- **AC-11**: Secrets: no credentials in the repo or client bundle; the admin password exists only in the backend database; nothing admin-related is committed to git (verify `.env*` untouched).

## Options considered

### Option 1: `/admin` area in this app, host-gated (chosen)

Admin routes live in `src/routes/admin*.tsx` + `src/features/admin/`. The root reads the `Host` header (existing `tickets.` pattern): `admin.*` renders the admin shell; any other host hitting `/admin*` 301s to `admin.techignite.net`.

**Pros**: one codebase, one deploy, reuses design system/auth-free public shell decisions; subdomain is pure infra (LiteHost) + no code duplication.
**Cons**: admin bundle ships in the same app (mitigated by route-level code splitting; admin JS only loads on admin routes); host checks must be right on first paint (SSR flash risk — gate at the route beforeLoad/loader level).

### Option 2: Separate app in this repo (`admin/` workspace) deployed to its own LiteHost folder

**Pros**: total bundle isolation.
**Cons**: two build pipelines, duplicated design tokens/config, violates "prefer existing sections/components"; overkill for ~5 screens; the user asked for "admin folder" singular in one flow.

### Option 3: Separate repository

**Pros**: cleanest separation of concerns.
**Cons**: loses shared design system; doubles CI; unjustified for an internal tool used by a handful of organizers.

## Feature design

Feature breakdown (each independently deliverable; frontend-only, in dependency order):

- **FE-1 — Admin auth + shell** (`src/routes/admin.tsx` layout, `src/features/admin/components/`, `src/lib/admin-api.ts`): host gate (admin host vs redirect), login form, logout, auth guard via a `beforeLoad`/loader that calls `GET /api/auth/me` (or equivalent) to resolve session, 401/403 handling, admin chrome (sidebar: Overview, Submissions, Coupons, Email; minimal DESIGN.md-consistent styling, dark `ink` theme). `noindex`.
- **FE-2 — Overview**: `GET /api/admin/stats` cards + quick links; honest empty/error states (the stats shape is untyped in OpenAPI — derive from `AdminController.getStats` before building).
- **FE-3 — Submissions**: list (status filter, paginated), detail drawer/page, review action with confirmation, CSV export link (`/api/admin/exports/submissions` downloads via cookie auth — use a plain anchor/fetch-blob, not XHR JSON parsing).
- **FE-4 — Coupons**: inventory list/create, allocate flow (inventory picker → teamId + code), mark used. Team picker: free-text UUID with validation in v1 (no team search endpoint is admin-safe here — verify `/api/teams` admin list availability; if absent, keep UUID input with paste support).
- **FE-5 — Email & campaigns**: templates list, single/batch send, campaign CRUD + send/test-send/cancel, subscribers list + CSV export, finalist-invite action behind a type-to-confirm dialog.

**INFRA-1 — LiteHost subdomain** (not code): create `admin.techignite.net` subdomain → same Nitro deployment as the apex (document in README + Dockerfile/deploy notes); confirm `COOKIE_DOMAIN` / `CORS_ORIGIN` on the backend; TLS cert for the subdomain.

Depth target: **Alpha** (build + `/check verify`) unless the user says otherwise. Beta would add tests; there is currently no test runner in this repo, so Beta requires adding one — flagged as a decision.

## Consequences

- The public site gains an authenticated surface; it must stay noindexed and out of all SEO artifacts (spec 0002 ACs must be re-checked: sitemap/llms.txt unchanged).
- Cookie auth couples admin availability to the backend `.techignite.net` domain setup; a misconfigured `COOKIE_DOMAIN` fails silently as "always logged out" — the verify step must test a real login against production or staging, not just unit-level mocks.
- Email-sending UI makes it one click to email 1,500+ applicants; every send path needs a confirmation with an explicit target summary. This is the highest-risk feature in v1.
- Scope creep risk: roles/custom-roles/user-management endpoints exist but are **out of scope** for v1 (see Non-goals).

## Non-goals (v1)

- Admin user management, custom roles, audit-log viewer, domains/deployments sections.
- Redemption analytics for coupons (backend has no such rollup).
- Any backend code changes (except possibly the admin-login-returns-token fallback if cookies are unworkable — see Open decisions).
- Ticket sales/Luma management.

## Decisions log (ratified 2026-11-05)

1. **Backend env verified** for production: admin cookie domain and CORS allowlist confirmed working.
2. **Local testing first**: build the UI against the local backend (`http://localhost:3030`, local MySQL, seeded local admin) before any production verification. Frontend reads `VITE_API_BASE_URL` (fallback `https://api.techignite.net/`); `.env.local` is git-ignored.
3. **Coupons scope**: inventory + allocate + mark-used only. No per-team allocation roster (no routed backend endpoint).
4. **Email scope**: full campaign manager in v1, including a **Tiptap-based rich-text email document editor** producing both `htmlContent` and plain-text `content`.
5. **Root-domain behaviour**: `techignite.net/admin*` → 301 to `admin.techignite.net` (Option A). Local dev hosts (`localhost`, `*.localhost`, `127.0.0.1`) render the admin area directly so it can be tested without DNS or /etc/hosts edits.
6. **Session persistence**: HTTP-only cookie only; no token in JS-readable storage.
7. **Depth**: Alpha (build + local verification). Beta would require adding a test runner to this repo — not in scope unless requested.

## Open decisions (parked)

1. Production verification of the full login + mutation flows (after local sign-off).
2. Beta depth / adding a test runner.
