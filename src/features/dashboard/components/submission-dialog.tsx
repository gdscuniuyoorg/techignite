import { useEffect, useState } from 'react';
import { Save, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { SubmissionCategory } from '../data';

export interface SubmissionFormValues {
  readonly category: SubmissionCategory;
  readonly title: string;
  readonly summary: string;
  readonly demoUrl: string;
  readonly repositoryUrl: string;
  readonly videoUrl: string;
  readonly technologies: readonly string[];
  readonly status: 'draft' | 'submitted';
}

const CATEGORY_LABELS: Record<SubmissionCategory, string> = {
  hackathon: 'Hackathon',
  project: 'Project',
};

interface SubmissionDialogProps {
  readonly initialCategory: SubmissionCategory;
  readonly onClose: () => void;
  readonly onSubmit: (values: SubmissionFormValues) => void;
}

function parseTechnologies(value: string): readonly string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/** Modal form for a new hackathon or project submission. Mount only while open. */
export function SubmissionDialog({
  initialCategory,
  onClose,
  onSubmit,
}: SubmissionDialogProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [technologies, setTechnologies] = useState('');

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

  const submit = (status: SubmissionFormValues['status']) => {
    onSubmit({
      category: initialCategory,
      title: title.trim(),
      summary: summary.trim(),
      demoUrl: demoUrl.trim(),
      repositoryUrl: initialCategory === 'project' ? repositoryUrl.trim() : '',
      videoUrl: videoUrl.trim(),
      technologies: parseTechnologies(technologies),
      status,
    });
  };

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
              {CATEGORY_LABELS[initialCategory]}
            </p>
            <h2
              id="submission-dialog-title"
              className="mt-1 text-xl font-semibold tracking-tight text-slate-900"
            >
              Submit your work
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Judges see exactly what you enter here. Drafts stay private.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
            submit(isDraft ? 'draft' : 'submitted');
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="submission-title">Title</Label>
            <Input
              id="submission-title"
              name="title"
              required
              autoFocus
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              placeholder="What are you submitting?"
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

          <div
            className={cn(
              'grid gap-4',
              initialCategory === 'project' && 'sm:grid-cols-2',
            )}
          >
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
            {initialCategory === 'project' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="submission-repo">Repository URL</Label>
                <Input
                  id="submission-repo"
                  name="repositoryUrl"
                  type="url"
                  value={repositoryUrl}
                  onChange={(event) => {
                    setRepositoryUrl(event.target.value);
                  }}
                  placeholder="https://"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="submission-video">Demo video URL</Label>
              <Input
                id="submission-video"
                name="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(event) => {
                  setVideoUrl(event.target.value);
                }}
                placeholder="https://"
              />
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
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <Button type="submit">
              <Send size={16} aria-hidden="true" />
              Submit for judging
            </Button>
            <Button type="submit" variant="outline" formNoValidate data-action="draft">
              <Save size={16} aria-hidden="true" />
              Save draft
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
