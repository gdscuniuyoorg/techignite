import { motion } from 'framer-motion';
import { hackathonPrizes } from '@/utils/hackathon';

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
} as const;

export function Prizes() {
  return (
    <section
      id="prizes"
      aria-labelledby="prizes-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <p className="flex items-center gap-2 text-eyebrow font-bold text-paper uppercase">
          <span aria-hidden="true" className="size-2 bg-muted-dark" />
          What do you stand to win?
        </p>

        <h2
          id="prizes-title"
          className="mt-6 max-w-4xl text-heading font-bold text-paper"
        >
          Build Your Ideas. Compete for{' '}
          <span className="bg-[#ffd6e6] px-1.5 text-ink">₦1,000,000</span> in Prizes.
        </h2>

        <ul className="mt-14 flex flex-col gap-4">
          {hackathonPrizes.map((prize) => (
            <li
              key={prize.label}
              className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[18rem_1fr] sm:gap-8"
            >
              <span className="text-label text-paper/90">{prize.label}</span>
              <div className="rounded-xl bg-surface px-6 py-5">
                <p className="text-3xl font-bold text-paper">{prize.amount}</p>
                <p className="mt-2 text-lg leading-relaxed text-muted">
                  {prize.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
