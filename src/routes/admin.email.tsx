import { formText } from '@/lib/form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useRef, type SyntheticEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Download, Send, FlaskConical, Ban, Trash2 } from 'lucide-react';
import {
  listCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  testSendCampaign,
  cancelCampaign,
  listEmailTemplates,
  sendTemplateEmail,
  listSubscribers,
  sendFinalistInvite,
  exportUrl,
  adminErrorMessage,
  type CampaignAudience,
  type CampaignStatus,
} from '@/lib/admin-api';
import type { EmailDocument } from '@/features/admin/components/tiptap-editor';
import { CampaignComposer } from '@/features/admin/components/campaign-composer';
import { ConfirmDialog } from '@/features/admin/components/confirm-dialog';
import { noindexHead } from '@/lib/seo';

const PAGE_SIZE = 10;

interface EmailSearch {
  readonly compose?: string | undefined;
  readonly sending?: string | undefined;
  readonly deleting?: string | undefined;
  readonly cancelling?: string | undefined;
  readonly finalist?: true | undefined;
  /** Text typed into a ConfirmDialog that requires typed confirmation. */
  readonly confirmText?: string | undefined;
  readonly offset: number;
}

function parseSearch(raw: Record<string, unknown>): EmailSearch {
  const pick = (
    key: 'compose' | 'sending' | 'deleting' | 'cancelling' | 'confirmText',
  ) => (typeof raw[key] === 'string' && raw[key] ? raw[key] : undefined);
  const offsetRaw = Number(raw.offset ?? 0);
  return {
    compose: pick('compose'),
    sending: pick('sending'),
    deleting: pick('deleting'),
    cancelling: pick('cancelling'),
    confirmText: pick('confirmText'),
    finalist: raw.finalist === 'true' ? true : undefined,
    offset: Number.isInteger(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0,
  };
}

export const Route = createFileRoute('/admin/email')({
  head: () => noindexHead('Email — Tech Ignite Admin'),
  validateSearch: parseSearch,
  component: AdminEmail,
});

const CAMPAIGN_STATUS_STYLES: Record<CampaignStatus, string> = {
  draft: 'border-line text-white/60',
  scheduled: 'border-brand-amber/50 bg-brand-amber/10 text-brand-amber',
  in_progress: 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue-soft',
  completed:
    'border-brand-green-bright/50 bg-brand-green-bright/10 text-brand-green-bright',
  cancelled: 'border-brand-red/50 bg-brand-red/10 text-[#ff9d91]',
};

function AdminEmail() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const testAddressRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<EmailDocument>({ html: '<p></p>', text: '' });
  const finalistSubjectRef = useRef<HTMLInputElement>(null);

  const setSearch = (patch: Partial<EmailSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const campaigns = useQuery({
    queryKey: ['admin', 'campaigns', search.offset],
    queryFn: () => listCampaigns({ limit: PAGE_SIZE, offset: search.offset }),
    placeholderData: (previous) => previous,
  });

  const templates = useQuery({
    queryKey: ['admin', 'email-templates'],
    queryFn: listEmailTemplates,
    staleTime: 5 * 60_000,
  });

  const subscribers = useQuery({
    queryKey: ['admin', 'subscribers-summary'],
    queryFn: async () => {
      const [all, active] = await Promise.all([
        listSubscribers({ limit: 1, offset: 0 }),
        listSubscribers({ limit: 1, offset: 0, unsubscribed: false }),
      ]);
      return { total: all.pagination.total, active: active.pagination.total };
    },
  });

  const editingCampaign = search.compose
    ? campaigns.data?.items.find((item) => item.id === search.compose)
    : undefined;

  const invalidateCampaigns = () =>
    void queryClient.invalidateQueries({ queryKey: ['admin', 'campaigns'] });

  const saveMutation = useMutation({
    mutationFn: async (input: FormData) => {
      const name = formText(input, 'name').trim();
      const subject = formText(input, 'subject').trim();
      const audience = formText(input, 'audience') as CampaignAudience;
      const scheduledForRaw = formText(input, 'scheduledFor').trim();
      const customRaw = formText(input, 'customRecipients');
      const { html, text } = documentRef.current;

      if (!name || !subject) {
        throw new Error('Campaign name and subject are required.');
      }
      if (!text.trim()) {
        throw new Error('The email body is empty.');
      }

      const customRecipients = customRaw
        .split(/[\n,;]+/)
        .map((entry) => entry.trim())
        .filter((entry) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(entry));
      if (audience === 'custom' && customRecipients.length === 0) {
        throw new Error('Add at least one valid email address for a custom audience.');
      }

      const payload = {
        name,
        subject,
        content: text,
        htmlContent: html,
        audience,
        ...(audience === 'custom' ? { customRecipients } : {}),
        ...(scheduledForRaw
          ? { scheduledFor: new Date(scheduledForRaw).toISOString() }
          : {}),
      };

      try {
        if (editingCampaign) {
          await updateCampaign(editingCampaign.id, payload);
          return null;
        }
        return await createCampaign(payload);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: (created) => {
      invalidateCampaigns();
      if (created) {
        documentRef.current = { html: '<p></p>', text: '' };
        setSearch({ compose: created.id });
      }
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await sendCampaign(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () => {
      invalidateCampaigns();
      setSearch({ sending: undefined, confirmText: undefined });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await cancelCampaign(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () => {
      invalidateCampaigns();
      setSearch({ cancelling: undefined });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteCampaign(id);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () => {
      invalidateCampaigns();
      setSearch({ deleting: undefined, compose: undefined });
    },
  });

  const testSendMutation = useMutation({
    mutationFn: async (id: string) => {
      const email = testAddressRef.current?.value.trim() ?? '';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        throw new Error(
          'Enter a valid test address in the “Test recipient” field first.',
        );
      }
      try {
        await testSendCampaign(id, email);
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
  });

  const finalistMutation = useMutation({
    mutationFn: async () => {
      const subject = (finalistSubjectRef.current?.value ?? '').trim();
      const { html, text } = documentRef.current;
      if (!subject) {
        throw new Error('Enter a subject for the finalist invitation.');
      }
      try {
        await sendFinalistInvite({
          name: 'Finalist Invitations',
          subject,
          htmlContent: html,
          content: text,
        });
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
    onSuccess: () => {
      invalidateCampaigns();
      setSearch({ finalist: undefined, confirmText: undefined });
    },
  });

  const templateSendMutation = useMutation({
    mutationFn: async (input: FormData) => {
      const to = formText(input, 'to').trim();
      const template = formText(input, 'template');
      const templateDataRaw = formText(input, 'templateData').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
        throw new Error('Enter a valid recipient address.');
      }
      let templateData: Record<string, unknown> | undefined;
      if (templateDataRaw) {
        try {
          const parsed: unknown = JSON.parse(templateDataRaw);
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error('templateData must be a JSON object.');
          }
          templateData = parsed as Record<string, unknown>;
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'templateData is invalid.',
            { cause: error },
          );
        }
      }
      try {
        await sendTemplateEmail({
          to,
          template,
          ...(templateData ? { templateData } : {}),
        });
      } catch (error) {
        throw new Error(await adminErrorMessage(error), { cause: error });
      }
    },
  });

  const handleTemplateSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    templateSendMutation.mutate(new FormData(form), {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const sendingCampaign = campaigns.data?.items.find(
    (item) => item.id === search.sending,
  );
  const deletingCampaign = campaigns.data?.items.find(
    (item) => item.id === search.deleting,
  );
  const cancellingCampaign = campaigns.data?.items.find(
    (item) => item.id === search.cancelling,
  );

  const items = campaigns.data?.items ?? [];
  const pagination = campaigns.data?.pagination;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-brand-blue-soft uppercase">Comms</p>
          <h1 className="mt-1 text-heading font-medium text-white">Email</h1>
        </div>
        <a
          href={exportUrl('api/admin/exports/subscribers')}
          className="flex h-11 items-center gap-2 rounded-xs border border-line bg-ink-raised px-4 text-button text-white/85 transition-colors hover:border-brand-blue hover:text-white"
          download
        >
          <Download size={16} strokeWidth={2} aria-hidden="true" />
          Export subscribers
        </a>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {/* Composer — Medium-style long-form canvas */}
        <div className="xl:col-span-3">
          <CampaignComposer
            key={editingCampaign?.id ?? 'new'}
            campaign={editingCampaign}
            saving={saveMutation.isPending}
            error={saveMutation.error?.message}
            finalistSubjectRef={finalistSubjectRef}
            onSubmit={(data) => {
              saveMutation.mutate(data);
            }}
            onBodyChange={(doc) => {
              documentRef.current = doc;
            }}
            onNew={() => {
              setSearch({ compose: undefined });
            }}
            onRequestFinalist={() => {
              setSearch({ finalist: true, confirmText: undefined });
            }}
          />
        </div>

        {/* Campaign list */}
        <section className="flex flex-col gap-4 xl:col-span-2">
          <div className="rounded-card border border-line bg-ink-raised p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-label text-white">
                <Mail
                  size={18}
                  strokeWidth={1.75}
                  className="text-brand-blue-soft"
                  aria-hidden="true"
                />
                Campaigns {pagination ? `(${String(pagination.total)})` : ''}
              </h2>
              <label className="flex items-center gap-2 text-xs text-muted">
                Test recipient
                <input
                  ref={testAddressRef}
                  type="email"
                  placeholder="you@techignite.net"
                  className="h-9 w-44 rounded-xs border border-line bg-ink px-2 text-sm text-paper outline-none focus:border-brand-blue"
                />
              </label>
            </div>

            {campaigns.isPending ? (
              <div className="mt-4 flex flex-col gap-2" aria-busy="true">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xs bg-ink-soft" />
                ))}
                <span className="sr-only">Loading campaigns…</span>
              </div>
            ) : campaigns.error ? (
              <p className="mt-4 text-sm text-[#ff9d91]">Couldn’t load campaigns.</p>
            ) : items.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No campaigns yet. Save your first draft.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col divide-y divide-line/60">
                {items.map((campaign) => (
                  <li key={campaign.id} className="flex flex-col gap-2 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch({ compose: campaign.id });
                        }}
                        className="text-left font-medium text-white hover:text-brand-blue-soft"
                        title="Load into composer"
                      >
                        {campaign.name}
                      </button>
                      <span
                        className={`inline-flex items-center rounded-pill border px-3 py-1 text-xs capitalize ${CAMPAIGN_STATUS_STYLES[campaign.status]}`}
                      >
                        {campaign.status.replaceAll('_', ' ')}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted">{campaign.subject}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                      <span>
                        {campaign.sentCount} sent · {campaign.failedCount} failed
                        {campaign.scheduledFor &&
                          ` · scheduled ${new Date(campaign.scheduledFor).toLocaleString()}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <a
                          href={exportUrl(
                            `api/admin/exports/campaign-recipients/${encodeURIComponent(campaign.id)}`,
                          )}
                          download
                          title="Export campaign recipients"
                          aria-label={`Export recipients for ${campaign.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xs text-white/60 transition-colors hover:bg-ink-soft hover:text-white"
                        >
                          <Download size={16} aria-hidden="true" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            testSendMutation.mutate(campaign.id);
                          }}
                          disabled={testSendMutation.isPending}
                          title="Send a test to the test recipient"
                          aria-label={`Send test of ${campaign.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xs text-white/60 transition-colors hover:bg-ink-soft hover:text-white disabled:opacity-50"
                        >
                          <FlaskConical size={16} aria-hidden="true" />
                        </button>
                        {(campaign.status === 'draft' ||
                          campaign.status === 'scheduled') && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch({ sending: campaign.id, confirmText: undefined });
                            }}
                            title="Send now"
                            aria-label={`Send ${campaign.name} now`}
                            className="flex h-9 w-9 items-center justify-center rounded-xs text-white/60 transition-colors hover:bg-ink-soft hover:text-brand-green-bright"
                          >
                            <Send size={16} aria-hidden="true" />
                          </button>
                        )}
                        {campaign.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch({ cancelling: campaign.id });
                            }}
                            title="Cancel scheduled send"
                            aria-label={`Cancel ${campaign.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xs text-white/60 transition-colors hover:bg-ink-soft hover:text-brand-amber"
                          >
                            <Ban size={16} aria-hidden="true" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSearch({ deleting: campaign.id });
                          }}
                          title="Delete campaign"
                          aria-label={`Delete ${campaign.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xs text-white/60 transition-colors hover:bg-ink-soft hover:text-[#ff9d91]"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {testSendMutation.error && (
              <p role="alert" className="mt-2 text-sm text-[#ff9d91]">
                {testSendMutation.error.message}
              </p>
            )}
            {testSendMutation.isSuccess && (
              <p role="status" className="mt-2 text-sm text-brand-green-bright">
                Test email sent.
              </p>
            )}

            {pagination && pagination.total > PAGE_SIZE && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted">
                  {String(search.offset + 1)}–
                  {String(Math.min(search.offset + PAGE_SIZE, pagination.total))} of{' '}
                  {String(pagination.total)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={search.offset === 0}
                    onClick={() => {
                      setSearch({ offset: Math.max(0, search.offset - PAGE_SIZE) });
                    }}
                    className="h-9 rounded-xs border border-line px-3 text-sm text-white/80 disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={search.offset + PAGE_SIZE >= pagination.total}
                    onClick={() => {
                      setSearch({ offset: search.offset + PAGE_SIZE });
                    }}
                    className="h-9 rounded-xs border border-line px-3 text-sm text-white/80 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick template send */}
          <form
            onSubmit={handleTemplateSubmit}
            className="flex flex-col gap-3 rounded-card border border-line bg-ink-raised p-5"
          >
            <h2 className="text-label text-white">Send a template email</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-white/80">
                To
                <input
                  name="to"
                  type="email"
                  required
                  placeholder="team@example.com"
                  className="h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/80">
                Template
                <select
                  name="template"
                  required
                  defaultValue=""
                  className="h-11 rounded-xs border border-line bg-ink px-3 text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="" disabled>
                    Select template…
                  </option>
                  {(templates.data ?? []).map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-white/80">
              templateData <span className="text-muted">(optional JSON object)</span>
              <textarea
                name="templateData"
                rows={2}
                placeholder='{"recipientName": "Ada"}'
                className="rounded-xs border border-line bg-ink px-3 py-2 font-mono text-sm text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              />
            </label>
            {templateSendMutation.error && (
              <p role="alert" className="text-sm text-[#ff9d91]">
                {templateSendMutation.error.message}
              </p>
            )}
            {templateSendMutation.isSuccess && (
              <p role="status" className="text-sm text-brand-green-bright">
                Email sent.
              </p>
            )}
            <button
              type="submit"
              disabled={templateSendMutation.isPending}
              className="flex h-11 items-center gap-2 self-start rounded-xs border border-line bg-ink px-5 text-button text-white/85 transition-colors hover:border-brand-blue hover:text-white disabled:opacity-50"
            >
              <Send size={16} strokeWidth={2} aria-hidden="true" />
              {templateSendMutation.isPending ? 'Sending…' : 'Send template'}
            </button>
          </form>

          {/* Subscribers summary */}
          <div className="rounded-card border border-line bg-ink-raised p-5">
            <h2 className="text-label text-white">Subscribers</h2>
            {subscribers.isPending ? (
              <div
                className="mt-3 h-6 w-48 animate-pulse rounded-xs bg-ink-soft"
                aria-busy="true"
              />
            ) : subscribers.data ? (
              <p className="mt-2 text-sm text-white/80">
                <strong className="text-white tabular-nums">
                  {subscribers.data.active}
                </strong>{' '}
                active ·{' '}
                <strong className="text-white tabular-nums">
                  {subscribers.data.total}
                </strong>{' '}
                total
              </p>
            ) : (
              <p className="mt-2 text-sm text-[#ff9d91]">
                Couldn’t load subscriber counts.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Destructive confirmations — state in URL search params */}
      <ConfirmDialog
        open={sendingCampaign != null}
        title="Send this campaign now?"
        body={
          <p>
            <strong className="text-white">{sendingCampaign?.name}</strong> goes to its
            configured audience immediately. This cannot be recalled. Type the campaign
            name to confirm.
          </p>
        }
        confirmLabel="Send now"
        requireText={sendingCampaign?.name}
        confirmValue={search.confirmText ?? ''}
        onConfirmValueChange={(value) => {
          setSearch({ confirmText: value });
        }}
        destructive
        confirming={sendMutation.isPending}
        onConfirm={() => {
          if (sendingCampaign) sendMutation.mutate(sendingCampaign.id);
        }}
        onCancel={() => {
          setSearch({ sending: undefined, confirmText: undefined });
        }}
      />
      <ConfirmDialog
        open={deletingCampaign != null}
        title="Delete this campaign?"
        body={
          <p>
            <strong className="text-white">{deletingCampaign?.name}</strong> and its
            recipient history are permanently deleted.
          </p>
        }
        confirmLabel="Delete campaign"
        destructive
        confirming={deleteMutation.isPending}
        onConfirm={() => {
          if (deletingCampaign) deleteMutation.mutate(deletingCampaign.id);
        }}
        onCancel={() => {
          setSearch({ deleting: undefined });
        }}
      />
      <ConfirmDialog
        open={cancellingCampaign != null}
        title="Cancel scheduled send?"
        body={
          <p>
            <strong className="text-white">{cancellingCampaign?.name}</strong> will not be
            sent at its scheduled time. You can reschedule it by editing the campaign.
          </p>
        }
        confirmLabel="Cancel send"
        confirming={cancelMutation.isPending}
        onConfirm={() => {
          if (cancellingCampaign) cancelMutation.mutate(cancellingCampaign.id);
        }}
        onCancel={() => {
          setSearch({ cancelling: undefined });
        }}
      />
      <ConfirmDialog
        open={search.finalist === true}
        title="Send finalist invitations?"
        body={
          <p>
            This emails <strong className="text-white">every finalist team</strong>{' '}
            immediately, using the body currently in the composer and the finalist
            subject. There is no undo. Type{' '}
            <strong className="text-white">FINALISTS</strong> to confirm.
          </p>
        }
        confirmLabel="Send finalist invites"
        requireText="FINALISTS"
        confirmValue={search.confirmText ?? ''}
        onConfirmValueChange={(value) => {
          setSearch({ confirmText: value });
        }}
        destructive
        confirming={finalistMutation.isPending}
        onConfirm={() => {
          finalistMutation.mutate();
        }}
        onCancel={() => {
          setSearch({ finalist: undefined, confirmText: undefined });
        }}
      />
      {finalistMutation.error && (
        <p role="alert" className="text-sm text-[#ff9d91]">
          {finalistMutation.error.message}
        </p>
      )}
    </div>
  );
}
