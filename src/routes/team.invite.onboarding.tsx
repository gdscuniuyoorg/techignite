import { createFileRoute } from '@tanstack/react-router';
import { TeamOnboarding } from '@/features/auth/components/team-onboarding';
import { noindexHead } from '@/lib/seo';

/**
 * Static shell for dynamic team invite links.
 *
 * Invite emails point at `/team/<id>/onboarding?token=…`, which cannot be
 * prerendered per team. Apache rewrites those URLs to this page so production
 * serves a chromeless shell instead of the public landing page (with its
 * navbar and footer). Rendering the real onboarding component with a
 * placeholder token produces the same loading markup the invite route renders
 * on its first client pass, so hydration matches before the router resolves
 * the actual team and token.
 */
export const Route = createFileRoute('/team/invite/onboarding')({
  // Match the real invite route's head exactly so hydration does not see a
  // different document title on the first client pass.
  head: () => noindexHead('Join your team | Tech Ignite'),
  component: InviteShell,
});

const noop = () => Promise.resolve();

function InviteShell() {
  return <TeamOnboarding teamId="invite" token="placeholder" onActivated={noop} />;
}
