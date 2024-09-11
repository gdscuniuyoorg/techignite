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
import { headers } from "next/headers";

export default function Home() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const isTicketSubdomain = host.startsWith("tickets.");

  if (isTicketSubdomain) {
    return (
      <main className="h-full">
        <Navbar isTicketSubdomain={true} />
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
