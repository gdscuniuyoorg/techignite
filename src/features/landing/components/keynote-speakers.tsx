import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { FaLinkedin } from 'react-icons/fa6';
import { ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { lineupSpeakers } from '@/utils/speakers';
import {
  blurUp,
  imageSettle,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

const MotionLink = motion.create(Link);

export function KeynoteSpeakers() {
  const userScrolled = useScrollGate();
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(() => new Set());

  const dismissBio = (name: string, event: ReactMouseEvent) => {
    event.stopPropagation();
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

  const reopenBio = (name: string) => {
    setDismissed((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

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

      {/* Cut-edge carousel: bleeds to the viewport edges, scrolls horizontally. */}
      <div className="mt-16 scrollbar-none overflow-x-auto sm:mt-20">
        <motion.ul
          variants={staggerContainer(0.09)}
          initial="hidden"
          whileInView={userScrolled ? 'visible' : 'hidden'}
          viewport={{ once: false, amount: 0.2 }}
          className="flex w-max items-start gap-4 pr-8 pl-[max(1.25rem,calc((100vw-90rem)/2+1.5rem))]"
        >
          {lineupSpeakers.slice(0, 1).map((speaker, index) => (
            <motion.li
              key={speaker.name}
              variants={springUp}
              className={index % 2 === 1 ? 'mt-11' : ''}
            >
              <div
                role="button"
                tabIndex={speaker.bio ? 0 : undefined}
                onClick={() => {
                  reopenBio(speaker.name);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    reopenBio(speaker.name);
                  }
                }}
                aria-label={speaker.bio ? `View bio for ${speaker.name}` : undefined}
                className="group/speaker relative w-[17.5rem] overflow-visible rounded-lg outline-none"
              >
                <motion.img
                  src={`/images/speakers/${speaker.image}`}
                  alt={`Portrait of ${speaker.name}`}
                  width={speaker.width}
                  height={speaker.height}
                  loading="lazy"
                  decoding="async"
                  variants={imageSettle}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="aspect-[39/50] w-full object-cover grayscale"
                />
                {speaker.bio && !dismissed.has(speaker.name) ? (
                  <div className="pointer-events-none absolute right-3 bottom-3 z-20 flex max-h-[82%] w-[calc(100%-1.5rem)] translate-y-2 flex-col rounded-md bg-ink/95 p-4 text-left text-paper opacity-0 shadow-xl transition-all duration-300 group-hover/speaker:pointer-events-auto group-hover/speaker:translate-y-0 group-hover/speaker:opacity-100 group-focus/speaker:pointer-events-auto group-focus/speaker:translate-y-0 group-focus/speaker:opacity-100 group-focus-within/speaker:pointer-events-auto group-focus-within/speaker:translate-y-0 group-focus-within/speaker:opacity-100">
                    <button
                      type="button"
                      onClick={(event) => {
                        dismissBio(speaker.name, event);
                      }}
                      aria-label={`Close bio for ${speaker.name}`}
                      className="absolute top-2.5 right-2.5 z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-soft/80 text-paper transition-colors hover:bg-paper hover:text-ink"
                    >
                      <X aria-hidden="true" className="size-3.5" />
                    </button>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 touch-pan-y [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/35 [&::-webkit-scrollbar-track]:bg-transparent">
                      <p className="text-xs leading-relaxed whitespace-pre-line text-white/90 sm:text-sm">
                        {speaker.bio}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex w-[17.5rem] items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-normal text-paper">{speaker.name}</h3>
                  <p className="mt-1 text-label text-muted">{speaker.role}</p>
                </div>
                {speaker.linkedin ? (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${speaker.name} on LinkedIn`}
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-ink-soft text-paper transition-colors hover:bg-brand-amber hover:text-ink"
                  >
                    <FaLinkedin className="size-3.5" />
                  </a>
                ) : (
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-ink-soft text-paper"
                  >
                    <FaLinkedin className="size-3.5" />
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

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
