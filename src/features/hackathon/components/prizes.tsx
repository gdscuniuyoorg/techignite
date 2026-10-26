import { motion } from 'framer-motion';
import { hackathonPrizes } from '@/utils/hackathon';
import {
  SPRING_POP,
  slideInLeft,
  slideInRight,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function Prizes() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="prizes"
      aria-labelledby="prizes-title"
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
          What do you stand to win?
        </motion.p>

        <motion.h2
          variants={slideInLeft}
          id="prizes-title"
          className="mt-6 max-w-4xl text-heading font-bold text-paper"
        >
          Build Your Ideas. Compete for{' '}
          <span className="bg-[#ffd6e6] px-1.5 text-ink">₦1,000,000</span> in Prizes.
        </motion.h2>

        <ul className="mt-14 flex flex-col gap-4">
          {hackathonPrizes.map((prize, index) => (
            <motion.li
              key={prize.label}
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              whileHover={{ y: -4 }}
              className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[18rem_1fr] sm:gap-8"
            >
              <span className="text-label text-paper/90">{prize.label}</span>
              <div className="rounded-xl bg-surface px-6 py-5 transition-colors hover:bg-ink-soft">
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
                  {prize.amount}
                </motion.p>
                <p className="mt-2 text-lg leading-relaxed text-muted">
                  {prize.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
