import { createFileRoute, redirect } from '@tanstack/react-router';
import { AdminRoot } from '@/features/admin/components/admin-root';
import { ADMIN_ORIGIN, isAdminHost } from '@/lib/admin-host';
import { resolveAdminRedirect } from '@/lib/admin-redirect';
import { noindexHead } from '@/lib/seo';

/**
 * The admin area is served on the admin.* subdomain in production. Local
 * hosts (localhost, *.localhost) render it inline for development. Any other
 * host gets a 301 to the canonical admin origin — the apex never serves admin
 * markup.
 */
export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const path = `${location.pathname}${location.searchStr}`;
    if (typeof window === 'undefined') {
      const target = await resolveAdminRedirect({ data: { path } });
      if (target) {
        // TanStack Router redirects are thrown as control flow — the router API contract.
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect({ href: target, statusCode: 301 });
      }
      return;
    }
    // Static hosting has no server function at request time, so enforce the
    // host gate in the browser as well. Without this, a prerendered admin
    // shell served from the apex would render on the public domain.
    if (!isAdminHost(window.location.host)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ href: `${ADMIN_ORIGIN}${path}`, statusCode: 301 });
    }
  },
  head: () => noindexHead('Tech Ignite Admin'),
  component: AdminRoot,
});
