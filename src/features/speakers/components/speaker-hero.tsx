import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export function SpeakerHero() {
  return (
    <section
      id="speakers"
      aria-labelledby="speakers-title"
      className="relative flex flex-col overflow-hidden bg-ink"
    >
      {/* Checker mosaic — transparent-backed artwork, ink shows through the gaps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          src="/icons/speakers-hero-section.png"
          alt=""
          width={1512}
          height={705}
          className="size-full object-cover object-top"
        />
      </div>

      {/* Cream arch */}
      <div
        className="relative mx-auto mt-32 flex w-full max-w-[1124px] flex-col items-center justify-center bg-[#FFFFFF] px-6 pt-24 pb-8 text-center min-[1124px]:w-[1124px] sm:h-[800px]"
        style={{
          borderTopLeftRadius: '500px',
          borderTopRightRadius: '500px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Topographic contour texture */}
        <img
          aria-hidden="true"
          src="/icons/transparent-background.png"
          alt=""
          width={1124}
          height={705}
          className="absolute inset-0 object-cover opacity-20"
        />

        <h1
          id="speakers-title"
          className="relative z-10 text-heading font-bold tracking-[-0.05em] text-ink"
        >
          Speaker Lineup
        </h1>
        <p className="mt-4 max-w-[40rem] text-subheading leading-relaxed font-normal text-ink">
          We don&rsquo;t book the most famous speakers. <br />
          We book the most creative ones.
        </p>

        <Link
          to="/"
          className="mt-6 flex h-13 items-center justify-center gap-2.5 rounded-xs bg-brand-amber px-8 text-button font-normal text-ink shadow-none transition-colors hover:bg-brand-amber/90 sm:mt-7 sm:h-14 sm:min-w-[220px] sm:px-10"
        >
          Become a Speaker
          <ArrowRight aria-hidden="true" className="size-4.5 sm:size-5" />
        </Link>
      </div>
    </section>
  );
}
