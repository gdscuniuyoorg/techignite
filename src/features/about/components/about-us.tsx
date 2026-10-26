import { motion } from 'framer-motion';
import { aboutUsParagraphs } from '@/utils/about';
import {
  blurUp,
  dotPop,
  slideInRight,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function AboutUs() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="about-us"
      aria-labelledby="about-us-title"
      className="bg-paper py-20 text-ink sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        <div className="border-t border-line-light pt-10 sm:pt-14">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-ink uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 bg-brand-blue"
            />
            About Us
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="about-us-title"
            className="mt-6 max-w-[60rem] text-heading font-bold text-ink"
          >
            A Festival Born to{' '}
            <span className="bg-brand-blue px-1.5 text-paper">Ignite Potential</span>
          </motion.h2>

          {aboutUsParagraphs.map((paragraph) => (
            <motion.p
              key={paragraph.text}
              variants={blurUp}
              className="mt-6 max-w-[52rem] text-lg leading-relaxed text-ink/80 first-of-type:mt-8"
            >
              {paragraph.text}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
