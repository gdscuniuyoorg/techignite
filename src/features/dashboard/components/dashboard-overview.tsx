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
import { DashboardPageHeader } from './dashboard-page-header';
import { DashboardStat } from './dashboard-stat';
import { SubmissionStatusBadge } from './submission-status-badge';
import type { DashboardSubmissionStatus } from './submission-status';
import {
  CHECKLIST,
  MEMBERS,
  MOCK_SUBMISSION,
  MOCK_TEAM,
  STEP_INDEX,
  STEPS,
  TIMELINE,
  type TimelineEntry,
} from '../data';

const STATUS: DashboardSubmissionStatus = 'draft';

const FILTERS = ['all', 'done', 'pending'] as const;
type CheckFilter = (typeof FILTERS)[number];

const TIMELINE_STYLES: Record<TimelineEntry['state'], string> = {
  done: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  current: 'border-violet-200 bg-violet-50 text-violet-600',
  upcoming: 'border-slate-200 bg-white text-slate-400',
};

export function DashboardOverview() {
  const [filter, setFilter] = useState<CheckFilter>('all');

  const completed = CHECKLIST.filter((item) => item.met).length;
  const total = CHECKLIST.length;
  const completion = Math.round((completed / total) * 100);
  const confirmed = MEMBERS.filter((member) => member.confirmed).length;
  const currentStep = STEP_INDEX[STATUS];

  const visibleChecklist = CHECKLIST.filter((item) => {
    if (filter === 'done') return item.met;
    if (filter === 'pending') return !item.met;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        eyebrow={`Tech Ignite ’26 · ${MOCK_TEAM.track}`}
        title="Overview"
        description="Ship your project, keep the team aligned, and submit before the clock runs out."
        aside={
          <Link to="/dashboard/submissions" className={cn(buttonVariants(), 'gap-2')}>
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
          value="Draft"
          hint="Not submitted yet"
          icon={FileText}
          badge={{ label: 'In progress', variant: 'warning' }}
        />
        <DashboardStat
          label="Deadline"
          value={`${String(MOCK_TEAM.daysLeft)} days`}
          hint="Closes 18 Nov, 11:59 PM WAT"
          icon={CalendarClock}
          badge={{ label: 'On track', variant: 'success' }}
        />
        <DashboardStat
          label="Team"
          value={`${String(MEMBERS.length)}/${String(MOCK_TEAM.seats)}`}
          hint={`${String(confirmed)} confirmed · ${String(MEMBERS.length - confirmed)} pending`}
          icon={Users}
          badge={{ label: `${String(confirmed)} confirmed`, variant: 'success' }}
        />
        <DashboardStat
          label="Checklist"
          value={`${String(completion)}%`}
          hint={`${String(completed)} of ${String(total)} requirements met`}
          icon={ListChecks}
          badge={{ label: `${String(completed)}/${String(total)}`, variant: 'default' }}
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
            {visibleChecklist.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                Nothing here.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {visibleChecklist.map((item) => (
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
                <CardDescription>Last saved {MOCK_TEAM.lastSaved}</CardDescription>
              </div>
              <SubmissionStatusBadge status={STATUS} />
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-slate-900">
                {MOCK_SUBMISSION.title}
              </p>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-500">
                {MOCK_SUBMISSION.description}
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
                    {String(MOCK_TEAM.daysLeft)} days
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
                  {String(MEMBERS.length)} of {String(MOCK_TEAM.seats)} seats used
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
              <ul className="flex flex-col gap-3">
                {MEMBERS.map((member) => (
                  <li key={member.email} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
                      {member.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">
                        {member.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {member.role}
                      </span>
                    </span>
                    <Badge variant={member.confirmed ? 'success' : 'warning'}>
                      {member.confirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                  </li>
                ))}
              </ul>
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
                        current ? 'font-medium text-slate-900' : 'text-slate-600',
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="block text-xs text-slate-500">{step.hint}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Activity */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Every milestone from registration to judging.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-x-8 sm:grid-cols-2">
            {TIMELINE.map((entry, index) => (
              <li key={`${entry.date}-${entry.label}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                      TIMELINE_STYLES[entry.state],
                    )}
                  >
                    {entry.state === 'done' ? (
                      <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                    ) : entry.state === 'current' ? (
                      <CircleDot size={12} aria-hidden="true" />
                    ) : (
                      <Clock3 size={12} aria-hidden="true" />
                    )}
                  </span>
                  {index < TIMELINE.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-slate-200" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 tabular-nums">
                      {entry.date}
                    </span>
                    <span
                      className={cn(
                        'text-sm',
                        entry.state === 'upcoming'
                          ? 'text-slate-500'
                          : 'font-medium text-slate-900',
                      )}
                    >
                      {entry.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {entry.detail}
                  </p>
                </div>
              </li>
            ))}
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
