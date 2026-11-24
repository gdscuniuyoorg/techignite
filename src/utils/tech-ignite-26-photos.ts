import photos from './tech-ignite-26-photos.json';

/** One frame from the Tech Ignite '26 photo album. */
export interface TechIgnite26Photo {
  /** Locally hosted, 1600px-wide copy of the Drive photo. */
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export const techIgnite26Photos: readonly TechIgnite26Photo[] = photos;
