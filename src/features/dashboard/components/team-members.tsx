import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardPageHeader } from './dashboard-page-header';
import { DashboardErrorState, DashboardLoading } from './dashboard-loading';
import { memberInitials } from './team-status';
import { useTeamProfile } from '../hooks/use-team-profile';
import { EVENT } from '../data';

/**
 * Read-only roster straight from GET /api/team. The API has no member write
 * endpoints, so nothing is invented and no invite/remove actions are shown.
 */
export function TeamMembers() {
  const { data: team, isPending, isError, error, refetch } = useTeamProfile();

  if (isPending) {
    return <DashboardLoading label="Loading your team roster…" />;
  }

  if (isError) {
    return (
      <DashboardErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Could not load your team roster.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  if (!team) {
    return <DashboardLoading label="Loading your team roster…" />;
  }

  const lead = team.members.find((member) => member.role === 'LEAD');
  const memberCount = team.members.length;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        eyebrow={`${EVENT.name} · ${EVENT.track}`}
        title="Team Members"
        description="Everyone registered under this team. Only the team lead can edit the submission."
        aside={
          <Badge variant="outline" className="px-3 py-1.5 text-xs">
            {String(memberCount)} {memberCount === 1 ? 'member' : 'members'}
          </Badge>
        }
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>
              {lead
                ? `Led by ${lead.name}`
                : 'No lead has been assigned to this team yet.'}
            </CardDescription>
          </div>
          {team.status && (
            <Badge variant="secondary">{team.status.toLowerCase()}</Badge>
          )}
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">Members</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {String(memberCount)}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">Track</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {EVENT.track}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs text-slate-500">Deadline</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {EVENT.deadline}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {memberCount === 0 ? (
        <Card className="items-center border-dashed py-12 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Mail size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-900">
              No members on the roster yet
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              Members appear here as soon as they are attached to your team.
              There is no self-service invite yet — contact organisers if your
              roster looks wrong.
            </p>
          </div>
          <a
            href="mailto:support@techignite.net"
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            support@techignite.net
          </a>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {team.members.map((member) => (
            <li key={member.id}>
              <Card className="h-full gap-0 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-semibold text-violet-700">
                    {memberInitials(member.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate text-sm font-medium text-slate-900">
                        {member.name}
                      </span>
                      <Badge
                        variant={member.role === 'LEAD' ? 'default' : 'secondary'}
                      >
                        {member.role === 'LEAD' ? 'Lead' : 'Member'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {member.role === 'LEAD' ? 'Team lead' : 'Team member'}
                    </p>
                    {member.email.length > 0 ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-2 flex items-center gap-1 truncate text-xs text-slate-500 hover:text-violet-600"
                      >
                        <Mail size={12} aria-hidden="true" />
                        {member.email}
                      </a>
                    ) : (
                      <p className="mt-2 flex items-center gap-1 truncate text-xs text-slate-400">
                        <Mail size={12} aria-hidden="true" />
                        No email on file
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-500">
        Need to change who is on the team? Contact{' '}
        <a
          href="mailto:support@techignite.net"
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          support@techignite.net
        </a>
        .
      </p>
    </div>
  );
}
