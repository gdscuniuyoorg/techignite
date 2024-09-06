import { partners } from "@/constants/partnersAndSponsors";
import Image from "next/image";

const SponsorsAndPartners = () => {
  return (
    <section className="bg-[#130E09] py-14">
      <h2 className="font-semibold text-2xl text-yellow-500 mb-3 lg:text-5xl text-left italic px-[130px]">
        Our Sponsors
      </h2>
      <p className="text-white text-sm lg:text-xl text-left mx-auto mb-16 px-[130px]">
        {`Whether you're a complete beginner or looking to take your skills to the
        next level.`}
      </p>
      <div className="overflow-x-auto flex flex-col hide-scrollbar lg:!ml-[130px] !pr-0 !mr-0">
        <div className="lg:flex hidden flex-row w-full gap-10">
          {partners.map((sponsor, i) => {
            return (
              <div className="w-full lg:w-[379px]" key={i}>
                <div className="bg-white rounded-3xl object-contain overflow-hidden items-center flex justify-center p-5 w-[331px] h-[293px]">
                  <Image
                    src={sponsor.image}
                    alt={sponsor.title}
                    width={400}
                    height={243}
                    className="object-cover overflow-hidden w-[331px] h-[243px]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SponsorsAndPartners;
