import { sponsors } from '@/constants/partnersAndSponsors';
import SecondButton from './buttons/SecondButton';
import { FiArrowUpRight } from 'react-icons/fi';

const Sponsors = () => {
  return (
    <section className="container flex flex-col items-center justify-center bg-[#130E09] bg-[url('/icons/wavy.svg')] px-[2rem] py-14 md:block lg:px-[130px]">
      <div className="mb-[5rem]">
        <h2 className="mb-3 text-left text-3xl font-semibold text-yellow-500 italic lg:text-5xl">
          Our Sponsors
        </h2>
        <p className="text-[1rem] text-white md:text-xl">
          Our sponsors are vital to the success of this event. Their support fuels our
          mission and enhances the overall experience. We invite you to become a sponsor,
          demonstrating your dedication to innovation and community while making a
          significant impact
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
        {sponsors.map((el, i) => (
          <a
            href={el.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
            key={i}
          >
            <div className="flex h-[140px] items-center justify-center overflow-hidden rounded-3xl bg-white object-contain p-3 sm:h-[160px] sm:p-4 md:h-[180px] md:p-5 lg:h-[200px] lg:p-6">
              <img
                src={el.image}
                alt={el.title}
                width={300}
                height={250}
                className="h-full w-full overflow-hidden object-contain"
              />
            </div>
          </a>
        ))}
      </div>
      <div className="mt-24 flex items-center gap-6">
        <div className="h-[.1px] flex-1 bg-white"></div>
        <a
          href="https://docs.google.com/presentation/d/1VAC3zqAwdiqG3v464hNtmUDTz-KP9KWf1MSMy0l5-H8/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SecondButton className="flex items-center gap-3 border border-1 border-black">
            Sponsor us <FiArrowUpRight className="text-xl" />
          </SecondButton>
        </a>
      </div>
    </section>
  );
};

export default Sponsors;
