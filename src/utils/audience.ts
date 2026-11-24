import type { LucideIcon } from 'lucide-react';
import { Atom, Disc, Layers, SquareStack } from 'lucide-react';

export interface AudienceItem {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly description: string;
}

export const audience: readonly AudienceItem[] = [
  {
    icon: SquareStack,
    name: 'Students & Aspiring Talent',
    description:
      'Students, beginners, and emerging tech professionals came to learn new skills and connect with the tech community.',
  },
  {
    icon: Disc,
    name: 'Developers & Builders',
    description:
      'Developers, designers, and makers shared ideas, built products, and created solutions that matter.',
  },
  {
    icon: Atom,
    name: 'Founders & Startups',
    description:
      'Entrepreneurs, startups, and aspiring founders explored how to validate ideas and take their next big step.',
  },
  {
    icon: Layers,
    name: 'Innovators & Tech Leaders',
    description:
      'Industry professionals and community leaders created opportunities for the next generation.',
  },
];
