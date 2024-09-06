import PartnersAndSponsors from "../molecules/PartnersAndSponsors";
import { sponsors } from "@/constants/partnersAndSponsors";

const Sponsors = () => {
  return (
    <PartnersAndSponsors
      topic="Sponsors"
      description="Meet our amazing Sponsors"
      images={sponsors}
      className="bg-[#130E09]"
      link="#"
      cta="Sponsor us"
    />
  );
};

export default Sponsors;
