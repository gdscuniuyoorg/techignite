/**
 * Host gate for the admin area. The admin app is served on the `admin.`
 * subdomain in production. Local hosts render the admin area inline so it can
 * be developed and tested without DNS or /etc/hosts edits.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

export function isAdminHost(host: string | undefined): boolean {
  if (!host) {
    return false;
  }
  // Strip any port suffix; lowercase for case-insensitive compare.
  const hostname = host.replace(/:\d+$/, '').toLowerCase();
  if (LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith('.localhost')) {
    return true;
  }
  return hostname.startsWith('admin.');
}

/** Canonical admin origin for redirects from the public hosts. */
export const ADMIN_ORIGIN: string =
  (import.meta.env.VITE_ADMIN_ORIGIN as string | undefined) ??
  'https://admin.techignite.net';
