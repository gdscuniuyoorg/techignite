import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { faqItems } from '@/utils/faq';

export function Faq() {
  const [openId, setOpenId] = useState<string | null>('vip-seating');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ink py-20 sm:py-24">
      <div className="container">
        {/* Top eyebrow divider */}
        <div className="border-t border-border pt-7 sm:pt-8">
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.14em] text-white uppercase sm:text-[13px]">
            <span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
            Frequently asked questions
          </p>
        </div>

        {/* Two-column layout */}
        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-14 md:grid-cols-2 md:gap-2.5">
          <div>
            <h2
              id="faq-title"
              className="font-sans text-[36px] leading-[1.1] font-normal tracking-[-0.03em] text-white sm:text-[46px] md:sticky md:top-28 md:text-[54px]"
            >
              Everything you
              <br />
              need to know.
            </h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-[#131313] transition-colors hover:bg-[#181818]"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => {
                        toggleItem(item.id);
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      className="flex w-full cursor-pointer items-start justify-between gap-4 px-4 py-5 text-left md:px-5"
                    >
                      <span className="font-sans text-base leading-[1.3] font-normal text-white md:text-[17px]">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors md:size-11 ${
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
                  </h3>

                  <div
                    id={`faq-answer-${item.id}`}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 text-sm leading-[1.45] text-[#a3a3a3] md:px-5 md:pb-5 md:text-[15px]">
                        <p className="max-w-[30rem]">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
