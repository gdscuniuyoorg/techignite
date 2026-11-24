/** Photo snippets for the /memories page — Tech Ignite '24 highlights. */
export interface MemoryPhoto {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly date: string;
  readonly width: number;
  readonly height: number;
}

/** Public Drive folder with the Tech Ignite '26 photo snippets. */
export const TECH_IGNITE_26_SNIPPETS_URL =
  'https://drive.google.com/drive/folders/1D79cUQGo1Zr2uow5TvhFkVQ3v8bhWzpV';

export const memoryPhotos: readonly MemoryPhoto[] = [
  {
    src: '/images/speakers/gallery-01.jpg',
    alt: 'Speaker presenting at the Tech Ignite podium',
    caption: 'Opening keynote on the main stage.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-02.jpg',
    alt: 'Attendees networking in the sponsor experience area',
    caption: 'Community and sponsor booths filled the hall.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-03.jpg',
    alt: 'Hackathon teams building through the night',
    caption: 'Shipathon teams building, pitching, and shipping.',
    date: '2026-11-19',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-04.jpg',
    alt: 'Attendees listening to a session',
    caption: 'Talks and conversations from builders across the ecosystem.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-05.jpg',
    alt: 'Group photo of attendees at the Tech Ignite venue',
    caption: 'A full house at the University of Uyo.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-06.jpg',
    alt: 'Judges reviewing Shipathon submissions',
    caption: 'Judges hard at work during the Shipathon review.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-07.jpg',
    alt: 'Attendees posing for a photo',
    caption: 'Faces from the Tech Ignite community.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-08.jpg',
    alt: 'Sponsor booths and community spaces',
    caption: 'Sponsors and community spaces powered the day.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
  {
    src: '/images/speakers/gallery-09.jpg',
    alt: 'Closing ceremony and awards',
    caption: 'Closing ceremony and the Shipathon awards.',
    date: '2026-11-20',
    width: 683,
    height: 689,
  },
];