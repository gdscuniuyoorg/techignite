import appCss from '@/styles/globals.css?url';
import '@fontsource-variable/google-sans';
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: "Tech Ignite '26 — Are you actually Building?" },
      {
        name: 'description',
        content:
          "Join 1,500+ students, developers, and creators at Tech Ignite '26. 20 November 2026, University of Uyo.",
      },
      { name: 'theme-color', content: '#050505' },
      { property: 'og:title', content: "Tech Ignite '26 — Are you actually Building?" },
      {
        property: 'og:description',
        content:
          'The annual GDSC UNIUYO flagship tech conference. 20 November 2026, University of Uyo.',
      },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      {
        rel: 'icon',
        href: '/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        href: '/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-paper">
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
