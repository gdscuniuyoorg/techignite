import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  UsersRound,
  Inbox,
  TicketPercent,
  Mail,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { getStats } from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';
import { StatCard } from '@/features/admin/components/stat-card';

export const Route = createFileRoute('/admin/')({
  head: () => noindexHead('Overview — Tech Ignite Admin'),
  component: AdminOverview,
});

function AdminOverview() {
  const { data, isPending, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getStats,
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true">
        <div className="h-8 w-56 animate-pulse rounded-xs bg-ink-raised" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-card bg-ink-raised" />
          ))}
        </div>
        <span className="sr-only">Loading dashboard statistics…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6">
        <h1 className="text-subheading font-medium text-white">
          Couldn’t load the dashboard
        </h1>
        <p className="mt-2 text-sm text-white/75">
          The admin API refused the request. Check your session and try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 flex h-11 items-center rounded-xs bg-brand-blue px-5 text-button text-white transition-colors hover:bg-brand-blue-strong"
        >
          Retry
        </button>
      </div>
    );
  }

  const couponMeter =
    data.coupons.totalSlots > 0 ? data.coupons.usedSlots / data.coupons.totalSlots : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-blue-soft uppercase">Back office</p>
          <h1 className="mt-1 text-heading font-medium text-white">Overview</h1>
        </div>
        <p className="text-sm text-muted">
          As of {new Date(data.asOf).toLocaleString()}
          {isFetching && ' · refreshing…'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value={data.applications.total}
          hint={`${String(data.applications.conversionRate)}% conversion · ${String(data.applications.byStatus.accepted ?? 0)} accepted`}
          icon={Users}
        />
        <StatCard
          label="Teams"
          value={data.teams.total}
          hint={`${String(data.teams.onboarded)} onboarded · ${String(data.teams.pendingOnboarding)} pending`}
          icon={UsersRound}
        />
        <StatCard
          label="Finalist teams"
          value={data.teams.finalists}
          hint={`${String(data.teams.totalMembers)} members across all teams`}
          icon={UserCheck}
        />
        <StatCard
          label="Submissions"
          value={data.submissions.total}
          hint={`${String(data.submissions.submitted)} awaiting review`}
          icon={Inbox}
        />
        <StatCard
          label="Sponsor coupons"
          value={`${String(data.coupons.remainingSlots)} left`}
          hint={`${String(data.coupons.usedSlots)} of ${String(data.coupons.totalSlots)} allocated · ${String(data.coupons.totalAllocations)} allocations`}
          icon={TicketPercent}
          meter={couponMeter}
        />
        <StatCard
          label="Emails sent"
          value={data.campaigns.totalEmailsSent}
          hint={`${String(data.campaigns.byStatus.find((row) => row.status === 'completed')?.campaigns ?? 0)} campaigns completed`}
          icon={Mail}
        />
        <StatCard
          label="Subscribers"
          value={data.users.activeSubscribers}
          hint={`${String(data.users.subscribers)} total on the list`}
          icon={Users}
        />
        <StatCard
          label="User accounts"
          value={data.users.total}
          hint="Registered on the hackathon platform"
          icon={UsersRound}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Campaign delivery breakdown */}
        <section className="rounded-card border border-line bg-ink-raised p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-label text-white">Campaigns by status</h2>
            <Link
              to="/admin/email"
              search={{ offset: 0 }}
              className="flex items-center gap-1 text-sm text-brand-blue-soft hover:text-white"
            >
              Manage <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          {data.campaigns.byStatus.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No campaigns yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="py-2 pr-4 font-normal">Status</th>
                    <th className="py-2 pr-4 font-normal">Campaigns</th>
                    <th className="py-2 pr-4 font-normal">Sent</th>
                    <th className="py-2 font-normal">Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.campaigns.byStatus.map((row) => (
                    <tr
                      key={row.status}
                      className="border-b border-line/50 text-white/85 last:border-0"
                    >
                      <td className="py-2 pr-4 capitalize">
                        {row.status.replaceAll('_', ' ')}
                      </td>
                      <td className="py-2 pr-4 tabular-nums">{row.campaigns}</td>
                      <td className="py-2 pr-4 tabular-nums">{row.emailsSent}</td>
                      <td className="py-2 tabular-nums">{row.emailsFailed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Application funnel */}
        <section className="rounded-card border border-line bg-ink-raised p-5">
          <h2 className="text-label text-white">Applications by status</h2>
          <div className="mt-3 flex flex-col gap-2">
            {Object.entries(data.applications.byStatus).length === 0 ? (
              <p className="text-sm text-muted">No applications recorded yet.</p>
            ) : (
              Object.entries(data.applications.byStatus)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const max = Math.max(...Object.values(data.applications.byStatus), 1);
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-sm text-white/70 capitalize">
                        {status.replaceAll('_', ' ')}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-ink-soft">
                        <div
                          className="h-full rounded-pill bg-brand-blue"
                          style={{ width: `${String((count / max) * 100)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm text-white/85 tabular-nums">
                        {count}
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
