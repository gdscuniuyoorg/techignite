import { speakers } from "@/constants";
import Image from "next/image";
import React from "react";

export default function Speakers() {
  return (
    <section className="px-4 lg:px-0">
      <h2 className="font-bold text-2xl text-[#101828] mb-3 lg:text-5xl text-center">Speakers</h2>
      <p className="text-[#475467] text-sm lg:text-xl text-center lg:w-[480px] mx-auto mb-16">Whether you&apos;re a complete beginner or looking to take your skills to the next level.</p>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {speakers.map((speaker, i) => {
          return (
            <div className="w-full" key={i}>
              <div className="bg-white rounded-3xl p-5">
                <Image
                  src={speaker.image}
                  alt={speaker.speaker}
                  width={400}
                  height={243}
                  className="object-cover"
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
    </section>
  );
}
