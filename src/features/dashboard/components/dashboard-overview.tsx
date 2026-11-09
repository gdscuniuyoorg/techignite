import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarClock,
  Check,
  CircleDot,
  Clock3,
  FileText,
  ListChecks,
  Mail,
  Plus,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import type { TeamProfile } from '@/lib/team-api';
import { DashboardPageHeader } from './dashboard-page-header';
import { DashboardErrorState, DashboardLoading } from './dashboard-loading';
import { DashboardStat } from './dashboard-stat';
import { SubmissionStatusBadge } from './submission-status-badge';
import {
  STATUS_LABELS,
  type DashboardSubmissionStatus,
} from './submission-status';
import {
  formatTeamDate,
  memberInitials,
  toSubmissionStatus,
} from './team-status';
import { useTeamProfile } from '../hooks/use-team-profile';
import { EVENT, STEP_INDEX, STEPS } from '../data';

const STATUS: DashboardSubmissionStatus = 'draft';

const FILTERS = ['all', 'done', 'pending'] as const;
type CheckFilter = (typeof FILTERS)[number];

interface Requirement {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly met: boolean;
}

function buildRequirements(team: TeamProfile): readonly Requirement[] {
  const leadCount = team.members.filter((member) => member.role === 'LEAD').length;
  return [
    {
      id: 'title',
      label: 'Project title',
      detail: 'Give judges a clear name for what you built.',
      met: team.projectTitle.trim().length > 0,
    },
    {
      id: 'description',
      label: 'Project description',
      detail: 'At least a short summary of the problem and your solution.',
      met: team.projectDescription.trim().length >= 40,
    },
    {
      id: 'demo',
      label: 'Working demo link',
      detail: 'A live URL judges can open without credentials.',
      met: team.demoUrl.length > 0,
    },
    {
      id: 'repo',
      label: 'Repository link',
      detail: 'Connect a GitHub repo that shows the team’s work.',
      met: team.repositoryUrl.length > 0,
    },
    {
      id: 'members',
      label: 'Team members listed',
      detail:
        leadCount > 0
          ? 'Every teammate is attached to the team profile.'
          : 'Your lead account is attached; invite the rest of the team.',
      met: team.members.length > 1,
    },
  ];
}

export function DashboardOverview() {
  const { data: team, isPending, isError, error, refetch } = useTeamProfile();
  const [filter, setFilter] = useState<CheckFilter>('all');

  if (isPending) {
    return <DashboardLoading label="Loading your team…" />;
  }

  if (isError) {
    return (
      <DashboardErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Could not load your team profile.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  if (!team) {
    return <DashboardLoading label="Loading your team…" />;
  }

  const status = toSubmissionStatus(team);
  const requirements = buildRequirements(team);
  const completed = requirements.filter((item) => item.met).length;
  const total = requirements.length;
  const completion = Math.round((completed / total) * 100);
  const lead = team.members.find((member) => member.role === 'LEAD');
  const memberCount = team.members.length;
  const currentStep = STEP_INDEX[status];

  const visibleRequirements = requirements.filter((item) => {
    if (filter === 'done') return item.met;
    if (filter === 'pending') return !item.met;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        eyebrow={`${EVENT.name} · ${EVENT.track}`}
        title="Overview"
        description="Ship your project, keep the team aligned, and submit before the clock runs out."
        aside={
          <Link
            to="/dashboard/submissions"
            className={cn(buttonVariants(), 'gap-2')}
          >
            <Plus size={16} aria-hidden="true" />
            Submit project
          </Link>
        }
      />

      {/* Summary */}
      <section
        aria-label="Team submission summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DashboardStat
          label="Submission"
          value={STATUS_LABELS[status]}
          hint={
            team.submittedAt !== null
              ? `Locked ${formatTeamDate(team.submittedAt)}`
              : 'Not submitted yet'
          }
          icon={FileText}
          badge={{
            label: status === 'draft' ? 'In progress' : STATUS_LABELS[status],
            variant: status === 'draft' ? 'warning' : 'success',
          }}
        />
        <DashboardStat
          label="Deadline"
          value={`${String(EVENT.daysLeft)} days`}
          hint={EVENT.deadline}
          icon={CalendarClock}
          badge={{ label: 'On track', variant: 'success' }}
        />
        <DashboardStat
          label="Team"
          value={`${String(memberCount)}`}
          hint={
            lead
              ? `${lead.name} leads · ${String(memberCount)} members`
              : `${String(memberCount)} members`
          }
          icon={Users}
          badge={{
            label: `${String(memberCount)} ${memberCount === 1 ? 'member' : 'members'}`,
            variant: 'default',
          }}
        />
        <DashboardStat
          label="Checklist"
          value={`${String(completion)}%`}
          hint={`${String(completed)} of ${String(total)} requirements met`}
          icon={ListChecks}
          badge={{
            label: `${String(completed)}/${String(total)}`,
            variant: completion === 100 ? 'success' : 'warning',
          }}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Requirements */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex-wrap">
            <div>
              <CardTitle>Submission requirements</CardTitle>
              <CardDescription>
                Finish every item before the portal closes.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFilter(value);
                  }}
                  aria-pressed={filter === value}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                    filter === value
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {visibleRequirements.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                Nothing here.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {visibleRequirements.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg',
                          item.met
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600',
                        )}
                      >
                        {item.met ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          <Clock3 size={16} aria-hidden="true" />
                        )}
                      </span>
                      <Badge variant={item.met ? 'success' : 'warning'}>
                        {item.met ? 'Done' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {/* Submission snapshot */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Submission snapshot</CardTitle>
                <CardDescription>
                  Updated {formatTeamDate(team.updatedAt)}
                </CardDescription>
              </div>
              <SubmissionStatusBadge status={status} />
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-slate-900">
                {team.projectTitle.length > 0
                  ? team.projectTitle
                  : 'Untitled project'}
              </p>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-500">
                {team.projectDescription.length > 0
                  ? team.projectDescription
                  : 'No description yet.'}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Checklist</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-900">
                    {String(completed)} of {String(total)}
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Deadline</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-900">
                    {String(EVENT.daysLeft)} days
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <Link
                to="/dashboard/submissions"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'w-full',
                )}
              >
                Open submission
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </CardFooter>
          </Card>

          {/* Team preview */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription>
                  {String(memberCount)}{' '}
                  {memberCount === 1 ? 'member' : 'members'} on the roster
                </CardDescription>
              </div>
              <Link
                to="/dashboard/team"
                className="text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {memberCount === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500">
                  No members on the roster yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {team.members.slice(0, 4).map((member) => (
                    <li key={member.id} className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
                        {memberInitials(member.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-900">
                          {member.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {member.role === 'LEAD' ? 'Team lead' : 'Member'}
                        </span>
                      </span>
                      <Badge variant={member.role === 'LEAD' ? 'default' : 'secondary'}>
                        {member.role === 'LEAD' ? 'Lead' : 'Member'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status stepper */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Submission status</CardTitle>
            <CardDescription>
              Drafts stay private until you send them to the judging team.
            </CardDescription>
          </div>
          <SubmissionStatusBadge status={STATUS} />
        </CardHeader>
        <CardContent>
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step, index) => {
              const done = index < currentStep;
              const current = index === currentStep;
              return (
                <li
                  key={step.label}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border px-3 py-3',
                    current
                      ? 'border-violet-200 bg-violet-50/60'
                      : 'border-slate-200 bg-white',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                      done
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : current
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-slate-200 text-slate-400',
                    )}
                  >
                    {done ? (
                      <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                    ) : current ? (
                      <CircleDot size={12} aria-hidden="true" />
                    ) : (
                      String(index + 1)
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-sm',
                        current
                          ? 'font-medium text-slate-900'
                          : 'text-slate-600',
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {step.hint}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <p className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Mail size={12} aria-hidden="true" />
        Need a hand? Email
        <a
          href="mailto:support@techignite.net"
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          support@techignite.net
        </a>
      </p>
    </div>
  );
}
