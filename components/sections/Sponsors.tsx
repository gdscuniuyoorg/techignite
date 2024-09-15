import PartnersAndSponsors from "../molecules/PartnersAndSponsors";
import { sponsors } from "@/constants/partnersAndSponsors";

const Sponsors = () => {
  return (
    <>
      <div className="bg-heroPattern bg-[#130E09] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-14 lg:px-[130px] px-[1rem]">
        {[...Array(15)].map((_, index) => (
          <div key={index} className="bg-[#ccc] rounded-md h-40"></div>
        ))}
      </div>
      <PartnersAndSponsors
        topic="Sponsors"
        description="Meet our amazing Sponsors"
        images={sponsors}
        className="bg-[#130E09]"
        link="https://docs.google.com/presentation/d/1VAC3zqAwdiqG3v464hNtmUDTz-KP9KWf1MSMy0l5-H8/edit?usp=sharing"
        cta="Sponsor us"
      />
    </>
  );
};

export default Sponsors;
