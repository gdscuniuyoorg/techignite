import { partners } from "@/constants/partnersAndSponsors";
import PartnersAndSponsors from "../molecules/PartnersAndSponsors";

const Partners = () => {
  return (
    <PartnersAndSponsors
      topic="Partners"
      description="Our incredible partners are helping to make this event extraordinary. Join us in creating a memorable experience for everyone by becoming a partner."
      images={partners}
      className="bg-[#FBBC04]"
      link="https://docs.google.com/presentation/d/1VAC3zqAwdiqG3v464hNtmUDTz-KP9KWf1MSMy0l5-H8/edit?usp=sharing"
      otherClassName={["black", "black"]}
      cta="Partner with us"
    />
  );
};

export default Partners;
