import ky, { HTTPError, TimeoutError } from 'ky';

/**
 * Shared client for the Tech Ignite admin API (api.techignite.net).
 *
 * Auth is the HTTP-only `authToken` cookie set by POST /api/admin/login, so
 * every request uses `credentials: 'include'` and the token is never readable
 * from JavaScript. The base URL is env-driven for local development; see
 * .env.local (git-ignored) and spec 0003.
 */
const ADMIN_API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'https://api.techignite.net/';

export const adminApi = ky.create({
  baseUrl: ADMIN_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  credentials: 'include',
});

// ─── Types (mirrors backend entities in techignite-backend/src/entities) ─────

export type SubmissionStatus =
  'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
export type CampaignStatus =
  'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type CampaignAudience =
  | 'all_applicants'
  | 'accepted_teams'
  | 'finalists'
  | 'reviewers'
  | 'admins'
  | 'subscribers'
  | 'custom';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';
export type AdminTeamMemberRole = 'lead' | 'member' | 'mentor';

export interface AdminSessionUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly status: string;
  readonly permissions: readonly string[];
}

export interface Pagination {
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export interface DashboardStats {
  readonly asOf: string;
  readonly applications: {
    readonly total: number;
    readonly byStatus: Record<string, number>;
    readonly conversionRate: number;
  };
  readonly teams: {
    readonly total: number;
    readonly onboarded: number;
    readonly pendingOnboarding: number;
    readonly finalists: number;
    readonly totalMembers: number;
  };
  readonly submissions: {
    readonly total: number;
    readonly byStatus: Record<string, number>;
    readonly submitted: number;
  };
  readonly coupons: {
    readonly totalSlots: number;
    readonly usedSlots: number;
    readonly remainingSlots: number;
    readonly totalAllocations: number;
  };
  readonly campaigns: {
    readonly byStatus: readonly {
      status: string;
      campaigns: number;
      emailsSent: number;
      emailsFailed: number;
    }[];
    readonly totalEmailsSent: number;
  };
  readonly users: {
    readonly total: number;
    readonly subscribers: number;
    readonly activeSubscribers: number;
  };
}

export interface ProjectSubmission {
  readonly id: string;
  readonly teamId: string;
  readonly projectTitle: string;
  readonly projectDescription: string;
  readonly demoUrl: string | null;
  readonly repositoryUrl: string | null;
  readonly videoUrl: string | null;
  readonly technologies: readonly string[] | null;
  readonly status: SubmissionStatus;
  readonly reviewerNotes: string | null;
  readonly submittedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CouponInventory {
  readonly id: string;
  readonly totalSlots: number;
  readonly availableSlots: number;
  readonly allocatedSlots: number;
  readonly provider: string | null;
  readonly createdAt: string;
}

export interface CouponAllocation {
  readonly id: string;
  readonly inventoryId: string;
  readonly teamId: string;
  readonly couponCode: string;
  readonly isUsed: boolean;
  readonly usedAt: string | null;
  readonly createdAt: string;
}

export interface EmailCampaign {
  readonly id: string;
  readonly name: string;
  readonly subject: string;
  readonly content: string;
  readonly htmlContent: string | null;
  readonly audience: CampaignAudience;
  readonly customRecipients: readonly string[] | null;
  readonly status: CampaignStatus;
  readonly scheduledFor: string | null;
  readonly sentAt: string | null;
  readonly totalRecipients: number;
  readonly sentCount: number;
  readonly failedCount: number;
  readonly isTemplate: boolean;
  readonly createdAt: string;
}

export interface EmailTemplateInfo {
  readonly name: string;
  readonly description: string;
  readonly requiredFields: readonly string[];
}

export interface Subscriber {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly isUnsubscribed: boolean;
  readonly subscribedAt: string;
}

export interface AdminApplication {
  readonly id: string;
  readonly teamName: string;
  readonly projectIdea: string;
  readonly agreedToRules: boolean;
  readonly applicantEmail: string;
  readonly teamDescription: string;
  readonly applicantFirstName: string;
  readonly applicantLastName: string;
  readonly status: ApplicationStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminTeam {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly isFinalist: boolean;
  readonly memberCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminTeamMember {
  readonly id: string;
  readonly teamId: string;
  readonly name: string;
  readonly email: string;
  readonly role: AdminTeamMemberRole;
  readonly userId: string | null;
  readonly onboardingStatus: string;
  readonly createdAt: string;
}

export interface ManagedUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly status: string;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AdminRole {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly permissions: readonly string[];
  readonly isDefault: boolean;
}

export interface AdminUserInput {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password: string;
  readonly role: string;
  readonly customRoleId?: string;
}

export interface ManagedUserInput {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password?: string;
  readonly role?: string;
  readonly status?: string;
}

export interface CustomRoleInput {
  readonly name: string;
  readonly description?: string;
  readonly permissions: readonly string[];
}

// ─── Boundary narrowing ─────────────────────────────────────────────────────
// The OpenAPI file types responses as untyped "description" stubs, so every
// envelope is checked at runtime. Malformed core fields throw; display-only
// fields fall back to safe defaults.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function firstString(fallback: string, ...values: readonly unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return fallback;
}

function strOrNull(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function strArray(value: unknown): readonly string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function strNumRecord(value: unknown): Record<string, number> {
  if (!isRecord(value)) {
    return {};
  }
  const out: Record<string, number> = {};
  for (const [key, v] of Object.entries(value)) {
    out[key] = num(v);
  }
  return out;
}

function expectData(body: unknown): unknown {
  if (!isRecord(body) || body.success !== true) {
    const message =
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : 'Malformed API response';
    throw new Error(message);
  }
  return body.data;
}

function expectPagination(body: unknown): Pagination {
  if (isRecord(body) && isRecord(body.pagination)) {
    return {
      total: num(body.pagination.total),
      limit: num(body.pagination.limit),
      offset: num(body.pagination.offset),
    };
  }
  return { total: 0, limit: 0, offset: 0 };
}

function mapSubmission(value: unknown): ProjectSubmission {
  if (!isRecord(value)) throw new Error('Malformed submission');
  const id = str(value.id);
  if (!id) throw new Error('Malformed submission: missing id');
  return {
    id,
    teamId: str(value.teamId),
    projectTitle: str(value.projectTitle, 'Untitled'),
    projectDescription: str(value.projectDescription),
    demoUrl: strOrNull(value.demoUrl),
    repositoryUrl: strOrNull(value.repositoryUrl),
    videoUrl: strOrNull(value.videoUrl),
    technologies: strArray(value.technologies),
    status: str(value.status, 'draft') as SubmissionStatus,
    reviewerNotes: strOrNull(value.reviewerNotes),
    submittedAt: strOrNull(value.submittedAt),
    createdAt: str(value.createdAt),
    updatedAt: str(value.updatedAt),
  };
}

function mapInventory(value: unknown): CouponInventory {
  if (!isRecord(value)) throw new Error('Malformed coupon inventory');
  const id = str(value.id);
  if (!id) throw new Error('Malformed coupon inventory: missing id');
  return {
    id,
    totalSlots: num(value.totalSlots),
    availableSlots: num(value.availableSlots),
    allocatedSlots: num(value.allocatedSlots),
    provider: strOrNull(value.provider),
    createdAt: str(value.createdAt),
  };
}

function mapCampaign(value: unknown): EmailCampaign {
  if (!isRecord(value)) throw new Error('Malformed campaign');
  const id = str(value.id);
  if (!id) throw new Error('Malformed campaign: missing id');
  return {
    id,
    name: str(value.name, 'Untitled campaign'),
    subject: str(value.subject),
    content: str(value.content),
    htmlContent: strOrNull(value.htmlContent),
    audience: str(value.audience, 'custom') as CampaignAudience,
    customRecipients: strArray(value.customRecipients),
    status: str(value.status, 'draft') as CampaignStatus,
    scheduledFor: strOrNull(value.scheduledFor),
    sentAt: strOrNull(value.sentAt),
    totalRecipients: num(value.totalRecipients),
    sentCount: num(value.sentCount),
    failedCount: num(value.failedCount),
    isTemplate: bool(value.isTemplate),
    createdAt: str(value.createdAt),
  };
}

function mapSubscriber(value: unknown): Subscriber {
  if (!isRecord(value)) throw new Error('Malformed subscriber');
  const id = str(value.id);
  if (!id) throw new Error('Malformed subscriber: missing id');
  return {
    id,
    email: str(value.email),
    name: strOrNull(value.name),
    isUnsubscribed: bool(value.isUnsubscribed),
    subscribedAt: str(value.subscribedAt),
  };
}

function asArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function collectionFrom(value: unknown, keys: readonly string[]): readonly unknown[] {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];
  for (const key of keys) {
    const candidate = value[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function paginationFrom(body: unknown, data: unknown, fallbackTotal: number): Pagination {
  const rootPagination =
    isRecord(body) && isRecord(body.pagination) ? body.pagination : null;
  const dataPagination =
    isRecord(data) && isRecord(data.pagination) ? data.pagination : null;
  const pagination = rootPagination ?? dataPagination;
  return pagination
    ? {
        total: num(pagination.total, fallbackTotal),
        limit: num(pagination.limit, fallbackTotal),
        offset: num(pagination.offset),
      }
    : { total: fallbackTotal, limit: fallbackTotal, offset: 0 };
}

function toApplicationStatus(value: unknown): ApplicationStatus {
  const normalized = str(value).toLowerCase();
  switch (normalized) {
    case 'accepted':
    case 'rejected':
    case 'waitlisted':
      return normalized;
    case 'pending':
    default:
      return 'pending';
  }
}

function toTeamMemberRole(value: unknown): AdminTeamMemberRole {
  const normalized = str(value).toLowerCase();
  switch (normalized) {
    case 'lead':
    case 'mentor':
      return normalized;
    case 'member':
    default:
      return 'member';
  }
}

function mapApplication(value: unknown): AdminApplication {
  if (!isRecord(value)) throw new Error('Malformed application');
  const id = firstString('', value.id, value.applicationId, value._id);
  if (!id) throw new Error('Malformed application: missing id');
  return {
    id,
    teamName: str(value.teamName, 'Unnamed team'),
    projectIdea: str(value.projectIdea),
    agreedToRules: bool(value.agreedToRules),
    applicantEmail: firstString('', value.applicantEmail, value.email),
    teamDescription: firstString('', value.teamDescription, value.description),
    applicantFirstName: firstString('', value.applicantFirstName, value.firstName),
    applicantLastName: firstString('', value.applicantLastName, value.lastName),
    status: toApplicationStatus(value.status),
    createdAt: firstString('', value.createdAt, value.created_at),
    updatedAt: firstString('', value.updatedAt, value.updated_at),
  };
}

function mapTeam(value: unknown): AdminTeam {
  if (!isRecord(value)) throw new Error('Malformed team');
  const id = firstString('', value.id, value.teamId, value._id);
  if (!id) throw new Error('Malformed team: missing id');
  const members = collectionFrom(value, ['members']);
  return {
    id,
    name: firstString('Unnamed team', value.name, value.teamName),
    description: firstString('', value.description, value.teamDescription),
    status: str(value.status, 'active'),
    isFinalist: bool(value.isFinalist ?? value.finalist),
    memberCount: num(value.memberCount, members.length),
    createdAt: firstString('', value.createdAt, value.created_at),
    updatedAt: firstString('', value.updatedAt, value.updated_at),
  };
}

function mapAdminTeamMember(value: unknown): AdminTeamMember {
  if (!isRecord(value)) throw new Error('Malformed team member');
  const id = firstString('', value.id, value.memberId, value._id);
  if (!id) throw new Error('Malformed team member: missing id');
  return {
    id,
    teamId: str(value.teamId),
    name: firstString('Unnamed member', value.name, value.fullName, value.memberName),
    email: firstString('', value.email, value.memberEmail),
    role: toTeamMemberRole(value.role),
    userId: strOrNull(value.userId ?? value.user_id),
    onboardingStatus: firstString(
      'unknown',
      value.onboardingStatus,
      value.inviteStatus,
      value.status,
    ).toLowerCase(),
    createdAt: firstString('', value.createdAt, value.created_at),
  };
}

function mapManagedUser(value: unknown): ManagedUser {
  if (!isRecord(value)) throw new Error('Malformed user');
  const id = firstString('', value.id, value.userId, value._id);
  if (!id) throw new Error('Malformed user: missing id');
  const status = str(value.status, bool(value.isActive, true) ? 'active' : 'inactive');
  return {
    id,
    email: str(value.email),
    firstName: firstString('', value.firstName, value.first_name),
    lastName: firstString('', value.lastName, value.last_name),
    role: str(value.role, 'user'),
    status,
    isActive: bool(value.isActive, status.toLowerCase() !== 'inactive'),
    createdAt: firstString('', value.createdAt, value.created_at),
    updatedAt: firstString('', value.updatedAt, value.updated_at),
  };
}

function mapRole(value: unknown, isDefault: boolean): AdminRole {
  if (!isRecord(value)) throw new Error('Malformed role');
  const name = firstString('', value.name, value.role, value.id);
  if (!name) throw new Error('Malformed role: missing name');
  return {
    id: firstString(name, value.id, value.roleId),
    name,
    description: str(value.description),
    permissions: strArray(value.permissions) ?? [],
    isDefault: bool(value.isDefault, isDefault),
  };
}

// ─── Session ────────────────────────────────────────────────────────────────

export type SessionResult =
  | { readonly status: 'authenticated'; readonly user: AdminSessionUser }
  | { readonly status: 'unauthenticated' }
  | { readonly status: 'forbidden'; readonly message: string };

export async function getSession(): Promise<SessionResult> {
  try {
    const body: unknown = await adminApi.get('api/auth/me').json();
    if (!isRecord(body) || body.success !== true || !isRecord(body.user)) {
      return { status: 'unauthenticated' };
    }
    const user = body.user;
    const roleRecord = isRecord(user.role) ? user.role : null;
    const role = roleRecord ? str(roleRecord.name) : str(user.role);
    if (role !== 'admin' && role !== 'custom') {
      return {
        status: 'forbidden',
        message: 'This account does not have admin access.',
      };
    }
    return {
      status: 'authenticated',
      user: {
        id: str(user.id),
        email: str(user.email),
        firstName: str(user.firstName),
        lastName: str(user.lastName),
        role,
        status: str(user.status),
        permissions:
          strArray(user.permissions) ??
          (roleRecord ? strArray(roleRecord.permissions) : null) ??
          [],
      },
    };
  } catch (error) {
    if (
      error instanceof HTTPError &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      return { status: 'unauthenticated' };
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<AdminSessionUser> {
  const body: unknown = await adminApi
    .post('api/admin/login', { json: { email, password } })
    .json();
  if (!isRecord(body) || body.success !== true || !isRecord(body.user)) {
    throw new Error(
      isRecord(body) && typeof body.message === 'string' ? body.message : 'Login failed',
    );
  }
  const user = body.user;
  const roleRecord = isRecord(user.role) ? user.role : null;
  return {
    id: str(user.id),
    email: str(user.email),
    firstName: str(user.firstName),
    lastName: str(user.lastName),
    role: roleRecord ? str(roleRecord.name) : str(user.role),
    status: 'ACTIVE',
    permissions:
      strArray(user.permissions) ??
      (roleRecord ? strArray(roleRecord.permissions) : null) ??
      [],
  };
}

export async function logout(): Promise<void> {
  await adminApi.post('api/auth/logout');
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export async function getStats(): Promise<DashboardStats> {
  const body: unknown = await adminApi.get('api/admin/stats').json();
  const data = expectData(body);
  if (!isRecord(data)) throw new Error('Malformed stats response');
  const applications = isRecord(data.applications) ? data.applications : {};
  const teams = isRecord(data.teams) ? data.teams : {};
  const submissions = isRecord(data.submissions) ? data.submissions : {};
  const coupons = isRecord(data.coupons) ? data.coupons : {};
  const campaigns = isRecord(data.campaigns) ? data.campaigns : {};
  const users = isRecord(data.users) ? data.users : {};
  return {
    asOf: str(data.asOf),
    applications: {
      total: num(applications.total),
      byStatus: strNumRecord(applications.byStatus),
      conversionRate: num(applications.conversionRate),
    },
    teams: {
      total: num(teams.total),
      onboarded: num(teams.onboarded),
      pendingOnboarding: num(teams.pendingOnboarding),
      finalists: num(teams.finalists),
      totalMembers: num(teams.totalMembers),
    },
    submissions: {
      total: num(submissions.total),
      byStatus: strNumRecord(submissions.byStatus),
      submitted: num(submissions.submitted),
    },
    coupons: {
      totalSlots: num(coupons.totalSlots),
      usedSlots: num(coupons.usedSlots),
      remainingSlots: num(coupons.remainingSlots),
      totalAllocations: num(coupons.totalAllocations),
    },
    campaigns: {
      byStatus: asArray(campaigns.byStatus).map((row) => {
        const r = isRecord(row) ? row : {};
        return {
          status: str(r.status),
          campaigns: num(r.campaigns),
          emailsSent: num(r.emailsSent),
          emailsFailed: num(r.emailsFailed),
        };
      }),
      totalEmailsSent: num(campaigns.totalEmailsSent),
    },
    users: {
      total: num(users.total),
      subscribers: num(users.subscribers),
      activeSubscribers: num(users.activeSubscribers),
    },
  };
}

// ─── Applications ───────────────────────────────────────────────────────────

export async function listApplications(params: {
  status?: ApplicationStatus | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<AdminApplication>> {
  const searchParams: Record<string, string | number> = {};
  if (params.status) searchParams.status = params.status;
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi.get('api/applications', { searchParams }).json();
  const data = expectData(body);
  const items = collectionFrom(data, ['applications', 'items', 'results']).map(
    mapApplication,
  );
  return { items, pagination: paginationFrom(body, data, items.length) };
}

export async function getApplication(id: string): Promise<AdminApplication> {
  const body: unknown = await adminApi
    .get(`api/applications/${encodeURIComponent(id)}`)
    .json();
  const data = expectData(body);
  const application =
    isRecord(data) && isRecord(data.application) ? data.application : data;
  return mapApplication(application);
}

export async function updateApplicationStatus(
  id: string,
  status: Exclude<ApplicationStatus, 'pending'>,
): Promise<void> {
  await adminApi.patch(`api/applications/${encodeURIComponent(id)}/status`, {
    json: { status },
  });
}

export async function batchUpdateApplicationStatus(
  updates: readonly {
    readonly id: string;
    readonly status: Exclude<ApplicationStatus, 'pending'>;
  }[],
): Promise<void> {
  await adminApi.patch('api/applications/batch/update', { json: updates });
}

export async function deleteApplication(id: string): Promise<void> {
  await adminApi.delete(`api/applications/${encodeURIComponent(id)}`);
}

// ─── Teams and members ──────────────────────────────────────────────────────

export async function listTeams(params: {
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<AdminTeam>> {
  const searchParams: Record<string, number> = {};
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi.get('api/teams', { searchParams }).json();
  const data = expectData(body);
  const items = collectionFrom(data, ['teams', 'items', 'results']).map(mapTeam);
  return { items, pagination: paginationFrom(body, data, items.length) };
}

export async function listFinalistTeams(): Promise<readonly AdminTeam[]> {
  const body: unknown = await adminApi.get('api/teams/finalists').json();
  const data = expectData(body);
  return collectionFrom(data, ['teams', 'finalists', 'items']).map(mapTeam);
}

export async function getTeam(id: string): Promise<AdminTeam> {
  const body: unknown = await adminApi.get(`api/teams/${encodeURIComponent(id)}`).json();
  const data = expectData(body);
  const team = isRecord(data) && isRecord(data.team) ? data.team : data;
  return mapTeam(team);
}

export async function toggleTeamFinalist(id: string): Promise<void> {
  await adminApi.patch(`api/teams/${encodeURIComponent(id)}/finalist`);
}

export async function deleteTeam(id: string): Promise<void> {
  await adminApi.delete(`api/teams/${encodeURIComponent(id)}`);
}

export async function listAdminTeamMembers(
  teamId: string,
): Promise<readonly AdminTeamMember[]> {
  const body: unknown = await adminApi
    .get('api/team-members', {
      searchParams: { teamId, limit: '100', offset: '0' },
    })
    .json();
  const data = expectData(body);
  return collectionFrom(data, ['members', 'items', 'results']).map(mapAdminTeamMember);
}

export async function updateAdminTeamMemberRole(
  id: string,
  role: AdminTeamMemberRole,
): Promise<void> {
  await adminApi.patch(`api/team-members/${encodeURIComponent(id)}/role`, {
    json: { role },
  });
}

export async function deleteAdminTeamMember(id: string): Promise<void> {
  await adminApi.delete(`api/team-members/${encodeURIComponent(id)}`);
}

// ─── Users and access ───────────────────────────────────────────────────────

export async function listDefaultRoles(): Promise<readonly AdminRole[]> {
  const body: unknown = await adminApi.get('api/admin/roles').json();
  const data = expectData(body);
  return collectionFrom(data, ['roles', 'items']).map((role) => mapRole(role, true));
}

export async function listCustomRoles(): Promise<readonly AdminRole[]> {
  const body: unknown = await adminApi.get('api/admin/custom-roles').json();
  const data = expectData(body);
  return collectionFrom(data, ['roles', 'customRoles', 'items']).map((role) =>
    mapRole(role, false),
  );
}

export async function createCustomRole(input: CustomRoleInput): Promise<void> {
  await adminApi.post('api/admin/custom-roles', { json: input });
}

export async function updateCustomRole(
  id: string,
  input: CustomRoleInput,
): Promise<void> {
  await adminApi.patch(`api/admin/custom-roles/${encodeURIComponent(id)}`, {
    json: input,
  });
}

export async function deleteCustomRole(id: string): Promise<void> {
  await adminApi.delete(`api/admin/custom-roles/${encodeURIComponent(id)}`);
}

export async function listAdminUsers(): Promise<readonly ManagedUser[]> {
  const body: unknown = await adminApi.get('api/admin/users').json();
  const data = expectData(body);
  return collectionFrom(data, ['users', 'admins', 'items']).map(mapManagedUser);
}

export async function createAdminUser(input: AdminUserInput): Promise<void> {
  await adminApi.post('api/admin/users', { json: input });
}

export async function updateAdminUserRole(
  id: string,
  input: { readonly role: string; readonly customRoleId?: string },
): Promise<void> {
  await adminApi.patch(`api/admin/users/${encodeURIComponent(id)}/role`, {
    json: input,
  });
}

export async function deactivateAdminUser(id: string): Promise<void> {
  await adminApi.patch(`api/admin/users/${encodeURIComponent(id)}/deactivate`);
}

export async function listUsers(params: {
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<ManagedUser>> {
  const searchParams: Record<string, number> = {};
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi.get('api/users', { searchParams }).json();
  const data = expectData(body);
  const items = collectionFrom(data, ['users', 'items', 'results']).map(mapManagedUser);
  return { items, pagination: paginationFrom(body, data, items.length) };
}

export async function getUser(id: string): Promise<ManagedUser> {
  const body: unknown = await adminApi.get(`api/users/${encodeURIComponent(id)}`).json();
  const data = expectData(body);
  const user = isRecord(data) && isRecord(data.user) ? data.user : data;
  return mapManagedUser(user);
}

export async function createUser(input: ManagedUserInput): Promise<void> {
  await adminApi.post('api/users', { json: input });
}

export async function updateUser(id: string, input: ManagedUserInput): Promise<void> {
  await adminApi.put(`api/users/${encodeURIComponent(id)}`, { json: input });
}

export async function deleteUser(id: string): Promise<void> {
  await adminApi.delete(`api/users/${encodeURIComponent(id)}`);
}

// ─── Operations ─────────────────────────────────────────────────────────────

export async function sendSubmissionReminders(): Promise<void> {
  await adminApi.post('api/admin/reminders/submission');
}

export async function sendOnboardingReminders(): Promise<void> {
  await adminApi.post('api/admin/reminders/onboarding');
}

// ─── Submissions ────────────────────────────────────────────────────────────

export interface ListResult<T> {
  readonly items: readonly T[];
  readonly pagination: Pagination;
}

export async function listSubmissions(params: {
  status?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<ProjectSubmission>> {
  const searchParams: Record<string, string | number> = {};
  if (params.status) searchParams.status = params.status;
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi.get('api/submissions', { searchParams }).json();
  const data = expectData(body);
  return {
    items: asArray(data).map(mapSubmission),
    pagination: expectPagination(body),
  };
}

export async function getSubmission(id: string): Promise<ProjectSubmission> {
  const body: unknown = await adminApi.get(`api/submissions/${id}`).json();
  return mapSubmission(expectData(body));
}

export async function reviewSubmission(
  id: string,
  input: { status: string; reviewerNotes?: string },
): Promise<void> {
  await adminApi.patch(`api/submissions/${id}/review`, { json: input });
}

export async function deleteSubmission(id: string): Promise<void> {
  await adminApi.delete(`api/submissions/${id}`);
}

// ─── Coupons ────────────────────────────────────────────────────────────────

export async function listCouponInventory(params: {
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<CouponInventory>> {
  const searchParams: Record<string, string | number> = {};
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi
    .get('api/coupons/inventory', { searchParams })
    .json();
  const data = expectData(body);
  return {
    items: asArray(data).map(mapInventory),
    pagination: expectPagination(body),
  };
}

export async function createCouponInventory(input: {
  totalSlots: number;
  provider?: string;
}): Promise<CouponInventory> {
  const body: unknown = await adminApi
    .post('api/coupons/inventory', { json: input })
    .json();
  return mapInventory(expectData(body));
}

export async function allocateCoupon(input: {
  inventoryId: string;
  teamId: string;
  couponCode: string;
}): Promise<CouponAllocation> {
  const body: unknown = await adminApi
    .post('api/coupons/allocate', { json: input })
    .json();
  const data = expectData(body);
  const allocation = isRecord(data) && isRecord(data.allocation) ? data.allocation : data;
  if (!isRecord(allocation)) throw new Error('Malformed allocation response');
  return {
    id: str(allocation.id),
    inventoryId: str(allocation.inventoryId),
    teamId: str(allocation.teamId),
    couponCode: str(allocation.couponCode),
    isUsed: bool(allocation.isUsed),
    usedAt: strOrNull(allocation.usedAt),
    createdAt: str(allocation.createdAt),
  };
}

export async function markCouponUsed(allocationId: string): Promise<void> {
  await adminApi.patch(`api/coupons/${allocationId}/use`);
}

// ─── Email & campaigns ──────────────────────────────────────────────────────

export async function listEmailTemplates(): Promise<readonly EmailTemplateInfo[]> {
  const body: unknown = await adminApi.get('api/email/templates').json();
  if (!isRecord(body) || !Array.isArray(body.templates)) {
    throw new Error('Malformed templates response');
  }
  return body.templates.map((item) => {
    const t = isRecord(item) ? item : {};
    return {
      name: str(t.name),
      description: str(t.description),
      requiredFields: strArray(t.requiredFields) ?? [],
    };
  });
}

export async function sendTemplateEmail(input: {
  to: string;
  template: string;
  templateData?: Record<string, unknown>;
}): Promise<void> {
  await adminApi.post('api/email/send', { json: input });
}

export async function listCampaigns(params: {
  status?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<EmailCampaign>> {
  const searchParams: Record<string, string | number> = {};
  if (params.status) searchParams.status = params.status;
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi.get('api/campaigns', { searchParams }).json();
  const data = expectData(body);
  return {
    items: asArray(data).map(mapCampaign),
    pagination: expectPagination(body),
  };
}

export interface CampaignInput {
  name: string;
  subject: string;
  content: string;
  htmlContent: string;
  audience: CampaignAudience;
  customRecipients?: readonly string[];
  scheduledFor?: string;
}

export async function createCampaign(input: CampaignInput): Promise<EmailCampaign> {
  const body: unknown = await adminApi.post('api/campaigns', { json: input }).json();
  return mapCampaign(expectData(body));
}

export async function updateCampaign(
  id: string,
  input: Partial<CampaignInput>,
): Promise<void> {
  await adminApi.patch(`api/campaigns/${id}`, { json: input });
}

export async function deleteCampaign(id: string): Promise<void> {
  await adminApi.delete(`api/campaigns/${id}`);
}

export async function sendCampaign(id: string): Promise<void> {
  await adminApi.post(`api/campaigns/${id}/send`);
}

export async function testSendCampaign(id: string, email: string): Promise<void> {
  await adminApi.post(`api/campaigns/${id}/test-send`, { json: { email } });
}

export async function cancelCampaign(id: string): Promise<void> {
  await adminApi.post(`api/campaigns/${id}/cancel`);
}

export async function listSubscribers(params: {
  unsubscribed?: boolean | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
}): Promise<ListResult<Subscriber>> {
  const searchParams: Record<string, string | number | boolean> = {};
  if (params.unsubscribed !== undefined) searchParams.unsubscribed = params.unsubscribed;
  if (params.limit !== undefined) searchParams.limit = params.limit;
  if (params.offset !== undefined) searchParams.offset = params.offset;
  const body: unknown = await adminApi
    .get('api/campaigns/subscribers', { searchParams })
    .json();
  const data = expectData(body);
  return {
    items: asArray(data).map(mapSubscriber),
    pagination: expectPagination(body),
  };
}

export async function sendFinalistInvite(input: {
  name?: string;
  subject: string;
  htmlContent: string;
  content?: string;
}): Promise<void> {
  await adminApi.post('api/campaigns/finalist-invite', { json: input });
}

// ─── Shared error handling ──────────────────────────────────────────────────

export async function adminErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body: unknown = await error.response.clone().json();
      if (isRecord(body) && typeof body.message === 'string' && body.message.trim()) {
        return body.message;
      }
    } catch {
      // Unparseable error body — fall through.
    }
    if (error.response.status === 401) return 'Your session expired. Sign in again.';
    if (error.response.status === 403) return 'You do not have permission to do that.';
    return `The server refused the request (HTTP ${String(error.response.status)}).`;
  }
  if (error instanceof TimeoutError) {
    return 'The request timed out. Check your connection and try again.';
  }
  return error instanceof Error && error.message
    ? error.message
    : 'Something went wrong.';
}

/** URL for CSV exports; opens with the browser's cookie-authenticated download. */
export function exportUrl(path: string): string {
  return new URL(path, ADMIN_API_BASE_URL).toString();
}
