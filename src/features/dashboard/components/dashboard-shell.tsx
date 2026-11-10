import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { FileText, LayoutDashboard, Loader2, LogOut, Users, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { hasStoredToken, isUnauthorized, logout } from '@/lib/team-api';
import { memberInitials } from './team-status';
import { useTeamProfile } from '../hooks/use-team-profile';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  {
    to: '/dashboard/submissions',
    label: 'Submission',
    icon: FileText,
    exact: false,
  },
  {
    to: '/dashboard/team',
    label: 'Team',
    icon: Users,
    exact: false,
  },
] as const;

function sectionLabel(pathname: string): string {
  if (pathname.startsWith('/dashboard/submissions')) {
    return 'Submission';
  }
  if (pathname.startsWith('/dashboard/team')) {
    return 'Team';
  }
  return 'Overview';
}

/** Minimal team portal shell with responsive navigation and account controls. */
export function DashboardShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: team, isPending, isError, error } = useTeamProfile();

  const signOut = useCallback(() => {
    logout();
    queryClient.clear();
    void navigate({ to: '/auth', replace: true });
  }, [navigate, queryClient]);

  // The SSR pass cannot read sessionStorage, so confirm the session after
  // hydration as well as in the route's beforeLoad guard.
  useEffect(() => {
    if (!hasStoredToken()) {
      void navigate({ to: '/auth', replace: true });
    }
  }, [navigate]);

  // An expired token means every dashboard query will 401 — drop the session.
  useEffect(() => {
    if (isError && isUnauthorized(error)) {
      signOut();
    }
  }, [error, isError, signOut]);

  const lead = team?.members.find((member) => member.role === 'LEAD');

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const nav = (
    <nav
      aria-label="Dashboard sections"
      className="flex scrollbar-none gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
        const active = isActive(to, exact);
        return (
          <Link
            key={to}
            to={to}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors',
              active
                ? 'bg-slate-100 font-medium text-slate-950'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <Icon
              size={16}
              strokeWidth={1.75}
              className={active ? 'text-brand-blue' : 'text-slate-400'}
              aria-hidden="true"
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <Link
      to="/dashboard"
      className="flex items-center gap-2.5"
      aria-label="Tech Ignite team dashboard"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-brand-cream">
        <Zap size={18} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-slate-900">Tech Ignite</span>
        <span className="text-xs text-slate-500">Team Portal</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-dvh w-full bg-slate-50 text-slate-900">
      <div className="flex w-full">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-3 py-5 lg:flex">
          <div className="flex flex-col gap-6">
            <div className="px-2">{brand}</div>

            <div className="flex flex-col gap-2">
              <p className="px-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
                Workspace
              </p>
              {nav}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 border-t border-slate-100 px-2 pt-4">
              {isPending ? (
                <span
                  role="status"
                  aria-busy="true"
                  className="flex min-w-0 flex-1 items-center gap-2 px-1 py-1 text-xs text-slate-500"
                >
                  <Loader2
                    size={14}
                    className="animate-spin text-brand-blue"
                    aria-hidden="true"
                  />
                  Loading account…
                </span>
              ) : team && lead ? (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue-pale text-xs font-semibold text-brand-blue-strong">
                    {memberInitials(lead.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {lead.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {team.name}
                    </span>
                  </span>
                </>
              ) : (
                <span className="min-w-0 flex-1 px-1 py-1 text-xs text-slate-500">
                  Team profile unavailable
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <header className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <div className="lg:hidden">{brand}</div>
                <div className="hidden items-center gap-2 text-sm lg:flex">
                  <span className="text-slate-400">{team ? team.name : 'Team'}</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-medium text-slate-900">
                    {sectionLabel(pathname)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Sign out"
                  onClick={signOut}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'text-slate-500',
                  )}
                >
                  <LogOut size={16} aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Mobile nav */}
            <div className="border-t border-slate-100 px-3 py-2 lg:hidden">{nav}</div>
          </div>

          <main
            id="dashboard-main"
            className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
