import { motion } from 'framer-motion';
import { outgoingCoreTeam } from '@/utils/coreteam';
import {
  blurUp,
  dotPop,
  imageSettle,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function CoreTeamGallery() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="coreteam"
      aria-labelledby="coreteam-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
        className="container"
      >
        <div className="border-t border-line pt-10 sm:pt-14">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 shrink-0 bg-brand-amber"
            />
            Outgoing CoreTeam
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="coreteam-title"
            className="mt-6 max-w-[60rem] text-heading font-bold text-paper"
          >
            The 25/26 <span className="bg-brand-amber px-1.5 text-ink">CoreTeam</span>
          </motion.h2>

          <motion.p
            variants={blurUp}
            className="mt-4 max-w-[52rem] text-lg leading-relaxed text-muted"
          >
            The student leaders who carried the GDGOC UNIUYO community through the
            25/26 session — the team handing over to the next set of builders.
          </motion.p>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-13 lg:gap-y-18">
            {outgoingCoreTeam.map((member) => (
              <motion.li
                key={member.src}
                variants={springUp}
                whileHover={{ y: -6 }}
                className="relative min-w-0"
              >
                <div className="overflow-hidden rounded-xs">
                  <motion.img
                    src={member.src}
                    alt={member.alt}
                    width={member.width}
                    height={member.height}
                    loading="lazy"
                    decoding="async"
                    variants={imageSettle}
                    whileHover={{
                      scale: 1.06,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="aspect-square w-full object-cover"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg leading-tight font-normal text-paper">
                    {member.name}
                  </h3>
                  {member.role ? (
                    <p className="mt-1 text-label text-muted">{member.role}</p>
                  ) : null}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
