import { partners } from "@/constants/partnersAndSponsors";
import Image from "next/image";

const SponsorsAndPartners = () => {
  return (
    <div className="overflow-x-auto flex flex-col hide-scrollbar lg:!ml-[130px] !pr-0 !mr-0">
      <div className=" lg:flex hidden flex-row w-full gap-10">
        {partners.map((speaker, i) => {
          return (
            <div className="w-full lg:w-[379px]" key={i}>
              <div className="bg-white rounded-3xl object-contain overflow-hidden items-center flex justify-center p-5 w-[331px] h-[293px]">
                <Image
                  src={speaker.image}
                  alt={speaker.speaker}
                  width={400}
                  height={243}
                  className="object-cover overflow-hidden w-[331px] h-[243px]"
                />
              </div>
              <div className="text-center mt-4 font-product-sans">
                <p className="font-bold text-xl lg:text-2xl mb-3 text-[#130E09]">
                  {speaker.speaker}
                </p>
                <p className="text-[#212529] text-sm lg:text-base">
                  {speaker.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorsAndPartners;
