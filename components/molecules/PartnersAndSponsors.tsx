import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import SecondButton from "../sections/buttons/SecondButton";

type ImageEntity = {
  title: string;
  image: string;
};

const PartnersAndSponsors = ({
  topic,
  description,
  images,
  className,
  link,
  otherClassName,
}: {
  topic: string;
  description: string;
  images: ImageEntity[];
  className?: string;
  link: string;
  otherClassName?: string[];
}) => {
  return (
    <section className={`py-14 ${className}`}>
      <h2
        className={`font-semibold text-2xl mb-3 lg:text-5xl text-left italic px-[130px] ${
          otherClassName ? `text-${otherClassName?.[0]}` : "text-yellow-500"
        }`}
      >
        {topic}
      </h2>
      <p
        className={`text-sm lg:text-xl text-left mx-auto mb-16 px-[130px] ${
          otherClassName ? `text-${otherClassName?.[1]}` : "text-white"
        }`}
      >
        {description}
      </p>
      <div className="overflow-x-auto flex flex-col hide-scrollbar lg:!ml-[130px] !pr-0 !mr-0">
        <div className="lg:flex hidden flex-row w-full gap-10">
          {images.map((el, i) => {
            return (
              <div className="w-full lg:w-[379px]" key={i}>
                <div className="bg-white rounded-3xl object-contain overflow-hidden items-center flex justify-center p-5 w-[331px] h-[293px]">
                  <Image
                    src={el.image}
                    alt={el.title}
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

      <div className="flex items-center gap-6 mt-24 px-[130px]">
        <div className="flex-1 bg-white h-[.1px]"></div>
        <a href={link} target="_blank">
          <SecondButton className="flex gap-3 items-center border-1 border-black">
            Sponsor Us <FiArrowUpRight className="text-xl" />
          </SecondButton>
        </a>
      </div>
    </section>
  );
};

export default PartnersAndSponsors;
