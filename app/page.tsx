import About from "@/components/sections/About";
import Expectations from "@/components/sections/Expectations";
import Faqs from "@/components/sections/Faqs";
import Hero from "@/components/sections/Hero";
import Speakers from "@/components/sections/Speakers";
import Topics from "@/components/sections/Topics";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Topics />
      <Expectations />

      <Speakers />
      <About />
      <Faqs />
    </main>
  );
}
