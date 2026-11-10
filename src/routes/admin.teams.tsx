import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Loader2, Star, Trash2, UsersRound, X } from 'lucide-react';
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog';
import {
  adminErrorMessage,
  deleteAdminTeamMember,
  deleteTeam,
  exportUrl,
  getTeam,
  listAdminTeamMembers,
  listFinalistTeams,
  listTeams,
  toggleTeamFinalist,
  updateAdminTeamMemberRole,
  type AdminTeamMemberRole,
} from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';

const PAGE_SIZE = 50;
const MEMBER_ROLES: readonly AdminTeamMemberRole[] = ['lead', 'member', 'mentor'];

interface TeamsSearch {
  readonly view: 'all' | 'finalists';
  readonly offset: number;
  readonly selected?: string | undefined;
}

function parseSearch(raw: Record<string, unknown>): TeamsSearch {
  const offsetValue = Number(raw.offset ?? 0);
  return {
    view: raw.view === 'finalists' ? 'finalists' : 'all',
    offset: Number.isInteger(offsetValue) && offsetValue >= 0 ? offsetValue : 0,
    selected:
      typeof raw.selected === 'string' && raw.selected.length > 0
        ? raw.selected
        : undefined,
  };
}

function parseMemberRole(value: string): AdminTeamMemberRole {
  switch (value) {
    case 'lead':
    case 'mentor':
      return value;
    case 'member':
    default:
      return 'member';
  }
}

export const Route = createFileRoute('/admin/teams')({
  head: () => noindexHead('Teams | Tech Ignite Admin'),
  validateSearch: parseSearch,
  component: AdminTeams,
});

function AdminTeams() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const setSearch = (patch: Partial<TeamsSearch>) =>
    void navigate({
      search: (previous) => ({ ...previous, ...patch }),
      replace: true,
    });

  const teamsQuery = useQuery({
    queryKey: ['admin', 'teams', search.offset],
    queryFn: () => listTeams({ limit: PAGE_SIZE, offset: search.offset }),
    enabled: search.view === 'all',
    placeholderData: (previous) => previous,
  });
  const finalistsQuery = useQuery({
    queryKey: ['admin', 'teams', 'finalists'],
    queryFn: listFinalistTeams,
    enabled: search.view === 'finalists',
  });
  const detailQuery = useQuery({
    queryKey: ['admin', 'teams', 'detail', search.selected ?? 'none'],
    queryFn: () => getTeam(search.selected ?? ''),
    enabled: search.selected !== undefined,
  });
  const membersQuery = useQuery({
    queryKey: ['admin', 'teams', search.selected ?? 'none', 'members'],
    queryFn: () => listAdminTeamMembers(search.selected ?? ''),
    enabled: search.selected !== undefined,
  });

  const invalidateTeams = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'teams'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
    ]);

  const finalistMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await toggleTeamFinalist(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: invalidateTeams,
  });
  const teamDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteTeam(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setDeletingTeamId(null);
      setSearch({ selected: undefined });
      await invalidateTeams();
    },
  });
  const roleMutation = useMutation({
    mutationFn: async (input: {
      readonly id: string;
      readonly role: AdminTeamMemberRole;
    }) => {
      try {
        await updateAdminTeamMemberRole(input.id, input.role);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['admin', 'teams', search.selected ?? 'none', 'members'],
      }),
  });
  const memberDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteAdminTeamMember(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setDeletingMemberId(null);
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'teams', search.selected ?? 'none', 'members'],
      });
    },
  });

  const teams =
    search.view === 'finalists'
      ? (finalistsQuery.data ?? [])
      : (teamsQuery.data?.items ?? []);
  const listPending =
    search.view === 'finalists' ? finalistsQuery.isPending : teamsQuery.isPending;
  const listError = search.view === 'finalists' ? finalistsQuery.error : teamsQuery.error;
  const selectedTeam = detailQuery.data;
  const deletingTeam =
    teams.find((team) => team.id === deletingTeamId) ??
    (selectedTeam?.id === deletingTeamId ? selectedTeam : null);
  const deletingMember =
    membersQuery.data?.find((member) => member.id === deletingMemberId) ?? null;
  const actionError = finalistMutation.error ?? roleMutation.error;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-blue-soft uppercase">
            Hackathon operations
          </p>
          <h1 className="mt-1 text-heading font-medium text-white">Teams</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Manage finalists, member roles, and team records.
          </p>
        </div>
        <a
          href={exportUrl('api/admin/exports/teams')}
          download
          className="flex h-11 items-center gap-2 rounded-xs border border-line bg-ink-raised px-4 text-button text-white/85 hover:border-brand-blue hover:text-white"
        >
          <Download size={16} aria-hidden="true" />
          Export teams
        </a>
      </div>

      <div role="group" aria-label="Team view" className="flex gap-2">
        {(['all', 'finalists'] as const).map((view) => (
          <button
            key={view}
            type="button"
            aria-pressed={search.view === view}
            onClick={() => {
              setSearch({ view, offset: 0 });
            }}
            className={`h-9 rounded-pill border px-4 text-sm capitalize ${
              search.view === view
                ? 'border-brand-blue bg-brand-blue/15 text-white'
                : 'border-line text-white/65 hover:text-white'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {actionError && (
        <p
          role="alert"
          className="rounded-xs border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-sm text-white/80"
        >
          {actionError.message}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-5">
        <section className="xl:col-span-3">
          {listPending ? (
            <div className="flex flex-col gap-3" aria-busy="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-card bg-ink-raised"
                />
              ))}
            </div>
          ) : listError ? (
            <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6 text-white/80">
              Could not load teams.
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-ink-raised px-6 py-16 text-center">
              <UsersRound size={28} className="text-white/30" aria-hidden="true" />
              <p className="text-white">No teams found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-ink-raised">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className={`flex flex-wrap items-center gap-3 px-4 py-4 ${
                    search.selected === team.id ? 'bg-brand-blue/5' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSearch({ selected: team.id });
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-2 font-medium text-white">
                      {team.name}
                      {team.isFinalist && (
                        <Star
                          size={14}
                          className="fill-brand-amber text-brand-amber"
                          aria-label="Finalist"
                        />
                      )}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      {String(team.memberCount)} members · {team.status}
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={finalistMutation.isPending}
                    onClick={() => {
                      finalistMutation.mutate(team.id);
                    }}
                    className="flex h-10 items-center gap-2 rounded-xs border border-line px-3 text-xs text-white/75 hover:border-brand-amber hover:text-white disabled:opacity-50"
                  >
                    <Star size={14} aria-hidden="true" />
                    {team.isFinalist ? 'Remove finalist' : 'Make finalist'}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {search.view === 'all' &&
            teamsQuery.data &&
            teamsQuery.data.pagination.total > PAGE_SIZE && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  {String(search.offset + 1)} to{' '}
                  {String(
                    Math.min(search.offset + PAGE_SIZE, teamsQuery.data.pagination.total),
                  )}{' '}
                  of {String(teamsQuery.data.pagination.total)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={search.offset === 0}
                    onClick={() => {
                      setSearch({
                        offset: Math.max(0, search.offset - PAGE_SIZE),
                      });
                    }}
                    className="h-11 rounded-xs border border-line px-4 text-button text-white/80 disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={
                      search.offset + PAGE_SIZE >= teamsQuery.data.pagination.total
                    }
                    onClick={() => {
                      setSearch({ offset: search.offset + PAGE_SIZE });
                    }}
                    className="h-11 rounded-xs border border-line px-4 text-button text-white/80 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </section>

        <section className="xl:col-span-2">
          {search.selected === undefined ? (
            <div className="flex min-h-64 items-center justify-center rounded-card border border-dashed border-line px-6 text-center text-sm text-muted">
              Select a team to manage its roster.
            </div>
          ) : detailQuery.isPending ? (
            <div
              aria-busy="true"
              className="flex min-h-64 items-center justify-center rounded-card border border-line bg-ink-raised"
            >
              <Loader2
                size={22}
                className="animate-spin text-brand-blue-soft"
                aria-hidden="true"
              />
            </div>
          ) : detailQuery.error ? (
            <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-5 text-sm text-white/80">
              Could not load this team.
            </div>
          ) : selectedTeam ? (
            <div className="rounded-card border border-line bg-ink-raised p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-eyebrow text-muted uppercase">Team</p>
                  <h2 className="mt-1 text-subheading font-medium text-white">
                    {selectedTeam.name}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close team details"
                  onClick={() => {
                    setSearch({ selected: undefined });
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xs text-white/60 hover:bg-ink-soft hover:text-white"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/70">
                {selectedTeam.description || 'No team description provided.'}
              </p>

              <div className="mt-5 flex items-center justify-between border-y border-line py-3">
                <h3 className="text-label text-white">Members</h3>
                <span className="text-xs text-muted">
                  {String(membersQuery.data?.length ?? 0)} total
                </span>
              </div>

              {membersQuery.isPending ? (
                <div className="flex justify-center py-10" aria-busy="true">
                  <Loader2
                    size={20}
                    className="animate-spin text-brand-blue-soft"
                    aria-hidden="true"
                  />
                </div>
              ) : membersQuery.error ? (
                <p className="py-5 text-sm text-white/70">Could not load this roster.</p>
              ) : membersQuery.data.length === 0 ? (
                <p className="py-5 text-sm text-muted">No members found.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {membersQuery.data.map((member) => (
                    <li key={member.id} className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {member.name}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {member.email || 'No email'}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${member.name}`}
                          onClick={() => {
                            setDeletingMemberId(member.id);
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center text-white/45 hover:text-white"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                      <label className="mt-3 flex items-center gap-3 text-xs text-muted">
                        Role
                        <select
                          value={member.role}
                          disabled={roleMutation.isPending}
                          onChange={(event) => {
                            roleMutation.mutate({
                              id: member.id,
                              role: parseMemberRole(event.target.value),
                            });
                          }}
                          className="h-10 flex-1 rounded-xs border border-line bg-ink px-3 text-sm text-paper outline-none focus:border-brand-blue"
                        >
                          {MEMBER_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role[0]?.toUpperCase()}
                              {role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() => {
                  setDeletingTeamId(selectedTeam.id);
                }}
                className="mt-5 flex h-11 items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <Trash2 size={15} aria-hidden="true" />
                Delete team
              </button>
            </div>
          ) : null}
        </section>
      </div>

      <ConfirmDialog
        open={deletingTeam !== null}
        title="Delete this team?"
        body={
          <p>
            This permanently deletes{' '}
            <strong className="text-white">{deletingTeam?.name}</strong> and may affect
            its submission.
          </p>
        }
        confirmLabel="Delete team"
        destructive
        confirming={teamDeleteMutation.isPending}
        error={teamDeleteMutation.error?.message}
        onConfirm={() => {
          if (deletingTeam) teamDeleteMutation.mutate(deletingTeam.id);
        }}
        onCancel={() => {
          teamDeleteMutation.reset();
          setDeletingTeamId(null);
        }}
      />

      <ConfirmDialog
        open={deletingMember !== null}
        title="Remove this member?"
        body={
          <p>
            Remove <strong className="text-white">{deletingMember?.name}</strong> from
            this team.
          </p>
        }
        confirmLabel="Remove member"
        destructive
        confirming={memberDeleteMutation.isPending}
        error={memberDeleteMutation.error?.message}
        onConfirm={() => {
          if (deletingMember) memberDeleteMutation.mutate(deletingMember.id);
        }}
        onCancel={() => {
          memberDeleteMutation.reset();
          setDeletingMemberId(null);
        }}
      />
    </div>
  );
}
