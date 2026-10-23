import { motion } from 'framer-motion';
import { hackathonStats } from '@/utils/hackathon';

export function HackathonStats() {
  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  } as const;

  return (
    <section
      id="hackathon-stats"
      aria-labelledby="hackathon-stats-title"
      className="bg-ink text-paper py-20 sm:py-24"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <h2
          id="hackathon-stats-title"
          className="sr-only"
        >
          Hackathon Stats
        </h2>

        <dl
          className="grid grid-cols-1 gap-y-16 sm:grid-cols-3 sm:gap-x-12 text-center sm:text-left"
        >
          {hackathonStats.map((stat) => (
            <motion.div
              key={stat.value}
              variants={item}
              className="flex flex-col items-center sm:items-start border-b border-line/60 pb-12 sm:border-b-0 sm:border-r sm:pr-12 sm:pb-0"
            >
              <dt className="text-stat font-bold tracking-[-0.04em] text-paper">
                {stat.value}
              </dt>
              <dd className="mt-4 text-label text-muted">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </dl>

        <motion.div
          variants={item}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 max-w-[56rem] mx-auto text-left"
        >
          <p className="leading-relaxed text-white/90">
            The Tech Ignite Hackathon is where curious minds, creative thinkers,
            and ambitious builders come together to solve problems through
            technology. It&rsquo;s an opportunity to collaborate, experiment with
            new ideas, and turn real-world challenges into innovative solutions.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
