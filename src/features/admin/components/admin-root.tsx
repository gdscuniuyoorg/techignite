import {
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getSession, logout, type AdminSessionUser } from '@/lib/admin-api';
import { getAdminQueryClient } from '@/lib/query-client';
import { AdminLogin } from './admin-login';
import { AdminShell } from './admin-shell';

const SESSION_QUERY_KEY = ['admin', 'session'] as const;

function AdminGate() {
  const queryClient = useQueryClient();
  const {
    data: session,
    isPending,
    isError,
  } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: getSession,
  });

  const loginSuccess = (user: AdminSessionUser) => {
    queryClient.setQueryData(SESSION_QUERY_KEY, { status: 'authenticated', user });
  };

  const { mutate: signOut, isPending: loggingOut } = useMutation({
    mutationFn: async () => {
      try {
        await logout();
      } catch {
        // Revoke may fail offline; the local session is dropped regardless.
      }
    },
    onSettled: () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, { status: 'unauthenticated' });
    },
  });

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink" aria-busy="true">
        <div className="h-1 w-40 overflow-hidden rounded-pill bg-ink-soft">
          <div className="h-full w-1/3 animate-pulse rounded-pill bg-brand-blue" />
        </div>
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  if (isError || session.status === 'unauthenticated') {
    return <AdminLogin onAuthenticated={loginSuccess} />;
  }

  if (session.status === 'forbidden') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-ink px-4 text-center">
        <h1 className="text-subheading font-medium text-white">Not authorised</h1>
        <p className="max-w-md text-muted">{session.message}</p>
        <button
          type="button"
          onClick={() => {
            signOut();
          }}
          className="flex h-11 items-center rounded-xs border border-line bg-ink-raised px-6 text-button text-white transition-colors hover:border-brand-blue"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <AdminShell
      user={session.user}
      onLogout={() => {
        signOut();
      }}
      loggingOut={loggingOut}
    />
  );
}

export function AdminRoot() {
  return (
    <QueryClientProvider client={getAdminQueryClient()}>
      <AdminGate />
    </QueryClientProvider>
  );
}
