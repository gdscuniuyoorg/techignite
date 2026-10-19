import { FiArrowUpRight } from 'react-icons/fi';
import SecondButton from '../sections/buttons/SecondButton';

interface ImageEntity {
  title: string;
  image: string;
  website?: string;
}

interface PartnersAndSponsorsProps {
  topic: string;
  description: string;
  images: ImageEntity[];
  className?: string;
  link: string;
  cta: string;
  /** `yellow` renders black text for the yellow Partner section. */
  tone?: 'dark' | 'yellow';
}

const PartnersAndSponsors = ({
  topic,
  description,
  images,
  className,
  link,
  cta,
  tone = 'dark',
}: PartnersAndSponsorsProps) => {
  const isYellow = tone === 'yellow';
  const headingClassName = isYellow ? 'text-black' : 'text-yellow-500';
  const descriptionClassName = isYellow ? 'text-black' : 'text-white';

  return (
    <section
      className={`py-14 ${className ?? ''} bg-[url('/icons/wavy.svg')]`}
      id={topic === 'Sponsors' ? 'Sponsors' : 'Partners'}
    >
      <h2
        className={`mb-3 px-[1rem] text-left text-3xl font-semibold italic lg:px-[130px] lg:text-5xl ${headingClassName}`}
      >
        {topic}
      </h2>
      <p
        className={`mx-auto mb-16 px-[1rem] text-left text-xl lg:px-[130px] ${descriptionClassName}`}
      >
        {description}
      </p>
      <div className="hide-scrollbar !mr-0 flex flex-col overflow-x-auto px-[1rem] !pr-0 lg:!ml-[130px]">
        <div className="mt-10 flex flex-row gap-10">
          {images.map((el) => {
            return (
              <div className="w-full lg:w-[379px]" key={el.title}>
                {topic === 'Sponsors' ? (
                  <a
                    href={el.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <div className="flex h-[293px] w-[331px] items-center justify-center overflow-hidden rounded-3xl bg-white object-contain p-5">
                      <img
                        src={el.image}
                        alt={el.title}
                        width={400}
                        height={243}
                        className="h-[243px] w-[331px] overflow-hidden object-contain"
                      />
                    </div>
                  </a>
                ) : (
                  <div className="flex h-[293px] w-[331px] items-center justify-center overflow-hidden rounded-3xl bg-white object-contain p-5">
                    <img
                      src={el.image}
                      alt={el.title}
                      width={400}
                      height={243}
                      className="h-[243px] w-[331px] overflow-hidden object-contain"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-24 flex items-center gap-6 px-[1rem] lg:px-[130px]">
        <div className="h-[.1px] flex-1 bg-white" />
        <a href={link} target="_blank" rel="noopener noreferrer">
          <SecondButton className="flex items-center gap-3 border border-1 border-black">
            {cta} <FiArrowUpRight className="text-xl" />
          </SecondButton>
        </a>
      </div>
    </section>
  );
};

export default PartnersAndSponsors;
