import ky, { HTTPError, TimeoutError } from 'ky';
import { httpErrorMessage } from '@/lib/api-error';

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
const MEMBER_EMAIL_KEY = 'techignite.team.member-email';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function getStoredMemberEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(MEMBER_EMAIL_KEY);
}

function setStoredMemberEmail(email: string): void {
  if (typeof window === 'undefined') return;
  const normalized = email.trim().toLowerCase();
  if (normalized.length > 0) {
    window.sessionStorage.setItem(MEMBER_EMAIL_KEY, normalized);
  }
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(MEMBER_EMAIL_KEY);
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
export type TeamMemberRole = 'LEAD' | 'MEMBER' | 'MENTOR';
export type TeamMemberOnboardingStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'UNKNOWN';

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: TeamMemberRole;
  readonly onboardingStatus: TeamMemberOnboardingStatus;
  readonly userId: string | null;
  readonly invitedAt: string | null;
  readonly joinedAt: string | null;
}

export interface TeamMemberList {
  readonly members: readonly TeamMember[];
  readonly total: number;
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

export type TeamInviteRole = 'lead' | 'member' | 'mentor';

export interface InviteTeamMemberInput {
  readonly memberEmail: string;
  readonly memberName?: string;
  readonly role?: TeamInviteRole;
}

export interface OnboardingVerification {
  readonly teamId: string;
  readonly teamName: string;
  readonly memberId: string;
  readonly memberName: string;
  readonly memberEmail: string;
  readonly role: TeamMemberRole;
  readonly expiresAt: string | null;
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

function toTeamMemberRole(value: unknown): TeamMemberRole {
  const normalized = typeof value === 'string' ? value.toUpperCase() : '';
  switch (normalized) {
    case 'LEAD':
    case 'MENTOR':
      return normalized;
    case 'MEMBER':
    default:
      return 'MEMBER';
  }
}

function toOnboardingStatus(record: Record<string, unknown>): TeamMemberOnboardingStatus {
  const normalized = firstString(record, [
    'onboardingStatus',
    'inviteStatus',
    'membershipStatus',
  ]).toUpperCase();
  switch (normalized) {
    case 'PENDING':
    case 'INVITED':
      return 'PENDING';
    case 'ACTIVE':
    case 'ACTIVATED':
    case 'ACCEPTED':
      return 'ACTIVE';
    case 'EXPIRED':
      return 'EXPIRED';
    default:
      return optionalString(record, ['userId', 'user_id']) !== null
        ? 'ACTIVE'
        : 'PENDING';
  }
}

function mapMember(value: unknown, index: number): TeamMember {
  if (!isRecord(value)) throw new Error('Malformed team member');
  const email = firstString(value, ['email', 'memberEmail']);
  return {
    id: firstString(value, ['id', 'memberId', '_id']) || `member-${String(index)}`,
    name:
      firstString(value, ['name', 'fullName', 'memberName']) || email || 'Unnamed member',
    email,
    role: toTeamMemberRole(value.role),
    onboardingStatus: toOnboardingStatus(value),
    userId: optionalString(value, ['userId', 'user_id']),
    invitedAt: optionalString(value, ['invitedAt', 'invited_at', 'createdAt']),
    joinedAt: optionalString(value, ['joinedAt', 'joined_at', 'activatedAt']),
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
  const fullName = [firstString(target, ['firstName']), firstString(target, ['lastName'])]
    .filter((part) => part.length > 0)
    .join(' ');

  return {
    id: firstString(target, ['id', 'teamId', '_id']),
    name:
      firstString(target, ['teamName', 'name', 'fullName']) || fullName || 'Your team',
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

function sessionFromBody(body: unknown, fallbackEmail: string): LoginResult {
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
  const member = isRecord(container.member)
    ? container.member
    : isRecord(container.user)
      ? container.user
      : container;
  setStoredMemberEmail(firstString(member, ['email', 'memberEmail']) || fallbackEmail);

  const team = isRecord(container.team)
    ? mapTeam(container.team)
    : isRecord(data) && ('teamName' in data || 'members' in data)
      ? mapTeam(data)
      : null;

  return {
    token,
    sessionToken: firstString(container, ['sessionToken']) || token,
    team,
  };
}

function mapOnboardingVerification(value: unknown): OnboardingVerification {
  if (!isRecord(value)) throw new Error('Malformed onboarding response');
  if (value.valid === false) throw new Error('This invite is no longer valid.');

  const team = isRecord(value.team) ? value.team : value;
  const member = isRecord(value.member)
    ? value.member
    : isRecord(value.teamMember)
      ? value.teamMember
      : value;

  return {
    teamId: firstString(team, ['id', 'teamId', '_id']) || firstString(value, ['teamId']),
    teamName:
      firstString(team, ['name', 'teamName']) ||
      firstString(value, ['teamName']) ||
      'Your team',
    memberId:
      firstString(member, ['id', 'memberId', '_id']) || firstString(value, ['memberId']),
    memberName:
      firstString(member, ['name', 'fullName', 'memberName']) ||
      firstString(value, ['memberName']),
    memberEmail:
      firstString(member, ['email', 'memberEmail']) ||
      firstString(value, ['memberEmail', 'email']),
    role: toTeamMemberRole(member.role ?? value.role),
    expiresAt:
      optionalString(value, ['expiresAt', 'expires_at']) ??
      optionalString(member, ['expiresAt', 'expires_at']),
  };
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<LoginResult> {
  const body: unknown = await teamApi.post('api/auth/login', { json: input }).json();
  return sessionFromBody(body, input.email);
}

export function logout(): void {
  clearStoredToken();
}

/** Parse a single embedded team record (as returned by GET /api/auth/me) into a TeamProfile-shaped value. */
function mapEmbeddedTeam(record: Record<string, unknown>): TeamProfile {
  const role = firstString(record, ['role']);
  const status = toTeamStatus(role);
  return {
    id: firstString(record, ['id', 'teamId', '_id']),
    name: firstString(record, ['teamName', 'name']),
    description: firstString(record, ['description', 'teamDescription']),
    status,
    projectTitle: firstString(record, ['projectTitle', 'title']),
    projectDescription: firstString(record, ['projectDescription', 'description']),
    technologies: toStringArray(record.technologies ?? record.techStack),
    demoUrl: firstString(record, ['demoUrl']),
    repositoryUrl: firstString(record, ['repositoryUrl', 'repoUrl']),
    submittedAt: optionalString(record, ['submittedAt', 'submitted_at', 'lockedAt']),
    members: [],
    createdAt: optionalString(record, ['createdAt', 'created_at']),
    updatedAt: optionalString(record, ['updatedAt', 'updated_at']),
  };
}

/** GET /api/auth/me — the signed-in team for the current token. */
export async function getSession(): Promise<TeamProfile | undefined> {
  const body: unknown = await teamApi.get('api/auth/me').json();
  const data = expectData(body);
  const container = isRecord(data) ? data : isRecord(body) ? body : {};
  const userRecord = isRecord(container.user) ? container.user : container;
  const teamsRaw: readonly unknown[] = Array.isArray(userRecord.teams)
    ? userRecord.teams
    : [];
  const firstTeam = teamsRaw[0];
  return firstTeam && isRecord(firstTeam) ? mapEmbeddedTeam(firstTeam) : undefined;
}

// ─── Team profile & submission ──────────────────────────────────────────────

/** GET /api/teams — team profile plus its submission fields. */
export async function getTeam(): Promise<TeamProfile> {
  const body: unknown = await teamApi.get('api/teams').json();
  const data = expectData(body);
  // The endpoint returns a paginated list of the caller's teams; the dashboard
  // shows the signed-in user's own team (newest first).
  const team: unknown = Array.isArray(data)
    ? (data as readonly unknown[])[0]
    : isRecord(data) && Array.isArray(data.teams)
      ? (data.teams as readonly unknown[])[0]
      : data;
  if (team === undefined) {
    throw new Error('No team is linked to this account yet.');
  }
  const profile = mapTeam(team);
  // The list payload omits the roster, but the dashboard's sidebar, overview
  // and submission pages all read team.members. Hydrate it from the roster
  // endpoint so those views have complete team details.
  if (profile.id.length > 0 && profile.members.length === 0) {
    const { members } = await getTeamMembers(profile.id);
    return { ...profile, members };
  }
  return profile;
}

export async function getTeamMembers(teamId: string): Promise<TeamMemberList> {
  const body: unknown = await teamApi
    .get('api/team-members', {
      searchParams: { teamId, limit: '100', offset: '0' },
    })
    .json();
  const data = expectData(body);
  const container = isRecord(data) ? data : {};
  const collection = Array.isArray(data)
    ? data
    : Array.isArray(container.members)
      ? container.members
      : Array.isArray(container.items)
        ? container.items
        : [];
  const members = collection.map(mapMember);
  const total =
    typeof container.total === 'number' && Number.isFinite(container.total)
      ? container.total
      : members.length;
  return { members, total };
}

export async function inviteTeamMember(
  teamId: string,
  input: InviteTeamMemberInput,
): Promise<void> {
  await teamApi.post(`api/teams/${encodeURIComponent(teamId)}/invite`, {
    json: input,
  });
}

export async function verifyOnboardingToken(
  token: string,
): Promise<OnboardingVerification> {
  const normalized = token.trim();
  if (normalized.length === 0) throw new Error('The invite token is missing.');
  const body: unknown = await teamApi
    .get('api/onboarding/verify', { searchParams: { token: normalized } })
    .json();
  return mapOnboardingVerification(expectData(body));
}

export async function activateOnboarding(
  token: string,
  memberEmail: string,
  password?: string,
): Promise<LoginResult> {
  const normalized = token.trim();
  if (normalized.length === 0) throw new Error('The invite token is missing.');
  const body: unknown = await teamApi
    .post('api/onboarding/activate', {
      json: password ? { token: normalized, password } : { token: normalized },
    })
    .json();
  return sessionFromBody(body, memberEmail);
}

export async function updateTeam(input: TeamUpdateInput): Promise<void> {
  await teamApi.patch('api/teams', { json: input });
}

export async function connectRepository(repositoryUrl: string): Promise<void> {
  await teamApi.patch('api/teams/repo', { json: { repoUrl: repositoryUrl } });
}

export async function submitTeam(): Promise<void> {
  await teamApi.post('api/teams/submit');
}

// ─── Error messages ────────────────────────────────────────────────────────

/**
 * Human-readable message for a failed team API call. Login passes its own
 * 401 message because "session expired" would be misleading there.
 */
export async function teamErrorMessage(
  error: unknown,
  unauthorizedMessage = 'Your session expired. Sign in again.',
  messages: {
    readonly forbidden?: string;
    readonly conflict?: string;
    readonly gone?: string;
    readonly notFound?: string;
  } = {},
): Promise<string> {
  if (error instanceof HTTPError) {
    const message = await httpErrorMessage(error);
    if (message.length > 0) {
      return message;
    }
    if (error.response.status === 401) return unauthorizedMessage;
    if (error.response.status === 404) {
      return messages.notFound ?? 'The requested resource could not be found.';
    }
    if (error.response.status === 403) {
      return (
        messages.forbidden ??
        'Your team is locked, so this action is no longer available.'
      );
    }
    if (error.response.status === 409) {
      return messages.conflict ?? 'That request conflicts with existing team data.';
    }
    if (error.response.status === 410) {
      return messages.gone ?? 'This link has expired and can no longer be used.';
    }
    if (error.response.status === 429) {
      return 'Too many requests. Wait a moment and try again.';
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
