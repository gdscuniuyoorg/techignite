import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  readonly label: string;
  readonly value: string | number;
  readonly hint?: string;
  readonly icon: LucideIcon;
  /** 0–1 fraction for the inline meter; omit to render no meter. */
  readonly meter?: number;
}

export function StatCard({ label, value, hint, icon: Icon, meter }: StatCardProps) {
  return (
    <div className="rounded-card border border-line bg-ink-raised p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-eyebrow text-muted uppercase">{label}</span>
        <Icon
          size={18}
          strokeWidth={1.75}
          className="text-brand-blue-soft"
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 text-4xl font-medium tracking-tight text-white tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {meter !== undefined && (
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-ink-soft"
          role="img"
          aria-label={`${String(Math.round(Math.min(Math.max(meter, 0), 1) * 100))}% of capacity used`}
        >
          <div
            className="h-full rounded-pill bg-brand-blue transition-[width] duration-300"
            style={{ width: `${String(Math.min(Math.max(meter, 0), 1) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
