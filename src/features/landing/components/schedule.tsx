import { motion } from 'framer-motion';
import { scheduleDays } from '@/utils/schedule';
import {
  imageSettle,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

export function Schedule() {
  const userScrolled = useScrollGate();

  return (
    <section id="agenda" aria-labelledby="agenda-title" className="bg-paper text-ink">
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
        className="container pt-16 pb-16 sm:pt-20 sm:pb-20"
      >
        <div className="border-t border-border-light pt-6">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-[13px] font-medium tracking-[0.02em] uppercase"
          >
            <span aria-hidden="true" className="size-2 shrink-0 bg-brand-green-vivid" />
            Schedule
          </motion.p>

          <motion.h2
            id="agenda-title"
            variants={slideInRight}
            className="mt-7 font-sans text-[36px] leading-[1.22] font-medium not-italic lg:text-[56px]"
          >
            <span className="lg:block">
              <mark className="bg-brand-green-vivid px-2 text-paper">2 days</mark> of
              inspiration &amp;
            </span>
            <span className="lg:block">innovation.</span>
          </motion.h2>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-16">
          <motion.div variants={imageSettle} className="overflow-hidden rounded-lg">
            <img
              src="/images/speakers/gallery-01.jpg"
              alt="Speaker presenting at the Tech Ignite podium"
              width={683}
              height={689}
              loading="lazy"
              decoding="async"
              className="aspect-[304/306] w-full object-cover grayscale"
            />
          </motion.div>

          <div>
            {scheduleDays.map((day, dayIndex) => (
              <motion.div
                key={day.label}
                variants={springUp}
                className={
                  dayIndex === 0 ? '' : 'mt-12 border-t border-border-light pt-10'
                }
              >
                <div className="grid gap-8 sm:grid-cols-[13.5rem_minmax(0,1fr)]">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-2 shrink-0 rounded-[1px] bg-brand-green-vivid"
                    />
                    <div>
                      <h3 className="text-[1.625rem] leading-[1.2] font-normal">
                        {day.label}:
                        <br />
                        {day.theme}
                      </h3>
                      <p className="mt-4 text-[15px] text-muted-dark">{day.date}</p>
                    </div>
                  </div>

                  <ul>
                    {day.sessions.map((session, sessionIndex) => (
                      <li
                        key={session.time}
                        className={`grid gap-2 py-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 ${
                          sessionIndex === 0 ? '' : 'border-t border-border-light'
                        }`}
                      >
                        <p className="text-base">{session.time}</p>
                        <p className="text-[15px] leading-snug text-ink/90">
                          {session.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
