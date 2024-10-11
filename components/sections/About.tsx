import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <section id="About" className="py-[200px]  container w-full">
      <div className="bg-[#130E09] overflow-hidden max-w-[1200px] mx-auto rounded-2xl lg:rounded-[32px] flex flex-col lg:flex-row lg:items-end">
        <div className="">
          <div className="lg:pl-[72px] lg:pt-[72px] px-6 lg:pb-16 pt-10 pb-8 text-white ">
            <h2 className="font-bold text-xl sm:text-2xl lg:text-5xl mb-2 lg:mb-8">
              About Tech Ignite
            </h2>
            <div className="lg:w-[480px] text-xs sm:text-sm lg:text-xl flex flex-col">
              <p>
                A tech conference held in collaboration with GDG On Campus
                UNIUYO community
              </p>
              <p className="text-[#FBBC04] font-bold mt-[1.5rem]">Featuring:</p>
              <p>10 speakers</p>
              <p>5 panelists</p>
              <p>500+ attendees</p>
            </div>
          </div>
          <div className="mr-8 sm:mr-14 bg-[#FBBC04] py-5 mb-10 lg:mb-24 rounded-tr-full rounded-br-full">
            <div className="w-max mx-auto flex items-center space-x-2">
              <div className="w-4 h-4 lg:w-8 lg:h-8">
                <Image
                  src="/icons/Star.svg"
                  alt="Star logo"
                  width={31}
                  height={31}
                />
              </div>
              <p className="lg:text-xl sm:text-sm text-xs text-[#130E09]">
                Innovative, Engaging, Inspiring, Collaborative, Transformative.{" "}
              </p>
              <div className="w-4 h-4 lg:w-8 lg:h-8">
                <Image
                  src="/icons/Star.svg"
                  alt="Star logo"
                  width={31}
                  height={31}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:pr-[72px] px-6">
          <div className="bg-[#FDDD81] rounded-t-[20px] lg:rounded-t-[32px] p-4 lg:px-6 lg:py-8">
            <div className="w-[72px] h-11 lg:w-32 lg:h-20">
              <Image
                src="/icons/logo-2.svg"
                alt="Tech Ignite Logo"
                width={121}
                height={74}
              />
            </div>
            <p className="text-[#130E09] text-xs sm:text-sm lg:text-lg mt-3">
              Join us for an exciting journey of discovery, networking, and
              learning as we bring together tech enthusiasts, developers, and
              creatives to explore the latest advancements in technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
