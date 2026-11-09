import { QueryClientProvider } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell';
import { getQueryClient } from '@/lib/query-client';
import { noindexHead } from '@/lib/seo';
import { hasStoredToken } from '@/lib/team-api';

function DashboardRoute() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <DashboardShell />
    </QueryClientProvider>
  );
}

/**
 * Team dashboard layout. Renders its own sidebar + content shell and stays
 * out of the search index. Site chrome is suppressed in the root layout for
 * every /dashboard route.
 */
export const Route = createFileRoute('/dashboard')({
  head: () => noindexHead('Team dashboard — Tech Ignite'),
  beforeLoad: () => {
    // The token lives in sessionStorage, so only guard in the browser.
    if (typeof window !== 'undefined' && !hasStoredToken()) {
      throw redirect({ to: '/auth' });
    }
  },
  component: DashboardRoute,
});
