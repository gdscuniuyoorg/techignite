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
