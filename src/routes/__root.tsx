import { Navbar } from '@/features/landing/components/navbar';
import { Footer } from '@/features/landing/components/footer';
import { ChowdeckPopup } from '@/features/landing/components/chowdeck-popup';
import { NotFound } from '@/features/landing/components/not-found';
import appCss from '@/styles/globals.css?url';
import '@fontsource-variable/google-sans';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // Fallback head for the 404 surface. Content routes override title and
      // description with their own head() entries (child head wins on merge).
      { title: "Tech Ignite '26 — Are you actually Building?" },
      {
        name: 'description',
        content:
          "Join 1,500+ students, developers, and creators at Tech Ignite '26. 20 November 2026, University of Uyo.",
      },
      { name: 'theme-color', content: '#050505' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-96x96.png',
        sizes: '96x96',
      },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  // Site chrome (navbar, footer, popup) is for public/landing routes only.
  // The admin and team dashboard areas render their own app chrome.
  const isChromeless = useRouterState({
    select: (state) =>
      state.location.pathname.startsWith('/admin') ||
      state.location.pathname.startsWith('/dashboard') ||
      state.location.pathname.startsWith('/auth') ||
      state.location.pathname.startsWith('/team/'),
  });

  return (
    <html lang="en" className="bg-ink">
      <head>
        <HeadContent />
      </head>
      <body className="bg-ink text-paper">
        {isChromeless ? (
          <Outlet />
        ) : (
          <>
            <Navbar />
            <Outlet />
            <Footer />
            {/* GDG x Chowdeck co-branding — public site only. */}
            <ChowdeckPopup />
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}
