import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  Bell,
  CalendarClock,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { MOCK_LEAD, MOCK_TEAM } from '../data';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  {
    to: '/dashboard/submissions',
    label: 'Application Submissions',
    icon: FileText,
    exact: false,
  },
  {
    to: '/dashboard/team',
    label: 'Team Members',
    icon: Users,
    exact: false,
  },
] as const;

function sectionLabel(pathname: string): string {
  if (pathname.startsWith('/dashboard/submissions')) {
    return 'Application Submissions';
  }
  if (pathname.startsWith('/dashboard/team')) {
    return 'Team Members';
  }
  return 'Overview';
}

/** Full-width, shadcn-style app shell: sticky sidebar + sticky top bar. */
export function DashboardShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

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
                ? 'bg-slate-100 font-medium text-slate-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <Icon
              size={16}
              strokeWidth={1.75}
              className={active ? 'text-violet-600' : 'text-slate-400'}
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
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
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-3 py-5 lg:flex">
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
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarClock size={13} aria-hidden="true" className="text-amber-500" />
                Submission closes
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {MOCK_TEAM.deadline}
              </p>
              <p className="text-xs text-amber-600">{MOCK_TEAM.daysLeft} days left</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-100 p-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                {MOCK_LEAD.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">
                  {MOCK_LEAD.name}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {MOCK_LEAD.role}
                </span>
              </span>
              <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
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
                  <span className="text-slate-400">Team</span>
                  <span className="text-slate-300">/</span>
                  <span className="font-medium text-slate-900">
                    {sectionLabel(pathname)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'icon' }),
                    'text-slate-600',
                  )}
                >
                  <Bell size={16} aria-hidden="true" />
                </button>
                <Link
                  to="/dashboard/submissions"
                  className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}
                >
                  <Sparkles size={14} aria-hidden="true" />
                  Submit Project
                </Link>
              </div>
            </header>

            {/* Mobile nav */}
            <div className="border-t border-slate-100 px-3 py-2 lg:hidden">{nav}</div>
          </div>

          <main id="dashboard-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
