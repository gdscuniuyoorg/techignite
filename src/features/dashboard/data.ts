import type { DashboardSubmissionStatus } from './components/submission-status';

export interface StatusStep {
  readonly label: string;
  readonly hint: string;
}

/**
 * Event-wide facts. The API does not expose the deadline, so it is a fixed
 * constant (spec 0004, decision D5).
 */
export const EVENT = {
  name: 'Tech Ignite ’26',
  track: 'Build with Paga Shipathon',
  deadline: '18 Nov 2026 · 11:59 PM WAT',
  daysLeft: 10,
} as const;

export const STEPS: readonly StatusStep[] = [
  { label: 'Draft', hint: 'In progress' },
  { label: 'Submitted', hint: 'Locked for judging' },
  { label: 'Under review', hint: 'Judges scoring' },
  { label: 'Decision', hint: 'Results out' },
];

export const STEP_INDEX: Record<DashboardSubmissionStatus, number> = {
  draft: 0,
  submitted: 1,
  under_review: 2,
  accepted: 3,
  rejected: 3,
};
