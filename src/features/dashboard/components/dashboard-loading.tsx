import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DashboardLoadingProps {
  readonly label?: string;
}

/** Shared loading state. Smallest text is 12px. */
export function DashboardLoading({ label = 'Loading…' }: DashboardLoadingProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-slate-500"
    >
      <Loader2 size={22} className="animate-spin text-violet-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

interface DashboardErrorStateProps {
  readonly message: string;
  readonly onRetry?: () => void;
}

export function DashboardErrorState({ message, onRetry }: DashboardErrorStateProps) {
  return (
    <Card className="items-center py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle size={18} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium text-slate-900">We couldn’t load this</p>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </Button>
      )}
    </Card>
  );
}
