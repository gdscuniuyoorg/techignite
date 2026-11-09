import { formText } from '@/lib/form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listSubmissions,
  reviewSubmission,
  deleteSubmission,
  exportUrl,
  adminErrorMessage,
  type SubmissionStatus,
} from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';
import { Download, Inbox, X } from 'lucide-react';
import { type SyntheticEvent } from 'react';
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog';

const STATUS_OPTIONS = [
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'draft',
] as const;
const PAGE_SIZE = 10;

interface SubmissionsSearch {
  readonly status?: SubmissionStatus | undefined;
  readonly offset: number;
  /** Id of the submission shown in the detail panel. */
  readonly selected?: string | undefined;
  /** Id of the submission pending delete confirmation. */
  readonly deleting?: string | undefined;
}

function parseSearch(raw: Record<string, unknown>): SubmissionsSearch {
  const status =
    typeof raw.status === 'string' &&
    (STATUS_OPTIONS as readonly string[]).includes(raw.status)
      ? (raw.status as SubmissionStatus)
      : undefined;
  const offsetRaw = Number(raw.offset ?? 0);
  const offset = Number.isInteger(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;
  const selected =
    typeof raw.selected === 'string' && raw.selected ? raw.selected : undefined;
  const deleting =
    typeof raw.deleting === 'string' && raw.deleting ? raw.deleting : undefined;
  return { status, offset, selected, deleting };
}

export const Route = createFileRoute('/admin/submissions')({
  head: () => noindexHead('Submissions — Tech Ignite Admin'),
  validateSearch: parseSearch,
  component: AdminSubmissions,
});

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  draft: 'border-line text-white/60',
  submitted: 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue-soft',
  under_review: 'border-brand-amber/50 bg-brand-amber/10 text-brand-amber',
  accepted:
    'border-brand-green-bright/50 bg-brand-green-bright/10 text-brand-green-bright',
  rejected: 'border-brand-red/50 bg-brand-red/10 text-[#ff9d91]',
};

function StatusBadge({ status }: { readonly status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-3 py-1 text-xs capitalize ${STATUS_STYLES[status]}`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}

function AdminSubmissions() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const setSearch = (patch: Partial<SubmissionsSearch>) =>
    void navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });

  const submissionsQuery = useQuery({
    queryKey: ['admin', 'submissions', search.status ?? 'all', search.offset],
    queryFn: () =>
      listSubmissions({ status: search.status, limit: PAGE_SIZE, offset: search.offset }),
    placeholderData: (previous) => previous,
  });

  const selected =
    submissionsQuery.data?.items.find((item) => item.id === search.selected) ?? null;
  const deleting =
    submissionsQuery.data?.items.find((item) => item.id === search.deleting) ?? null;

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ['admin', 'submissions'] });

  const reviewMutation = useMutation({
    mutationFn: async (input: { id: string; status: string; reviewerNotes: string }) => {
      try {
        await reviewSubmission(input.id, {
          status: input.status,
          ...(input.reviewerNotes.trim()
            ? { reviewerNotes: input.reviewerNotes.trim() }
            : {}),
        });
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteSubmission(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () => {
      invalidate();
      setSearch({ deleting: undefined, selected: undefined });
    },
  });

  const handleReviewSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const data = new FormData(event.currentTarget);
    const status = formText(data, 'status');
    const reviewerNotes = formText(data, 'reviewerNotes');
    if (status) {
      reviewMutation.mutate({ id: selected.id, status, reviewerNotes });
    }
  };

  const { data, isPending, isFetching, error, refetch } = submissionsQuery;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-blue-soft uppercase">Judging</p>
          <h1 className="mt-1 text-heading font-medium text-white">Submissions</h1>
        </div>
        <a
          href={exportUrl('api/admin/exports/submissions')}
          className="flex h-11 items-center gap-2 rounded-xs border border-line bg-ink-raised px-4 text-button text-white/85 transition-colors hover:border-brand-blue hover:text-white"
          download
        >
          <Download size={16} strokeWidth={2} aria-hidden="true" />
          Export CSV
        </a>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by status"
      >
        <button
          type="button"
          onClick={() => {
            setSearch({ status: undefined, offset: 0 });
          }}
          aria-pressed={search.status === undefined}
          className={`h-9 rounded-pill border px-4 text-sm transition-colors ${
            search.status === undefined
              ? 'border-brand-blue bg-brand-blue/15 text-white'
              : 'border-line text-white/65 hover:text-white'
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              setSearch({ status, offset: 0 });
            }}
            aria-pressed={search.status === status}
            className={`h-9 rounded-pill border px-4 text-sm capitalize transition-colors ${
              search.status === status
                ? 'border-brand-blue bg-brand-blue/15 text-white'
                : 'border-line text-white/65 hover:text-white'
            }`}
          >
            {status.replaceAll('_', ' ')}
          </button>
        ))}
        {isFetching && <span className="text-sm text-muted">Refreshing…</span>}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {/* List */}
        <section className="xl:col-span-3">
          {isPending ? (
            <div className="flex flex-col gap-3" aria-busy="true">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-card bg-ink-raised" />
              ))}
              <span className="sr-only">Loading submissions…</span>
            </div>
          ) : error ? (
            <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6">
              <p className="text-white">Couldn’t load submissions.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 flex h-11 items-center rounded-xs bg-brand-blue px-5 text-button text-white hover:bg-brand-blue-strong"
              >
                Retry
              </button>
            </div>
          ) : data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-ink-raised px-6 py-16 text-center">
              <Inbox size={28} className="text-white/30" aria-hidden="true" />
              <p className="text-white">No submissions match this filter.</p>
              <p className="max-w-sm text-sm text-muted">
                Submissions appear here once teams submit their projects from the
                hackathon portal.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {data.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch({ selected: item.id });
                    }}
                    aria-pressed={search.selected === item.id}
                    className={`w-full rounded-card border p-4 text-left transition-colors ${
                      search.selected === item.id
                        ? 'border-brand-blue bg-brand-blue/5'
                        : 'border-line bg-ink-raised hover:border-brand-blue/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-white">{item.projectTitle}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="font-mono text-xs text-white/45">
                        team {item.teamId.slice(0, 8)}…
                      </span>
                      <span>
                        {item.submittedAt
                          ? `Submitted ${new Date(item.submittedAt).toLocaleDateString()}`
                          : `Created ${new Date(item.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {data && data.pagination.total > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted">
                {String(search.offset + 1)}–
                {String(Math.min(search.offset + PAGE_SIZE, data.pagination.total))} of{' '}
                {String(data.pagination.total)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={search.offset === 0}
                  onClick={() => {
                    setSearch({ offset: Math.max(0, search.offset - PAGE_SIZE) });
                  }}
                  className="h-11 rounded-xs border border-line px-4 text-button text-white/80 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={search.offset + PAGE_SIZE >= data.pagination.total}
                  onClick={() => {
                    setSearch({ offset: search.offset + PAGE_SIZE });
                  }}
                  className="h-11 rounded-xs border border-line px-4 text-button text-white/80 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Detail / review panel */}
        <section className="xl:col-span-2">
          {selected ? (
            <div className="rounded-card border border-line bg-ink-raised p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-subheading font-medium text-white">
                  {selected.projectTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setSearch({ selected: undefined });
                  }}
                  aria-label="Close detail panel"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs text-white/60 hover:bg-ink-soft hover:text-white"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2">
                <StatusBadge status={selected.status} />
              </div>

              <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-white/80">
                {selected.projectDescription || 'No description provided.'}
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-line pt-4 text-sm">
                {selected.demoUrl && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">Demo</dt>
                    <dd>
                      <a
                        className="break-all text-brand-blue-soft hover:text-white"
                        href={selected.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selected.demoUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {selected.repositoryUrl && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">Repo</dt>
                    <dd>
                      <a
                        className="break-all text-brand-blue-soft hover:text-white"
                        href={selected.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selected.repositoryUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {selected.videoUrl && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">Video</dt>
                    <dd>
                      <a
                        className="break-all text-brand-blue-soft hover:text-white"
                        href={selected.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selected.videoUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {selected.technologies && selected.technologies.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-muted">Stack</dt>
                    <dd className="text-white/80">{selected.technologies.join(', ')}</dd>
                  </div>
                )}
              </dl>

              {/* Review form */}
              <form
                key={selected.id}
                onSubmit={handleReviewSubmit}
                className="mt-5 flex flex-col gap-3 border-t border-line pt-4"
              >
                <h3 className="text-label text-white">Record review</h3>
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Decision
                  <select
                    name="status"
                    required
                    defaultValue={selected.status}
                    className="h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="under_review">Under review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  Reviewer notes <span className="text-muted">(optional)</span>
                  <textarea
                    name="reviewerNotes"
                    rows={3}
                    defaultValue={selected.reviewerNotes ?? ''}
                    className="rounded-xs border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                    placeholder="Visible to the judging team."
                  />
                </label>
                {reviewMutation.error && (
                  <p role="alert" className="text-sm text-[#ff9d91]">
                    {reviewMutation.error.message}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={reviewMutation.isPending}
                    className="flex h-11 items-center rounded-xs bg-brand-blue px-5 text-button text-white transition-colors hover:bg-brand-blue-strong disabled:opacity-50"
                  >
                    {reviewMutation.isPending ? 'Saving…' : 'Save review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch({ deleting: selected.id });
                    }}
                    className="flex h-11 items-center rounded-xs border border-brand-red/40 px-5 text-button text-[#ff9d91] transition-colors hover:bg-brand-red/10"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-card border border-dashed border-line px-6 py-12 text-center">
              <p className="text-white/60">Select a submission to review it.</p>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={deleting != null}
        title="Delete this submission?"
        body={
          <>
            <p>
              This permanently deletes{' '}
              <strong className="text-white">{deleting?.projectTitle}</strong>. This
              cannot be undone.
            </p>
          </>
        }
        confirmLabel="Delete submission"
        destructive
        confirming={deleteMutation.isPending}
        onConfirm={() => {
          if (deleting) deleteMutation.mutate(deleting.id);
        }}
        onCancel={() => {
          setSearch({ deleting: undefined });
        }}
      />
    </div>
  );
}
