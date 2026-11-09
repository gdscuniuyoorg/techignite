import ky, { HTTPError, TimeoutError } from 'ky';

/**
 * Client for the team-facing hackathon API. The base URL is env-driven so a
 * local backend (http://localhost:3030) can be used in development; see
 * .env.local (git-ignored) and spec 0004.
 *
 * Auth is a bearer JWT returned by POST /api/auth/login. It is kept in
 * sessionStorage (cleared when the tab closes) and attached to every request.
 */
const TEAM_API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'https://api.techignite.net/';

const TOKEN_KEY = 'techignite.team.token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export function hasStoredToken(): boolean {
  return getStoredToken() !== null;
}

export const teamApi = ky.create({
  baseUrl: TEAM_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = getStoredToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});

// ─── Types (mirrors the draft OpenAPI contract, v1.0.0) ─────────────────────

export type TeamStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'LOCKED' | 'SUBMITTED';

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  /** Backend enum: `LEAD` or `MEMBER`. */
  readonly role: string;
}

export interface TeamProfile {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: TeamStatus;
  readonly projectTitle: string;
  readonly projectDescription: string;
  readonly technologies: readonly string[];
  readonly demoUrl: string;
  readonly repositoryUrl: string;
  readonly submittedAt: string | null;
  readonly members: readonly TeamMember[];
  readonly createdAt: string | null;
  readonly updatedAt: string | null;
}

export interface LoginInput {
  readonly email: string;
  readonly password: string;
}

export interface LoginResult {
  readonly token: string;
  readonly sessionToken?: string;
  readonly team: TeamProfile | null;
}

export interface TeamUpdateInput {
  readonly projectTitle?: string;
  readonly projectDescription?: string;
  readonly techStack?: string;
  readonly demoUrl?: string;
}

// ─── Runtime narrowing ──────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function firstString(record: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return '';
}

function optionalString(
  record: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  const value = firstString(record, keys);
  return value.length > 0 ? value : null;
}

function toStringArray(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return [];
}

function toTeamStatus(value: unknown): TeamStatus {
  const normalized = typeof value === 'string' ? value.toUpperCase() : '';
  switch (normalized) {
    case 'ACTIVE':
    case 'PENDING':
    case 'REJECTED':
    case 'LOCKED':
    case 'SUBMITTED':
      return normalized;
    default:
      return 'PENDING';
  }
}

function mapMember(value: unknown, index: number): TeamMember {
  if (!isRecord(value)) throw new Error('Malformed team member');
  return {
    id: firstString(value, ['id', 'memberId', '_id']) || `member-${String(index)}`,
    name: firstString(value, ['name', 'fullName', 'memberName']) || 'Unnamed member',
    email: firstString(value, ['email', 'memberEmail']),
    role: firstString(value, ['role']).toUpperCase() === 'LEAD' ? 'LEAD' : 'MEMBER',
  };
}

export function mapTeam(value: unknown): TeamProfile {
  if (!isRecord(value)) throw new Error('Malformed team profile');
  const target = isRecord(value.team)
    ? value.team
    : isRecord(value.user)
      ? value.user
      : value;
  const members = target.members;
  const fullName = [
    firstString(target, ['firstName']),
    firstString(target, ['lastName']),
  ]
    .filter((part) => part.length > 0)
    .join(' ');

  return {
    id: firstString(target, ['id', 'teamId', '_id']),
    name:
      firstString(target, ['teamName', 'name', 'fullName']) ||
      fullName ||
      'Your team',
    description: firstString(target, ['description', 'teamDescription']),
    status: toTeamStatus(target.status),
    projectTitle: firstString(target, ['projectTitle', 'title']),
    projectDescription: firstString(target, ['projectDescription', 'description']),
    technologies: toStringArray(target.technologies ?? target.techStack),
    demoUrl: firstString(target, ['demoUrl']),
    repositoryUrl: firstString(target, ['repositoryUrl', 'repoUrl']),
    submittedAt: optionalString(target, ['submittedAt', 'submitted_at', 'lockedAt']),
    members: Array.isArray(members) ? members.map(mapMember) : [],
    createdAt: optionalString(target, ['createdAt', 'created_at']),
    updatedAt: optionalString(target, ['updatedAt', 'updated_at']),
  };
}

/** Message from the documented error envelope: `{ success, error: { message } }`. */
function errorMessageFromBody(body: unknown): string {
  if (!isRecord(body)) return '';
  const error = body.error;
  if (isRecord(error) && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }
  return typeof body.message === 'string' ? body.message : '';
}

function expectData(body: unknown): unknown {
  if (!isRecord(body) || body.success !== true) {
    throw new Error(errorMessageFromBody(body) || 'Malformed API response');
  }
  return 'data' in body && body.data !== undefined && body.data !== null
    ? body.data
    : body;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<LoginResult> {
  const body: unknown = await teamApi.post('api/auth/login', { json: input }).json();
  const data = expectData(body);

  const container = isRecord(data) ? data : isRecord(body) ? body : {};

  const token =
    typeof data === 'string'
      ? data
      : firstString(container, ['sessionToken', 'token', 'accessToken', 'jwt']);
  if (token.length === 0) {
    throw new Error('The server did not return a session token.');
  }
  setStoredToken(token);

  const sessionToken = firstString(container, ['sessionToken']) || token;

  const team =
    isRecord(container.team)
      ? mapTeam(container.team)
      : isRecord(container.user)
        ? mapTeam(container.user)
        : isRecord(data) && ('id' in data || 'name' in data)
          ? mapTeam(data)
          : null;

  return { token, sessionToken, team };
}

export function logout(): void {
  clearStoredToken();
}

/** GET /api/auth/me — the signed-in team for the current token. */
export async function getSession(): Promise<TeamProfile> {
  const body: unknown = await teamApi.get('api/auth/me').json();
  return mapTeam(expectData(body));
}

// ─── Team profile & submission ──────────────────────────────────────────────

/** GET /api/team — team profile plus its submission fields. */
export async function getTeam(): Promise<TeamProfile> {
  const body: unknown = await teamApi.get('api/team').json();
  return mapTeam(expectData(body));
}

export async function updateTeam(input: TeamUpdateInput): Promise<void> {
  await teamApi.patch('api/team', { json: input });
}

export async function connectRepository(repositoryUrl: string): Promise<void> {
  await teamApi.patch('api/team/repo', { json: { repoUrl: repositoryUrl } });
}

export async function submitTeam(): Promise<void> {
  await teamApi.post('api/team/submit');
}

// ─── Error messages ────────────────────────────────────────────────────────

/**
 * Human-readable message for a failed team API call. Login passes its own
 * 401 message because "session expired" would be misleading there.
 */
export async function teamErrorMessage(
  error: unknown,
  unauthorizedMessage = 'Your session expired. Sign in again.',
): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body: unknown = await error.response.clone().json();
      const message = errorMessageFromBody(body);
      if (message.length > 0) {
        return message;
      }
    } catch {
      // Unparseable error body — fall through to the status-based message.
    }
    if (error.response.status === 401) return unauthorizedMessage;
    if (error.response.status === 403) {
      return 'Your team is locked, so this action is no longer available.';
    }
    if (error.response.status === 409) {
      return 'That team name is already taken.';
    }
    return `The server refused the request (HTTP ${String(error.response.status)}).`;
  }
  if (error instanceof TimeoutError) {
    return 'The request timed out. Check your connection and try again.';
  }
  return error instanceof Error && error.message
    ? error.message
    : 'Something went wrong.';
}

/** True when the failure is an expired/invalid bearer token. */
export function isUnauthorized(error: unknown): boolean {
  return error instanceof HTTPError && error.response.status === 401;
}
