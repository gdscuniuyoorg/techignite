import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BellRing,
  Download,
  Inbox,
  Loader2,
  Mail,
  TicketPercent,
  Users,
  UsersRound,
  ArrowRight,
} from 'lucide-react';
import {
  adminErrorMessage,
  exportUrl,
  getStats,
  sendOnboardingReminders,
  sendSubmissionReminders,
} from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog';
import { StatCard } from '@/features/admin/components/stat-card';

export const Route = createFileRoute('/admin/')({
  head: () => noindexHead('Overview — Tech Ignite Admin'),
  component: AdminOverview,
});

interface StatusTone {
  readonly dot: string;
  readonly bar: string;
}

const STATUS_TONES: Record<string, StatusTone> = {
  pending: { dot: 'bg-brand-amber', bar: 'bg-brand-amber' },
  accepted: { dot: 'bg-brand-green-bright', bar: 'bg-brand-green-bright' },
  rejected: { dot: 'bg-brand-red', bar: 'bg-brand-red' },
  waitlisted: { dot: 'bg-brand-blue', bar: 'bg-brand-blue' },
};

function toneFor(status: string): StatusTone {
  return STATUS_TONES[status] ?? { dot: 'bg-slate-400', bar: 'bg-slate-400' };
}

function Panel({
  title,
  action,
  children,
  className,
}: {
  readonly title: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 ${className ?? ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Horizontal share bar for a status breakdown (reference “product category” bar). */
function StatusBar({
  segments,
}: {
  readonly segments: readonly { status: string; value: number }[];
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) {
    return <div className="h-3 rounded-full bg-slate-100" />;
  }
  return (
    <div
      className="flex h-3 overflow-hidden rounded-full bg-slate-100"
      role="img"
      aria-label="Distribution by status"
    >
      {segments.map(({ status, value }) => (
        <div
          key={status}
          className={toneFor(status).bar}
          style={{ width: `${String((value / total) * 100)}%` }}
          title={`${status}: ${String(value)}`}
        />
      ))}
    </div>
  );
}

/** Single-ring allocation donut with the remaining count in the middle. */
function AllocationDonut({
  used,
  total,
  remaining,
}: {
  readonly used: number;
  readonly total: number;
  readonly remaining: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const fraction = total > 0 ? Math.min(Math.max(used / total, 0), 1) : 0;
  const usedLength = circumference * fraction;

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-40 w-40"
      role="img"
      aria-label={`${String(used)} of ${String(total)} coupon slots allocated`}
    >
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        strokeWidth="14"
        className="stroke-slate-100"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${String(usedLength)} ${String(circumference - usedLength)}`}
        transform="rotate(-90 60 60)"
        className="stroke-brand-blue"
      />
      <text
        x="60"
        y="57"
        textAnchor="middle"
        fontSize={22}
        fontWeight={600}
        className="fill-slate-950"
      >
        {remaining}
      </text>
      <text x="60" y="75" textAnchor="middle" fontSize={10} className="fill-slate-500">
        slots left
      </text>
    </svg>
  );
}

function MeterRow({
  label,
  value,
  percent,
  caption,
  color,
}: {
  readonly label: string;
  readonly value: number;
  readonly percent: number;
  readonly caption: string;
  readonly color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-950 tabular-nums">{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${String(Math.min(Math.max(percent, 0), 100))}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">{caption}</p>
    </div>
  );
}

function AdminOverview() {
  const [reminder, setReminder] = useState<'submission' | 'onboarding' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { data, isPending, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getStats,
  });
  const reminderMutation = useMutation({
    mutationFn: async (kind: 'submission' | 'onboarding') => {
      try {
        if (kind === 'submission') await sendSubmissionReminders();
        else await sendOnboardingReminders();
        return kind;
      } catch (mutationError) {
        throw new Error(await adminErrorMessage(mutationError), {
          cause: mutationError,
        });
      }
    },
    onSuccess: (kind) => {
      setReminder(null);
      setNotice(
        kind === 'submission'
          ? 'Submission reminders were queued.'
          : 'Onboarding reminders were queued.',
      );
    },
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-100 lg:col-span-3" />
          <div className="h-72 animate-pulse rounded-2xl bg-slate-100 lg:col-span-2" />
        </div>
        <span className="sr-only">Loading dashboard statistics…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-red/30 bg-white p-6">
        <h1 className="text-lg font-semibold text-slate-950">
          Couldn’t load the dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The admin API refused the request. Check your session and try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 flex h-10 items-center rounded-lg bg-brand-blue px-5 text-sm font-medium text-white transition-colors hover:bg-brand-blue-strong"
        >
          Retry
        </button>
      </div>
    );
  }

  const couponMeter =
    data.coupons.totalSlots > 0 ? data.coupons.usedSlots / data.coupons.totalSlots : 0;
  const completedCampaigns =
    data.campaigns.byStatus.find((row) => row.status === 'completed')?.campaigns ?? 0;
  const applicationsByStatus = Object.entries(data.applications.byStatus).sort(
    ([, a], [, b]) => b - a,
  );
  const hasApplications = data.applications.total > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Event snapshot for Tech Ignite ’26.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
          {isFetching && (
            <Loader2 size={13} className="animate-spin text-slate-400" aria-hidden="true" />
          )}
          Last updated: {new Date(data.asOf).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Applications"
          value={data.applications.total}
          hint={`${String(data.applications.conversionRate)}% conversion · ${String(
            data.applications.byStatus.accepted ?? 0,
          )} accepted`}
          icon={Users}
        />
        <StatCard
          label="Teams"
          value={data.teams.total}
          hint={`${String(data.teams.onboarded)} onboarded · ${String(
            data.teams.pendingOnboarding,
          )} pending`}
          icon={UsersRound}
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
          hint={`${String(data.coupons.usedSlots)} of ${String(
            data.coupons.totalSlots,
          )} allocated`}
          icon={TicketPercent}
          meter={couponMeter}
        />
        <StatCard
          label="Emails sent"
          value={data.campaigns.totalEmailsSent}
          hint={`${String(completedCampaigns)} campaigns completed`}
          icon={Mail}
        />
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-xl border border-brand-green-bright/30 bg-brand-green-bright/5 px-4 py-3 text-sm text-slate-700"
        >
          {notice}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          title="Application pipeline"
          className="lg:col-span-3"
          action={
            <Link
              to="/admin/applications"
              search={{ offset: 0 }}
              className="flex items-center gap-1 text-xs font-medium text-brand-blue hover:text-brand-blue-strong"
            >
              Manage <ArrowRight size={13} aria-hidden="true" />
            </Link>
          }
        >
          {hasApplications ? (
            <div className="mt-5">
              <StatusBar
                segments={applicationsByStatus.map(([status, value]) => ({
                  status,
                  value,
                }))}
              />
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {applicationsByStatus.map(([status, count]) => {
                  const percent = (count / data.applications.total) * 100;
                  return (
                    <li
                      key={status}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneFor(status).dot}`}
                        aria-hidden="true"
                      />
                      <span className="capitalize text-slate-600">
                        {status.replaceAll('_', ' ')}
                      </span>
                      <span className="ml-auto font-medium text-slate-950 tabular-nums">
                        {count}
                      </span>
                      <span className="w-10 text-right text-xs text-slate-400 tabular-nums">
                        {percent.toFixed(0)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-xs text-slate-400">
                {String(data.applications.total)} applications ·{' '}
                {String(data.applications.conversionRate)}% conversion to accepted
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              No applications recorded yet.
            </p>
          )}
        </Panel>

        <Panel title="Coupon allocation" className="lg:col-span-2">
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {data.coupons.totalSlots > 0 ? (
              <AllocationDonut
                used={data.coupons.usedSlots}
                total={data.coupons.totalSlots}
                remaining={data.coupons.remainingSlots}
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-slate-100 text-center">
                <span className="px-4 text-xs text-slate-400">No coupons</span>
              </div>
            )}
            <ul className="w-full max-w-52 space-y-4">
              <li className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" aria-hidden="true" />
                <span className="text-slate-600">Allocated</span>
                <span className="ml-auto font-medium text-slate-950 tabular-nums">
                  {data.coupons.usedSlots}
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" aria-hidden="true" />
                <span className="text-slate-600">Remaining</span>
                <span className="ml-auto font-medium text-slate-950 tabular-nums">
                  {data.coupons.remainingSlots}
                </span>
              </li>
              <li className="border-t border-slate-100 pt-4 text-xs text-slate-400">
                {String(data.coupons.totalAllocations)} total allocations across{' '}
                {String(data.coupons.totalSlots)} slots
              </li>
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Teams">
          <div className="mt-5 space-y-5">
            <MeterRow
              label="Onboarded"
              value={data.teams.onboarded}
              percent={
                data.teams.total > 0
                  ? (data.teams.onboarded / data.teams.total) * 100
                  : 0
              }
              caption={`${String(data.teams.totalMembers)} members in total`}
              color="bg-brand-green-bright"
            />
            <MeterRow
              label="Pending onboarding"
              value={data.teams.pendingOnboarding}
              percent={
                data.teams.total > 0
                  ? (data.teams.pendingOnboarding / data.teams.total) * 100
                  : 0
              }
              caption={`${String(data.teams.total)} teams registered`}
              color="bg-brand-amber"
            />
            <MeterRow
              label="Finalists"
              value={data.teams.finalists}
              percent={
                data.teams.total > 0
                  ? (data.teams.finalists / data.teams.total) * 100
                  : 0
              }
              caption="Shortlisted for judging"
              color="bg-brand-blue"
            />
          </div>
        </Panel>

        <Panel title="Campaign delivery">
          {data.campaigns.byStatus.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No campaigns yet.</p>
          ) : (
            <div className="mt-5 space-y-5">
              {data.campaigns.byStatus.map((row) => {
                const attempts = row.emailsSent + row.emailsFailed;
                return (
                  <MeterRow
                    key={row.status}
                    label={row.status.replaceAll('_', ' ')}
                    value={row.emailsSent}
                    percent={attempts > 0 ? (row.emailsSent / attempts) * 100 : 0}
                    caption={`${String(row.campaigns)} campaigns · ${String(
                      row.emailsFailed,
                    )} failed`}
                    color="bg-brand-green-bright"
                  />
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Quick actions">
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setReminder('submission');
              }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:border-brand-blue/40 hover:bg-slate-50 hover:text-slate-950"
            >
              <BellRing size={16} className="text-brand-amber" aria-hidden="true" />
              Send submission reminders
            </button>
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setReminder('onboarding');
              }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:border-brand-blue/40 hover:bg-slate-50 hover:text-slate-950"
            >
              <BellRing size={16} className="text-brand-blue" aria-hidden="true" />
              Send onboarding reminders
            </button>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-500">Exports</p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[
                ['Applications', 'api/admin/exports/applications'],
                ['Teams', 'api/admin/exports/teams'],
                ['Submissions', 'api/admin/exports/submissions'],
                ['Subscribers', 'api/admin/exports/subscribers'],
                ['Users', 'api/admin/exports/users'],
              ].map(([label, path]) => (
                <a
                  key={path}
                  href={exportUrl(path ?? '')}
                  download
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
                >
                  <Download size={13} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <ConfirmDialog
        open={reminder !== null}
        title="Send reminder emails?"
        body={
          <p>
            This queues <strong className="text-slate-950">{reminder}</strong> reminders
            for every currently eligible recipient.
          </p>
        }
        confirmLabel="Send reminders"
        confirming={reminderMutation.isPending}
        error={reminderMutation.error?.message}
        onConfirm={() => {
          if (reminder) reminderMutation.mutate(reminder);
        }}
        onCancel={() => {
          reminderMutation.reset();
          setReminder(null);
        }}
      />
    </div>
  );
}
