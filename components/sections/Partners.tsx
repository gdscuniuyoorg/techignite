import { partners } from "@/constants/partnersAndSponsors";
import PartnersAndSponsors from "../molecules/PartnersAndSponsors";

const Partners = () => {
  return (
    <PartnersAndSponsors
      topic="Partners"
      description="Meet our amazing Partners"
      images={partners}
      className="bg-[#FBBC04]"
      link="#"
    />
  );
};

export default Partners;
