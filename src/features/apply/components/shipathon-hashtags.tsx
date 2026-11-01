import { motion } from 'framer-motion';
import { shipathonHashtags } from '@/utils/apply';
import { staggerContainer, useScrollGate, wordReveal } from '@/lib/motion';

export function ShipathonHashtags() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="hashtags"
      aria-labelledby="hashtags-title"
      className="bg-ink py-24 text-paper sm:py-32"
    >
      <motion.div
        variants={staggerContainer(0.2)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.35 }}
        className="container"
      >
        <motion.h2
          variants={wordReveal}
          id="hashtags-title"
          className="overflow-hidden pb-2 text-center text-eyebrow font-normal text-muted uppercase"
        >
          Official Hackathon Hashtags
        </motion.h2>

        <ul className="mt-10 flex flex-col items-center gap-2 text-center">
          {shipathonHashtags.map((hashtag) => (
            <motion.li
              key={hashtag}
              variants={wordReveal}
              className="overflow-hidden pb-[0.12em]"
            >
              <span className="inline-block font-product-sans text-[clamp(1.75rem,5vw,4rem)] leading-[1.1] font-bold tracking-tight text-paper transition-colors hover:text-brand-blue-soft">
                {hashtag}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
