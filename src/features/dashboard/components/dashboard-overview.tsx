import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarClock,
  Check,
  CircleDot,
  Clock3,
  Mail,
  Users,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import type { TeamProfile } from '@/lib/team-api';
import { DashboardPageHeader } from './dashboard-page-header';
import { DashboardErrorState, DashboardLoading } from './dashboard-loading';
import { SubmissionStatusBadge } from './submission-status-badge';
import { STATUS_LABELS } from './submission-status';
import {
  formatTeamDate,
  isSubmissionLocked,
  memberInitials,
  toSubmissionStatus,
} from './team-status';
import { useTeamProfile } from '../hooks/use-team-profile';
import { EVENT, STEP_INDEX, STEPS } from '../data';

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

  if (isPending) {
    return <DashboardLoading label="Loading your team…" />;
  }

  if (isError) {
    return (
      <DashboardErrorState
        message={
          error instanceof Error ? error.message : 'Could not load your team profile.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  const status = toSubmissionStatus(team);
  const requirements = buildRequirements(team);
  const completed = requirements.filter((item) => item.met).length;
  const total = requirements.length;
  const completion = Math.round((completed / total) * 100);
  const lead = team.members.find((member) => member.role === 'LEAD');
  const memberCount = team.members.length;
  const currentStep = STEP_INDEX[status];
  const remaining = total - completed;
  const nextRequirement = requirements.find((item) => !item.met);
  const locked = isSubmissionLocked(team);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
      <DashboardPageHeader
        eyebrow={`${EVENT.name} · ${EVENT.track}`}
        title="Overview"
        description="Everything your team needs to finish and submit the project."
      />

      <section
        aria-label="Team submission summary"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      >
        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <SubmissionStatusBadge status={status} />
              <span className="text-xs text-slate-500">
                {String(completed)} of {String(total)} requirements complete
              </span>
            </div>

            <h2 className="mt-5 max-w-xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {locked
                ? `Your project is ${STATUS_LABELS[status].toLowerCase()}`
                : completion === 100
                  ? 'Your submission is ready'
                  : `${String(remaining)} ${remaining === 1 ? 'item' : 'items'} left to finish`}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {locked
                ? 'Your entry is locked while organisers review it. You can still view the submitted details.'
                : nextRequirement
                  ? `Next: ${nextRequirement.label}. ${nextRequirement.detail}`
                  : 'Review the details once more, then send the project to the judging team.'}
            </p>

            <div
              className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Submission completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completion}
            >
              <span
                className="block h-full rounded-full bg-brand-blue"
                style={{ width: `${String(completion)}%` }}
              />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-slate-500">Checklist</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {String(completion)}% complete
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Team</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {String(memberCount)} {memberCount === 1 ? 'member' : 'members'}
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-xs text-slate-500">Last updated</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {formatTeamDate(team.updatedAt)}
                </dd>
              </div>
            </dl>

            <Link
              to="/dashboard/submissions"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-6 bg-slate-950 text-white shadow-none hover:bg-slate-800',
              )}
            >
              {locked ? 'View submission' : 'Continue submission'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col justify-between bg-slate-950 p-6 text-white sm:p-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-cream">
              <CalendarClock size={19} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="mt-10">
              <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                Submission closes
              </p>
              <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">
                {String(EVENT.daysLeft)}
              </p>
              <p className="mt-1 text-sm text-slate-300">days remaining</p>
              <p className="mt-6 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">
                {EVENT.deadline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-950">
                Submission checklist
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Complete every item before submitting.
              </p>
            </div>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">
              {String(completed)}/{String(total)}
            </span>
          </div>
          <ul className="divide-y divide-slate-100">
            {requirements.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-4 sm:px-6">
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                    item.met
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600',
                  )}
                >
                  {item.met ? (
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <Clock3 size={14} aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-900">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                    {item.detail}
                  </span>
                </span>
                <span
                  className={cn(
                    'shrink-0 text-xs font-medium',
                    item.met ? 'text-emerald-700' : 'text-amber-700',
                  )}
                >
                  {item.met ? 'Done' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">Project</p>
                <h2 className="mt-1 text-base font-semibold text-slate-950">
                  {team.projectTitle.length > 0 ? team.projectTitle : ''}
                </h2>
              </div>
              <SubmissionStatusBadge status={status} />
            </div>
            <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
              {team.projectDescription.length > 0
                ? team.projectDescription
                : 'Add a short description of the problem and your solution.'}
            </p>
            <dl className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
              <div className="flex items-center justify-between gap-3 py-3 text-xs">
                <dt className="text-slate-500">Demo link</dt>
                <dd className="font-medium text-slate-900">
                  {team.demoUrl.length > 0 ? 'Added' : 'Missing'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-3 text-xs">
                <dt className="text-slate-500">Repository</dt>
                <dd className="font-medium text-slate-900">
                  {team.repositoryUrl.length > 0 ? 'Connected' : 'Missing'}
                </dd>
              </div>
            </dl>
            <Link
              to="/dashboard/submissions"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-strong hover:text-brand-blue"
            >
              Open submission
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">Team</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {lead ? `Led by ${lead.name}` : `${String(memberCount)} members`}
                </p>
              </div>
              <Users size={17} className="text-slate-400" aria-hidden="true" />
            </div>
            {memberCount === 0 ? (
              <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                No members are attached to this team yet.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
                {team.members.slice(0, 3).map((member) => (
                  <li key={member.id} className="flex items-center gap-2.5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue-pale text-xs font-semibold text-brand-blue-strong">
                      {memberInitials(member.name)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                      {member.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {member.role === 'LEAD' ? 'Lead' : 'Member'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/dashboard/team"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue-strong hover:text-brand-blue"
            >
              View team
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              Submission journey
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Drafts stay private until they are sent to the judging team.
            </p>
          </div>
          <SubmissionStatusBadge status={status} />
        </div>
        <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const done = index < currentStep;
            const current = index === currentStep;
            return (
              <li key={step.label} className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                    done
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      : current
                        ? 'border-brand-blue bg-brand-blue text-white'
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
                <span>
                  <span
                    className={cn(
                      'block text-sm font-medium',
                      current ? 'text-slate-950' : 'text-slate-600',
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{step.hint}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-5 text-xs text-slate-500">
        <Mail size={12} aria-hidden="true" />
        Need a hand? Email
        <a
          href="mailto:support@techignite.net"
          className="font-medium text-brand-blue-strong hover:text-brand-blue"
        >
          support@techignite.net
        </a>
      </p>
    </div>
  );
}
