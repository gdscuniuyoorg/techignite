import React from "react";
import HeroImg from "./ui/HeroImg";
import Button from "./buttons/Button";
import RegistrationUnderlineImg from "./ui/RegistrationUnderlineImg";
import VenueImg from "./ui/VenueImg";




export default function Hero() {
  return (
    <div
      id="About"
      className="container flex flex-col py-20 items-center justify-center w-full"
    >
      <div className="py-5 flex justify-center items-center w-full px-0">
        <HeroImg />
      </div>
      <div className="pb-10">
        <p className=" text-center text-[20px] leading-[28px] text-[#495057]">
          Join us at GDSC Uyo’s Tech Ignite, a one-day event designed to spark <br class="hidden lg:block"/>
          your interest in the ever-evolving world of tech.
        </p>
      </div>
      <div className="pb-5">
        <Button className="!p-[10px_32px]">Register Now</Button>
      </div>
      <p>Registration is free</p>
      <RegistrationUnderlineImg />
      <VenueImg />
    </div>
  );
}
