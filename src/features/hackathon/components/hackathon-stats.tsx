import { motion } from 'framer-motion';
import { hackathonStats } from '@/utils/hackathon';
import { blurUp, staggerContainer, tumbleDrop, useScrollGate } from '@/lib/motion';

export function HackathonStats() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="hackathon-stats"
      aria-labelledby="hackathon-stats-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.22)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <h2 id="hackathon-stats-title" className="sr-only">
          Hackathon Stats
        </h2>

        <dl className="grid grid-cols-1 gap-y-16 text-center sm:grid-cols-3 sm:gap-x-12 sm:text-left">
          {hackathonStats.map((stat, index) => (
            <motion.div
              key={stat.value}
              custom={index}
              variants={tumbleDrop}
              className="flex flex-col items-center sm:items-start"
            >
              <dt className="relative w-fit pb-3 text-[clamp(2.5rem,4.5vw,6.5rem)] leading-[0.9] font-normal tracking-[-0.04em] text-paper after:absolute after:top-full after:left-0 after:h-px after:w-[calc(100%+2.5rem)] after:bg-white/30">
                {stat.value}
              </dt>
              <dd className="mt-4 text-label text-muted">{stat.label}</dd>
            </motion.div>
          ))}
        </dl>

        <motion.div variants={blurUp} className="mt-24 max-w-[1046px]">
          <p className="text-subheading leading-normal text-white/90">
            The Tech Ignite Hackathon is where curious minds, creative thinkers, and
            ambitious builders come together to solve problems through technology.
            It&rsquo;s an opportunity to collaborate, experiment with new ideas, and turn
            real-world challenges into innovative solutions.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
