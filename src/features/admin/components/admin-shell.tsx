import { useRef } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Inbox, TicketPercent, Mail, LogOut, Menu } from 'lucide-react';
import type { AdminSessionUser } from '@/lib/admin-api';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/submissions', label: 'Submissions', icon: Inbox, exact: false },
  { to: '/admin/coupons', label: 'Coupons', icon: TicketPercent, exact: false },
  { to: '/admin/email', label: 'Email', icon: Mail, exact: false },
] as const;

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
            className={`flex h-11 items-center gap-3 rounded-xs border px-4 text-label transition-colors ${
              active
                ? 'border-brand-blue/40 bg-brand-blue/10 text-white'
                : 'border-transparent text-white/70 hover:border-line hover:bg-ink-raised hover:text-white'
            }`}
          >
            <Icon
              size={18}
              strokeWidth={1.75}
              className={active ? 'text-brand-blue-soft' : 'text-white/50'}
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
      className="flex h-11 items-center gap-3 rounded-xs px-4 text-label text-white/70 transition-colors hover:bg-ink-raised hover:text-white disabled:opacity-50"
    >
      <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
      {loggingOut ? 'Signing out…' : 'Sign out'}
    </button>
  );

  return (
    <div className="min-h-dvh bg-ink text-paper">
      {/* Mobile top bar — hook-free disclosure widget */}
      <details
        ref={mobileNavRef}
        className="sticky top-0 z-40 border-b border-line bg-ink lg:hidden"
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
            <span className="text-label text-white">Tech Ignite Admin</span>
          </Link>
          <span className="flex h-11 w-11 items-center justify-center text-white/80">
            <Menu size={22} aria-hidden="true" />
          </span>
        </summary>
        <div className="border-t border-line px-4 pt-3 pb-4">
          {nav}
          <div className="mt-2 border-t border-line pt-2">{signOutButton}</div>
        </div>
      </details>

      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col justify-between border-r border-line bg-ink px-5 py-6 lg:flex">
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
                <span className="text-label text-white">Tech Ignite</span>
                <span className="text-eyebrow text-white/40 uppercase">Admin</span>
              </span>
            </Link>
            {nav}
          </div>
          <div className="flex flex-col gap-3 border-t border-line px-2 pt-4">
            <div className="flex flex-col">
              <span className="text-label text-white">
                {user.firstName} {user.lastName}
              </span>
              <span className="truncate text-sm text-muted">{user.email}</span>
            </div>
            {signOutButton}
          </div>
        </aside>

        {/* Content */}
        <main
          id="admin-main"
          className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
