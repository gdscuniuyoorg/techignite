import type { TeamProfile } from '@/lib/team-api';
import type { DashboardSubmissionStatus } from './submission-status';

/**
 * Map the backend team status onto the dashboard's submission status.
 * The API can report `SUBMITTED` after locking even though the team status
 * enum usually shows `LOCKED`.
 */
export function toSubmissionStatus(team: TeamProfile): DashboardSubmissionStatus {
  switch (team.status) {
    case 'LOCKED':
    case 'SUBMITTED':
      return 'submitted';
    case 'REJECTED':
      return 'rejected';
    case 'PENDING':
      return 'under_review';
    case 'ACTIVE':
      return team.submittedAt !== null ? 'submitted' : 'draft';
    default: {
      const exhaustiveCheck: never = team.status;
      return exhaustiveCheck;
    }
  }
}

/** Writes are blocked once the team is submitted/locked. */
export function isSubmissionLocked(team: TeamProfile): boolean {
  return (
    team.status === 'LOCKED' || team.status === 'SUBMITTED' || team.submittedAt !== null
  );
}

export function formatTeamDate(value: string | null): string {
  if (value === null) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function memberInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return `${first}${last}`.toUpperCase() || '?';
}
