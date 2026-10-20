import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

const palette = [
  { label: 'Blue', swatch: 'bg-brand-blue' },
  { label: 'Green', swatch: 'bg-brand-green-bright' },
  { label: 'Amber', swatch: 'bg-brand-amber' },
  { label: 'Cream', swatch: 'bg-brand-cream' },
  { label: 'Paper', swatch: 'bg-paper' },
  { label: 'Ink', swatch: 'bg-ink-soft' },
] as const;

function Home() {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh flex-col items-center justify-center bg-ink px-6 py-16 text-center text-paper"
    >
      <p className="max-w-[22rem] text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
        20 November, 2026 · University of Uyo
      </p>

      <h1 className="mt-6 max-w-full font-product-sans text-[clamp(1.75rem,8vw,6rem)] leading-[0.9] font-bold tracking-[-0.045em] text-balance uppercase">
        Tech Ignite <span className="text-brand-cream">'26</span>
      </h1>

      <p className="mt-5 text-lg text-white/60">Are you actually Building?</p>

      <p className="mt-12 max-w-sm text-sm leading-relaxed text-white/40">
        The design system is in place. Sections will be rebuilt here next.
      </p>

      <ul
        aria-label="Brand palette"
        className="mt-14 flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] tracking-[0.16em] text-white/45 uppercase sm:gap-x-6"
      >
        {palette.map((tone) => (
          <li key={tone.label} className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-2 ${tone.swatch}`} />
            {tone.label}
          </li>
        ))}
      </ul>
    </main>
  );
}
