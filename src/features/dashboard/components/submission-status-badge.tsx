import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { STATUS_LABELS, type DashboardSubmissionStatus } from './submission-status';

const STATUS_VARIANTS: Record<DashboardSubmissionStatus, BadgeVariant> = {
  draft: 'outline',
  submitted: 'default',
  under_review: 'warning',
  accepted: 'success',
  rejected: 'destructive',
};

interface SubmissionStatusBadgeProps {
  readonly status: DashboardSubmissionStatus;
}

/** Status pill shared by the dashboard header and summary tiles. */
export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
