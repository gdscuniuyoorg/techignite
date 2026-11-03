# 0002. SEO and LLM optimization for the public site

**Date**: 2026-11-03
**Status**: Proposed

## Summary

Make techignite.net fully indexable and machine readable. Every content route gets its own title, description, canonical link, social card tags, and structured data (JSON-LD). robots.txt, sitemap.xml, and llms.txt are served as runtime generated routes. site.webmanifest gets corrected to the real brand. A light copy pass tightens headings for search intent. (Structured data means machine readable JSON baked into the page so search engines understand the event.)

## Context

Tech Ignite '26 is a public marketing site for a one day event on 20 November 2026 at the University of Uyo. Organic search and AI answer engines (assistants that read the open web to answer questions) are real discovery channels for the event, and today the site ships almost none of the plumbing they depend on. Only `__root.tsx` sets meta tags. There is no canonical link, no Open Graph or Twitter card image, no sitemap.xml, no robots.txt, no llms.txt, no structured data, and no per route head. Every route currently shares one generic description.

Forces at play: the site is a small, mostly static content surface (six content routes plus a placeholder at /photos), built with TanStack Start 1.169 (React 19, Vite 8, Nitro output), so anything runtime generated must fit the file router. Content already lives in typed modules under `src/utils/` (faq, footer, stats, schedule, apply, speakers), which is the right place to draw SEO data from so pages and machine readable outputs cannot drift apart. The design source of truth is DESIGN.md; the copy pass must not wreck the designed voice for keyword stuffing.

Consequences of not deciding: the event stays invisible to search and to AI answers, launches lose their tail of organic traffic, and every later page ships the same boilerplate meta because there is no pattern to follow.

## Requirements

**User stories**:

- As a person searching for tech conferences in Nigeria, I want Tech Ignite to appear with accurate date, venue, and registration info so that I can decide to register.
- As an AI assistant answering “what tech events are on in Uyo in November 2026”, I want machine readable facts (JSON-LD, llms.txt) so that I can cite the event correctly.
- As the site owner, I want every route discoverable with unique metadata so that social shares and search results render correctly, without hand editing each head.

**Acceptance criteria** (the contract, each criterion is IDed and independently checkable):

- **AC-1**: Each of the six content routes (`/`, `/about`, `/agenda`, `/apply`, `/hackathon`, `/speakers`) serves a unique `<title>`, meta description, canonical link (`<link rel="canonical">`), Open Graph tags (og:title, og:description, og:type, og:site_name, og:url, og:image, og:image:width, og:image:height, og:image:alt, og:locale), and Twitter card tags (twitter:card = summary_large_image, twitter:title, twitter:description, twitter:image, twitter:site = @gdgocuniuyo). All URLs are absolute against `https://techignite.net`.
- **AC-2**: `/photos` renders `noindex` (meta robots), is absent from sitemap.xml, and carries no canonical. It is not disallowed in robots.txt (see Feature design, robots.txt rules).
- **AC-3**: `GET /sitemap.xml` returns 200, `Content-Type: application/xml; charset=utf-8`, valid XML listing exactly the six content routes as absolute URLs. No `<priority>` and no `<changefreq>`; `<lastmod>` is omitted.
- **AC-4**: `GET /robots.txt` returns 200, `Content-Type: text/plain; charset=utf-8`. Rules: `User-agent: *` with `Allow: /`; training crawlers (GPTBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent) are each disallowed; the file ends with `Sitemap: https://techignite.net/sitemap.xml`.
- **AC-5**: `GET /llms.txt` returns 200, `Content-Type: text/plain; charset=utf-8`, UTF-8 text containing: site name, a one line summary, the key facts (event name, 20 November 2026, University of Uyo, free entry, organizer GDG on Campus University of Uyo, registration URL `https://gdg.community.dev/events/details/google-gdg-on-campus-university-of-uyo-uyo-nigeria-presents-tech-ignite-26/`), links to all six content routes, the FAQ rendered inline (sourced from `src/utils/faq.ts`), and contact/socials (sourced from `src/utils/footer.ts`).
- **AC-6**: JSON-LD is present and parses as valid JSON in every page it ships on. Home (`/`): Event (startDate `2026-11-20`, free offer, venue University of Uyo, Uyo, Nigeria, organizer GDG on Campus University of Uyo with the gdg.community.dev URL, eventStatus EventScheduled, eventAttendanceMode InPerson), FAQPage (mainEntity from `src/utils/faq.ts` faqItems), Organization, WebSite (with SearchAction targeting `https://www.google.com/search?q=site:techignite.net+{search_term_string}`). Organization and WebSite ship on all six content routes. BreadcrumbList ships on the five subpages (not home): Home → About, Home → Agenda, Home → Speakers, Home → Apply, Home → Hackathon.
- **AC-7**: `public/site.webmanifest` is corrected: `name` = “Tech Ignite '26”, `short_name` = “Tech Ignite”, `theme_color` = `#050505`, `background_color` = `#050505` (icons unchanged).
- **AC-8**: Copy pass is limited to metadata and headings. Each of the six routes ships a unique title and description matching the table in this spec. Heading edits (h1/h2) are confined to tightening search intent (event name, date, venue, Uyo, hackathon, Shipathon) and must preserve the DESIGN.md voice. No body copy is rewritten.
- **AC-9**: `bun run check` (typecheck + lint + format) passes with zero errors; `bun run build` succeeds; `bun run smoke` passes (built server serves `/` and its stylesheet).
- **AC-10**: Every absolute URL emitted by the head work (canonicals, og:image `https://techignite.net/past-photos/past-photo.jpg`, sitemap URLs) resolves 200 when the server is built and running.
- **AC-11**: The 404 `notFoundComponent` in `__root.tsx` renders a `noindex` meta tag.

## Options considered

### Option 1: Runtime generated routes for robots.txt, sitemap.xml, llms.txt

Serve the three files from TanStack Start server route handlers (file routes declaring `server.handlers.GET` in this router version), reading a single shared route/SEO table.

**Pros**:

- One source of truth; the sitemap and llms.txt cannot advertise routes that do not exist, and vice versa.
- Content (FAQ, socials, registration URL) is pulled from the typed content modules, so machine readable output tracks copy edits automatically.

**Cons**:

- Runtime code where static files used to do; hosting must run the Nitro server (already the case per the tickets subdomain requirement).
- Depends on the file router accepting componentless server route files; needs a fallback if generation rejects them.

### Option 2: Static files in `public/`

Ship `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` verbatim, hand maintained.

**Pros**:

- Zero runtime code, works on static hosting.
- Trivially simple to review.

**Cons**:

- Duplicates the route list and the content data; guarantees drift as the site grows.
- Every new content route means a manual XML edit or a silent omission.

### Option 3: Build time generation (script regenerating public/ from the router config)

A script walks the route tree and writes the three files at build time.

**Pros**:

- Runtime stays static; output always matches the router.

**Cons**:

- A bespoke generator for six routes is more machinery than the problem warrants; another script to maintain, and it silently breaks if routes are added without re running it.

## Decision

**Chosen option**: Option 1: Runtime generated routes.

Serve robots.txt, sitemap.xml, and llms.txt as generated server routes off one shared SEO table (chosen by the engineer; Option 1).

**Implementation skills**: none (no community skills shaped this design)

**Basis**: (basis: your AGENTS.md, the feature-isolation and content-module conventions · spec 0001, the TanStack Start migration · schema.org structured data types · Google Search Central guidance on robots.txt and noindex · llms.txt convention)

## Rationale

The site already requires a server runtime (Nitro output), so Option 1 adds no new hosting requirement, and it is the only option that cannot silently drift from the route tree and the content modules. Option 2 trades a review convenience for a guaranteed inconsistency, which is exactly the failure mode this feature exists to prevent. Option 3 fixes the drift for the route list but still freezes FAQ/socials at build time and adds a generator nobody asked for.

One engineer choice is worth flagging honestly: the robots.txt plan originally paired `noindex` on /photos with a robots.txt `Disallow: /photos`. That pair is self defeating. A disallowed URL is never crawled, so the noindex tag is never read and the page can linger in the index as a bare URL. Per Google Search Central guidance the spec instead keeps /photos **out of sitemap.xml + `noindex` on the page, and NOT disallowed in robots.txt**. The robots.txt rules therefore disallow only training crawlers, which is a policy choice independent of indexing.

## Feature design

**Data model sketch**: none. No persistence. One new typed module becomes the single source of truth:

`src/utils/seo.ts` (or `src/lib/seo.ts` if /develop finds that fits the existing split better; content stays in utils, helpers in lib):

- `SITE_ORIGIN = 'https://techignite.net'` (const)
- `seoRoutes`: readonly array of `{ path, title, description }` for the six content routes (the table in Build plan task 5 is the seed).
- JSON-LD builders: `organizationJsonLd()`, `websiteJsonLd()`, `eventJsonLd()`, `faqPageJsonLd(items)`, `breadcrumbJsonLd(trail)` returning plain objects; each route's `head()` serializes them into `<script type="application/ld+json">` via head `scripts`.
- `absoluteUrl(path: string): string` = `SITE_ORIGIN + path`.

**State transitions**: n/a.

**API surface** (server routes; all public, no auth):

| Endpoint     | Method | Key inputs | Key outputs                               | Auth | Key errors                                                                                               |
| ------------ | ------ | ---------- | ----------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------- |
| /sitemap.xml | GET    | none       | XML `<urlset>` with the six absolute URLs | none | 500 with plain text if JSON-LD/table import throws at module init (build time failure, not runtime data) |
| /robots.txt  | GET    | none       | text/plain rules + Sitemap line           | none | same                                                                                                     |
| /llms.txt    | GET    | none       | text/plain llms.txt document              | none | same                                                                                                     |

Per-route `head()` gains: title, description, canonical, OG, Twitter tags, and JSON-LD scripts (Organization+WebSite everywhere, Event+FAQPage on `/`, BreadcrumbList on subpages) from `seoRoutes`.

**Value sourcing** (every value each output needs, and where it comes from):

| Action               | Value produced / displayed                                     | Source                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| head() per route     | title, description                                             | `seoRoutes` table in this spec (Build plan task 5)                                                                                                                                                 |
| head() per route     | canonical, og:url, twitter:image, og:image URLs                | derived from `SITE_ORIGIN` (`src/utils/seo.ts`)                                                                                                                                                    |
| og:image             | `https://techignite.net/past-photos/past-photo.jpg` (1280x853) | engineer's pick of an existing repo asset, `public/past-photos/past-photo.jpg`                                                                                                                     |
| Event JSON-LD        | startDate, location, organizer, offer, url                     | engineer-confirmed facts (this interview): 2026-11-20, University of Uyo (Uyo, Nigeria), free, GDG on Campus University of Uyo, registration = `REGISTER_URL` in `src/utils/footer.ts`             |
| FAQPage JSON-LD      | questions and answers                                          | `faqItems` in `src/utils/faq.ts` (single source)                                                                                                                                                   |
| WebSite SearchAction | target URL                                                     | engineer-confirmed: `https://www.google.com/search?q=site:techignite.net+{search_term_string}`                                                                                                     |
| Organization JSON-LD | name, url, logo, sameAs                                        | name “GDG on Campus University of Uyo” / “Tech Ignite '26”, url = `SITE_ORIGIN`, logo `https://techignite.net/web-app-manifest-512x512.png`, sameAs = `footerSocialLinks` in `src/utils/footer.ts` |
| llms.txt             | key facts, links, FAQ, contact                                 | `seoRoutes`, `REGISTER_URL`, `footerSocialLinks`, `faqItems`, Speaker/sponsor mailto `gdscuniuyo@gmail.com` (`src/utils/speakers.ts`)                                                              |
| /photos head         | robots noindex                                                 | static, in the route's `head()`                                                                                                                                                                    |
| 404 component        | robots noindex                                                 | static, in `not-found.tsx` head or meta                                                                                                                                                            |

**Key invariants**:

- `SITE_ORIGIN` is the only place the origin string appears; everything absolute derives from it.
- Machine readable outputs (sitemap, llms.txt) import content, never copy strings.
- No route not in `seoRoutes` appears in sitemap.xml or gets canonical/OG tags (except Organization/WebSite JSON-LD is fine to ship on the six only; /photos ships none).
- /photos stays out of the index: noindex + absent from sitemap; robots.txt does not Disallow it (deliberate).

**Security model**: public read-only content. No auth, no PII, no cookies introduced. JSON-LD and meta output is static public copy; nothing from requests is reflected (server routes read no request input except none). robots.txt rules are advisory, not access control.

**Configuration required**: none. No new env vars, secrets, or flags.

**Critical test scenarios**:

- Happy path: `bun run build` && `bun run smoke` pass; `curl -s -o /dev/null -w "%{http_code}"` returns 200 for `/`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and `/past-photos/past-photo.jpg`; verifies **AC-1**, **AC-3**, **AC-4**, **AC-5**, **AC-10**
- Failure case: `/photos` returns HTML containing `noindex` and is absent from sitemap.xml body; `/nonexistent` returns the 404 with `noindex`; verifies **AC-2**, **AC-11**
- Parse case: every JSON-LD block on all six routes parses as JSON and Event JSON-LD carries `startDate: "2026-11-20"`; verifies **AC-6**
- Hygiene case: `site.webmanifest` parses, name/short_name/theme_color/background_color match AC-7; `bun run check` exits 0; verifies **AC-7**, **AC-9**

## Build plan

Ordered as an end-to-end slice (Tracer Bullet), threading one thing at a time through every layer rather than all meta first, all routes last. The project has no recorded build approach; this assumes end-to-end slices and says so.

1. Create `src/utils/seo.ts` with `SITE_ORIGIN`, `seoRoutes` (the six table entries below), `absoluteUrl()`, and the JSON-LD builders. Satisfies **AC-1**, **AC-6** (foundation for AC-3/5)
2. Wire `head()` into the six content routes (title, description, canonical, OG, Twitter, Organization+WebSite JSON-LD), add JSON-LD scripts to `__root.tsx` only if the router prefers root-level scripts, otherwise per route. Satisfies **AC-1**, **AC-6**
3. Home page extras: Event + FAQPage JSON-LD in `/`'s head; BreadcrumbList JSON-LD on the five subpages. Satisfies **AC-6**
4. Add `noindex` to `/photos` head and to the 404 `notFoundComponent`. Satisfies **AC-2**, **AC-11**
5. Server routes for `/sitemap.xml`, `/robots.txt`, `/llms.txt` (componentless file routes with `server.handlers.GET` returning `new Response(body, { headers: { 'Content-Type': ... } })`; route files named with the escaped-dot convention, e.g. `sitemap[.]xml.tsx`; run `bun run routes:generate` and commit `src/routeTree.gen.ts`). If the generator or type system rejects componentless server routes in this version, fall back to a single Nitro server handler mounted at those three paths; same cache headers, same content. Satisfies **AC-3**, **AC-4**, **AC-5**
   - Sitemap: absolute URLs for the six routes, XML escaped, no priority/changefreq/lastmod.
   - robots.txt exact content:
     ```
     User-agent: *
     Allow: /

     User-agent: GPTBot
     Disallow: /

     User-agent: ClaudeBot
     Disallow: /

     User-agent: anthropic-ai
     Disallow: /

     User-agent: CCBot
     Disallow: /

     User-agent: Google-Extended
     Disallow: /

     User-agent: Applebot-Extended
     Disallow: /

     User-agent: Bytespider
     Disallow: /

     User-agent: meta-externalagent
     Disallow: /

     Sitemap: https://techignite.net/sitemap.xml
     ```
     Note the deliberate omission of a `/photos` disallow (see Rationale).
   - llms.txt structure (plain text, one key per line is not required; keep the conventional shape: H1 name, blockquote summary, `##` sections):
     ```
     # Tech Ignite '26

     > Tech Ignite '26 is the annual GDSC UNIUYO (Google Developer Groups on Campus,
     > University of Uyo) flagship tech conference: talks, workshops, community and a
     > hackathon, on 20 November 2026 at the University of Uyo, Uyo, Nigeria. Free entry.

     ## Key facts
     - Event: Tech Ignite '26
     - Date: 20 November 2026
     - Venue: University of Uyo, Uyo, Nigeria
     - Entry: free; registration required
     - Register: https://gdg.community.dev/events/details/google-gdg-on-campus-university-of-uyo-uyo-nigeria-presents-tech-ignite-26/
     - Organizer: GDG on Campus University of Uyo
     - Site: https://techignite.net

     ## Pages
     - https://techignite.net/ — home
     - https://techignite.net/about — about the event and organizers
     - https://techignite.net/agenda — programme
     - https://techignite.net/speakers — speakers
     - https://techignite.net/apply — apply to Shipathon with Paga (₦1,000,000 prize pool)
     - https://techignite.net/hackathon — hackathon overview

     ## FAQ
     (inline serialization of faqItems from src/utils/faq.ts)

     ## Contact and socials
     - Email: gdscuniuyo@gmail.com
     - LinkedIn: https://www.linkedin.com/company/gdscuniuyo
     - X: https://x.com/gdgocuniuyo
     - Facebook: https://web.facebook.com/gdscuniuyo
     ```
6. Copy pass: apply the table below as `seoRoutes`; tighten h1/h2 only where intent is missing, preserving DESIGN.md voice; fix `public/site.webmanifest`. Satisfies **AC-7**, **AC-8**

   | Route        | Title                                              | Description (≤ ~160 chars)                                                                                                                                        |
   | ------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `/`          | Tech Ignite '26 — Are You Actually Building?       | Tech Ignite '26 is the annual GDSC UNIUYO flagship tech conference: talks, workshops, community and a hackathon. 20 November 2026, University of Uyo. Free entry. |
   | `/about`     | About Tech Ignite '26 — GDSC UNIUYO Flagship Event | What Tech Ignite is, who organizes it (GDG on Campus University of Uyo), and why 1,500+ students, developers and creators gather in Uyo every year.               |
   | `/agenda`    | Agenda — Tech Ignite '26 Programme                 | The full Tech Ignite '26 programme: keynotes, sessions, community spaces and the Shipathon experience, 20 November 2026 at the University of Uyo.                 |
   | `/speakers`  | Speakers — Tech Ignite '26                         | Meet the speakers at Tech Ignite '26: developers, designers and founders taking the stage at the GDSC UNIUYO flagship conference.                                 |
   | `/apply`     | Apply to Shipathon with Paga — Tech Ignite '26     | Apply to Shipathon with Paga at Tech Ignite '26: build a working product, ship a pitch, compete for a ₦1,000,000 prize pool. For students and developers.         |
   | `/hackathon` | Hackathon — Tech Ignite '26                        | The Tech Ignite '26 hackathon in Uyo: build, ship and demo in front of judges, with mentors, prizes and a community of builders.                                  |

7. Verification: `bun run check`, `bun run build`, `bun run smoke`; with the built server running, assert 200s and Content-Types for AC-3..5/AC-10; parse every JSON-LD block; grep rendered HTML for canonical/OG/Twitter tags on all six routes. Satisfies **AC-9**, **AC-10**

## Consequences

**Positive**:

- Every share and search result renders with real cards instead of a bare URL; AI assistants can cite date, venue, price, and registration without scraping prose.
- One module (`src/utils/seo.ts`) owns the origin and the per route table, so future routes get SEO by adding one entry.
- FAQPage structured data reuses the live FAQ module; it cannot drift.

**Negative / tradeoffs**:

- Three runtime routes now depend on the module graph loading cleanly at server start; a content module error is a 500, not a stale static file. Mitigated by smoke + build checks.
- SearchAction pointing at Google site search sends some users to Google rather than on site (deliberate engineer choice); revisit if on site search ever ships.
- robots.txt cannot both block indexing and allow the /photos noindex to be seen; we chose noindex and no disallow, which means the page may still appear in results as an unhosted “No information available” entry if ever linked externally. This is the documented tradeoff of dropping the disallow.
- OG cards use an unbranded past event photo (1280x853, wrong ratio for the ideal 1.91:1 card); acceptable until a branded 1200x630 asset exists.

**Neutral**:

- `src/routeTree.gen.ts` will be regenerated and committed (already the repo convention).
- The stale tickets. subdomain references in README/AGENTS.md are now known inaccurate (no in code tickets branch exists); /sync should reconcile.
- `/photos` stays a scaffold page, now quarantined from the index instead of removed (removal was explicitly not requested).

**Migration plan**: none. Purely additive plus a metadata manifest edit; no data, no auth, no deploy order. Rollback = revert the commit.

## Follow-up

- [ ] Create a branded 1200x630 OG image; swap `og:image` to it when it exists.
- [ ] Build the /photos page; remove its noindex, add it to `seoRoutes` and sitemap.xml.
- [ ] Decide whether /apply and /hackathon deserve FAQPage or Event JSON-LD of their own (currently home only).
- [ ] `/sync`: reconcile README and AGENTS.md (tickets branch no longer exists in code; 1440px container vs DESIGN.md's 1280px).
- [ ] Revisit Google-Extended / training crawler stance after the event if AI visibility data warrants.

## References

**Project sources** (verifiable, in this repo):

- `AGENTS.md` — feature isolation, `src/utils` content modules, DESIGN.md as design source of truth, validation gate
- `docs/specs/0001-tanstack-start-migration.md` — stack and Nitro output decisions this spec builds on
- `src/routes/__root.tsx` — current head() shape being extended
- `src/utils/footer.ts` (REGISTER_URL, footerSocialLinks), `src/utils/faq.ts` (faqItems), `src/utils/speakers.ts` (gdscuniuyo@gmail.com), `src/utils/stats.ts`, `src/utils/schedule.ts`, `src/utils/apply.ts`
- `public/past-photos/past-photo.jpg` — chosen og:image asset
- `public/site.webmanifest` — manifest being corrected

**Practices & standards**:

- schema.org types: Event, Organization, WebSite (SearchAction), FAQPage, BreadcrumbList
- Google Search Central guidance: serve unique titles and descriptions per page; use noindex to keep a URL out of the index; do not Disallow a URL whose noindex you want honored; sitemap under 50k URLs lists canonical URLs only; meaningful `lastmod` or omit it
- llms.txt convention: H1 + blockquote summary + link lists, plain text, for LLM consumers
- Open Graph protocol and Twitter Card (summary_large_image) for link previews
