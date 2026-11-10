import { useEffect, useState } from 'react';
import { Loader2, Save, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TeamProfile } from '@/lib/team-api';
import { teamErrorMessage } from '@/lib/team-api';

export interface SubmissionFormValues {
  readonly title: string;
  readonly summary: string;
  readonly demoUrl: string;
  readonly repositoryUrl: string;
  readonly technologies: readonly string[];
}

export type SubmissionSaveMode = 'draft' | 'submit';

interface SubmissionDialogProps {
  readonly team: TeamProfile;
  readonly onClose: () => void;
  readonly onSave: (
    values: SubmissionFormValues,
    mode: SubmissionSaveMode,
  ) => Promise<void>;
}

function parseTechnologies(value: string): readonly string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/** Modal form for the team's project submission. Mount only while open. */
export function SubmissionDialog({ team, onClose, onSave }: SubmissionDialogProps) {
  const [title, setTitle] = useState(team.projectTitle);
  const [summary, setSummary] = useState(team.projectDescription);
  const [demoUrl, setDemoUrl] = useState(team.demoUrl);
  const [repositoryUrl, setRepositoryUrl] = useState(team.repositoryUrl);
  const [technologies, setTechnologies] = useState(team.technologies.join(', '));
  const [savingMode, setSavingMode] = useState<SubmissionSaveMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const save = async (mode: SubmissionSaveMode) => {
    setError(null);
    setSavingMode(mode);
    try {
      await onSave(
        {
          title: title.trim(),
          summary: summary.trim(),
          demoUrl: demoUrl.trim(),
          repositoryUrl: repositoryUrl.trim(),
          technologies: parseTechnologies(technologies),
        },
        mode,
      );
    } catch (submitError) {
      setError(await teamErrorMessage(submitError));
      setSavingMode(null);
    }
  };

  const busy = savingMode !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Close submission form"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-dialog-title"
        className="relative z-10 my-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/20 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-violet-600 uppercase">
              Project submission
            </p>
            <h2
              id="submission-dialog-title"
              className="mt-1 text-xl font-semibold tracking-tight text-slate-900"
            >
              Submit your project
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Judges see exactly what you enter here. Drafts stay private until you submit
              for judging.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={busy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form
          className="mt-5 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const native = event.nativeEvent;
            const submitter = native instanceof SubmitEvent ? native.submitter : null;
            const isDraft = submitter?.getAttribute('data-action') === 'draft';
            void save(isDraft ? 'draft' : 'submit');
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="submission-title">Project title</Label>
            <Input
              id="submission-title"
              name="title"
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              placeholder="What did you build?"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="submission-summary">Description</Label>
            <Textarea
              id="submission-summary"
              name="summary"
              required
              rows={4}
              value={summary}
              onChange={(event) => {
                setSummary(event.target.value);
              }}
              placeholder="The problem, your solution, and what makes it different."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="submission-demo">Demo URL</Label>
              <Input
                id="submission-demo"
                name="demoUrl"
                type="url"
                required
                value={demoUrl}
                onChange={(event) => {
                  setDemoUrl(event.target.value);
                }}
                placeholder="https://"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="submission-repo">
                Repository URL{' '}
                <span className="font-normal text-slate-400">(GitHub)</span>
              </Label>
              <Input
                id="submission-repo"
                name="repositoryUrl"
                type="url"
                value={repositoryUrl}
                onChange={(event) => {
                  setRepositoryUrl(event.target.value);
                }}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="submission-tech">Tech stack</Label>
            <Input
              id="submission-tech"
              name="technologies"
              value={technologies}
              onChange={(event) => {
                setTechnologies(event.target.value);
              }}
              placeholder="React, Node, PostgreSQL"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <Button type="submit" disabled={busy}>
              {savingMode === 'submit' ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={16} aria-hidden="true" />
              )}
              {savingMode === 'submit' ? 'Submitting…' : 'Submit for judging'}
            </Button>
            <Button
              type="submit"
              variant="outline"
              formNoValidate
              data-action="draft"
              disabled={busy}
            >
              {savingMode === 'draft' ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Save size={16} aria-hidden="true" />
              )}
              {savingMode === 'draft' ? 'Saving…' : 'Save draft'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
