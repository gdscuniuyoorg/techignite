import { motion } from 'framer-motion';
import { hackathonBenefits } from '@/utils/hackathon';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
} as const;

export function WhyApply() {
  return (
    <section
      id="why-apply"
      aria-labelledby="why-apply-title"
      className="bg-paper py-20 text-ink sm:py-24"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container"
      >
        <div className="border-t border-line-light pt-10 sm:pt-14">
          <motion.p
            variants={item}
            className="flex items-center gap-2 text-eyebrow font-bold text-ink uppercase"
          >
            <span aria-hidden="true" className="size-2 bg-[#FF84B3]" />
            Why apply?
          </motion.p>

          <motion.h2
            variants={item}
            id="why-apply-title"
            className="mt-6 max-w-[80rem] text-heading font-bold text-ink"
          >
            More Than a Hackathon. It&rsquo;s Your Next{' '}
            <span className="bg-[#FF84B3]/20 px-1.5">Big Opportunity</span>.
          </motion.h2>

          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {hackathonBenefits.map((benefit) => (
              <motion.li
                key={benefit.title}
                variants={item}
                className="flex flex-col gap-3 rounded-md bg-[#FF84B3] p-5 sm:p-6"
              >
                <h3 className="text-lg font-bold text-paper">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-paper/85">
                  {benefit.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
