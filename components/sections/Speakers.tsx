import { speakers } from "@/constants";
import Image from "next/image";
import React from "react";

export default function Speakers() {
  return (
    <section className="py-12 " id="Speakers">
      <h2 className="font-bold text-2xl text-[#101828] mb-3 lg:text-5xl text-center">
        Speakers
      </h2>
      <p className="text-[#475467] text-[1rem] lg:text-xl text-center mx-auto mb-16">
        Our lineup features seasoned experts who will share their extensive
        knowledge on careers, tech, and education.
        <br className="hidden lg:block" />
        Get ready to gain valuable insights from the best in the field.
      </p>
      <div className="overflow-x-auto flex flex-col hide-scrollbar lg:!ml-[130px] !pr-0 !mr-0">
        <div className="flex flex-row mt-10 gap-10">
          {speakers.map((speaker, i) => {
            return (
              <div className="w-full lg:w-[379px]" key={i}>
                <div className="bg-white rounded-3xl object-contain overflow-hidden items-center flex justify-center p-5 w-[331px] h-[293px]">
                  <Image
                    src={speaker.image}
                    alt={speaker.speaker}
                    width={400}
                    height={243}
                    className="object-cover w-[331px] h-[243px]"
                  />
                </div>
                <div className="text-center mt-4 font-product-sans">
                  <p className="font-bold text-xl lg:text-2xl mb-3 text-[#130E09]">
                    {speaker.speaker}
                  </p>
                  <p className="text-[#212529] text-sm lg:text-base">
                    {speaker.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
