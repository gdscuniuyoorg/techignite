import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa6';
import { lineupSpeakers } from '@/utils/speakers';
import {
  imageSettle,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function SpeakerLineup() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="keynote-speakers"
      aria-labelledby="keynote-speakers-title"
      className="border-t border-line bg-ink pt-10 pb-20 text-paper sm:pt-14 sm:pb-24"
    >
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.15 }}
        className="container"
      >
        <motion.h2
          variants={slideInRight}
          id="keynote-speakers-title"
          className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
        >
          <span aria-hidden="true" className="size-2 shrink-0 bg-brand-amber" />
          Keynote Speakers
        </motion.h2>

        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-13 lg:gap-y-18">
          {lineupSpeakers.map((speaker) => (
            <motion.li
              key={speaker.name}
              variants={springUp}
              whileHover={{ y: -6 }}
              className="min-w-0"
            >
              <div className="overflow-hidden rounded-xs">
                <motion.img
                  src={`/images/speakers/${speaker.image}`}
                  alt={`Portrait of ${speaker.name}`}
                  width={speaker.width}
                  height={speaker.height}
                  loading="lazy"
                  variants={imageSettle}
                  whileHover={{
                    scale: 1.06,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg leading-tight font-normal text-paper">
                    {speaker.name}
                  </h3>
                  <p className="mt-1 text-label text-muted">{speaker.role}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xs bg-ink-soft text-paper"
                >
                  <FaLinkedin className="size-4" />
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
