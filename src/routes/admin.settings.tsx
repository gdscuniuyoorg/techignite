import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentEvent, updateEvent, adminErrorMessage } from '@/lib/admin-api';
import { noindexHead } from '@/lib/seo';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/admin/settings')({
  head: () => noindexHead('Event Settings — Tech Ignite Admin'),
  component: AdminSettings,
});

function AdminSettings() {
  const queryClient = useQueryClient();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  const eventQuery = useQuery({
    queryKey: ['admin', 'event', 'current'],
    queryFn: getCurrentEvent,
  });

  const updateMutation = useMutation({
    mutationFn: async (input: { submissionsOpen?: boolean; applicationsOpen?: boolean }) => {
      if (!eventQuery.data) throw new Error('No event found');
      try {
        await updateEvent(eventQuery.data.id, input);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'event'] });
      setUpdateSuccess('Event settings updated successfully');
      setUpdateError(null);
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    },
    onError: (error) => {
      setUpdateError(error.message);
      setUpdateSuccess(null);
    },
  });

  const toggleSubmissions = () => {
    if (!eventQuery.data) return;
    updateMutation.mutate({ submissionsOpen: !eventQuery.data.submissionsOpen });
  };

  const toggleApplications = () => {
    if (!eventQuery.data) return;
    updateMutation.mutate({ applicationsOpen: !eventQuery.data.applicationsOpen });
  };

  const { data: event, isPending, error } = eventQuery;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-eyebrow text-brand-blue-soft uppercase">Configuration</p>
        <h1 className="mt-1 text-heading font-medium text-white">Event Settings</h1>
        <p className="mt-2 text-muted">
          Control applications and submissions for the current hackathon event.
        </p>
      </div>

      {isPending ? (
        <div className="rounded-card border border-line bg-ink-raised p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-ink" />
        </div>
      ) : error ? (
        <div className="rounded-card border border-brand-red/40 bg-brand-red/10 p-6">
          <p className="text-white">Couldn't load event settings.</p>
        </div>
      ) : !event ? (
        <div className="rounded-card border border-line bg-ink-raised p-6">
          <p className="text-white/60">No event configured.</p>
          <p className="mt-2 text-sm text-muted">
            Create an event first to manage settings.
          </p>
        </div>
      ) : (
        <>
          {updateSuccess && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-card border border-brand-green-bright/40 bg-brand-green-bright/10 p-4"
            >
              <CheckCircle2
                size={20}
                className="shrink-0 text-brand-green-bright"
                aria-hidden="true"
              />
              <p className="text-sm text-brand-green-bright">{updateSuccess}</p>
            </div>
          )}

          {updateError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-card border border-brand-red/40 bg-brand-red/10 p-4"
            >
              <XCircle size={20} className="shrink-0 text-[#ff9d91]" aria-hidden="true" />
              <p className="text-sm text-[#ff9d91]">{updateError}</p>
            </div>
          )}

          <div className="rounded-card border border-line bg-ink-raised">
            <div className="border-b border-line px-6 py-4">
              <h2 className="text-subheading font-medium text-white">{event.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {new Date(event.startDate).toLocaleDateString()} –{' '}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="divide-y divide-line">
              {/* Applications Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div>
                  <h3 className="font-medium text-white">Applications</h3>
                  <p className="mt-1 text-sm text-muted">
                    Teams can apply to participate in the hackathon
                  </p>
                  {event.applicationDeadline && (
                    <p className="mt-1 text-xs text-white/50">
                      Deadline: {new Date(event.applicationDeadline).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggleApplications}
                  disabled={updateMutation.isPending}
                  role="switch"
                  aria-checked={event.applicationsOpen}
                  aria-label={
                    event.applicationsOpen
                      ? 'Applications are open. Click to close.'
                      : 'Applications are closed. Click to open.'
                  }
                  className={`relative h-8 w-14 rounded-full transition-colors disabled:opacity-50 ${
                    event.applicationsOpen ? 'bg-brand-blue' : 'bg-line'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                      event.applicationsOpen ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Submissions Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div>
                  <h3 className="font-medium text-white">Submissions</h3>
                  <p className="mt-1 text-sm text-muted">
                    Teams can submit their projects for judging
                  </p>
                  {event.submissionDeadline && (
                    <p className="mt-1 text-xs text-white/50">
                      Deadline: {new Date(event.submissionDeadline).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggleSubmissions}
                  disabled={updateMutation.isPending}
                  role="switch"
                  aria-checked={event.submissionsOpen}
                  aria-label={
                    event.submissionsOpen
                      ? 'Submissions are open. Click to close.'
                      : 'Submissions are closed. Click to open.'
                  }
                  className={`relative h-8 w-14 rounded-full transition-colors disabled:opacity-50 ${
                    event.submissionsOpen ? 'bg-brand-blue' : 'bg-line'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                      event.submissionsOpen ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-line bg-ink-raised p-6">
            <h3 className="font-medium text-white">About these settings</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-white/50">•</span>
                <span>
                  When submissions are <strong className="text-white">closed</strong>,
                  teams cannot create, edit, or submit projects
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-white/50">•</span>
                <span>
                  When submissions are <strong className="text-white">open</strong>, teams
                  can work on and submit their projects
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-white/50">•</span>
                <span>Admins can always view and manage all submissions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-white/50">•</span>
                <span>Changes take effect immediately for all users</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
