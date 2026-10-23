import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  stagger,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { stats } from '@/utils/stats';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.15),
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function StatCounter({
  target,
  suffix,
  duration,
  delay = 0,
}: {
  target: number;
  suffix: string;
  duration: number;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return;
    }

    const controls = animate(0, target, {
      duration,
      delay,
      // Ease-out exponential deceleration: starts with rapid momentum, then glides smoothly to rest
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        setCount(Math.round(value));
      },
    });

    return () => {
      controls.stop();
    };
  }, [isInView, target, duration, delay, shouldReduceMotion]);

  return (
    <span ref={ref} aria-hidden="true" className="tabular-nums">
      {shouldReduceMotion ? target : count}
      {suffix}
    </span>
  );
}

export function WhatToExpect() {
  return (
    <section
      id="what-to-expect"
      aria-labelledby="what-to-expect-title"
      className="bg-ink py-20 sm:py-24"
    >
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="border-t border-border pt-8"
        >
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-2.5 text-sm font-medium tracking-wider text-white uppercase sm:text-base"
          >
            <span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
            What to expect
          </motion.p>

          <motion.h2
            id="what-to-expect-title"
            variants={itemVariants}
            className="mt-8 w-full align-middle font-sans text-[28px] leading-[36px] font-normal tracking-[0px] text-balance text-foreground not-italic sm:text-[36px] sm:leading-[46px] lg:text-[42px] lg:leading-[52px] xl:mt-10 xl:text-[60px] xl:leading-[70px]"
          >
            A global stage where students, innovation, and technology come together to{' '}
            <mark className="rounded-xs bg-primary px-1.5 text-primary-foreground">
              build the future,
            </mark>{' '}
            and inspire what’s next.
          </motion.h2>
        </motion.div>

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:mt-12 sm:grid-cols-3 sm:gap-x-12 lg:mt-12 lg:gap-x-14 xl:mt-14 xl:gap-x-20 xl:gap-y-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              variants={statVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              <dt className="text-[clamp(2.5rem,4vw,3.75rem)] font-normal text-foreground tabular-nums xl:text-stat">
                <span className="sr-only">{stat.value}</span>
                <StatCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={stat.duration}
                  delay={index * 0.15}
                />
              </dt>
              <dd className="mt-6 max-w-[20rem] border-t border-border pt-5 text-sm leading-relaxed text-white/85 transition-colors group-hover:border-brand-blue-soft/50 group-hover:text-white">
                {stat.description}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
