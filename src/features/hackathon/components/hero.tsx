import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export function HackathonHero() {
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
          src="/icons/hackathon-hero-section.png"
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
          id="hackathon-title"
          className="relative z-10 text-center text-heading font-bold text-ink"
        >
          Ideas Don’t Build Themselves
        </h1>
        <p className="mt-4 text-subheading leading-relaxed font-normal text-ink">
          Bring your skills, find your people, and build something amazing.
          <br />
          The Tech Ignite Hackathon is where creativity meets code and big ideas become
          reality.
        </p>

        <Link
          to="/"
          className="mt-6 flex h-13 items-center justify-center gap-2.5 rounded-xs bg-[#FF84B3] px-8 text-button font-normal text-ink shadow-none transition-colors hover:bg-[#FF84B3]/90 sm:mt-7 sm:h-14 sm:min-w-[220px] sm:px-10"
        >
          Apply Now
          <ArrowRight aria-hidden="true" className="size-4.5 sm:size-5" />
        </Link>
      </div>
    </section>
  );
}
