import React from "react";
import Logo from "./ui/Logo";
import Button from "./buttons/Button";

const Navbar = () => {
  return (
    <div className="container bg-white md:px-20 py-5 flex flex-col md:flex-row justify-between items-center">
      <div className="">
        <Logo />
      </div>
      <div className="hidden md:flex gap-10 md:items-center text-[#344363]">
        <a href="#About">About Tech Ignite</a>
        <a href="#Faqs">FAQs</a>
        <a href="Contact">Contact</a>
        <Button className="">Register Now</Button>
      </div>
    </div>
  );
};

export default Navbar;
