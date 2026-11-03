import { faqItems } from '@/utils/faq';
import { REGISTER_URL, footerSocialLinks } from '@/utils/footer';

/** Single source of truth for the canonical origin. Every absolute URL in
 * metadata, structured data, sitemap and llms.txt derives from this. */
export const SITE_ORIGIN = 'https://techignite.net';

export const SITE_NAME = "Tech Ignite '26";

const CONTACT_EMAIL = 'gdscuniuyo@gmail.com';

const OG_IMAGE = {
  url: `${SITE_ORIGIN}/past-photos/past-photo.jpg`,
  width: 1280,
  height: 853,
  alt: 'Tech Ignite past event at the University of Uyo',
} as const;

interface BreadcrumbLink {
  readonly name: string;
  readonly path: string;
}

export interface SeoRouteEntry {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  /** Breadcrumb trail for structured data. Omitted on the home route. */
  readonly breadcrumb?: readonly BreadcrumbLink[];
}

const HOME_AND_ABOUT: readonly BreadcrumbLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];
const HOME_AND_AGENDA: readonly BreadcrumbLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Agenda', path: '/agenda' },
];
const HOME_AND_SPEAKERS: readonly BreadcrumbLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Speakers', path: '/speakers' },
];
const HOME_AND_APPLY: readonly BreadcrumbLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Apply', path: '/apply' },
];
const HOME_AND_HACKATHON: readonly BreadcrumbLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Hackathon', path: '/hackathon' },
];

/** The six indexable routes. Server routes (sitemap, llms.txt) render from
 * this table, so a route missing here is invisible to search. */
export const seoRoutes: readonly SeoRouteEntry[] = [
  {
    path: '/',
    title: "Tech Ignite '26 — Are You Actually Building?",
    description:
      "Tech Ignite '26 is the annual GDSC UNIUYO flagship tech conference: talks, workshops, community and a hackathon. 20 November 2026, University of Uyo. Free entry.",
  },
  {
    path: '/about',
    title: "About Tech Ignite '26 — GDSC UNIUYO Flagship Event",
    description:
      'What Tech Ignite is, who organizes it (GDG on Campus University of Uyo), and why 1,500+ students, developers and creators gather in Uyo every year.',
    breadcrumb: HOME_AND_ABOUT,
  },
  {
    path: '/agenda',
    title: "Agenda — Tech Ignite '26 Programme",
    description:
      "The full Tech Ignite '26 programme: keynotes, sessions, community spaces and the Shipathon experience, 20 November 2026 at the University of Uyo.",
    breadcrumb: HOME_AND_AGENDA,
  },
  {
    path: '/speakers',
    title: "Speakers — Tech Ignite '26",
    description:
      "Meet the speakers at Tech Ignite '26: developers, designers and founders taking the stage at the GDSC UNIUYO flagship conference.",
    breadcrumb: HOME_AND_SPEAKERS,
  },
  {
    path: '/apply',
    title: "Apply to Shipathon with Paga — Tech Ignite '26",
    description:
      "Apply to Shipathon with Paga at Tech Ignite '26: build a working product, ship a pitch, compete for a ₦1,000,000 prize pool. For students and developers.",
    breadcrumb: HOME_AND_APPLY,
  },
  {
    path: '/hackathon',
    title: "Hackathon — Tech Ignite '26",
    description:
      "The Tech Ignite '26 hackathon in Uyo: build, ship and demo in front of judges, with mentors, prizes and a community of builders.",
    breadcrumb: HOME_AND_HACKATHON,
  },
] as const;

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
}

function requireEntry(path: string): SeoRouteEntry {
  const entry = seoRoutes.find((route) => route.path === path);
  if (!entry) {
    throw new Error(`No SEO entry for path: ${path}`);
  }
  return entry;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GDG on Campus University of Uyo',
    alternateName: SITE_NAME,
    url: SITE_ORIGIN,
    logo: absoluteUrl('/web-app-manifest-512x512.png'),
    email: CONTACT_EMAIL,
    sameAs: footerSocialLinks.map((link) => link.href),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://www.google.com/search?q=site:techignite.net+{search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function eventJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: SITE_NAME,
    startDate: '2026-11-20',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'University of Uyo Main Campus (Perm site)',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Uyo',
        addressRegion: 'Akwa Ibom State',
        addressCountry: 'Nigeria',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'GDG on Campus University of Uyo',
      url: REGISTER_URL,
    },
    image: OG_IMAGE.url,
    description: requireEntry('/').description,
    url: SITE_ORIGIN,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01T00:00:00+01:00',
      url: REGISTER_URL,
    },
  };
}

export function faqPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  trail: readonly BreadcrumbLink[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

interface LdJsonScript {
  readonly type: 'application/ld+json';
  readonly children: string;
}

/** JSON-LD for the head as a script descriptor. "<" is Unicode escaped so the
 * payload cannot break out of the script tag. */
function jsonLdScript(data: Record<string, unknown>): LdJsonScript {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data).replace(/</g, '\\u003c'),
  };
}

/** head() payload for every content route: unique title, description,
 * canonical, Open Graph, Twitter card and JSON-LD structured data. */
export function seoHead(path: string) {
  const entry = requireEntry(path);
  const url = absoluteUrl(entry.path);

  const meta = [
    { title: entry.title },
    { name: 'description', content: entry.description },
    { property: 'og:title', content: entry.title },
    { property: 'og:description', content: entry.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:url', content: url },
    { property: 'og:image', content: OG_IMAGE.url },
    { property: 'og:image:width', content: String(OG_IMAGE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE.height) },
    { property: 'og:image:alt', content: OG_IMAGE.alt },
    { property: 'og:locale', content: 'en_NG' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: entry.title },
    { name: 'twitter:description', content: entry.description },
    { name: 'twitter:image', content: OG_IMAGE.url },
    { name: 'twitter:site', content: '@gdgocuniuyo' },
  ];

  const scripts = [
    jsonLdScript(organizationJsonLd()),
    jsonLdScript(websiteJsonLd()),
    ...(entry.path === '/'
      ? [jsonLdScript(eventJsonLd()), jsonLdScript(faqPageJsonLd())]
      : []),
    ...(entry.breadcrumb ? [jsonLdScript(breadcrumbJsonLd(entry.breadcrumb))] : []),
  ];

  return {
    meta,
    links: [{ rel: 'canonical', href: url }],
    scripts,
  };
}

/** robots noindex head block, for routes that must stay out of the index
 * (/photos) and the 404 catch-all. */
export function noindexHead(title: string): {
  meta: ({ title: string } | { name: string; content: string })[];
} {
  return {
    meta: [{ title }, { name: 'robots', content: 'noindex' }],
  };
}

export function sitemapXml(): string {
  const urls = seoRoutes
    .map((entry) => `  <url><loc>${absoluteUrl(entry.path)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robotsTxt(): string {
  return `User-agent: *
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

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}

export function llmsTxt(): string {
  const pages = seoRoutes
    .map((entry) => `- ${absoluteUrl(entry.path)} — ${entry.title}`)
    .join('\n');
  const faq = faqItems.map((item) => `### ${item.question}\n${item.answer}`).join('\n\n');
  const socials = footerSocialLinks
    .map((link) => `- ${link.label}: ${link.href}`)
    .join('\n');

  return `# Tech Ignite '26

> Tech Ignite '26 is the annual GDSC UNIUYO (Google Developer Groups on Campus, University of Uyo) flagship tech conference: talks, workshops, community and a hackathon, on 20 November 2026 at the University of Uyo, Uyo, Nigeria. Free entry.

## Key facts
- Event: Tech Ignite '26
- Date: 20 November 2026
- Venue: University of Uyo Main Campus, Uyo, Nigeria
- Entry: free; registration required
- Register: ${REGISTER_URL}
- Organizer: GDG on Campus University of Uyo
- Contact: ${CONTACT_EMAIL}
- Site: ${SITE_ORIGIN}

## Pages
${pages}

## FAQ
${faq}

## Contact and socials
- Email: ${CONTACT_EMAIL}
${socials}
`;
}
