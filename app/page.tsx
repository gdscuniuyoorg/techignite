import About from "@/components/sections/About";
import Expectations from "@/components/sections/Expectations";
import Faqs from "@/components/sections/Faqs";
import Navbar from "@/components/sections/Navbar";
import Speakers from "@/components/sections/Speakers";
import Topics from "@/components/sections/Topics";
import Hero from "@/components/sections/Hero";
import Image from "next/image";



export default function Home() {
  return (
    <main className=" min-h-screen  bg-[#F5F9FE]">
     <Navbar />

      <Hero />
      <Topics />
      <Expectations />

      <Speakers />
      <About />
      <Faqs />
    </main>
  );
}
