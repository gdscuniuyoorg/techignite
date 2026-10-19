import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { faqs } from '@/constants';

export default function Faqs() {
  return (
    <section id="Faqs" className="mb-28 w-full px-4 md:mb-72">
      <h2 className="mb-14 text-center text-[28px] font-bold text-[#101828] md:text-5xl">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto rounded-md bg-white p-8 md:w-[768px]">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => {
            return (
              <AccordionItem className="" key={faq.value} value={faq.value}>
                <AccordionTrigger className="font-semibold text-[#1D2939] md:text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#475467]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
