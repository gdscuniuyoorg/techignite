import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell';
import { noindexHead } from '@/lib/seo';

/**
 * Team dashboard layout. Renders its own sidebar + content shell and stays
 * out of the search index. Site chrome is suppressed in the root layout for
 * every /dashboard route.
 */
export const Route = createFileRoute('/dashboard')({
  head: () => noindexHead('Team dashboard — Tech Ignite'),
  component: DashboardShell,
});
