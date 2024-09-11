"use client";

import About from "@/components/sections/About";
import Expectations from "@/components/sections/Expectations";
import Faqs from "@/components/sections/Faqs";
import Navbar from "@/components/sections/Navbar";
import Speakers from "@/components/sections/Speakers";
import Topics from "@/components/sections/Topics";
import Hero from "@/components/sections/Hero";
import Hackathon from "@/components/sections/Hackathon";
import Sponsors from "@/components/sections/Sponsors";
import Partners from "@/components/sections/Partners";
import { usePathname } from "next/navigation";
import TicketPage from "@/components/molecules/TicketPage";

export default function Home() {
  const subDomain = window.location.hostname;

  if (subDomain.includes("tickets.")) {
    return (
      <main className="h-full">
        <Navbar />
        <TicketPage />
      </main>
    );
  }

  return (
    <main className=" min-h-screen  bg-[#F5F9FE]">
      <Navbar />
      <Hero />
      <Topics />
      <Expectations />
      <Speakers />
      <Sponsors />
      <Partners />
      <About />
      {/* <Faqs /> */}
    </main>
  );
}
