export interface StatItem {
  value: string;
  target: number;
  suffix: string;
  duration: number;
  description: string;
}

export const stats: readonly StatItem[] = [
  {
    value: '20+',
    target: 20,
    suffix: '+',
    duration: 1.4,
    description:
      'Innovators and creative leaders shared practical insights with the community.',
  },
  {
    value: '1500+',
    target: 1500,
    suffix: '+',
    duration: 2.2,
    description:
      'Students, developers, founders, and creators gathered to learn, connect, and build.',
  },
  {
    value: '5k+',
    target: 5,
    suffix: 'k+',
    duration: 1.1,
    description:
      "Community members were reached through the ideas, stories, and momentum of Tech Ignite '26.",
  },
];
