import About from "@/components/sections/About";
import Expectations from "@/components/sections/Expectations";
import Faqs from "@/components/sections/Faqs";
import Speakers from "@/components/sections/Speakers";
import Topics from "@/components/sections/Topics";
import Hero from "@/components/sections/hero";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hero />
      <Topics />
      <Expectations />
      
      <Speakers />
      <About />
      <Faqs />
    </main>
  );
}
