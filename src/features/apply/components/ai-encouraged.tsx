import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, useScrollGate } from '@/lib/motion';

export function AiEncouraged() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="ai-encouraged"
      aria-labelledby="ai-encouraged-title"
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
            <span aria-hidden="true" className="size-2 bg-brand-green-bright" />A Note on
            AI
          </motion.p>

          <motion.h2
            variants={fadeUp}
            id="ai-encouraged-title"
            className="mt-6 max-w-[56rem] text-heading font-bold text-ink"
          >
            AI is <span className="bg-[#FF84B3]/20 px-1.5">Encouraged</span>, Not
            Required.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-[42rem] text-lg leading-relaxed text-ink/75"
          >
            Participants are encouraged, but not required, to incorporate Artificial
            Intelligence into their projects — assistants, workflow automations, developer
            tools, support agents, and more. The goal isn&rsquo;t simply to use AI, but to
            build products that are useful, practical, and well-designed.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-8 inline-block bg-[#FF84B3] px-3 py-2 text-lg font-medium text-paper"
          >
            That said, AI slop is greatly frowned upon.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
