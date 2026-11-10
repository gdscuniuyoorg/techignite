import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Mail, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getStoredMemberEmail,
  inviteTeamMember,
  type InviteTeamMemberInput,
  type TeamMember,
} from '@/lib/team-api';
import { DashboardPageHeader } from './dashboard-page-header';
import { DashboardErrorState, DashboardLoading } from './dashboard-loading';
import { InviteMemberDialog } from './invite-member-dialog';
import { memberInitials } from './team-status';
import { teamMembersKey, useTeamMembers } from '../hooks/use-team-members';
import { TEAM_PROFILE_KEY, useTeamProfile } from '../hooks/use-team-profile';
import { EVENT } from '../data';

function roleLabel(role: TeamMember['role']): string {
  switch (role) {
    case 'LEAD':
      return 'Lead';
    case 'MENTOR':
      return 'Mentor';
    case 'MEMBER':
      return 'Member';
    default: {
      const exhaustiveCheck: never = role;
      return exhaustiveCheck;
    }
  }
}

/** Team roster and lead only invitation flow. */
export function TeamMembers() {
  const queryClient = useQueryClient();
  const teamQuery = useTeamProfile();
  const teamId = teamQuery.data?.id ?? '';
  const membersQuery = useTeamMembers(teamId);
  const [inviting, setInviting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (teamQuery.isPending || (teamId.length > 0 && membersQuery.isPending)) {
    return <DashboardLoading label="Loading your team roster…" />;
  }

  if (teamQuery.isError || membersQuery.isError) {
    const error = teamQuery.error ?? membersQuery.error;
    return (
      <DashboardErrorState
        message={
          error instanceof Error ? error.message : 'Could not load your team roster.'
        }
        onRetry={() => {
          void teamQuery.refetch();
          if (teamId.length > 0) void membersQuery.refetch();
        }}
      />
    );
  }

  const team = teamQuery.data;
  const members = membersQuery.data?.members ?? team.members;
  const lead = members.find((member) => member.role === 'LEAD');
  const memberCount = members.length;
  const pendingCount = members.filter(
    (member) => member.onboardingStatus === 'PENDING',
  ).length;
  const storedEmail = getStoredMemberEmail()?.toLowerCase() ?? '';
  const canInvite =
    team.id.length > 0 &&
    lead !== undefined &&
    (storedEmail.length === 0 || lead.email.toLowerCase() === storedEmail);

  const sendInvite = async (input: InviteTeamMemberInput): Promise<void> => {
    await inviteTeamMember(team.id, input);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: TEAM_PROFILE_KEY }),
      queryClient.invalidateQueries({ queryKey: teamMembersKey(team.id) }),
    ]);
    setNotice(`Invite sent to ${input.memberEmail}.`);
    setInviting(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
      <DashboardPageHeader
        eyebrow={`${EVENT.name} · ${EVENT.track}`}
        title="Team Members"
        description="See who is on the team and invite people before submissions close."
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="px-3 py-1.5 text-xs">
              {String(memberCount)} {memberCount === 1 ? 'member' : 'members'}
            </Badge>
            {canInvite && (
              <Button
                type="button"
                className="h-11 bg-slate-950 px-4 text-white hover:bg-slate-800"
                onClick={() => {
                  setNotice(null);
                  setInviting(true);
                }}
              >
                <UserPlus size={16} aria-hidden="true" />
                Invite member
              </Button>
            )}
          </div>
        }
      />

      {notice && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {notice}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-medium text-slate-500">Current team</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {team.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {lead
                ? `Led by ${lead.name}`
                : 'No lead has been assigned to this team yet.'}
            </p>
          </div>
          <Badge variant="secondary" className="capitalize">
            {team.status.toLowerCase()}
          </Badge>
        </div>

        <dl className="grid border-y border-slate-100 bg-slate-50/70 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
          <div className="px-5 py-4 sm:px-6">
            <dt className="text-xs text-slate-500">Members</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-950 tabular-nums">
              {String(memberCount)}
            </dd>
          </div>
          <div className="border-t border-slate-200 px-5 py-4 sm:border-t-0 sm:px-6">
            <dt className="text-xs text-slate-500">Pending invites</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-950 tabular-nums">
              {String(pendingCount)}
            </dd>
          </div>
          <div className="border-t border-slate-200 px-5 py-4 sm:border-t-0 sm:px-6">
            <dt className="text-xs text-slate-500">Deadline</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">
              {EVENT.deadline}
            </dd>
          </div>
        </dl>

        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Roster</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Invited people appear here before they activate their link.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {String(memberCount)} total
          </span>
        </div>

        {memberCount === 0 ? (
          <div className="flex flex-col items-center border-t border-slate-100 px-5 py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Mail size={18} aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-900">
              No members on the roster yet
            </p>
            <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
              {canInvite
                ? 'Use the invite button above to add your first teammate.'
                : 'The team lead can invite members from this page.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-pale text-sm font-semibold text-brand-blue-strong">
                    {memberInitials(member.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-950">
                      {member.name}
                    </span>
                    {member.email.length > 0 ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 hover:text-brand-blue-strong"
                      >
                        <Mail size={12} aria-hidden="true" />
                        {member.email}
                      </a>
                    ) : (
                      <span className="mt-0.5 block text-xs text-slate-400">
                        No email on file
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-13 sm:pl-0">
                  {member.onboardingStatus === 'PENDING' && (
                    <Badge variant="warning">Invite pending</Badge>
                  )}
                  {member.onboardingStatus === 'EXPIRED' && (
                    <Badge variant="destructive">Invite expired</Badge>
                  )}
                  {member.onboardingStatus === 'ACTIVE' && (
                    <Badge variant="success">Active</Badge>
                  )}
                  <Badge
                    variant={
                      member.role === 'LEAD'
                        ? 'default'
                        : member.role === 'MENTOR'
                          ? 'warning'
                          : 'secondary'
                    }
                  >
                    {roleLabel(member.role)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-500">
        Need help with the roster? Contact{' '}
        <a
          href="mailto:support@techignite.net"
          className="font-medium text-brand-blue-strong hover:text-brand-blue"
        >
          support@techignite.net
        </a>
        .
      </p>

      {inviting && (
        <InviteMemberDialog
          teamName={team.name}
          existingEmails={members.map((member) => member.email)}
          onClose={() => {
            setInviting(false);
          }}
          onInvite={sendInvite}
        />
      )}
    </div>
  );
}
