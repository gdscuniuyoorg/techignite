import { useState, type RefObject, type SyntheticEvent } from 'react';
import { CalendarClock, ChevronDown, Plus, Rocket, Save } from 'lucide-react';
import type { CampaignAudience, EmailCampaign } from '@/lib/admin-api';
import {
  TiptapEditor,
  type EmailDocument,
} from '@/features/admin/components/tiptap-editor';

const AUDIENCE_OPTIONS: readonly { value: CampaignAudience; label: string }[] = [
  { value: 'subscribers', label: 'Newsletter subscribers' },
  { value: 'all_applicants', label: 'All applicants' },
  { value: 'accepted_teams', label: 'Accepted teams' },
  { value: 'finalists', label: 'Finalist teams' },
  { value: 'reviewers', label: 'Reviewers' },
  { value: 'admins', label: 'Admins' },
  { value: 'custom', label: 'Custom recipients' },
];

interface CampaignComposerProps {
  readonly campaign: EmailCampaign | undefined;
  readonly saving: boolean;
  readonly error: string | undefined;
  readonly finalistSubjectRef: RefObject<HTMLInputElement | null>;
  readonly onSubmit: (data: FormData) => void;
  readonly onBodyChange: (doc: EmailDocument) => void;
  readonly onNew: () => void;
  readonly onRequestFinalist: () => void;
}

function audienceLabel(audience: CampaignAudience): string {
  return (
    AUDIENCE_OPTIONS.find((option) => option.value === audience)?.label ?? 'Audience'
  );
}

/**
 * Long-form campaign composer styled after a Medium draft: an unboxed title and
 * subject over a white writing canvas, with publishing meta (audience,
 * schedule, finalist send) tucked into the byline instead of a labelled form.
 * Submission is still a real <form> so Enter-to-save and validation work.
 */
export function CampaignComposer({
  campaign,
  saving,
  error,
  finalistSubjectRef,
  onSubmit,
  onBodyChange,
  onNew,
  onRequestFinalist,
}: CampaignComposerProps) {
  const [audience, setAudience] = useState<CampaignAudience>(
    campaign?.audience ?? 'subscribers',
  );
  const [finalistOpen, setFinalistOpen] = useState(false);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  };

  const statusLabel = campaign ? campaign.status.replaceAll('_', ' ') : 'New draft';

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Composer bar — status on the left, publishing actions on the right. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-3 sm:px-10">
        <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" aria-hidden="true" />
          {statusLabel}
        </span>
        <div className="flex items-center gap-2">
          {campaign && (
            <button
              type="button"
              onClick={onNew}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Plus size={14} strokeWidth={2} aria-hidden="true" />
              New campaign
            </button>
          )}
          <button
            type="button"
            aria-expanded={finalistOpen}
            onClick={() => {
              setFinalistOpen((open) => !open);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand-amber/40 px-3 text-sm text-brand-amber transition-colors hover:bg-brand-amber/10"
          >
            <Rocket size={14} strokeWidth={2} aria-hidden="true" />
            Finalist invites
          </button>
        </div>
      </div>

      {finalistOpen && (
        <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 bg-brand-amber/5 px-6 py-4 sm:px-10">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-slate-600">
            Finalist subject
            <input
              ref={finalistSubjectRef}
              type="text"
              placeholder="You're a finalist — next steps"
              className="h-10 w-full rounded-lg border border-brand-amber/30 bg-white px-3 text-sm font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRequestFinalist}
              className="inline-flex h-10 items-center rounded-full bg-brand-amber px-4 text-sm font-medium text-slate-950 transition-opacity hover:opacity-90"
            >
              Send invites…
            </button>
            <button
              type="button"
              onClick={() => {
                setFinalistOpen(false);
              }}
              className="h-10 px-3 text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
          <p className="w-full text-xs text-slate-500">
            Sends immediately to every finalist team using the body below and this
            subject. There is no undo.
          </p>
        </div>
      )}

      {/* Writing canvas. */}
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <label htmlFor="campaign-name" className="sr-only">
          Campaign title
        </label>
        <input
          id="campaign-name"
          name="name"
          required
          autoComplete="off"
          defaultValue={campaign?.name ?? ''}
          placeholder="Campaign title"
          className="w-full border-0 bg-transparent text-[2rem] leading-[1.15] font-semibold tracking-[-0.02em] text-slate-950 outline-none placeholder:text-slate-300 sm:text-[2.6rem] sm:leading-[1.1]"
        />

        <label htmlFor="campaign-subject" className="sr-only">
          Subject line
        </label>
        <input
          id="campaign-subject"
          name="subject"
          required
          autoComplete="off"
          defaultValue={campaign?.subject ?? ''}
          placeholder="Add a subject line so readers know what this is about"
          className="mt-3 w-full border-0 bg-transparent text-lg text-slate-600 outline-none placeholder:text-slate-400 sm:text-xl"
        />

        {/* Byline: author identity plus publishing meta, Medium-style. */}
        <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <img
              src="/icons/logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
            <span className="font-medium text-slate-700">Tech Ignite Comms</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <label className="relative flex items-center">
            <span className="sr-only">Audience</span>
            <select
              name="audience"
              value={audience}
              onChange={(event) => {
                const next = AUDIENCE_OPTIONS.find(
                  (option) => option.value === event.target.value,
                );
                if (next) setAudience(next.value);
              }}
              className="cursor-pointer appearance-none rounded-full border border-transparent py-1 pr-6 pl-2 font-medium text-slate-700 transition-colors outline-none hover:border-slate-200 hover:bg-slate-50 focus:border-brand-blue focus:bg-white"
            >
              {AUDIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-1.5 text-slate-400"
              aria-hidden="true"
            />
          </label>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <label className="flex items-center gap-1.5">
            <CalendarClock size={15} className="text-slate-400" aria-hidden="true" />
            <span className="sr-only">Schedule for (optional)</span>
            <input
              type="datetime-local"
              name="scheduledFor"
              defaultValue={
                campaign?.scheduledFor ? campaign.scheduledFor.slice(0, 16) : ''
              }
              className="bg-transparent py-1 text-sm text-slate-600 outline-none focus:text-slate-900"
            />
          </label>
        </div>

        {audience === 'custom' && (
          <label className="mt-5 block rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-medium text-slate-600">
            Custom recipients{' '}
            <span className="font-normal text-slate-400">— one address per line</span>
            <textarea
              name="customRecipients"
              rows={3}
              defaultValue={campaign?.customRecipients?.join('\n') ?? ''}
              placeholder={'ada@example.com\nfemi@example.com'}
              className="mt-2 block w-full resize-y bg-transparent font-mono text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
        )}

        <div className="mt-8 border-t border-slate-200/80 pt-6">
          <TiptapEditor
            key={campaign?.id ?? 'new'}
            variant="document"
            initialHtml={
              campaign
                ? (campaign.htmlContent ??
                  (campaign.content === '' ? undefined : campaign.content))
                : undefined
            }
            onChange={onBodyChange}
            ariaLabel="Campaign email body"
          />
        </div>
      </div>

      {/* Publishing footer. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={15} strokeWidth={2} aria-hidden="true" />
            {saving ? 'Saving…' : campaign ? 'Save changes' : 'Save draft'}
          </button>
          <p className="text-xs text-slate-500">
            {campaign
              ? 'Changes stay private until you send or schedule this campaign.'
              : 'Saves as a private draft — nothing is emailed yet.'}
          </p>
        </div>
        <span className="text-xs text-slate-400">{audienceLabel(audience)}</span>
      </div>

      {error && (
        <p
          role="alert"
          className="border-t border-brand-red/20 bg-brand-red/5 px-6 py-3 text-sm text-brand-red sm:px-10"
        >
          {error}
        </p>
      )}
    </form>
  );
}
