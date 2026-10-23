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
    description: 'Global innovators and creative leaders sharing insights that help you.',
  },
  {
    value: '1500+',
    target: 1500,
    suffix: '+',
    duration: 2.2,
    description:
      'Connect with fellow tech students, share ideas, and explore new opportunities together.',
  },
  {
    value: '5k+',
    target: 5,
    suffix: 'k+',
    duration: 1.1,
    description:
      'A vibrant community of creators from around the world has the best outcome.',
  },
];
