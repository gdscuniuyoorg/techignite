import { createFileRoute } from '@tanstack/react-router';
import { noindexHead } from '@/lib/seo';

export const Route = createFileRoute('/photos')({
  head: () => noindexHead("Photos — Tech Ignite '26"),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/photos"!</div>;
}
