import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { blurUp, fadeUp, staggerContainer } from '@/lib/motion';
import { SponsorPin } from '@/components/molecules/sponsor-pin';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  /** Mosaic drifts up slower than the page as you scroll away — depth. */
  const mosaicY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-ink sm:min-h-[calc(100svh-6rem)]"
    >
      {/* Tech Ignite '24 family photo — low-angle parallax, domed arch floats above it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.img
          src="/past-photos/past-photo.jpg"
          alt=""
          width={1280}
          height={853}
          fetchPriority="high"
          decoding="async"
          style={{ y: mosaicY }}
          className="size-full object-cover object-top"
        />
        {/* Dark ink overlay — keeps the arch lockup readable over the bright photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/60" />
      </div>

      {/* Cream arch — rises into view on load, same geometry as the speaker hero */}
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="arch-contour relative mx-auto mt-24 flex w-full max-w-[1124px] flex-1 flex-col items-center justify-center bg-accent px-6 pt-44 pb-10 text-center min-[1124px]:w-[1124px] lg:pt-24"
        style={{
          borderTopLeftRadius: '500px',
          borderTopRightRadius: '500px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Small sponsor sign parked at top-center on mobile;
            lower-right from lg up. */}
        <div className="absolute top-4 left-1/2 z-10 block -translate-x-1/2 lg:top-auto lg:right-12 lg:bottom-16 lg:left-auto lg:translate-x-0 xl:right-14">
          <SponsorPin
            sponsorName="Chowdeck"
            logoSrc="/images/sponsors/chowdeck-sponsor.png"
          />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.16, 0.6)}
          className="relative z-10 flex w-full flex-col items-center"
        >
          <motion.p variants={fadeUp} className="text-base font-normal text-ink">
            Successfully held on 19 and 20 November 2026 at the University of Uyo
          </motion.p>

          <motion.img
            src="/icons/banner.png"
            alt="Tech Ignite '26"
            width={800}
            height={213}
            fetchPriority="high"
            decoding="async"
            variants={blurUp}
            className="mt-6 w-[79%] sm:mt-8 sm:w-[76%]"
          />

          <motion.p
            variants={fadeUp}
            className="mt-4 text-tagline font-normal text-ink sm:mt-5"
          >
            Are you actually Building?
          </motion.p>
        </motion.div>

        <h1 id="hero-title" className="sr-only">
          Tech Ignite '26 was successfully held at the University of Uyo
        </h1>
      </motion.div>
    </section>
  );
}
