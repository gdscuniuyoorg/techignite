export interface ShipathonStat {
  readonly value: string;
  readonly label: string;
}

export const shipathonStats: readonly ShipathonStat[] = [
  {
    value: '₦1 Million',
    label: 'Total prize pool, equity-free',
  },
  {
    value: '3–5',
    label: 'Builders per team',
  },
  {
    value: '2 Weeks',
    label: 'To ship a working prototype',
  },
];

/** Backgrounds invited to the shipathon — rendered as chips on /apply. */
export const shipathonBackgrounds: readonly string[] = [
  'Developers',
  'Tech Enthusiasts',
  'Students',
  'Individuals & Teams',
];

export interface ShipathonMilestone {
  readonly name: string;
  readonly date: string;
}

export const shipathonTimeline: readonly ShipathonMilestone[] = [
  {
    name: 'Hackathon announcement',
    date: 'Monday, 2nd of October',
  },
  {
    name: 'Registration ends',
    date: 'Saturday, 7th of November',
  },
  {
    name: 'Introduction call',
    date: 'Sunday, 8th of November',
  },
  {
    name: 'Building ends',
    date: '18th of November',
  },
  {
    name: 'Screening day',
    date: '19th of November',
  },
  {
    name: 'Final Demo Day & prize giving',
    date: '20th of November',
  },
];

export interface ShipathonCriterion {
  readonly id: string;
  readonly name: string;
  readonly points: number;
  readonly description: string;
}

export const shipathonCriteria: readonly ShipathonCriterion[] = [
  {
    id: 'technical-quality',
    name: 'Technical Quality',
    points: 30,
    description:
      'Assesses code correctness, memory safety, efficiency, and maintainability.',
  },
  {
    id: 'innovation',
    name: 'Innovation',
    points: 20,
    description:
      'Rewards novelty of approach, originality, and creative problem-solving.',
  },
  {
    id: 'impact-relevance',
    name: 'Impact & Relevance',
    points: 20,
    description:
      'Measures the solution’s usefulness and applicability to African and global challenges.',
  },
  {
    id: 'usability-design',
    name: 'Usability & Design',
    points: 20,
    description: 'Evaluates user experience, documentation quality, and accessibility.',
  },
  {
    id: 'presentation',
    name: 'Presentation',
    points: 10,
    description:
      'Judges the clarity of the demonstration, technical explanation, and overall delivery.',
  },
];

export type ShipathonJudgeMode = 'virtual' | 'in-person';

export interface ShipathonJudge {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly mode: ShipathonJudgeMode;
}

export const shipathonJudges: readonly ShipathonJudge[] = [
  {
    id: 'tayo-oviosu',
    name: 'Tayo Oviosu',
    role: 'CEO of Paga',
    mode: 'virtual',
  },
  {
    id: 'paga-engineer',
    name: 'Announcing soon',
    role: 'Paga Engine Engineer',
    mode: 'in-person',
  },
  {
    id: 'femi-aluko',
    name: 'Femi Aluko',
    role: 'CEO/Co-founder of Chowdeck',
    mode: 'in-person',
  },
  {
    id: 'saviour-inyang',
    name: 'Saviour Inyang',
    role: 'Product Designer at Cowrywise',
    mode: 'in-person',
  },
  {
    id: 'judge-five',
    name: 'Announcing soon',
    role: 'To be announced',
    mode: 'in-person',
  },
  {
    id: 'judge-six',
    name: 'Announcing soon',
    role: 'To be announced',
    mode: 'in-person',
  },
];

export interface ShipathonPrize {
  readonly label: string;
  readonly amount: string;
  readonly description: string;
}

export const shipathonPrizes: readonly ShipathonPrize[] = [
  {
    label: '1st Place',
    amount: '₦500,000',
    description: 'Cash prize, merch boxes, plus the chance to intern with Paga.',
  },
  {
    label: '2nd Runner-up',
    amount: '₦300,000',
    description: 'Cash prize and merch boxes for the second runner-up.',
  },
  {
    label: '3rd Runner-up',
    amount: '₦200,000',
    description: 'Cash prize and merch boxes for the third runner-up.',
  },
];

/** Official hackathon hashtags — rendered as the closing statement on /apply. */
export const shipathonHashtags: readonly string[] = [
  '#techignite26hackathon',
  '#buildwithpagahackathon',
];
