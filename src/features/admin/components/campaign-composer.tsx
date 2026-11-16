import { useRef, useState, type RefObject, type SyntheticEvent } from 'react';
import { CalendarClock, ChevronDown, LayoutTemplate, Plus, Rocket, Save, Send, Sparkles, Users } from 'lucide-react';
import {
  type CampaignAudience,
  type EmailCampaign,
  type EmailTemplateInfo,
  getEmailTemplateContent,
} from '@/lib/admin-api';
import {
  TiptapEditor,
  type EmailDocument,
} from '@/features/admin/components/tiptap-editor';

const MERGE_TAGS = [
  { tag: '$first_name', label: 'First name', example: 'Ada' },
  { tag: '$team_name', label: 'Team name', example: 'Fintech Innovators' },
  { tag: '$project_title', label: 'Project title', example: 'PayFlow' },
  { tag: '$email', label: 'Email', example: 'ada@example.com' },
] as const;

const AUDIENCE_OPTIONS: readonly { value: CampaignAudience; label: string }[] = [
  { value: 'subscribers', label: 'Newsletter subscribers' },
  { value: 'all_applicants', label: 'All applicants' },
  { value: 'accepted_teams', label: 'Accepted teams' },
  { value: 'finalists', label: 'Finalist teams' },
  { value: 'reviewers', label: 'Reviewers' },
  { value: 'admins', label: 'Admins' },
  { value: 'custom', label: 'Custom recipients / Batch list' },
];

interface CampaignComposerProps {
  readonly campaign: EmailCampaign | undefined;
  readonly saving: boolean;
  readonly sending: boolean;
  readonly error: string | undefined;
  readonly finalistSubjectRef: RefObject<HTMLInputElement | null>;
  readonly templates?: readonly EmailTemplateInfo[] | undefined;
  readonly onSubmit: (data: FormData) => void;
  readonly onSendNow: (data: FormData) => void;
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
  sending,
  error,
  finalistSubjectRef,
  templates = [],
  onSubmit,
  onSendNow,
  onBodyChange,
  onNew,
  onRequestFinalist,
}: CampaignComposerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const [audience, setAudience] = useState<CampaignAudience>(
    campaign?.audience ?? 'subscribers',
  );
  const [scheduledDate, setScheduledDate] = useState(
    campaign?.scheduledFor ? campaign.scheduledFor.slice(0, 16) : '',
  );
  const [customEmailsText, setCustomEmailsText] = useState(
    campaign?.customRecipients?.join('\n') ?? '',
  );
  const [finalistOpen, setFinalistOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [composerKey, setComposerKey] = useState<number>(0);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [editorInitialHtml, setEditorInitialHtml] = useState<string | undefined>(
    campaign
      ? (campaign.htmlContent ?? (campaign.content === '' ? undefined : campaign.content))
      : undefined,
  );

  const customRecipientCount = customEmailsText
    .split(/[\n,;]+/)
    .map((entry) => entry.trim())
    .filter((entry) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(entry)).length;

  const handleTemplateSelect = async (templateName: string) => {
    setSelectedTemplate(templateName);
    if (!templateName) return;
    try {
      const templateData = await getEmailTemplateContent(templateName);
      if (templateData) {
        if (subjectInputRef.current) {
          subjectInputRef.current.value = templateData.subject;
        }
        if (nameInputRef.current && (!nameInputRef.current.value || nameInputRef.current.value === 'Campaign title')) {
          nameInputRef.current.value = templateData.name.replace(/-/g, ' ');
        }
        setEditorInitialHtml(templateData.body);
        setComposerKey((k) => k + 1);
        onBodyChange({
          html: templateData.body,
          text: templateData.body.replace(/<[^>]+>/g, ' '),
        });
      }
    } catch (err) {
      console.error('Failed to load template content:', err);
    }
  };

  const handleInsertTag = (tag: string) => {
    if (document.activeElement === subjectInputRef.current && subjectInputRef.current) {
      const input = subjectInputRef.current;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const nextVal = input.value.slice(0, start) + ' ' + tag + ' ' + input.value.slice(end);
      input.value = nextVal.trim();
    } else {
      navigator.clipboard.writeText(tag).catch(() => {});
    }
    setCopiedTag(tag);
    setTimeout(() => {
      setCopiedTag(null);
    }, 2500);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  };

  const handleSendNow = () => {
    const form = formRef.current;
    if (!form) return;
    // Run the browser's required-field validation before opening the
    // confirmation dialog, so a half-filled campaign never reaches the send
    // prompt.
    if (!form.reportValidity()) return;
    onSendNow(new FormData(form));
  };

  const statusLabel = campaign ? campaign.status.replaceAll('_', ' ') : 'New draft';
  const canSendNow =
    campaign === undefined ||
    campaign.status === 'draft' ||
    campaign.status === 'scheduled';

  return (
    <form
      ref={formRef}
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
              defaultValue="You're a finalist — next steps"
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
            Sends immediately to every finalist team using the body in the composer and this subject.
          </p>
        </div>
      )}

      {/* Writing canvas. */}
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <label htmlFor="campaign-name" className="sr-only">
          Campaign title
        </label>
        <input
          ref={nameInputRef}
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
          ref={subjectInputRef}
          id="campaign-subject"
          name="subject"
          required
          autoComplete="off"
          defaultValue={campaign?.subject ?? ''}
          placeholder="Add a subject line (e.g. Congratulations $team_name!)"
          className="mt-3 w-full border-0 bg-transparent text-lg text-slate-600 outline-none placeholder:text-slate-400 sm:text-xl"
        />

        {/* Publishing controls: Audience selection, Template preset & Schedule */}
        <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <img
              src="/icons/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full border border-slate-200 object-cover"
            />
            <span className="font-medium text-slate-700">Comms</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <div className="flex items-center gap-1.5">
            <Users size={15} className="text-slate-400" aria-hidden="true" />
            <label className="relative flex items-center">
              <span className="sr-only">Target audience</span>
              <select
                name="audience"
                value={audience}
                onChange={(event) => {
                  const next = AUDIENCE_OPTIONS.find(
                    (option) => option.value === event.target.value,
                  );
                  if (next) setAudience(next.value);
                }}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-7 pl-2.5 text-xs font-medium text-slate-800 transition-colors outline-none hover:border-slate-300 hover:bg-white focus:border-brand-blue focus:bg-white"
              >
                {AUDIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2 text-slate-400"
                aria-hidden="true"
              />
            </label>
          </div>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <div className="flex items-center gap-1.5">
            <LayoutTemplate size={15} className="text-slate-400" aria-hidden="true" />
            <label className="relative flex items-center">
              <span className="sr-only">Load starter template</span>
              <select
                value={selectedTemplate}
                onChange={(e) => void handleTemplateSelect(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-7 pl-2.5 text-xs font-medium text-slate-800 transition-colors outline-none hover:border-slate-300 hover:bg-white focus:border-brand-blue focus:bg-white"
              >
                <option value="">Load template…</option>
                {templates.map((tpl) => (
                  <option key={tpl.name} value={tpl.name}>
                    Template: {tpl.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2 text-slate-400"
                aria-hidden="true"
              />
            </label>
          </div>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <div className="flex items-center gap-1.5">
            <CalendarClock size={15} className="text-slate-400" aria-hidden="true" />
            <label className="flex items-center">
              <span className="sr-only">Schedule for (optional)</span>
              <input
                type="datetime-local"
                name="scheduledFor"
                value={scheduledDate}
                onChange={(e) => {
                  setScheduledDate(e.target.value);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-700 outline-none hover:border-slate-300 focus:border-brand-blue focus:bg-white"
              />
            </label>
            {scheduledDate && (
              <button
                type="button"
                onClick={() => {
                  setScheduledDate('');
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
                title="Clear schedule"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {audience === 'custom' && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="custom-recipients" className="text-xs font-semibold text-slate-700">
                Custom Recipients (Batch Send)
              </label>
              <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-medium text-slate-600">
                {customRecipientCount === 1
                  ? '1 valid email'
                  : `${String(customRecipientCount)} valid emails`}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Enter or paste recipient email addresses separated by commas, semicolons, or new lines to batch send to this list.
            </p>
            <textarea
              id="custom-recipients"
              name="customRecipients"
              rows={4}
              value={customEmailsText}
              onChange={(e) => {
                setCustomEmailsText(e.target.value);
              }}
              placeholder={'ada@example.com\nfemi@example.com\nteam@startup.io'}
              className="mt-3 block w-full resize-y rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        )}

        {/* Dynamic merge variables toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs">
          <span className="font-semibold text-slate-700">Dynamic variables:</span>
          {MERGE_TAGS.map(({ tag, label }) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleInsertTag(tag)}
              title={`Click to copy ${tag} (or insert into subject if focused)`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-blue shadow-xs transition hover:border-brand-blue/50 hover:bg-brand-blue/5 active:scale-95"
            >
              <span>+{tag}</span>
              <span className="font-sans text-[10px] text-slate-400">({label})</span>
            </button>
          ))}
          <div className="ml-auto text-[11px] text-slate-500">
            {copiedTag ? (
              <span className="font-medium text-emerald-600">
                Copied <strong className="font-mono">{copiedTag}</strong> to clipboard! Paste into your email body.
              </span>
            ) : (
              <span>Auto-materializes per recipient upon send</span>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200/80 pt-6">
          <TiptapEditor
            key={`${campaign?.id ?? 'new'}-${composerKey}`}
            variant="document"
            initialHtml={editorInitialHtml}
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
            disabled={saving || sending}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={15} strokeWidth={2} aria-hidden="true" />
            {saving
              ? 'Saving…'
              : scheduledDate
                ? 'Schedule campaign'
                : campaign
                  ? 'Save changes'
                  : 'Save draft'}
          </button>
          {canSendNow && (
            <button
              type="button"
              onClick={handleSendNow}
              disabled={saving || sending}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-brand-green-bright/50 px-6 text-sm font-medium text-brand-green-bright transition-colors hover:bg-brand-green-bright/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={15} strokeWidth={2} aria-hidden="true" />
              {sending ? 'Sending…' : 'Send now'}
            </button>
          )}
          <p className="text-xs text-slate-500">
            {scheduledDate
              ? 'Saves as scheduled to be sent automatically at the selected time.'
              : campaign
                ? 'Changes stay private until you send or schedule this campaign.'
                : 'Save as a draft or send immediately to the selected audience.'}
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500">{audienceLabel(audience)}</span>
      </div>
      {error && (
        <div className="border-t border-[#ff9d91]/30 bg-[#ff9d91]/10 px-6 py-3 sm:px-10">
          <p role="alert" className="text-xs font-medium text-[#ff9d91]">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}
