import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import {
  HackathonLogin,
  type TeamLoginValues,
} from '@/features/auth/components/hackathon-login';
import { noindexHead } from '@/lib/seo';
import { hasStoredToken, login } from '@/lib/team-api';

/**
 * Team sign-in for the Tech Ignite hackathon. Sits outside the site chrome,
 * stays out of search indexes, and redirects successful teams to their
 * dashboard.
 */
export const Route = createFileRoute('/auth')({
  head: () => noindexHead('Team sign in — Tech Ignite'),
  beforeLoad: () => {
    // Already signed in? Skip the form. Tokens live in sessionStorage.
    if (typeof window !== 'undefined' && hasStoredToken()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate({ from: Route.fullPath });

  const onAuthenticated = async (values: TeamLoginValues): Promise<void> => {
    await login({ teamName: values.teamName, password: values.teamPassword });
    await navigate({ to: '/dashboard' });
  };

  return <HackathonLogin onSubmit={onAuthenticated} />;
}
