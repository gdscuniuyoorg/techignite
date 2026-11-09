import type { LucideIcon } from 'lucide-react';
import { ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TeamProfile } from '@/lib/team-api';
import { SubmissionStatusBadge } from './submission-status-badge';
import type { DashboardSubmissionStatus } from './submission-status';
import { formatTeamDate } from './team-status';

interface SubmissionCardProps {
  readonly team: TeamProfile;
  readonly status: DashboardSubmissionStatus;
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

/** Read-only view of the team's judged project submission. */
export function SubmissionCard({ team, status }: SubmissionCardProps) {
  const hasDetails =
    team.projectTitle.length > 0 || team.projectDescription.length > 0;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {team.projectTitle.length > 0 ? team.projectTitle : 'Untitled project'}
            </h3>
            <SubmissionStatusBadge status={status} />
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {team.projectDescription.length > 0
              ? team.projectDescription
              : hasDetails
                ? 'No description yet.'
                : 'Add a title and description so judges know what you built.'}
          </p>
        </div>
      </div>

      {team.technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {team.technologies.map((technology) => (
            <Badge key={technology} variant="secondary">
              {technology}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
        {team.demoUrl.length > 0 && (
          <SubmissionLink
            href={team.demoUrl}
            label={linkLabel(team.demoUrl)}
            icon={ExternalLink}
          />
        )}
        {team.repositoryUrl.length > 0 && (
          <SubmissionLink
            href={team.repositoryUrl}
            label={linkLabel(team.repositoryUrl)}
            icon={ExternalLink}
          />
        )}
        <span className="ml-auto text-xs text-slate-400">
          Updated {formatTeamDate(team.updatedAt ?? team.submittedAt)}
        </span>
      </div>
    </article>
  );
}
