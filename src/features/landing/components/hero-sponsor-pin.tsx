import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * Small "Powered by Chowdeck" sign hanging from a pushpin, parked on the
 * right side of the hero arch. A single, short choreography that runs once:
 * pin falls and bites → board swings on it → the wordmark fades in.
 * No idle loop.
 */

const LOGO_SRC = '/images/sponsors/chowdeck-sponsor.png';

const pinDrop: Variants = {
  hidden: { opacity: 0, y: -40, rotate: -14 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: [-14, -4, 0],
    transition: {
      delay: 0.2,
      duration: 0.45,
      ease: [0.55, 0, 1, 0.45],
      rotate: { duration: 0.5, times: [0, 0.7, 1], ease: 'easeOut', delay: 0.2 },
      opacity: { duration: 0.12, delay: 0.2 },
    },
  },
};

const hangSwing: Variants = {
  hidden: { opacity: 0, rotate: 10 },
  visible: {
    opacity: 1,
    rotate: [10, -4, 1.6, -0.7, 0],
    transition: {
      delay: 0.6,
      duration: 1.8,
      times: [0, 0.26, 0.48, 0.7, 1],
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.2, delay: 0.6 },
    },
  },
};

const signReveal: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Pushing the sign with the mouse: one decaying swing back to rest. */
const hoverPush = {
  rotate: [0, -7, 4.6, -2.6, 1.2, 0],
  transition: {
    duration: 1.15,
    times: [0, 0.2, 0.44, 0.65, 0.82, 1],
    ease: 'easeInOut' as const,
  },
};

export function HeroSponsorPin() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const revealProps = shouldReduceMotion
    ? { initial: false }
    : ({ initial: 'hidden', whileInView: 'visible' } as const);

  const hoverProps = shouldReduceMotion ? {} : { whileHover: hoverPush };

  return (
    <motion.figure
      {...revealProps}
      viewport={{ once: true, amount: 0.5 }}
      className="relative w-52 shrink-0 select-none lg:w-60"
    >
      <figcaption className="sr-only">Powered by Chowdeck</figcaption>

      {/* Everything below the pin swings on it. Moving the mouse over the
          sign pushes it — it wobbles on the pin and settles back. */}
      <motion.div
        variants={hangSwing}
        style={{ transformOrigin: '50% 18px' }}
        className="relative flex flex-col"
        {...hoverProps}
      >
        {/* Taut ropes from the pin down to the board's eyelets. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-[36px] h-[36px] w-full text-ink/50"
        >
          <line
            x1="50"
            y1="0"
            x2="5"
            y2="100"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="50"
            y1="0"
            x2="95"
            y2="100"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* The board itself. */}
        <div className="relative mt-[72px]">
          <div className="relative flex aspect-[2/1] w-full flex-col items-center justify-center rounded-[5px] border border-ink/15 bg-paper px-4 text-ink shadow-[0_18px_36px_-20px_rgba(5,5,5,0.45)]">
            <span
              aria-hidden="true"
              className="absolute -top-[5px] left-[5%] size-2.5 -translate-x-1/2 rounded-full border-2 border-ink/35 bg-mist"
            />
            <span
              aria-hidden="true"
              className="absolute -top-[5px] right-[5%] size-2.5 translate-x-1/2 rounded-full border-2 border-ink/35 bg-mist"
            />

            <motion.div
              variants={signReveal}
              className="flex w-full flex-col items-center"
            >
              <p className="text-[0.625rem] font-medium tracking-[0.28em] text-ink/70 uppercase">
                Powered by
              </p>

              <div className="mt-2 h-px w-2/5 bg-ink/15" />

              <img
                src={LOGO_SRC}
                alt=""
                width={201}
                height={74}
                className="mt-2 h-auto w-[56%]"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pushpin at the apex: rounded head, darker rim, highlight, short neck. */}
      <motion.div variants={pinDrop} className="absolute top-0 left-1/2 z-30 -ml-4.5">
        <div className="relative size-9 rounded-full bg-brand-blue shadow-[0_8px_14px_-6px_rgba(5,5,5,0.5)] ring-[3px] ring-brand-blue-strong">
          <span
            aria-hidden="true"
            className="absolute top-[7px] left-[7px] size-2.5 rounded-full bg-brand-blue-soft"
          />
        </div>

        <span
          aria-hidden="true"
          className="absolute top-full left-1/2 -mt-0.5 h-2 w-1.5 -translate-x-1/2 rounded-b-full bg-brand-blue-strong"
        />
      </motion.div>
    </motion.figure>
  );
}
