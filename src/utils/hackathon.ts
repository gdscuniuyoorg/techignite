export interface HackathonStat {
  readonly value: string;
  readonly label: string;
}

export const hackathonStats: readonly HackathonStat[] = [
  {
    value: '#1 Million',
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
