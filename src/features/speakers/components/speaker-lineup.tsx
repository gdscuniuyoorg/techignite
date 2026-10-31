import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import { lineupSpeakers } from '@/utils/speakers';
import { REGISTER_URL } from '@/utils/footer';
import {
  imageSettle,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function SpeakerLineup() {
  const userScrolled = useScrollGate();
  /** Speakers whose bio overlay the visitor explicitly dismissed with the X.
   * Stored as a Set so dismissing one card never affects another. */
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(() => new Set());

  const dismissBio = (name: string, event: ReactMouseEvent) => {
    event.stopPropagation();
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

  /** Tapping/clicking the card clears an earlier dismissal so the bio can reopen. */
  const reopenBio = (name: string) => {
    setDismissed((prev) => {
      if (!prev.has(name)) return prev;
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

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
              tabIndex={speaker.bio ? 0 : undefined}
              aria-label={speaker.bio ? `View bio for ${speaker.name}` : undefined}
              className="group/speaker relative min-w-0 outline-none"
            >
              <div className="overflow-hidden rounded-xs" onClick={() => reopenBio(speaker.name)}>
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

                {speaker.bio && !dismissed.has(speaker.name) ? (
                  <div className="pointer-events-none absolute inset-0 z-10 flex translate-y-2 flex-col bg-ink/92 p-5 text-paper opacity-0 transition-all duration-300 group-hover/speaker:translate-y-0 group-hover/speaker:opacity-100 group-hover/speaker:pointer-events-auto group-focus/speaker:translate-y-0 group-focus/speaker:opacity-100 group-focus/speaker:pointer-events-auto group-focus-within/speaker:translate-y-0 group-focus-within/speaker:opacity-100 group-focus-within/speaker:pointer-events-auto sm:p-6">
                    <button
                      type="button"
                      onClick={(event) => dismissBio(speaker.name, event)}
                      aria-label={`Close bio for ${speaker.name}`}
                      className="absolute top-3 right-3 z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-soft/80 text-paper transition-colors hover:bg-paper hover:text-ink"
                    >
                      <X aria-hidden="true" className="size-4" />
                    </button>

                    {/* mt-auto keeps short bios bottom-aligned while letting long
                        ones scroll instead of overflowing the card. */}
                    <div className="mt-auto min-h-0 overflow-y-auto overscroll-contain pr-1">
                      <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                        {speaker.bio}
                      </p>
                    </div>

                    <a
                      href={REGISTER_URL}
                      className="mt-4 flex h-10 shrink-0 items-center justify-center gap-2 rounded-xs bg-brand-blue px-5 text-sm font-medium text-paper transition-colors hover:bg-brand-blue-strong lg:hidden"
                    >
                      Register Now
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </a>

                  </div>
                ) : null}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg leading-tight font-normal text-paper">
                    {speaker.name}
                  </h3>
                  <p className="mt-1 text-label text-muted">{speaker.role}</p>
                </div>
                {speaker.linkedin ? (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${speaker.name} on LinkedIn`}
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xs bg-ink-soft text-paper transition-colors hover:bg-brand-amber hover:text-ink"
                  >
                    <FaLinkedin className="size-4" />
                  </a>
                ) : (
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xs bg-ink-soft text-paper"
                  >
                    <FaLinkedin className="size-4" />
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
