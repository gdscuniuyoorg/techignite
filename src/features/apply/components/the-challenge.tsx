import { motion } from 'framer-motion';
import {
  clipRevealDown,
  dotPop,
  fadeUp,
  slideInRight,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

const CHALLENGE_PARAGRAPHS: readonly string[] = [
  'Build an application that solves an African problem, powered by the Paga Engine API. That’s it. We are making the challenge open, because great ideas can come from every industry.',
  'Over two weeks, participants will work in teams of 3–5, receive mentorship from experienced industry experts, attend practical workshops, and refine their ideas into market-ready products.',
  'The program culminates in a Demo Day, where finalists pitch their solutions before a panel of judges, investors, ecosystem leaders, and potential partners for a chance to win prizes, funding opportunities, and industry recognition.',
];

export function TheChallenge() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="the-challenge"
      aria-labelledby="the-challenge-title"
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
            The Challenge
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="the-challenge-title"
            className="mt-6 max-w-[56rem] text-heading font-bold text-ink"
          >
            Solve an African Problem.{' '}
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
                Ship it with Paga.
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

          <motion.div
            variants={fadeUp}
            className="max-w-xl space-y-8 self-center border-t border-line-light pt-10"
          >
            {CHALLENGE_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-ink/75">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
