import { motion } from 'framer-motion';
import { blurUp, slideInRight, staggerContainer, useScrollGate } from '@/lib/motion';

/**
 * The 2026 lineup is still under wraps: no speaker, teaser, or dummy cards
 * ship for now — the section states "To Be Announced" until reveals land.
 * `DummySpeakerCard` and `lineupSpeakers` stay parked in the codebase for
 * the reveal.
 */
export function SpeakerLineup() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="keynote-speakers"
      aria-labelledby="keynote-speakers-title"
      className="border-t border-line bg-ink pt-10 pb-20 sm:pt-14 sm:pb-24"
    >
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <motion.h2
          variants={slideInRight}
          id="keynote-speakers-title"
          className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
        >
          <span aria-hidden="true" className="size-2 shrink-0 bg-brand-amber" />
          Keynote Speakers
        </motion.h2>

        {/* Composed empty state — token surfaces, no placeholder graphics. */}
        <motion.div
          variants={blurUp}
          className="mt-14 flex flex-col items-center rounded-card border border-line bg-surface px-6 py-16 text-center sm:py-20"
        >
          <p className="font-product-sans text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-tight text-paper">
            TO BE ANNOUNCED
          </p>
          <p className="mt-4 max-w-md text-label leading-relaxed text-muted">
            The Tech Ignite &rsquo;26 keynote lineup will be revealed here. Stay tuned.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
