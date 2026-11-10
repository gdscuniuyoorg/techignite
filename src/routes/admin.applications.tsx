import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileText, Loader2, Trash2, X } from 'lucide-react';
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog';
import {
  adminErrorMessage,
  batchUpdateApplicationStatus,
  deleteApplication,
  exportUrl,
  getApplication,
  listApplications,
  updateApplicationStatus,
  type ApplicationStatus,
} from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';

const PAGE_SIZE = 20;
const STATUS_OPTIONS: readonly ApplicationStatus[] = [
  'pending',
  'accepted',
  'rejected',
  'waitlisted',
];
const DECISION_OPTIONS = ['accepted', 'rejected', 'waitlisted'] as const;
type ApplicationDecision = (typeof DECISION_OPTIONS)[number];

interface ApplicationsSearch {
  readonly status?: ApplicationStatus | undefined;
  readonly offset: number;
  readonly selected?: string | undefined;
  readonly deleting?: string | undefined;
}

function parseStatus(value: unknown): ApplicationStatus | undefined {
  switch (value) {
    case 'pending':
    case 'accepted':
    case 'rejected':
    case 'waitlisted':
      return value;
    default:
      return undefined;
  }
}

function parseDecision(value: unknown): ApplicationDecision {
  switch (value) {
    case 'rejected':
    case 'waitlisted':
      return value;
    case 'accepted':
    default:
      return 'accepted';
  }
}

function parseSearch(raw: Record<string, unknown>): ApplicationsSearch {
  const offsetValue = Number(raw.offset ?? 0);
  return {
    status: parseStatus(raw.status),
    offset: Number.isInteger(offsetValue) && offsetValue >= 0 ? offsetValue : 0,
    selected:
      typeof raw.selected === 'string' && raw.selected.length > 0
        ? raw.selected
        : undefined,
    deleting:
      typeof raw.deleting === 'string' && raw.deleting.length > 0
        ? raw.deleting
        : undefined,
  };
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: 'border-brand-amber/50 bg-brand-amber/10 text-brand-amber',
  accepted:
    'border-brand-green-bright/50 bg-brand-green-bright/10 text-brand-green-bright',
  rejected: 'border-brand-red/50 bg-brand-red/10 text-white/80',
  waitlisted: 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue-soft',
};

function StatusBadge({ status }: { readonly status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-pill border px-3 py-1 text-xs capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function displayDate(value: string): string {
  if (value.length === 0) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
}

export const Route = createFileRoute('/admin/applications')({
  head: () => noindexHead('Applications | Tech Ignite Admin'),
  validateSearch: parseSearch,
  component: AdminApplications,
});

function AdminApplications() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [batchStatus, setBatchStatus] = useState<ApplicationDecision>('accepted');

  const setSearch = (patch: Partial<ApplicationsSearch>) =>
    void navigate({
      search: (previous) => ({ ...previous, ...patch }),
      replace: true,
    });

  const applicationsQuery = useQuery({
    queryKey: ['admin', 'applications', search.status ?? 'all', search.offset],
    queryFn: () =>
      listApplications({
        status: search.status,
        limit: PAGE_SIZE,
        offset: search.offset,
      }),
    placeholderData: (previous) => previous,
  });

  const detailQuery = useQuery({
    queryKey: ['admin', 'applications', 'detail', search.selected ?? 'none'],
    queryFn: () => getApplication(search.selected ?? ''),
    enabled: search.selected !== undefined,
  });

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
    ]);

  const statusMutation = useMutation({
    mutationFn: async (input: {
      readonly id: string;
      readonly status: ApplicationDecision;
    }) => {
      try {
        await updateApplicationStatus(input.id, input.status);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: invalidate,
  });

  const batchMutation = useMutation({
    mutationFn: async () => {
      try {
        await batchUpdateApplicationStatus(
          [...selectedIds].map((id) => ({ id, status: batchStatus })),
        );
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setSelectedIds(new Set());
      await invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteApplication(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: async () => {
      setSearch({ deleting: undefined, selected: undefined });
      await invalidate();
    },
  });

  const data = applicationsQuery.data ?? {
    items: [],
    pagination: { total: 0, limit: PAGE_SIZE, offset: search.offset },
  };
  const selected = detailQuery.data;
  // Guard the deleting lookup on a real id: comparing `selected?.id` with an
  // absent `search.deleting` is `undefined === undefined → true`, which would
  // make the confirmation dialog open on its own with no target.
  const deleting =
    search.deleting === undefined
      ? null
      : (data.items.find((application) => application.id === search.deleting) ??
        (selected?.id === search.deleting ? selected : null));
  const actionError = statusMutation.error ?? batchMutation.error;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-blue-soft uppercase">Intake</p>
          <h1 className="mt-1 text-heading font-medium text-white">Applications</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Review applicants, record decisions, and create accepted teams.
          </p>
        </div>
        <a
          href={exportUrl('api/applications/export/csv')}
          download
          className="flex h-11 items-center gap-2 rounded-xs border border-line bg-ink-raised px-4 text-button text-white/85 transition-colors hover:border-brand-blue hover:text-white"
        >
          <Download size={16} aria-hidden="true" />
          Export CSV
        </a>
      </div>

      <div
        role="group"
        aria-label="Filter applications by status"
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          aria-pressed={search.status === undefined}
          onClick={() => {
            setSearch({ status: undefined, offset: 0 });
          }}
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
            aria-pressed={search.status === status}
            onClick={() => {
              setSearch({ status, offset: 0 });
            }}
            className={`h-9 rounded-pill border px-4 text-sm capitalize transition-colors ${
              search.status === status
                ? 'border-brand-blue bg-brand-blue/15 text-white'
                : 'border-line text-white/65 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
        {applicationsQuery.isFetching && (
          <span className="text-sm text-muted">Refreshing…</span>
        )}
      </div>

      {selectedIds.size > 0 && (
        <section className="flex flex-wrap items-center gap-3 rounded-card border border-brand-blue/40 bg-brand-blue/10 p-4">
          <p className="mr-auto text-sm text-white">
            {String(selectedIds.size)} selected
          </p>
          <label className="sr-only" htmlFor="batch-application-status">
            Batch decision
          </label>
          <select
            id="batch-application-status"
            value={batchStatus}
            onChange={(event) => {
              setBatchStatus(parseDecision(event.target.value));
            }}
            className="h-11 rounded-xs border border-line bg-ink px-3 text-sm text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
          >
            {DECISION_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status[0]?.toUpperCase()}
                {status.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={batchMutation.isPending}
            onClick={() => {
              batchMutation.mutate();
            }}
            className="flex h-11 items-center rounded-xs bg-brand-blue px-4 text-button text-white hover:bg-brand-blue-strong disabled:opacity-50"
          >
            {batchMutation.isPending ? 'Applying…' : 'Apply decision'}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedIds(new Set());
            }}
            className="flex h-11 items-center rounded-xs border border-line px-4 text-button text-white/75 hover:text-white"
          >
            Clear
          </button>
        </section>
      )}

      {actionError && (
        <p
          role="alert"
          className="rounded-xs border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-sm text-white/80"
        >
          {actionError.message}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-5">
        <section className="xl:col-span-3">
          {applicationsQuery.isPending ? (
            <div className="flex flex-col gap-3" aria-busy="true">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-card bg-ink-raised"
                />
              ))}
              <span className="sr-only">Loading applications…</span>
            </div>
          ) : applicationsQuery.error ? (
            <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6">
              <p className="text-white">Could not load applications.</p>
              <button
                type="button"
                onClick={() => void applicationsQuery.refetch()}
                className="mt-3 flex h-11 items-center rounded-xs bg-brand-blue px-5 text-button text-white"
              >
                Retry
              </button>
            </div>
          ) : data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-ink-raised px-6 py-16 text-center">
              <FileText size={28} className="text-white/30" aria-hidden="true" />
              <p className="text-white">No applications match this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-card border border-line bg-ink-raised">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="w-12 px-4 py-3 font-normal">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-3 py-3 font-normal">Team</th>
                    <th className="px-3 py-3 font-normal">Applicant</th>
                    <th className="px-3 py-3 font-normal">Status</th>
                    <th className="px-4 py-3 font-normal">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((application) => (
                    <tr
                      key={application.id}
                      className={`border-b border-line/60 last:border-0 ${
                        search.selected === application.id ? 'bg-brand-blue/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${application.teamName}`}
                          checked={selectedIds.has(application.id)}
                          onChange={(event) => {
                            setSelectedIds((current) => {
                              const next = new Set(current);
                              if (event.target.checked) next.add(application.id);
                              else next.delete(application.id);
                              return next;
                            });
                          }}
                          className="h-4 w-4 accent-brand-blue"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSearch({ selected: application.id });
                          }}
                          className="text-left font-medium text-white hover:text-brand-blue-soft"
                        >
                          {application.teamName}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <span className="block text-white/85">
                          {application.applicantFirstName} {application.applicantLastName}
                        </span>
                        <span className="block text-xs text-muted">
                          {application.applicantEmail}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {displayDate(application.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.pagination.total > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {String(search.offset + 1)} to{' '}
                {String(Math.min(search.offset + PAGE_SIZE, data.pagination.total))} of{' '}
                {String(data.pagination.total)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={search.offset === 0}
                  onClick={() => {
                    setSearch({
                      offset: Math.max(0, search.offset - PAGE_SIZE),
                    });
                  }}
                  className="h-11 rounded-xs border border-line px-4 text-button text-white/80 disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={search.offset + PAGE_SIZE >= data.pagination.total}
                  onClick={() => {
                    setSearch({ offset: search.offset + PAGE_SIZE });
                  }}
                  className="h-11 rounded-xs border border-line px-4 text-button text-white/80 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="xl:col-span-2">
          {search.selected === undefined ? (
            <div className="flex min-h-64 items-center justify-center rounded-card border border-dashed border-line px-6 text-center text-sm text-muted">
              Select an application to review it.
            </div>
          ) : detailQuery.isPending ? (
            <div
              className="flex min-h-64 items-center justify-center rounded-card border border-line bg-ink-raised"
              aria-busy="true"
            >
              <Loader2
                size={22}
                className="animate-spin text-brand-blue-soft"
                aria-hidden="true"
              />
            </div>
          ) : detailQuery.error ? (
            <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-5 text-sm text-white/80">
              Could not load this application.
            </div>
          ) : selected ? (
            <div className="rounded-card border border-line bg-ink-raised p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-eyebrow text-muted uppercase">Application</p>
                  <h2 className="mt-1 text-subheading font-medium text-white">
                    {selected.teamName}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close application details"
                  onClick={() => {
                    setSearch({ selected: undefined });
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xs text-white/60 hover:bg-ink-soft hover:text-white"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3">
                <StatusBadge status={selected.status} />
              </div>

              <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
                <div className="py-3">
                  <dt className="text-muted">Applicant</dt>
                  <dd className="mt-1 text-white/85">
                    {selected.applicantFirstName} {selected.applicantLastName}
                  </dd>
                  <dd className="text-brand-blue-soft">{selected.applicantEmail}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-muted">Project idea</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-white/80">
                    {selected.projectIdea || 'No project idea provided.'}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-muted">Team description</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-white/80">
                    {selected.teamDescription || 'No description provided.'}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <h3 className="text-label text-white">Decision</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                  {DECISION_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={statusMutation.isPending}
                      onClick={() => {
                        statusMutation.mutate({ id: selected.id, status });
                      }}
                      className="flex h-11 items-center justify-center rounded-xs border border-line px-3 text-button text-white/80 transition-colors hover:border-brand-blue hover:text-white disabled:opacity-50"
                    >
                      {status[0]?.toUpperCase()}
                      {status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearch({ deleting: selected.id });
                }}
                className="mt-5 flex h-11 items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <Trash2 size={15} aria-hidden="true" />
                Delete application
              </button>
            </div>
          ) : null}
        </section>
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this application?"
        body={
          <p>
            This permanently deletes the application for{' '}
            <strong className="text-white">{deleting?.teamName}</strong>.
          </p>
        }
        confirmLabel="Delete application"
        destructive
        confirming={deleteMutation.isPending}
        error={deleteMutation.error?.message}
        onConfirm={() => {
          if (deleting) deleteMutation.mutate(deleting.id);
        }}
        onCancel={() => {
          deleteMutation.reset();
          setSearch({ deleting: undefined });
        }}
      />
    </div>
  );
}
