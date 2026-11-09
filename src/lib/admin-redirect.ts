import { createServerFn } from '@tanstack/react-start';
import { isAdminHost, ADMIN_ORIGIN } from './admin-host';

/**
 * Apex/platform hosts must never serve the admin app. Returns the absolute
 * admin-origin URL for the given path when the request comes from a public
 * host, or null when the current host is allowed to render admin (admin.* or
 * local development hosts). Runs inside a server function so the server-only
 * request APIs stay out of the client bundle; during SSR it executes inline.
 */
export const resolveAdminRedirect = createServerFn({ method: 'GET' })
  .validator((input: { path: string }) => input)
  .handler(async ({ data }) => {
    const { getRequestHost } = await import('@tanstack/react-start/server');
    if (isAdminHost(getRequestHost())) {
      return null;
    }
    return `${ADMIN_ORIGIN}${data.path}`;
  });
