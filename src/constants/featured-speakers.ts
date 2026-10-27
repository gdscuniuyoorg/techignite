export interface FeaturedSpeaker {
  name: string;
  role: string;
  image: string;
  width: number;
  height: number;
}

export const featuredSpeakers: readonly FeaturedSpeaker[] = [
  {
    name: 'Marcus Sato',
    role: 'CEO, NeoXR Labs',
    image: '/images/speaker-lineup/Sato.jpg',
    width: 308,
    height: 400,
  },
  {
    name: 'Ava Martinezz',
    role: 'Creative Director, PixelWave',
    image: '/images/speaker-lineup/Ava-2.jpg',
    width: 308,
    height: 400,
  },
  {
    name: 'Kenji Lee',
    role: 'CEO, Visionary Collective',
    image: '/images/speaker-lineup/Kenji.jpg',
    width: 308,
    height: 400,
  },
  {
    name: 'Ava Nakamura',
    role: 'Director, MetaLab Studios',
    image: '/images/speaker-lineup/Ava.jpg',
    width: 308,
    height: 400,
  },
  {
    name: 'Luca Fernandez',
    role: 'CIO, Adobe Creative Cloud',
    image: '/images/speaker-lineup/Luca.jpg',
    width: 308,
    height: 400,
  },
];
