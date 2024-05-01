import React from "react";

import Button from "./buttons/Button";
import Image from "next/image";

export default function Hero() {
  // const handleClick = () => {
  //   window.open(
  //     'https://gdsc.community.dev/events/details/developer-student-clubs-university-of-uyo-uyo-nigeria-presents-tech-ignite-2024/',
  //     '_blank'
  //   );
  // };
  return (
    <div className="container font-product-sans flex flex-col py-20 items-center justify-center w-full">
      <div className="py-5 flex justify-center items-center w-full px-0">
        <Image
          src="/icons/hero.svg"
          alt="Tech Ignite Hero"
          width={429}
          height={180}
        ></Image>
      </div>
      <div className="pb-10">
        <p className=" text-center text-[20px] leading-[28px] text-[#495057]">
          Join us at GDSC Uyo’s Tech Ignite, a one-day event designed to spark{' '}
          <br className="hidden lg:block" />
          your interest in the ever-evolving world of tech.
        </p>
      </div>
      <div className="pb-5">
        <Button  className="!p-[10px_32px]">
          Register Now
        </Button>
      </div>
      <p>Registration is free</p>
      <Image
        src="/icons/lightening.svg"
        alt="Tech Ignite Lightening"
        width={167.5}
        height={21.5}
      ></Image>

      <div className="pt-5">
        <Image
          src="/icons/venue.svg"
          alt="Tech Ignite Lightening"
          width={789}
          height={357.19}
        ></Image>
      </div>
    </div>
  );
}
