import { createFileRoute } from '@tanstack/react-router';
import { ApplicationSubmissions } from '@/features/dashboard/components/application-submissions';
import { noindexHead } from '@/lib/seo';

export const Route = createFileRoute('/dashboard/submissions')({
  head: () => noindexHead('Application Submissions — Team dashboard'),
  component: ApplicationSubmissions,
});
