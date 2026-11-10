import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';

type StatTrend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  readonly label: string;
  readonly value: string | number;
  readonly hint?: string;
  readonly icon: LucideIcon;
  /** 0–1 fraction for the inline meter; omit to render no meter. */
  readonly meter?: number;
  /** Direction shown before the hint; omit to render the hint plainly. */
  readonly trend?: StatTrend;
}

const TREND_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight,
} as const;

const TREND_COLOR: Record<StatTrend, string> = {
  up: 'text-brand-green-bright',
  down: 'text-brand-red',
  neutral: 'text-slate-400',
};

/**
 * Light analytics tile: an icon square, a small label, one prominent number,
 * and an optional trend line — the layout used across the admin overview.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  meter,
  trend,
}: StatCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend] : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
        {value}
      </p>

      {hint && (
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          {TrendIcon && (
            <TrendIcon
              size={13}
              strokeWidth={2.25}
              className={TREND_COLOR[trend ?? 'neutral']}
              aria-hidden="true"
            />
          )}
          {hint}
        </p>
      )}

      {meter !== undefined && (
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="img"
          aria-label={`${String(Math.round(Math.min(Math.max(meter, 0), 1) * 100))}% of capacity used`}
        >
          <div
            className="h-full rounded-full bg-brand-blue transition-[width] duration-300"
            style={{ width: `${String(Math.min(Math.max(meter, 0), 1) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
