import PartnersAndSponsors from "../molecules/PartnersAndSponsors";
import { sponsors } from "@/constants/partnersAndSponsors";
import Image from "next/image";
import SecondButton from "./buttons/SecondButton";
import { FiArrowUpRight } from "react-icons/fi";

const Sponsors = () => {
  return (
    <section className="py-14 lg:px-[130px] px-[2rem] bg-heroPattern bg-[#130E09] flex flex-col md:block items-center justify-center">
      <div className="mb-[5rem]">
        <h2 className="font-semibold text-3xl mb-3 lg:text-5xl text-left italic text-yellow-500">
          Our Sponsors
        </h2>
        <p className="text-[1rem] md:text-xl text-white">
          Our sponsors are vital to the success of this event. Their support
          fuels our mission and enhances the overall experience. We invite you
          to become a sponsor, demonstrating your dedication to innovation and
          community while making a significant impact
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {sponsors.map((el, i) => (
          <a
            href={el.website || "#"}
            target="_blank"
            className="cursor-pointer"
            key={i}
          >
            <div className="bg-white rounded-3xl object-contain overflow-hidden items-center flex justify-center p-3 sm:p-4 md:p-5 lg:p-6 w-full sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px] h-[140px] sm:h-[160px] md:h-[180px] lg:h-[200px]">
              <Image
                src={el.image}
                alt={el.title}
                width={300}
                height={250}
                className="object-contain overflow-hidden w-full h-full"
              />
            </div>
          </a>
        ))}
      </div>
      <div className="flex items-center gap-6 mt-24">
        <div className="flex-1 bg-white h-[.1px]"></div>
        <a
          href="https://docs.google.com/presentation/d/1VAC3zqAwdiqG3v464hNtmUDTz-KP9KWf1MSMy0l5-H8/edit?usp=sharing"
          target="_blank"
        >
          <SecondButton className="flex gap-3 items-center border border-1 border-black">
            Sponsor us <FiArrowUpRight className="text-xl" />
          </SecondButton>
        </a>
      </div>
    </section>
  );
};

export default Sponsors;
