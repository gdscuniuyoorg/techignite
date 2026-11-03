import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import {
  blurUp,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

const MotionLink = motion.create(Link);

export function KeynoteSpeakers() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="speakers"
      aria-labelledby="keylineup-title-id"
      className="overflow-hidden bg-ink text-paper"
    >
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
        className="container pt-16 sm:pt-20"
      >
        <div className="border-t border-border pt-8">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2.5 text-sm font-medium tracking-wider text-paper uppercase sm:text-base"
          >
            <span aria-hidden="true" className="size-2.5 shrink-0 bg-brand-amber" />
            Keynote speakers
          </motion.p>

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between xl:gap-20">
            <motion.h2
              id="keylineup-title-id"
              variants={slideInRight}
              className="font-sans text-[36px] text-[46px] font-normal text-paper not-italic lg:text-[42px] lg:leading-[52px] xl:text-[60px] xl:leading-[70px]"
            >
              <span className="block">
                Our{' '}
                <mark className="bg-brand-amber px-2 whitespace-nowrap text-paper">
                  Speaker
                </mark>
              </span>
              <span className="block">Lineup</span>
            </motion.h2>

            <motion.p
              variants={blurUp}
              className="max-w-md text-[17px] leading-[1.5] text-white/85"
            >
              World-class creators, innovators, and tech leaders sharing their stories and
              insights.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* No teaser cards — the lineup itself says "To Be Announced" for now. */}
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
        className="container"
      >
        <motion.div
          variants={blurUp}
          className="mt-14 flex flex-col items-center rounded-card border border-line bg-surface px-6 py-14 text-center sm:mt-16 sm:py-16"
        >
          <p className="font-product-sans text-[clamp(1.5rem,4.5vw,3rem)] leading-[0.95] font-bold tracking-tight text-paper">
            TO BE ANNOUNCED
          </p>
          <p className="mt-3 text-label text-muted">
            The keynote lineup will be revealed here.
          </p>
        </motion.div>
      </motion.div>

      <div className="container">
        <div className="flex justify-center pb-20 sm:pb-24">
          <MotionLink
            variants={springUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            to="/speakers"
            className="mt-14 flex h-12 items-center gap-2.5 rounded-md bg-brand-amber px-8 text-button font-normal text-ink transition-colors hover:bg-brand-cream"
          >
            See All Speakers
            <ArrowRight aria-hidden="true" className="size-4" />
          </MotionLink>
        </div>
      </div>

      {/* Amber mosaic line closing the section, edge to edge. */}
      <img
        src="/icons/speakers-line.png"
        alt=""
        width={1510}
        height={333}
        loading="lazy"
        decoding="async"
        className="block h-[4rem] w-full object-cover"
      />
    </section>
  );
}
