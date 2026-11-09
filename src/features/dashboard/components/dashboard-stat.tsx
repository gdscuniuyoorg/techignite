import type { LucideIcon } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DashboardStatProps {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly icon: LucideIcon;
  readonly badge?: { readonly label: string; readonly variant?: BadgeVariant };
}

/** shadcn-style summary tile. Smallest text is 12px. */
export function DashboardStat({
  label,
  value,
  hint,
  icon: Icon,
  badge,
}: DashboardStatProps) {
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="text-sm text-slate-500">{label}</span>
        <Ellipsis size={16} className="ml-auto text-slate-300" aria-hidden="true" />
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        {badge && <Badge variant={badge.variant ?? 'success'}>{badge.label}</Badge>}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>
    </Card>
  );
}
