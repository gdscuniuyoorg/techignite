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
        <p className="text-xs font-medium tracking-wide text-violet-600 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {aside}
    </div>
  );
}
