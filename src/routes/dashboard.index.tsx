import { createFileRoute } from '@tanstack/react-router';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';
import { noindexHead } from '@/lib/seo';

export const Route = createFileRoute('/dashboard/')({
  head: () => noindexHead('Overview — Team dashboard'),
  component: DashboardOverview,
});
