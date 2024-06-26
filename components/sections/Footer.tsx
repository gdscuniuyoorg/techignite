import Image from "next/image";
import React from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { BsTwitterX } from "react-icons/bs";
import { MdMail } from "react-icons/md";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white py-10 w-full">
      <div className="container flex flex-col-reverse md:flex-row gap-6 items-center justify-between">
        <div className="lg:flex hidden items-center">
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
        <div className="lg:hidden flex items-center">
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
            width={200.54}
            height={34}
            className="ml-3"
          />
        </div>

        <div className="flex items-center gap-6">
          <Link href="https://web.facebook.com/gdscuniuyo">
            <FaFacebook className="md:h-8 h-6 w-6 md:w-8 cursor-pointer" />
          </Link>
          <Link href="https://www.instagram.com/gdscuniuyo">
            <RiInstagramFill className="md:h-8 h-6 w-6 md:w-8 cursor-pointer" />
          </Link>
          <Link href="https://www.twitter.com/gdscuniuyo">
            <BsTwitterX className="md:h-8 h-6 w-6 md:w-8 cursor-pointer" />
          </Link>
          <Link href="https://gdsc.community.dev/university-of-uyo-uyo-nigeria/ ">
            <MdMail className="md:h-8 h-6 w-6 md:w-8 cursor-pointer" />
          </Link>

          <Link href="https://www.linkedin.com/company/gdscuniuyo">
            <FaLinkedin className="md:h-8 h-6 w-6 md:w-8 cursor-pointer" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
