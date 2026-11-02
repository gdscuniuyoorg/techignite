const DUMMY_SPEAKER_COLORS = [
  'bg-[#FEF0C7]', // warm pastel yellow / cream
  'bg-[#D1FADF]', // soft pastel mint green
  'bg-[#DBEAFE]', // soft pastel sky blue
  'bg-[#FEF0C7]', // warm pastel yellow
  'bg-[#FCE7F3]', // gentle pastel rose pink
] as const;

export interface DummySpeakerCardProps {
  readonly colorIndex?: number;
  readonly name?: string;
  readonly role?: string;
  readonly className?: string;
}

/**
 * Mystery unrevealed speaker card matching the Tech Ignite reference design.
 * Features a pastel stage with a dashed-circle avatar placeholder
 * and teaser text ("FULL NAME", "Job Title — Company Name").
 */
export function DummySpeakerCard({
  colorIndex = 0,
  name = 'FULL NAME',
  role = 'Job Title — Company Name',
  className = '',
}: DummySpeakerCardProps) {
  const bgClass =
    DUMMY_SPEAKER_COLORS[Math.abs(colorIndex) % DUMMY_SPEAKER_COLORS.length] ??
    DUMMY_SPEAKER_COLORS[0];

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm transition-transform duration-300 ${className}`}
    >
      {/* Pastel avatar stage */}
      <div
        className={`flex aspect-[4/4.1] w-full items-center justify-center p-6 ${bgClass}`}
      >
        <div className="flex w-[60%] aspect-square items-center justify-center rounded-full border-2 border-dashed border-[#475467]/40 p-2 sm:p-2.5">
          <div className="flex size-full items-end justify-center overflow-hidden rounded-full bg-[#D1D5DB]">
            <svg
              viewBox="0 0 120 120"
              fill="currentColor"
              className="h-[75%] w-[75%] translate-y-1.5 text-[#475467]"
              aria-hidden="true"
            >
              <path d="M60 16 C48 16 38 26 38 38 C38 49 46 58 57 60 C33 64 20 80 18 104 C28 114 43 120 60 120 C77 120 92 114 102 104 C100 80 87 64 63 60 C74 58 82 49 82 38 C82 26 72 16 60 16 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Teaser label section */}
      <div className="flex flex-col justify-center bg-paper px-5 py-4">
        <h3 className="font-product-sans text-base font-bold tracking-wider text-ink uppercase sm:text-lg">
          {name}
        </h3>
        <p className="mt-0.5 text-xs font-normal text-muted-dark sm:text-sm">
          {role}
        </p>
      </div>
    </div>
  );
}
