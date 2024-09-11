import PartnersAndSponsors from "../molecules/PartnersAndSponsors";
import { sponsors } from "@/constants/partnersAndSponsors";

const Sponsors = () => {
  return (
    <PartnersAndSponsors
      topic="Sponsors"
      description="Meet our amazing Sponsors"
      images={sponsors}
      className="bg-[#130E09]"
      link="https://docs.google.com/presentation/d/1VAC3zqAwdiqG3v464hNtmUDTz-KP9KWf1MSMy0l5-H8/edit?usp=sharing"
      cta="Sponsor us"
    />
  );
};

export default Sponsors;
