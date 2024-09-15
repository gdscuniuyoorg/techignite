import PartnersAndSponsors from "../molecules/PartnersAndSponsors";
import { sponsors } from "@/constants/partnersAndSponsors";

const Sponsors = () => {
  return (
    <PartnersAndSponsors
      topic="Sponsors"
      description="Meet our amazing sponsors who make this event possible! Their support drives our mission forward and helps create an unforgettable experience. Join us in making a lasting impact by becoming a sponsor and showcasing your commitment to innovation and community."
      images={sponsors}
      className="bg-[#130E09]"
      link="https://docs.google.com/presentation/d/1VAC3zqAwdiqG3v464hNtmUDTz-KP9KWf1MSMy0l5-H8/edit?usp=sharing"
      cta="Sponsor us"
    />
  );
};

export default Sponsors;
