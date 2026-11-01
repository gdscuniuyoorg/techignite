import { motion } from 'framer-motion';
import { shipathonTimeline } from '@/utils/apply';
import { dotPop, slideInRight, staggerContainer, useScrollGate } from '@/lib/motion';

export function ShipathonTimeline() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="timeline"
      aria-labelledby="timeline-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.18)}
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
              className="size-2 bg-brand-green-bright"
            />
            Timeline
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="timeline-title"
            className="mt-6 max-w-[52rem] text-heading font-bold text-paper"
          >
            Six Dates. One{' '}
            <span className="wrap-reverse relative inline-block px-1.5">
              {/* Green highlight sweeps in from the left, then the text fades up. */}
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={userScrolled ? { scaleX: 1 } : { scaleX: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="absolute inset-0 origin-left bg-brand-green-bright"
              />
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={userScrolled ? { opacity: 1 } : { opacity: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="relative text-ink"
              >
                Working Product.
              </motion.span>
            </span>
          </motion.h2>
        </div>

        <motion.ul
          variants={staggerContainer(0.12, 0.2)}
          initial="hidden"
          whileInView={userScrolled ? 'visible' : 'hidden'}
          viewport={{ once: false, amount: 0.15 }}
          className="mt-14 border-t border-line"
        >
          {shipathonTimeline.map((milestone) => (
            <motion.li
              key={milestone.name}
              variants={slideInRight}
              className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-line py-7 sm:grid-cols-[1rem_16rem_1fr] sm:py-9"
            >
              <motion.span
                variants={dotPop}
                aria-hidden="true"
                className="size-2 bg-brand-green-bright max-sm:hidden"
              />
              <p className="text-label text-muted">{milestone.date}</p>
              <h3 className="text-subheading font-medium text-paper">{milestone.name}</h3>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
