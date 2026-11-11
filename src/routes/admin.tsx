import { createFileRoute } from '@tanstack/react-router';
import { AdminRoot } from '@/features/admin/components/admin-root';
import { noindexHead } from '@/lib/seo';

/**
 * The admin area is served under /admin on the site.
 */
export const Route = createFileRoute('/admin')({
  head: () => noindexHead('Tech Ignite Admin'),
  component: AdminRoot,
});
