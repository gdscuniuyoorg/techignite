export interface HackathonStat {
  readonly value: string;
  readonly label: string;
}

export interface HackathonBenefit {
  readonly title: string;
  readonly description: string;
}

export const hackathonBenefits: readonly HackathonBenefit[] = [
  {
    title: 'Turn Ideas Into Reality',
    description:
      'Move beyond concepts and build working solutions to real-world problems. Bring your ideas to life and see what you can create.',
  },
  {
    title: 'Build With Like Minds',
    description:
      'Team up with developers, designers, and innovators who challenge your thinking, share ideas, and push boundaries with you.',
  },
  {
    title: 'Learn by Doing',
    description:
      'Get hands-on experience, experiment with new technologies, solve challenges, and sharpen the skills that matter in the real world.',
  },
  {
    title: 'Show the World What You Can Do',
    description:
      'Present your work, showcase your creativity, connect with the tech community, and put your skills in the spotlight.',
  },
];

export interface HackathonPrize {
  readonly label: string;
  readonly amount: string;
  readonly description: string;
}

export const hackathonPrizes: readonly HackathonPrize[] = [
  {
    label: 'First Prize',
    amount: '₦500,000',
    description:
      'Take the top spot and claim the biggest share of the prize pool for your outstanding innovation.',
  },
  {
    label: '2nd Place',
    amount: '₦300,000',
    description:
      'Earn your place among the best and get rewarded for your creativity, teamwork, and problem-solving.',
  },
  {
    label: '3rd Place',
    amount: '₦200,000',
    description:
      'Make your mark, showcase your skills, and take home a reward for bringing your ideas to life.',
  },
];

export const hackathonStats: readonly HackathonStat[] = [
  {
    value: '₦1 Million',
    label: 'To be won, equity-free',
  },
  {
    value: '3 Finalists',
    label: 'Pitch live on the main stage',
  },
  {
    value: '19th Nov',
    label: 'Final, in person in Uyo',
  },
];

export interface HowItWorksStep {
  readonly name: string;
  readonly date: string;
  readonly description: string;
}

export const howItWorksSteps: readonly HowItWorksStep[] = [
  {
    name: 'Apply',
    date: 'Nov 1, 2026',
    description: 'Complete the form, upload your pitch deck and share a 60-second video.',
  },
  {
    name: 'Review',
    date: 'Nov 14, 2026',
    description:
      'Reviewers score every eligible application and invite a shortlist of 20 to a 15-minute call.',
  },
  {
    name: 'Pitch',
    date: 'Nov 15, 2026',
    description:
      'Shortlisted teams get 15 minutes to pitch live and defend their solution before the judges.',
  },
  {
    name: 'The Final',
    date: 'Nov 19, 2026',
    description:
      'The best teams face off on the main stage — build fast, pitch hard, and take home the prize.',
  },
];

export interface HackathonFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const hackathonFaqItems: readonly HackathonFaqItem[] = [
  {
    id: 'who-can-participate',
    question: 'Who can participate in the hackathon?',
    answer:
      'Students, developers, designers, and aspiring entrepreneurs passionate about technology and solving real-world problems are welcome to participate.',
  },
  {
    id: 'team-requirement',
    question: 'Do I need a team to apply?',
    answer:
      "No — you can apply solo or as a team of up to four. If you'd like a team but don't have one yet, we'll match solo applicants during the shortlist call.",
  },
  {
    id: 'project-scope',
    question: 'What kind of projects can I build?',
    answer:
      'Anything that solves a real problem — web or mobile apps, AI tools, hardware, or open-source contributions. Judges reward creativity and practical impact over polish.',
  },
  {
    id: 'judging',
    question: 'How will the projects be judged?',
    answer:
      'Reviewers score every eligible application on problem fit, creativity, and execution. Shortlisted teams then pitch live, where judges assess impact, technical depth, and presentation.',
  },
  {
    id: 'registration',
    question: 'How do I register?',
    answer:
      'Complete the application form, upload your pitch deck, and share a 60-second video — that secures your spot in the hackathon.',
  },
];
