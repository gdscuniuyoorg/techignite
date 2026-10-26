import { motion } from 'framer-motion';
import { howItWorksSteps } from '@/utils/hackathon';
import {
  clipRevealDown,
  dotPop,
  slideInRight,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function HowItWorks() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
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
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-ink uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 bg-brand-green-bright"
            />
            How It Works
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="how-it-works-title"
            className="mt-6 max-w-[52rem] text-heading font-bold text-ink"
          >
            From Your First Idea to a{' '}
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
                className="relative text-paper"
              >
                Working Solution.
              </motion.span>
            </span>
          </motion.h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-[24rem_1fr] lg:gap-20">
          <motion.div variants={clipRevealDown}>
            <motion.img
              src="/past-photos/hackathon.png"
              alt="Hackathon participants collaborating on a laptop during Tech Ignite"
              width={384}
              height={448}
              loading="lazy"
              initial={{ scale: 1.15 }}
              whileInView={userScrolled ? { scale: 1 } : { scale: 1.15 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[3/4] w-full object-cover grayscale"
            />
          </motion.div>

          <motion.ul variants={clipRevealDown} className="border-t border-line-light">
            {howItWorksSteps.map((step) => (
              <motion.li
                key={step.name}
                variants={slideInRight}
                className="grid grid-cols-1 gap-x-6 gap-y-3 py-8 first:pt-10 sm:grid-cols-[1rem_12rem_1fr] sm:gap-x-8 lg:first:pt-8"
              >
                <motion.span
                  variants={dotPop}
                  aria-hidden="true"
                  className="mt-3 size-2 bg-brand-green-bright max-sm:hidden"
                />
                <div>
                  <h3 className="text-subheading font-medium text-ink">{step.name}</h3>
                  <p className="mt-2 text-label text-muted-dark">{step.date}</p>
                </div>
                <p className="max-w-sm self-start text-label leading-relaxed text-ink/75 max-sm:pl-10">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
