import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { faqs } from "@/constants";

export default function Faqs() {
  return (
    <section className="w-full px-4 mb-28 md:mb-72">
      <h2 className="text-center text-[#101828] text-[28px] font-bold md:text-5xl mb-14">Frequently Asked Questions</h2>
      <div className="p-8 bg-white rounded-md md:w-[768px] mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => {
            return (
              <AccordionItem className="" key={faq.value} value={faq.value}>
                <AccordionTrigger className="font-semibold md:text-xl text-[#1D2939]">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-[#475467]">{faq.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
