import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { TeamOnboarding } from '@/features/auth/components/team-onboarding';
import { noindexHead } from '@/lib/seo';

interface OnboardingSearch {
  readonly token: string;
}

export const Route = createFileRoute('/team/$id/onboarding')({
  validateSearch: (search: Record<string, unknown>): OnboardingSearch => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  head: () => noindexHead('Join your team | Tech Ignite'),
  component: TeamOnboardingPage,
});

function TeamOnboardingPage() {
  const { id } = Route.useParams();
  const { token } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <TeamOnboarding
      key={`${id}:${token}`}
      teamId={id}
      token={token}
      onActivated={async () => {
        await navigate({ to: '/dashboard', replace: true });
      }}
    />
  );
}
