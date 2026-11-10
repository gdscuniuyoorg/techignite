import { useState, type SyntheticEvent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Download,
  KeyRound,
  Loader2,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog';
import {
  adminErrorMessage,
  createAdminUser,
  createCustomRole,
  deactivateAdminUser,
  deleteCustomRole,
  exportUrl,
  listAdminUsers,
  listCustomRoles,
  listDefaultRoles,
  listUsers,
  updateAdminUserRole,
  updateCustomRole,
  type AdminRole,
  type AdminUserInput,
  type CustomRoleInput,
} from '@/lib/admin-api';
import { formText } from '@/lib/form';
import { noindexHead } from '@/lib/seo';

const PAGE_SIZE = 50;
const INPUT_CLASS =
  'h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue';

type AccessTab = 'users' | 'admins' | 'roles';

interface UsersSearch {
  readonly tab: AccessTab;
  readonly offset: number;
}

function parseSearch(raw: Record<string, unknown>): UsersSearch {
  const offsetValue = Number(raw.offset ?? 0);
  const tab: AccessTab = raw.tab === 'admins' || raw.tab === 'roles' ? raw.tab : 'users';
  return {
    tab,
    offset: Number.isInteger(offsetValue) && offsetValue >= 0 ? offsetValue : 0,
  };
}

function permissionsFrom(value: string): readonly string[] {
  return value
    .split(',')
    .map((permission) => permission.trim())
    .filter((permission) => permission.length > 0);
}

function adminRoleInput(value: string): {
  readonly role: string;
  readonly customRoleId?: string;
} {
  if (value.startsWith('custom:')) {
    return { role: 'custom', customRoleId: value.slice('custom:'.length) };
  }
  return { role: value || 'admin' };
}

export const Route = createFileRoute('/admin/users')({
  head: () => noindexHead('Users and access | Tech Ignite Admin'),
  validateSearch: parseSearch,
  component: AdminUsers,
});

function AdminUsers() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [adminFormVersion, setAdminFormVersion] = useState(0);
  const [roleFormVersion, setRoleFormVersion] = useState(0);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [deactivatingAdminId, setDeactivatingAdminId] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  const setSearch = (patch: Partial<UsersSearch>) =>
    void navigate({
      search: (previous) => ({ ...previous, ...patch }),
      replace: true,
    });

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', 'platform', search.offset],
    queryFn: () => listUsers({ limit: PAGE_SIZE, offset: search.offset }),
    enabled: search.tab === 'users',
    placeholderData: (previous) => previous,
  });
  const adminsQuery = useQuery({
    queryKey: ['admin', 'users', 'admins'],
    queryFn: listAdminUsers,
    enabled: search.tab === 'admins',
  });
  const defaultRolesQuery = useQuery({
    queryKey: ['admin', 'roles', 'default'],
    queryFn: listDefaultRoles,
    enabled: search.tab === 'admins' || search.tab === 'roles',
  });
  const customRolesQuery = useQuery({
    queryKey: ['admin', 'roles', 'custom'],
    queryFn: listCustomRoles,
    enabled: search.tab === 'admins' || search.tab === 'roles',
  });

  const invalidateUsers = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
    ]);
  const invalidateRoles = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });

  const adminCreateMutation = useMutation({
    mutationFn: async (input: AdminUserInput) => {
      try {
        await createAdminUser(input);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setAdminFormVersion((value) => value + 1);
      await invalidateUsers();
    },
  });
  const adminRoleMutation = useMutation({
    mutationFn: async (input: {
      readonly id: string;
      readonly role: string;
      readonly customRoleId?: string;
    }) => {
      try {
        await updateAdminUserRole(input.id, {
          role: input.role,
          ...(input.customRoleId ? { customRoleId: input.customRoleId } : {}),
        });
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: invalidateUsers,
  });
  const adminDeactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deactivateAdminUser(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setDeactivatingAdminId(null);
      await invalidateUsers();
    },
  });
  const roleMutation = useMutation({
    mutationFn: async (input: {
      readonly id: string | null;
      readonly values: CustomRoleInput;
    }) => {
      try {
        if (input.id) await updateCustomRole(input.id, input.values);
        else await createCustomRole(input.values);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setEditingRole(null);
      setRoleFormVersion((value) => value + 1);
      await invalidateRoles();
    },
  });
  const roleDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteCustomRole(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setDeletingRoleId(null);
      setEditingRole(null);
      await invalidateRoles();
    },
  });

  const handleAdminSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = formText(data, 'email');
    const firstName = formText(data, 'firstName');
    const lastName = formText(data, 'lastName');
    const password = formText(data, 'password');
    const assignment = adminRoleInput(formText(data, 'role'));
    if (!email || !firstName || !lastName || !password) return;
    adminCreateMutation.mutate({
      email,
      firstName,
      lastName,
      password,
      role: assignment.role,
      ...(assignment.customRoleId ? { customRoleId: assignment.customRoleId } : {}),
    });
  };

  const handleRoleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = formText(data, 'name');
    const description = formText(data, 'description');
    const permissions = permissionsFrom(formText(data, 'permissions'));
    if (!name || permissions.length === 0) return;
    roleMutation.mutate({
      id: editingRole?.id ?? null,
      values: {
        name,
        permissions,
        ...(description ? { description } : {}),
      },
    });
  };

  const deactivatingAdmin =
    adminsQuery.data?.find((user) => user.id === deactivatingAdminId) ?? null;
  const deletingRole =
    customRolesQuery.data?.find((role) => role.id === deletingRoleId) ?? null;
  const defaultRoles = defaultRolesQuery.data ?? [];
  const customRoles = customRolesQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-blue-soft uppercase">Administration</p>
          <h1 className="mt-1 text-heading font-medium text-white">Users and access</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Manage platform users, admin accounts, roles, and permissions.
          </p>
        </div>
        <a
          href={exportUrl('api/admin/exports/users')}
          download
          className="flex h-11 items-center gap-2 rounded-xs border border-line bg-ink-raised px-4 text-button text-white/85 hover:border-brand-blue hover:text-white"
        >
          <Download size={16} aria-hidden="true" />
          Export users
        </a>
      </div>

      <div
        role="tablist"
        aria-label="User management sections"
        className="flex flex-wrap gap-2"
      >
        {(['users', 'admins', 'roles'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={search.tab === tab}
            onClick={() => {
              setSearch({ tab, offset: 0 });
            }}
            className={`h-10 rounded-pill border px-4 text-sm capitalize ${
              search.tab === tab
                ? 'border-brand-blue bg-brand-blue/15 text-white'
                : 'border-line text-white/65 hover:text-white'
            }`}
          >
            {tab === 'admins' ? 'Admin accounts' : tab}
          </button>
        ))}
      </div>

      {search.tab === 'users' && (
        <div role="tabpanel">
          <section>
            {usersQuery.isPending ? (
              <div className="flex flex-col gap-3" aria-busy="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-card bg-ink-raised"
                  />
                ))}
              </div>
            ) : usersQuery.error ? (
              <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6 text-white/80">
                Could not load users.
              </div>
            ) : usersQuery.data.items.length === 0 ? (
              <div className="rounded-card border border-line bg-ink-raised px-6 py-16 text-center text-muted">
                No users found.
              </div>
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-ink-raised">
                {usersQuery.data.items.map((user) => (
                  <li key={user.id}>
                    <div className="flex w-full items-center gap-3 px-4 py-4 text-left">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-ink-soft text-sm font-medium text-white">
                        {(user.firstName[0] ?? user.email[0] ?? '?').toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {user.email}
                        </span>
                      </span>
                      <span className="text-xs text-white/60 capitalize">
                        {user.role}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {usersQuery.data && usersQuery.data.pagination.total > PAGE_SIZE && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  {String(search.offset + 1)} to{' '}
                  {String(
                    Math.min(search.offset + PAGE_SIZE, usersQuery.data.pagination.total),
                  )}{' '}
                  of {String(usersQuery.data.pagination.total)}
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
                      search.offset + PAGE_SIZE >= usersQuery.data.pagination.total
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
        </div>
      )}

      {search.tab === 'admins' && (
        <div role="tabpanel" className="grid gap-4 xl:grid-cols-5">
          <section className="rounded-card border border-line bg-ink-raised p-5 xl:col-span-2">
            <div className="flex items-center gap-3">
              <UserPlus size={20} className="text-brand-blue-soft" aria-hidden="true" />
              <h2 className="text-subheading font-medium text-white">Create admin</h2>
            </div>
            <form
              key={adminFormVersion}
              onSubmit={handleAdminSubmit}
              className="mt-5 grid gap-4"
            >
              <label className="flex flex-col gap-2 text-sm text-white/80">
                First name
                <input name="firstName" required className={INPUT_CLASS} />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Last name
                <input name="lastName" required className={INPUT_CLASS} />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Email
                <input name="email" type="email" required className={INPUT_CLASS} />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Temporary password
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className={INPUT_CLASS}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Role
                <select name="role" className={INPUT_CLASS} defaultValue="admin">
                  {defaultRoles.map((role) => (
                    <option key={`default-${role.id}`} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                  {customRoles.map((role) => (
                    <option key={`custom-${role.id}`} value={`custom:${role.id}`}>
                      {role.name}
                    </option>
                  ))}
                  {defaultRoles.length === 0 && <option value="admin">admin</option>}
                </select>
              </label>
              {adminCreateMutation.error && (
                <p role="alert" className="text-sm text-white/80">
                  {adminCreateMutation.error.message}
                </p>
              )}
              <button
                type="submit"
                disabled={adminCreateMutation.isPending}
                className="flex h-11 items-center justify-center rounded-xs bg-brand-blue px-5 text-button text-white disabled:opacity-50"
              >
                {adminCreateMutation.isPending ? 'Creating…' : 'Create admin'}
              </button>
            </form>
          </section>

          <section className="xl:col-span-3">
            {adminsQuery.isPending ? (
              <div className="flex min-h-64 items-center justify-center rounded-card bg-ink-raised">
                <Loader2
                  size={22}
                  className="animate-spin text-brand-blue-soft"
                  aria-hidden="true"
                />
              </div>
            ) : adminsQuery.error ? (
              <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6 text-white/80">
                Could not load admin users.
              </div>
            ) : adminsQuery.data.length === 0 ? (
              <div className="rounded-card border border-line bg-ink-raised px-6 py-16 text-center text-muted">
                No admin users found.
              </div>
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-ink-raised">
                {adminsQuery.data.map((admin) => (
                  <li key={admin.id} className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {admin.firstName} {admin.lastName}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {admin.email}
                        </span>
                      </span>
                      <select
                        aria-label={`Role for ${admin.email}`}
                        defaultValue={admin.role}
                        disabled={adminRoleMutation.isPending}
                        onChange={(event) => {
                          const assignment = adminRoleInput(event.target.value);
                          adminRoleMutation.mutate({ id: admin.id, ...assignment });
                        }}
                        className="h-10 rounded-xs border border-line bg-ink px-3 text-sm text-paper outline-none focus:border-brand-blue"
                      >
                        {defaultRoles.map((role) => (
                          <option key={`default-${role.id}`} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                        {customRoles.map((role) => (
                          <option key={`custom-${role.id}`} value={`custom:${role.id}`}>
                            {role.name}
                          </option>
                        ))}
                        {!defaultRoles.some((role) => role.name === admin.role) && (
                          <option value={admin.role}>{admin.role}</option>
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setDeactivatingAdminId(admin.id);
                        }}
                        className="flex h-10 items-center rounded-xs border border-line px-3 text-xs text-white/70 hover:text-white"
                      >
                        Deactivate
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {adminRoleMutation.error && (
              <p role="alert" className="mt-3 text-sm text-white/80">
                {adminRoleMutation.error.message}
              </p>
            )}
          </section>
        </div>
      )}

      {search.tab === 'roles' && (
        <div role="tabpanel" className="grid gap-4 xl:grid-cols-5">
          <section className="rounded-card border border-line bg-ink-raised p-5 xl:col-span-2">
            <div className="flex items-center gap-3">
              <KeyRound size={20} className="text-brand-blue-soft" aria-hidden="true" />
              <h2 className="text-subheading font-medium text-white">
                {editingRole ? 'Edit custom role' : 'Create custom role'}
              </h2>
            </div>
            <form
              key={`${editingRole?.id ?? 'new'}-${String(roleFormVersion)}`}
              onSubmit={handleRoleSubmit}
              className="mt-5 grid gap-4"
            >
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Name
                <input
                  name="name"
                  required
                  defaultValue={editingRole?.name ?? ''}
                  className={INPUT_CLASS}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Description
                <input
                  name="description"
                  defaultValue={editingRole?.description ?? ''}
                  className={INPUT_CLASS}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Permissions
                <textarea
                  name="permissions"
                  required
                  rows={5}
                  defaultValue={editingRole?.permissions.join(', ') ?? ''}
                  placeholder="MANAGE_USERS, MANAGE_TEAMS"
                  className="rounded-xs border border-line bg-ink px-3 py-3 font-mono text-sm text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                />
                <span className="text-xs text-muted">
                  Separate permission names with commas.
                </span>
              </label>
              {roleMutation.error && (
                <p role="alert" className="text-sm text-white/80">
                  {roleMutation.error.message}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={roleMutation.isPending}
                  className="flex h-11 items-center rounded-xs bg-brand-blue px-5 text-button text-white disabled:opacity-50"
                >
                  {roleMutation.isPending
                    ? 'Saving…'
                    : editingRole
                      ? 'Save role'
                      : 'Create role'}
                </button>
                {editingRole && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRole(null);
                    }}
                    className="h-11 px-3 text-sm text-white/65 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="flex flex-col gap-4 xl:col-span-3">
            <div className="rounded-card border border-line bg-ink-raised p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={18}
                  className="text-brand-green-bright"
                  aria-hidden="true"
                />
                <h2 className="text-label text-white">Default roles</h2>
              </div>
              {defaultRolesQuery.isPending ? (
                <p className="mt-4 text-sm text-muted">Loading roles…</p>
              ) : defaultRolesQuery.error ? (
                <p className="mt-4 text-sm text-white/70">Could not load roles.</p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {defaultRoles.map((role) => (
                    <li key={role.id} className="rounded-xs border border-line p-3">
                      <p className="text-sm font-medium text-white">{role.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {String(role.permissions.length)} permissions
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-card border border-line bg-ink-raised p-5">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-brand-blue-soft" aria-hidden="true" />
                <h2 className="text-label text-white">Custom roles</h2>
              </div>
              {customRolesQuery.isPending ? (
                <p className="mt-4 text-sm text-muted">Loading custom roles…</p>
              ) : customRolesQuery.error ? (
                <p className="mt-4 text-sm text-white/70">Could not load custom roles.</p>
              ) : customRoles.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No custom roles yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-line">
                  {customRoles.map((role) => (
                    <li
                      key={role.id}
                      className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRole(role);
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block text-sm font-medium text-white">
                          {role.name}
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          {role.description ||
                            `${String(role.permissions.length)} permissions`}
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${role.name}`}
                        onClick={() => {
                          setDeletingRoleId(role.id);
                        }}
                        className="flex h-10 w-10 items-center justify-center text-white/45 hover:text-white"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={deactivatingAdmin !== null}
        title="Deactivate this admin?"
        body={
          <p>
            <strong className="text-white">{deactivatingAdmin?.email}</strong> will lose
            admin access.
          </p>
        }
        confirmLabel="Deactivate admin"
        destructive
        confirming={adminDeactivateMutation.isPending}
        error={adminDeactivateMutation.error?.message}
        onConfirm={() => {
          if (deactivatingAdmin) adminDeactivateMutation.mutate(deactivatingAdmin.id);
        }}
        onCancel={() => {
          adminDeactivateMutation.reset();
          setDeactivatingAdminId(null);
        }}
      />
      <ConfirmDialog
        open={deletingRole !== null}
        title="Delete this custom role?"
        body={
          <p>
            This removes <strong className="text-white">{deletingRole?.name}</strong>.
            Reassign affected admins first.
          </p>
        }
        confirmLabel="Delete role"
        destructive
        confirming={roleDeleteMutation.isPending}
        error={roleDeleteMutation.error?.message}
        onConfirm={() => {
          if (deletingRole) roleDeleteMutation.mutate(deletingRole.id);
        }}
        onCancel={() => {
          roleDeleteMutation.reset();
          setDeletingRoleId(null);
        }}
      />
    </div>
  );
}
