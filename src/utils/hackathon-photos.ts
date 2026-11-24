import photos from './hackathon-photos.json';

/** One photo in the Tech Ignite '26 Hackathon album. */
export interface HackathonPhoto {
  /** Local file for the first ten frames, remote Google CDN URL for the rest. */
  readonly src: string;
  /** Local file used when a remote `src` fails to load or has expired. */
  readonly fallback: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export const hackathonPhotos: readonly HackathonPhoto[] = photos;
