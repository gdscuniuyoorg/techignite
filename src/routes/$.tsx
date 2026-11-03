import { createFileRoute } from '@tanstack/react-router';
import { NotFound } from '@/features/landing/components/not-found';
import { noindexHead } from '@/lib/seo';

/** Catch-all 404. Gives unmatched URLs their own head() with a noindex
 * robots tag, which the root notFoundComponent alone cannot carry. */
export const Route = createFileRoute('/$')({
  head: () => noindexHead('404 — Page not found | Tech Ignite'),
  component: NotFound,
});
