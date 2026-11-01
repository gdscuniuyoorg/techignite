import { motion } from 'framer-motion';
import { shipathonJudges, type ShipathonJudgeMode } from '@/utils/apply';
import { springUp, staggerContainer, useScrollGate } from '@/lib/motion';

const MODE_LABELS: Record<ShipathonJudgeMode, string> = {
  virtual: 'Virtual',
  'in-person': 'In person',
};

const MODE_PILL_CLASSES: Record<ShipathonJudgeMode, string> = {
  virtual: 'bg-brand-blue-pale text-ink',
  'in-person': 'bg-mist text-muted-dark',
};

export function ShipathonJudges() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="judges"
      aria-labelledby="judges-title"
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
            variants={springUp}
            className="flex items-center gap-2 text-eyebrow font-normal text-ink uppercase"
          >
            <span aria-hidden="true" className="size-2 bg-[#FF84B3]" />
            Confirmed Judges
          </motion.p>

          <motion.h2
            variants={springUp}
            id="judges-title"
            className="mt-6 max-w-[52rem] text-heading font-bold text-ink"
          >
            The Panel Ready to{' '}
            <span className="bg-[#FF84B3]/20 px-1.5">Ship the Verdict</span>.
          </motion.h2>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shipathonJudges.map((judge, index) => (
            <motion.li
              key={judge.id}
              variants={springUp}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-3 rounded-md border border-line-light bg-paper p-5 transition-colors hover:border-[#FF84B3] sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-label font-bold text-ink/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={`rounded-pill px-3 py-1 text-xs leading-none ${MODE_PILL_CLASSES[judge.mode]}`}
                >
                  {MODE_LABELS[judge.mode]}
                </span>
              </div>
              <h3
                className={`text-lg font-bold ${
                  judge.name === 'Announcing soon' ? 'text-ink/40' : 'text-ink'
                }`}
              >
                {judge.name}
              </h3>
              <p className="text-sm leading-relaxed text-ink/65">{judge.role}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
