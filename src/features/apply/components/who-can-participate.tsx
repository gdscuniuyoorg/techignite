import { motion } from 'framer-motion';
import { shipathonBackgrounds } from '@/utils/apply';
import { fadeUp, springUp, staggerContainer, useScrollGate } from '@/lib/motion';

export function WhoCanParticipate() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="who-can-participate"
      aria-labelledby="who-can-participate-title"
      className="bg-paper py-20 text-ink sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.18)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <div className="border-t border-line-light pt-10 sm:pt-14">
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-2 text-eyebrow font-normal text-ink uppercase"
          >
            <span aria-hidden="true" className="size-2 bg-[#FF84B3]" />
            Who Can Participate?
          </motion.p>

          <motion.h2
            variants={fadeUp}
            id="who-can-participate-title"
            className="mt-6 max-w-[60rem] text-heading font-bold text-ink"
          >
            Open to All Builders, From{' '}
            <span className="bg-[#FF84B3]/20 px-1.5">Every Background</span>.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-[42rem] text-lg leading-relaxed text-ink/75"
          >
            This hackathon is open to all individuals and teams from various backgrounds,
            including developers, tech enthusiasts, and students in Akwa Ibom State.
          </motion.p>

          <ul className="mt-12 flex flex-wrap gap-3">
            {shipathonBackgrounds.map((background) => (
              <motion.li key={background} variants={springUp}>
                <span className="flex h-11 items-center rounded-pill border border-line-light px-6 text-label text-ink/80 transition-colors hover:border-[#FF84B3] hover:text-ink">
                  {background}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
