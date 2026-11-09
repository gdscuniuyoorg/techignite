import type { DashboardSubmissionStatus } from './components/submission-status';

export interface ChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly met: boolean;
}

export interface TeamMember {
  readonly name: string;
  readonly initials: string;
  readonly role: string;
  readonly email: string;
  readonly confirmed: boolean;
}

export interface TimelineEntry {
  readonly date: string;
  readonly label: string;
  readonly detail: string;
  readonly state: 'done' | 'current' | 'upcoming';
}

export interface StatusStep {
  readonly label: string;
  readonly hint: string;
}

export const MOCK_TEAM = {
  name: 'Neon Ledger',
  code: 'TI26-0431',
  track: 'Build with Paga Shipathon',
  seats: 4,
  deadline: '18 Nov 2026 · 11:59 PM WAT',
  daysLeft: 10,
  lastSaved: '8 Nov 2026',
} as const;

export const MOCK_LEAD = {
  name: 'Emediong Essien',
  initials: 'EE',
  role: 'Team lead',
} as const;

export const MOCK_SUBMISSION = {
  title: 'Paga Split — group payments for campus collectives',
  description:
    'A shared wallet for student teams: collect dues, split event costs, and settle instantly with Paga. Built for the 2026 campus hackathon season.',
  demoUrl: 'https://paga-split.demo.techignite.net',
  repositoryUrl: 'https://git.techignite.net/neon-ledger/paga-split',
  videoUrl: '',
  technologies: ['TanStack Start', 'TypeScript', 'PostgreSQL', 'Paga API'],
} as const;

export type SubmissionCategory = 'hackathon' | 'project';

export interface CategorySubmission {
  readonly id: string;
  readonly category: SubmissionCategory;
  readonly title: string;
  readonly summary: string;
  readonly status: DashboardSubmissionStatus;
  readonly updatedAt: string;
  readonly demoUrl: string;
  readonly repositoryUrl: string;
  readonly videoUrl: string;
  readonly technologies: readonly string[];
}

export const SUBMISSIONS: readonly CategorySubmission[] = [
  {
    id: 'hackathon-paga-split',
    category: 'hackathon',
    title: MOCK_SUBMISSION.title,
    summary: MOCK_SUBMISSION.description,
    status: 'draft',
    updatedAt: '8 Nov 2026',
    demoUrl: MOCK_SUBMISSION.demoUrl,
    repositoryUrl: '',
    videoUrl: '',
    technologies: MOCK_SUBMISSION.technologies,
  },
  {
    id: 'project-ignite-campus',
    category: 'project',
    title: 'Ignite Campus — event operations for student chapters',
    summary:
      'An operations workspace for GDSC chapters: plan meetups, track budgets, and publish recaps without spreadsheets. Built as the team’s post-hackathon product.',
    status: 'submitted',
    updatedAt: '6 Nov 2026',
    demoUrl: 'https://ignite-campus.demo.techignite.net',
    repositoryUrl: 'https://git.techignite.net/neon-ledger/ignite-campus',
    videoUrl: 'https://drive.techignite.net/neon-ledger/ignite-campus-walkthrough',
    technologies: ['TanStack Start', 'TypeScript', 'Drizzle', 'Tailwind CSS'],
  },
];

export const CHECKLIST: readonly ChecklistItem[] = [
  {
    id: 'profile',
    label: 'Team profile complete',
    detail: 'Team name, track, and every member email confirmed.',
    met: true,
  },
  {
    id: 'details',
    label: 'Project title and description',
    detail: 'At least 120 characters describing the problem and solution.',
    met: true,
  },
  {
    id: 'demo',
    label: 'Working demo link',
    detail: 'A live URL judges can open without credentials.',
    met: true,
  },
  {
    id: 'repo',
    label: 'Repository link',
    detail: 'Read-only access is fine; history must show the team’s work.',
    met: true,
  },
  {
    id: 'video',
    label: '3-minute demo video',
    detail: 'Upload to the shared drive and paste the link here.',
    met: false,
  },
  {
    id: 'members',
    label: 'All members confirmed',
    detail: 'Three of four teammates have accepted their invites.',
    met: true,
  },
];

export const MEMBERS: readonly TeamMember[] = [
  {
    name: 'Emediong Essien',
    initials: 'EE',
    role: 'Team lead · Frontend',
    email: 'emediong@techignite.net',
    confirmed: true,
  },
  {
    name: 'Mfoniso Ibokette',
    initials: 'MI',
    role: 'Backend',
    email: 'mfoniso@techignite.net',
    confirmed: true,
  },
  {
    name: 'Thanhiela Okon',
    initials: 'TO',
    role: 'Design',
    email: 'thanhiela@techignite.net',
    confirmed: true,
  },
  {
    name: 'Gideon Jones',
    initials: 'GJ',
    role: 'Product',
    email: 'gideon@techignite.net',
    confirmed: false,
  },
];

export const STEPS: readonly StatusStep[] = [
  { label: 'Draft', hint: 'In progress' },
  { label: 'Submitted', hint: 'Locked for judging' },
  { label: 'Under review', hint: 'Judges scoring' },
  { label: 'Decision', hint: 'Results out' },
];

export const STEP_INDEX: Record<DashboardSubmissionStatus, number> = {
  draft: 0,
  submitted: 1,
  under_review: 2,
  accepted: 3,
  rejected: 3,
};

export const TIMELINE: readonly TimelineEntry[] = [
  {
    date: '14 Oct',
    label: 'Team created',
    detail: 'Neon Ledger registered for the Build with Paga Shipathon.',
    state: 'done',
  },
  {
    date: '28 Oct',
    label: 'Application accepted',
    detail: 'Your team cleared screening and received onboarding details.',
    state: 'done',
  },
  {
    date: '01 Nov',
    label: 'Team onboarded',
    detail: 'Workspace provisioned and sponsor docs shared.',
    state: 'done',
  },
  {
    date: '04 Nov',
    label: 'Draft started',
    detail: 'Project details saved for the first time.',
    state: 'done',
  },
  {
    date: '08 Nov',
    label: 'Last saved',
    detail: 'Checklist updated — demo video still outstanding.',
    state: 'current',
  },
  {
    date: '18 Nov',
    label: 'Submission deadline',
    detail: 'Portal closes at 11:59 PM WAT. No late entries.',
    state: 'upcoming',
  },
  {
    date: '19 Nov',
    label: 'Judging begins',
    detail: 'Reviewers score every submitted project on the rubric.',
    state: 'upcoming',
  },
];
