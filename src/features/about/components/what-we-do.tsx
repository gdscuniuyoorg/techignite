import { motion } from 'framer-motion';
import { whatWeDoItems } from '@/utils/about';
import {
  dotPop,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function WhatWeDo() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="what-we-do"
      aria-labelledby="what-we-do-title"
      className="bg-paper pt-20 pb-24 text-ink sm:pt-24 sm:pb-28"
    >
      <motion.div
        variants={staggerContainer(0.14)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
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
            What We Do
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="what-we-do-title"
            className="mt-6 max-w-[60rem] text-heading font-bold text-ink"
          >
            One Day.{' '}
            <span className="bg-brand-blue px-1.5 text-paper">Four Ways to Grow</span>
          </motion.h2>

          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {whatWeDoItems.map((item) => (
              <motion.li
                key={item.title}
                variants={springUp}
                whileHover={{ y: -8 }}
                className="flex flex-col gap-3 rounded-panel bg-mist p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                <p className="text-base leading-relaxed text-ink/75">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
