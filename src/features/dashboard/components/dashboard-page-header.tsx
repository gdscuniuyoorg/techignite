import type { ReactNode } from 'react';

interface DashboardPageHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly aside?: ReactNode;
}

/** Shared page heading for every dashboard section. Smallest text is 12px. */
export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  aside,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-brand-blue-strong uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {aside}
    </div>
  );
}
