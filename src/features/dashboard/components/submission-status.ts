export type DashboardSubmissionStatus =
  'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';

export const STATUS_LABELS: Record<DashboardSubmissionStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under review',
  accepted: 'Accepted',
  rejected: 'Rejected',
};
