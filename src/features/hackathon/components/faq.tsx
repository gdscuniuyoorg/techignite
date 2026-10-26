import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { hackathonFaqItems } from '@/utils/hackathon';
import { fadeUp, staggerContainer, useScrollGate } from '@/lib/motion';

export function HackathonFaq() {
  const userScrolled = useScrollGate();
  const [openId, setOpenId] = useState<string | null>('who-can-participate');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="container"
      >
        {/* Top eyebrow divider */}
        <div className="border-t border-line pt-7 sm:pt-8">
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
          >
            <span aria-hidden="true" className="size-2 shrink-0 bg-[#FF84B3]" />
            Frequently Asked Questions
          </motion.p>
        </div>

        {/* Sticky title + accordion */}
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div>
            <motion.h2
              variants={fadeUp}
              id="faq-title"
              className="text-heading font-normal text-paper md:sticky md:top-28"
            >
              Everything to
              <br />
              Know About
              <br />
              the Hackathon
            </motion.h2>
          </div>

          <div className="space-y-4">
            {hackathonFaqItems.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                  className="overflow-hidden rounded-2xl bg-ink-raised transition-colors hover:bg-ink-soft"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => {
                        toggleItem(faq.id);
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-6 text-left md:px-7"
                    >
                      <span className="text-lg font-medium text-paper md:text-xl">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors md:size-11 ${
                          isOpen
                            ? 'bg-paper text-[#FF84B3]'
                            : 'bg-[#FF84B3] text-paper hover:bg-[#FF84B3]/90'
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="size-5" />
                        ) : (
                          <Plus className="size-5" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-answer-${faq.id}`}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-6 text-sm leading-[1.45] text-muted md:px-7 md:text-base">
                        <p className="max-w-[34rem]">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
