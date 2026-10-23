import { useState } from 'react';
import { AnimatePresence, motion, stagger, type Variants } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { faqItems } from '@/utils/faq';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Faq() {
  const [openId, setOpenId] = useState<string | null>('vip-seating');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-ink py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        {/* Top Eyebrow Divider */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-white uppercase sm:text-[13px]">
            <span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
            FREQUENTLY ASKED QUESTIONS
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* Left: Heading */}
          <div className="lg:col-span-5">
            <h2
              id="faq-title"
              className="sticky top-28 font-sans text-[36px] leading-[1.12] font-normal tracking-[-0.03em] text-white sm:text-[46px] lg:text-[54px] xl:text-[60px]"
            >
              Everything you
              <br />
              need to know.
            </h2>
          </div>

          {/* Right: Accordion Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-4 lg:col-span-7"
          >
            {faqItems.map((item) => {
              const isOpen = openId === item.id;

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="overflow-hidden rounded-[20px] bg-[#131313] transition-colors hover:bg-[#181818]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleItem(item.id);
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 p-6 sm:px-7 sm:py-6"
                  >
                    <span className="pt-2 text-left font-sans text-base leading-snug font-normal text-white sm:text-[18px]">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen
                          ? 'bg-paper text-ink'
                          : 'bg-primary text-primary-foreground hover:bg-brand-blue-strong'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="size-5" />
                      ) : (
                        <Plus className="size-5" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pt-0 pb-7 text-sm leading-relaxed text-[#a3a3a3] sm:px-7 sm:text-[15px]">
                          <p className="max-w-[530px]">{item.answer}</p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
