import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, FolderGit2, Lock, Send, Trophy, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  connectRepository,
  submitTeam,
  updateTeam,
  type TeamUpdateInput,
} from '@/lib/team-api';
import { DashboardPageHeader } from './dashboard-page-header';
import { DashboardErrorState, DashboardLoading } from './dashboard-loading';
import { SubmissionCard } from './submission-card';
import {
  SubmissionDialog,
  type SubmissionFormValues,
  type SubmissionSaveMode,
} from './submission-dialog';
import { SubmissionStatusBadge } from './submission-status-badge';
import { formatTeamDate, isSubmissionLocked, toSubmissionStatus } from './team-status';
import { TEAM_PROFILE_KEY, useTeamProfile } from '../hooks/use-team-profile';
import { EVENT, HACKATHON_COUPON } from '../data';

/** Hackathon info card plus the live, judged project submission. */
export function ApplicationSubmissions() {
  const { data: team, isPending, isError, error, refetch } = useTeamProfile();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (isPending) {
    return <DashboardLoading label="Loading your submission…" />;
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
  const locked = isSubmissionLocked(team);

  const saveSubmission = async (
    values: SubmissionFormValues,
    mode: SubmissionSaveMode,
  ): Promise<void> => {
    const input: TeamUpdateInput = {
      projectTitle: values.title,
      projectDescription: values.summary,
      techStack: values.technologies.join(', '),
      ...(values.demoUrl.length > 0 ? { demoUrl: values.demoUrl } : {}),
    };
    await updateTeam(input);

    if (values.repositoryUrl.length > 0 && values.repositoryUrl !== team.repositoryUrl) {
      await connectRepository(values.repositoryUrl);
    }

    if (mode === 'submit') {
      await submitTeam();
    }

    await queryClient.invalidateQueries({ queryKey: TEAM_PROFILE_KEY });
    setEditing(false);
    setNotice(
      mode === 'submit'
        ? 'Project submitted and locked for judging.'
        : 'Project details saved.',
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        eyebrow={`${EVENT.name} · ${EVENT.track}`}
        title="Application Submissions"
        description="Your hackathon entry and the project judges will score."
        aside={<SubmissionStatusBadge status={status} />}
      />

      {notice && (
        <p
          role="status"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          <Check size={14} aria-hidden="true" />
          {notice}
        </p>
      )}

      {/* Hackathon record — read-only. The API stores one judged project. */}
      <Card className="bg-slate-50/60">
        <CardHeader className="flex-wrap">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 ring-1 ring-slate-200">
              <Trophy size={17} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Hackathon Submissions</CardTitle>
              <CardDescription>
                A quick record of your hackathon entry. The judged work lives under
                Project Submissions.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary">Registered</Badge>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Team</dt>
              <dd className="mt-0.5 truncate text-sm font-medium text-slate-900">
                {team.name}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Track</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{EVENT.track}</dd>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Deadline</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {EVENT.deadline}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Hackathon team hosting coupon */}
      <Card className="bg-slate-50/60">
        <CardHeader className="flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-blue ring-1 ring-slate-200">
              <Tag size={17} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <CardTitle>LiteHosting coupon</CardTitle>
              <CardDescription>
                For hackathon teams — copy the code at checkout.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Coupon code</dt>
              <dd className="mt-1 flex items-center justify-between gap-2">
                <code className="font-mono text-sm font-semibold text-slate-900">
                  {HACKATHON_COUPON.code}
                </code>
                <button
                  type="button"
                  aria-label="Copy coupon code"
                  onClick={() => {
                    void navigator.clipboard?.writeText(HACKATHON_COUPON.code).catch(() => {});
                  }}
                  className="flex shrink-0 items-center justify-center rounded-xs p-1 text-slate-400 transition-colors hover:text-brand-blue"
                >
                  <Copy size={14} aria-hidden="true" />
                </button>
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Discount</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {HACKATHON_COUPON.discount}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Valid until</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {HACKATHON_COUPON.validUntil}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <dt className="text-xs text-slate-500">Limits</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {String(HACKATHON_COUPON.uses)} total · {String(HACKATHON_COUPON.perClient)}/client
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Judged project submission */}
      <Card>
        <CardHeader className="flex-wrap">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FolderGit2 size={17} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>Project Submissions</CardTitle>
                <SubmissionStatusBadge status={status} />
              </div>
              <CardDescription>
                Your main submission — judges score this entry.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SubmissionCard team={team} status={status} />
          {team.members.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Submitted by {team.name} · {String(team.members.length)}{' '}
              {team.members.length === 1 ? 'member' : 'members'}
            </p>
          )}
        </CardContent>
        <CardFooter>
          {locked ? (
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock size={13} aria-hidden="true" />
              Locked {formatTeamDate(team.submittedAt)}. Writes are disabled — contact
              organisers to reopen.
            </p>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => {
                  setEditing(true);
                }}
              >
                <Send size={16} aria-hidden="true" />
                Submit project
              </Button>
              <p className="text-xs text-slate-500">
                Save a draft any time. Submitting locks the entry.
              </p>
            </>
          )}
        </CardFooter>
      </Card>

      {editing && (
        <SubmissionDialog
          team={team}
          onClose={() => {
            setEditing(false);
          }}
          onSave={saveSubmission}
        />
      )}
    </div>
  );
}
