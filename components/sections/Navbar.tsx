import React from "react";
import Image from "next/image";
import Button from "./buttons/Button";

const Navbar = () => {
  return (
    <div className=" w-full bg-white sticky top-0 z-30 ">
      <div className="container w-full bg-white  py-5 flex flex-col md:flex-row justify-between items-center">
        <div className="">
          <div className="flex items-center">
            <Image
              src="/icons/logo.svg"
              alt="Tech Ignite Logo"
              width={55}
              height={34}
              className="mr-3"
            />
            <div className="h-[34px] border-[#DEE2E6] border bg-black rounded-full"></div>
            <Image
              src="/icons/gdsc.svg"
              alt="Tech Ignite Logo"
              width={255.54}
              height={34}
              className="ml-3"
            />
          </div>
        </div>
        <div className="hidden md:flex gap-10 md:items-center text-[#344363]">
          <a href="#About">About Tech Ignite</a>
          <a href="#Faqs">FAQs</a>
          <a href="Contact">Contact</a>
          <Button className="">Register Now</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
