import { motion } from 'framer-motion';
import { shipathonStats } from '@/utils/apply';
import { blurUp, staggerContainer, tumbleDrop, useScrollGate } from '@/lib/motion';

export function ShipathonStats() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="shipathon-stats"
      aria-labelledby="shipathon-stats-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.22)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <h2 id="shipathon-stats-title" className="sr-only">
          Shipathon Stats
        </h2>

        <dl className="grid grid-cols-1 gap-y-16 text-center sm:grid-cols-3 sm:gap-x-12 sm:text-left">
          {shipathonStats.map((stat, index) => (
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
            This November, we are inviting builders from all over Akwa Ibom State to
            participate in the official Tech Ignite &rsquo;26{' '}
            <span className="font-bold text-[#FF84B3]">Build with Paga</span> Shipathon —
            a high-impact innovation challenge designed to empower the brightest builders
            to create practical solutions to real-world problems. The goal is a working
            prototype with a credible path to becoming a real product, not a weekend demo.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
