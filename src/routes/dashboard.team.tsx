import { createFileRoute } from '@tanstack/react-router';
import { TeamMembers } from '@/features/dashboard/components/team-members';
import { noindexHead } from '@/lib/seo';

export const Route = createFileRoute('/dashboard/team')({
  head: () => noindexHead('Team Members — Team dashboard'),
  component: TeamMembers,
});
