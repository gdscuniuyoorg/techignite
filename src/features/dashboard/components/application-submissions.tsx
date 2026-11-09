import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FolderGit2, Plus, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardPageHeader } from './dashboard-page-header';
import { SubmissionCard } from './submission-card';
import { SubmissionDialog, type SubmissionFormValues } from './submission-dialog';
import { SUBMISSIONS, type CategorySubmission, type SubmissionCategory } from '../data';

interface SubmissionGroup {
  readonly category: SubmissionCategory;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly emptyLabel: string;
  readonly cardVariant: 'simple' | 'detailed';
}

const GROUPS: readonly SubmissionGroup[] = [
  {
    category: 'hackathon',
    title: 'Hackathon Submissions',
    description: 'A quick record of what the team built during the hackathon weekend.',
    icon: Trophy,
    emptyLabel: 'No hackathon submission yet',
    cardVariant: 'simple',
  },
  {
    category: 'project',
    title: 'Project Submissions',
    description: 'Your main submission — judges score this entry.',
    icon: FolderGit2,
    emptyLabel: 'No project submission yet',
    cardVariant: 'detailed',
  },
];

/** Two grouped submission boards; new entries are created in a modal form. */
export function ApplicationSubmissions() {
  const [submissions, setSubmissions] =
    useState<readonly CategorySubmission[]>(SUBMISSIONS);
  const [dialogCategory, setDialogCategory] = useState<SubmissionCategory | null>(null);

  const handleSubmit = (values: SubmissionFormValues) => {
    const entry: CategorySubmission = {
      id: `${values.category}-${String(Date.now())}`,
      category: values.category,
      title: values.title.length > 0 ? values.title : 'Untitled submission',
      summary: values.summary.length > 0 ? values.summary : 'No description yet.',
      status: values.status,
      updatedAt: 'Just now',
      demoUrl: values.demoUrl,
      repositoryUrl: values.repositoryUrl,
      videoUrl: values.videoUrl,
      technologies: values.technologies,
    };
    setSubmissions((previous) => [entry, ...previous]);
    setDialogCategory(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        eyebrow="Submission"
        title="Application Submissions"
        description="Your team's hackathon and project entries, all in one place."
        aside={
          <Button
            type="button"
            onClick={() => {
              setDialogCategory('project');
            }}
          >
            <Plus size={16} aria-hidden="true" />
            Submit project
          </Button>
        }
      />

      {GROUPS.map((group) => {
        const entries = submissions.filter((item) => item.category === group.category);
        const Icon = group.icon;

        return (
          <Card key={group.category} className="bg-slate-50/60">
            <CardHeader className="flex-wrap">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 ring-1 ring-slate-200">
                  <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{group.title}</CardTitle>
                    <Badge variant="secondary">{entries.length}</Badge>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDialogCategory(group.category);
                }}
              >
                <Plus size={14} aria-hidden="true" />
                New submission
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center">
                  <Icon size={20} className="text-slate-400" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-700">{group.emptyLabel}</p>
                  <p className="text-xs text-slate-500">
                    Start a draft — you can finish it later.
                  </p>
                </div>
              ) : (
                entries.map((entry) => (
                  <SubmissionCard
                    key={entry.id}
                    submission={entry}
                    variant={group.cardVariant}
                  />
                ))
              )}
            </CardContent>
          </Card>
        );
      })}

      {dialogCategory !== null && (
        <SubmissionDialog
          initialCategory={dialogCategory}
          onClose={() => {
            setDialogCategory(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
