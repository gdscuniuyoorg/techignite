import { motion } from 'framer-motion';
import { shipathonCriteria } from '@/utils/apply';
import {
  SPRING_POP,
  slideInLeft,
  slideInRight,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function JudgingCriteria() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="judging-criteria"
      aria-labelledby="judging-criteria-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.2)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <motion.p
          variants={slideInLeft}
          className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
        >
          <span aria-hidden="true" className="size-2 bg-muted-dark" />
          Judging Criteria
        </motion.p>

        <motion.h2
          variants={slideInLeft}
          id="judging-criteria-title"
          className="mt-6 max-w-4xl text-heading font-bold text-paper"
        >
          Every Build Is Scored Out of{' '}
          <span className="bg-brand-cream px-1.5 text-ink">100 Points</span>.
        </motion.h2>

        <ul className="mt-14 flex flex-col gap-4">
          {shipathonCriteria.map((criterion, index) => (
            <motion.li
              key={criterion.id}
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              whileHover={{ y: -4 }}
              className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[18rem_1fr] sm:gap-8"
            >
              <span className="text-label text-paper/90">{criterion.name}</span>
              <div className="rounded-xl bg-surface px-6 py-5 transition-colors hover:bg-ink-soft">
                <div className="flex items-center justify-between gap-6">
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, scale: 0.6 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { ...SPRING_POP, delay: 0.45 },
                      },
                    }}
                    className="text-3xl font-bold text-paper"
                  >
                    {criterion.points} pts
                  </motion.p>
                  {/* Weight bar — static width, animated via transform only. */}
                  <div
                    aria-hidden="true"
                    className="hidden h-1.5 flex-1 overflow-hidden rounded-pill bg-white/10 sm:block"
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={userScrolled ? { scaleX: 1 } : { scaleX: 0 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      style={{
                        width: `${String((criterion.points / 30) * 100)}%`,
                      }}
                      className="h-full origin-left rounded-pill bg-[#FF84B3]"
                    />
                  </div>
                </div>
                <p className="mt-2 text-lg leading-relaxed text-muted">
                  {criterion.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
