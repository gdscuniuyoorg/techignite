import { useRef } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  UsersRound,
} from 'lucide-react';
import type { AdminSessionUser } from '@/lib/admin-api';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/applications', label: 'Applications', icon: FileText, exact: false },
  { to: '/admin/teams', label: 'Teams', icon: UsersRound, exact: false },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox, exact: false },
  { to: '/admin/users', label: 'Users & access', icon: KeyRound, exact: false },
] as const;

function sectionLabel(pathname: string): string {
  const item = NAV_ITEMS.find(({ to, exact }) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`),
  );
  return item?.label ?? 'Admin';
}

interface AdminShellProps {
  readonly user: AdminSessionUser;
  readonly onLogout: () => void;
  readonly loggingOut: boolean;
}

export function AdminShell({ user, onLogout, loggingOut }: AdminShellProps) {
  const mobileNavRef = useRef<HTMLDetailsElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const closeMobileNav = () => {
    mobileNavRef.current?.removeAttribute('open');
  };

  const nav = (
    <nav aria-label="Admin sections" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
        const active = isActive(to, exact);
        return (
          <Link
            key={to}
            to={to}
            onClick={closeMobileNav}
            aria-current={active ? 'page' : undefined}
            className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
              active
                ? 'bg-slate-100 font-medium text-slate-950'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <Icon
              size={18}
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

  const signOutButton = (
    <button
      type="button"
      onClick={onLogout}
      disabled={loggingOut}
      className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 disabled:opacity-50"
    >
      <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
      {loggingOut ? 'Signing out…' : 'Sign out'}
    </button>
  );

  return (
    <div className="admin-dashboard-theme min-h-dvh bg-slate-50 text-slate-900">
      {/* Mobile top bar */}
      <details
        ref={mobileNavRef}
        className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden"
      >
        <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-4 [&::-webkit-details-marker]:hidden">
          <Link
            to="/admin"
            onClick={closeMobileNav}
            className="flex items-center gap-2"
            aria-label="Tech Ignite admin — overview"
          >
            <img
              src="/icons/logo.png"
              alt=""
              width={64}
              height={64}
              className="h-8 w-8"
            />
            <span className="text-sm font-semibold text-slate-950">
              Tech Ignite Admin
            </span>
          </Link>
          <span className="flex h-11 w-11 items-center justify-center text-slate-600">
            <Menu size={22} aria-hidden="true" />
          </span>
        </summary>
        <div className="border-t border-slate-100 px-4 pt-3 pb-4">
          {nav}
          <div className="mt-2 border-t border-slate-100 pt-2">{signOutButton}</div>
        </div>
      </details>

      <div className="flex w-full">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-3 py-5 lg:flex">
          <div className="flex flex-col gap-8">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-2"
              aria-label="Tech Ignite admin — overview"
            >
              <img
                src="/icons/logo.png"
                alt=""
                width={80}
                height={80}
                className="h-10 w-10"
              />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-slate-950">Tech Ignite</span>
                <span className="text-xs text-slate-500">Admin portal</span>
              </span>
            </Link>
            {nav}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-2 pt-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-950">
                {user.firstName} {user.lastName}
              </span>
              <span className="truncate text-xs text-slate-500">{user.email}</span>
            </div>
            {signOutButton}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 hidden h-14 items-center justify-between border-b border-slate-200 bg-white px-6 lg:flex">
            <div>
              <p className="text-xs text-slate-500">Admin workspace</p>
              <p className="text-sm font-medium text-slate-950">
                {sectionLabel(pathname)}
              </p>
            </div>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 capitalize">
              {user.role}
            </span>
          </header>
          <main id="admin-main" className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
