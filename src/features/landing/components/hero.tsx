import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { blurUp, fadeUp, springUp, staggerContainer } from '@/lib/motion';
import { HeroSponsorPin } from '@/features/landing/components/hero-sponsor-pin';
import { REGISTER_URL } from '@/utils/footer';

const MotionAnchor = motion.create('a');

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
      {/* Checker mosaic — transparent-backed artwork, ink shows through the gaps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.img
          src="/icons/hero.png"
          alt=""
          width={1512}
          height={703}
          fetchPriority="high"
          decoding="async"
          style={{ y: mosaicY }}
          className="size-full object-cover object-top"
        />
      </div>

      {/* Cream arch — rises into view on load, same geometry as the speaker hero */}
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="arch-contour relative mx-auto mt-24 flex w-full max-w-[1124px] flex-1 flex-col items-center justify-center bg-accent px-6 pt-24 pb-10 text-center min-[1124px]:w-[1124px]"
        style={{
          borderTopLeftRadius: '500px',
          borderTopRightRadius: '500px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Small sponsor sign parked on the arch's lower-right; compact on
            phones, full size from lg up. */}
        <div className="absolute right-3 bottom-2 z-10 block lg:right-12 lg:bottom-16 xl:right-14">
          <HeroSponsorPin />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.16, 0.6)}
          className="relative z-10 flex w-full flex-col items-center"
        >
          <motion.p variants={fadeUp} className="text-base font-normal text-ink">
            20 November, 2026. University of Uyo, Aks
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

          <MotionAnchor
            variants={springUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-13 items-center justify-center gap-2.5 rounded-xs bg-primary px-8 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong sm:mt-7 sm:h-14 sm:min-w-[220px] sm:px-10"
          >
            Register Now
            <ArrowRight aria-hidden="true" className="size-4.5 sm:size-5" />
          </MotionAnchor>
        </motion.div>

        <h1 id="hero-title" className="sr-only">
          Tech Ignite '26 — Are you actually Building?
        </h1>
      </motion.div>
    </section>
  );
}
