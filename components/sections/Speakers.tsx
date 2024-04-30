import { speakers } from "@/constants";
import Image from "next/image";
import React from "react";

export default function Speakers() {
  return (
    <section className="">
      <h2 className="font-bold text-2xl text-[#101828] mb-3 lg:text-5xl text-center">
        Speakers
      </h2>
      <p className="text-[#475467] text-sm lg:text-xl text-center lg:w-[480px] mx-auto mb-16">
        Whether you&apos;re a complete beginner or looking to{' '}
        <br className="hidden lg:block" />
        take your skills to the next level.
      </p>
      <div className="overflow-x-auto flex flex-col hide-scrollbar lg:!ml-[130px] !pr-0 !mr-0">
        {' '}
        <div className=" flex flex-row w-full gap-10">
          {speakers.map((speaker, i) => {
            return (
              <div className="w-full lg:w-[379px]" key={i}>
                <div className="bg-white rounded-3xl object-contain p-5 w-[331px] h-[243px]">
                  <Image
                    src={speaker.image}
                    alt={speaker.speaker}
                    width={400}
                    height={243}
                    className="object-cover w-[331px] h-[243px]"
                  />
                </div>
                <div className="text-center mt-4">
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
        <div className=" flex flex-row gap-10">
          {speakers.map((speaker, i) => {
            return (
              <div className="w-full lg:w-[379px]" key={i}>
                <div className="bg-white rounded-3xl object-contain p-5 w-[331px] h-[243px]">
                  <Image
                    src={speaker.image}
                    alt={speaker.speaker}
                    width={400}
                    height={243}
                    className="object-cover w-[331px] h-[243px]"
                  />
                </div>
                <div className="text-center mt-4">
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
