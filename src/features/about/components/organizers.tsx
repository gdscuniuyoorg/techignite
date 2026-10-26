import { motion } from 'framer-motion';
import { organizerPanels } from '@/utils/about';
import {
  blurUp,
  dotPop,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function Organizers() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="organizers"
      aria-labelledby="organizers-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.14)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <div className="border-t border-line pt-10 sm:pt-14">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 bg-brand-amber"
            />
            About the Organizers
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="organizers-title"
            className="mt-6 max-w-[60rem] text-heading font-bold text-paper"
          >
            Built by <span className="bg-brand-amber px-1.5 text-ink">the Community</span>
            , for the Community
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {organizerPanels.map((panel) => (
              <motion.article
                key={panel.title}
                variants={springUp}
                whileHover={{ y: -8 }}
                className="flex flex-col gap-3 rounded-panel bg-ink-raised p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-paper">{panel.title}</h3>
                <p className="text-base leading-relaxed text-muted">
                  {panel.description}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.p
            variants={blurUp}
            className="mt-8 max-w-[52rem] text-lg leading-relaxed text-muted"
          >
            Tech Ignite &rsquo;26 is made possible by student volunteers, mentors, and
            partners across Uyo&rsquo;s tech ecosystem — all working to give every
            attendee a shot at building something that matters.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
