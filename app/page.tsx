"use client";
import { useEffect, useState } from "react";
import About from "@/components/sections/About";
import Expectations from "@/components/sections/Expectations";
import Faqs from "@/components/sections/Faqs";
import Navbar from "@/components/sections/Navbar";
import Speakers from "@/components/sections/Speakers";
import Topics from "@/components/sections/Topics";
import Hero from "@/components/sections/Hero";
import Sponsors from "@/components/sections/Sponsors";
import Partners from "@/components/sections/Partners";
import TicketPage from "@/components/molecules/TicketPage";

export default function Home() {
  const [isTicketSubdomain, setIsTicketSubdomain] = useState(false);

  useEffect(() => {
    const subDomain = window.location.hostname;
    setIsTicketSubdomain(subDomain.includes("tickets."));
  }, []);

  if (isTicketSubdomain) {
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
