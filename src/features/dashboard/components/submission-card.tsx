import type { LucideIcon } from 'lucide-react';
import { ExternalLink, FileText, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubmissionStatusBadge } from './submission-status-badge';
import type { CategorySubmission } from '../data';

interface SubmissionCardProps {
  readonly submission: CategorySubmission;
  /** `simple` is the compact hackathon record; `detailed` is the full project entry. */
  readonly variant?: 'simple' | 'detailed';
}

/** Display host for a URL so judges see where a link points. */
function linkLabel(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

interface SubmissionLinkProps {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
}

function SubmissionLink({ href, label, icon: Icon }: SubmissionLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-violet-200 hover:text-violet-700"
    >
      <Icon size={13} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
}

/** Read-only summary of one submitted (or drafted) entry. Smallest text is 12px. */
export function SubmissionCard({
  submission,
  variant = 'detailed',
}: SubmissionCardProps) {
  if (variant === 'simple') {
    return (
      <article className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <FileText size={15} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-slate-900">
            {submission.title}
          </h3>
          <p className="text-xs text-slate-500">Updated {submission.updatedAt}</p>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{submission.title}</h3>
            <SubmissionStatusBadge status={submission.status} />
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {submission.summary}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {submission.technologies.map((technology) => (
          <Badge key={technology} variant="secondary">
            {technology}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
        {submission.demoUrl.length > 0 && (
          <SubmissionLink
            href={submission.demoUrl}
            label={linkLabel(submission.demoUrl)}
            icon={ExternalLink}
          />
        )}
        {submission.repositoryUrl.length > 0 && (
          <SubmissionLink
            href={submission.repositoryUrl}
            label={linkLabel(submission.repositoryUrl)}
            icon={ExternalLink}
          />
        )}
        {submission.videoUrl.length > 0 && (
          <SubmissionLink href={submission.videoUrl} label="Demo video" icon={Video} />
        )}
        <span className="ml-auto text-xs text-slate-400">
          Updated {submission.updatedAt}
        </span>
      </div>
    </article>
  );
}
