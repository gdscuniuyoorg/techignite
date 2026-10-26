import { ArrowRight } from 'lucide-react';
import { REGISTER_URL } from '@/utils/footer';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex flex-col overflow-hidden bg-ink sm:h-[705px]"
    >
      {/* Checker mosaic — transparent-backed artwork, ink shows through the gaps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          src="/icons/hero.png"
          alt=""
          width={1512}
          height={703}
          className="size-full object-cover object-top"
        />
      </div>

      {/* Cream arch */}
      <div
        className="arch-contour relative mx-auto flex w-full max-w-[1124px] flex-col items-center justify-center bg-accent px-6 pt-16 pb-20 text-center min-[1124px]:w-[1124px] sm:h-[705px]"
        style={{
          borderTopLeftRadius: '500px',
          borderTopRightRadius: '500px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <p className="text-base font-normal text-ink">
          20 November, 2026. University of Uyo, Aks
        </p>

        <img
          src="/icons/banner.png"
          alt="Tech Ignite '26"
          width={800}
          height={213}
          className="mt-6 w-[79%] sm:mt-8 sm:w-[76%]"
        />

        <h1 id="hero-title" className="sr-only">
          Tech Ignite '26 — Are you actually Building?
        </h1>

        <p className="mt-4 text-tagline font-normal text-ink sm:mt-5">
          Are you actually Building?
        </p>

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex h-13 items-center justify-center gap-2.5 rounded-xs bg-primary px-8 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong sm:mt-7 sm:h-14 sm:min-w-[220px] sm:px-10"
        >
          Register Now
          <ArrowRight aria-hidden="true" className="size-4.5 sm:size-5" />
        </a>
      </div>
    </section>
  );
}
