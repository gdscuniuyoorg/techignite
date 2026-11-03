export interface DummySpeakerCardProps {
  readonly colorIndex?: number;
  readonly name?: string;
  readonly role?: string;
  readonly className?: string;
}

/**
 * Mystery unrevealed speaker card. Rotates two design-token pastel stages
 * (cream-arch tone and blue-pale mosaic tone) so the ink-canvas grid keeps
 * the festival mosaic rhythm without inventing colors: the dashed ring,
 * silhouette, paper plate, and type are all built from the ink/paper/muted
 * tokens. Class strings are literal — Tailwind compiles only what it sees.
 */
const DUMMY_STAGE_CLASSES: readonly string[] = [
  'bg-accent', // brand-cream — the hero-arch tone
  'bg-brand-blue-pale', // the checker-mosaic pale tone
];

export function DummySpeakerCard({
  colorIndex = 0,
  name = 'FULL NAME',
  role = 'Job Title — Company Name',
  className = '',
}: DummySpeakerCardProps) {
  const bgClass: string =
    DUMMY_STAGE_CLASSES[Math.abs(colorIndex) % DUMMY_STAGE_CLASSES.length] ?? 'bg-accent';

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-card border border-line-light bg-paper shadow-[0_18px_36px_-22px_rgba(5,5,5,0.55)] transition-transform duration-300 ${className}`}
    >
      {/* Pastel avatar stage — token tint only, no raw pastels */}
      <div
        className={`flex aspect-[4/4.1] w-full items-center justify-center p-6 ${bgClass}`}
      >
        <div className="flex aspect-square w-[58%] items-center justify-center rounded-full border-2 border-dashed border-ink/30 p-2 sm:p-2.5">
          {/* Portrait minutes still to come — silhouette in ink, base in mist */}
          <div className="flex size-full items-end justify-center overflow-hidden rounded-full bg-mist">
            <svg
              viewBox="0 0 120 120"
              fill="currentColor"
              className="h-[75%] w-[75%] translate-y-1.5 text-ink/75"
              aria-hidden="true"
            >
              <path d="M60 16 C48 16 38 26 38 38 C38 49 46 58 57 60 C33 64 20 80 18 104 C28 114 43 120 60 120 C77 120 92 114 102 104 C100 80 87 64 63 60 C74 58 82 49 82 38 C82 26 72 16 60 16 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Teaser plate — paper below, ink type, Google Sans caps lockup */}
      <div className="flex flex-col justify-center bg-paper px-5 py-4">
        <h3 className="text-base font-bold tracking-[0.05em] text-ink uppercase sm:text-lg">
          {name}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-dark sm:text-sm">{role}</p>
      </div>
    </div>
  );
}
