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

export interface AdminSessionUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly status: string;
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
    const role = str(user.role);
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
  return {
    id: str(user.id),
    email: str(user.email),
    firstName: str(user.firstName),
    lastName: str(user.lastName),
    role: str(user.role),
    status: 'ACTIVE',
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
