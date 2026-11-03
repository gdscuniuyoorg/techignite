import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SponsorPin } from '@/components/molecules/sponsor-pin';
import { SPRING_POP, staggerContainer, wordReveal } from '@/lib/motion';

const HERO_WORDS = ['Ideas', 'Don’t', 'Build', 'Themselves'] as const;

export function HackathonHero() {
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
      id="speakers"
      aria-labelledby="speakers-title"
      className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-ink sm:min-h-[calc(100svh-6rem)]"
    >
      {/* Checker mosaic — transparent-backed artwork, ink shows through the gaps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.img
          src="/icons/hackathon-hero-section.png"
          alt=""
          width={1512}
          height={705}
          style={{ y: mosaicY }}
          className="size-full object-cover object-top"
        />
      </div>

      {/* Cream arch — rises into view on load */}
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative mx-auto mt-24 flex w-full max-w-[1124px] flex-1 flex-col items-center justify-center bg-[#FFFFFF] px-6 pt-44 pb-10 text-center min-[1124px]:w-[1124px] lg:pt-24"
        style={{
          borderTopLeftRadius: '500px',
          borderTopRightRadius: '500px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Topographic contour texture — slow ambient drift */}
        <motion.img
          aria-hidden="true"
          src="/icons/transparent-background.png"
          alt=""
          width={1124}
          height={705}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 object-cover opacity-20"
        />

        {/* Small sponsor sign parked at top-center on mobile;
            lower-right from lg up. */}
        <div className="absolute top-4 left-1/2 z-20 block -translate-x-1/2 lg:top-auto lg:right-10 lg:bottom-8 lg:left-auto lg:translate-x-0 xl:right-14">
          <SponsorPin
            sponsorName="Paga Engine"
            logoSrc="/images/sponsors/paga-engine.png"
            logoWidth={1352}
            logoHeight={219}
            logoClassName="mt-2 h-auto w-[80%]"
          />
        </div>

        <motion.h1
          id="hackathon-title"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.16, 0.7)}
          className="relative z-10 text-center text-heading font-bold text-ink"
        >
          {HERO_WORDS.map((word, index) => (
            <span
              key={word}
              className="inline-block overflow-hidden pb-[0.12em] align-bottom"
            >
              <motion.span variants={wordReveal} className="inline-block">
                {word}
                {index < HERO_WORDS.length - 1 ? '\u00A0' : ''}
              </motion.span>
              {index < HERO_WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.7 }}
          className="relative z-10 mt-4 text-subheading leading-relaxed font-normal text-ink"
        >
          Bring your skills, find your people, and build something amazing.
          <br />
          The Build with Paga Shipathon is where creativity meets code and big ideas
          become reality.
        </motion.p>

        <motion.button
          type="button"
          disabled
          aria-disabled="true"
          title="Applications are not open yet"
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SPRING_POP, delay: 2 }}
          className="relative z-10 mt-6 flex h-13 cursor-not-allowed items-center justify-center gap-2.5 rounded-xs bg-[#FF84B3]/60 px-8 text-button font-normal text-ink shadow-none sm:mt-7 sm:h-14 sm:min-w-[220px] sm:px-10"
        >
          Apply Now
          <ArrowRight aria-hidden="true" className="size-4.5 sm:size-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
