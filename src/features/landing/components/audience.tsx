interface AudienceGroup {
  title: string;
  description: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
}

const audienceGroups: readonly AudienceGroup[] = [
  {
    title: 'Students & Aspiring Talent',
    description:
      'Students, beginners, and future tech professionals ready to learn new skills and connect with the tech community.',
    iconSrc: '/audience-icons/StudentsIcon.svg',
    iconWidth: 100,
    iconHeight: 100,
  },
  {
    title: 'Developers & Builders',
    description:
      'Developers, designers, and makers turning ideas into real products and building solutions that matter.',
    iconSrc: '/audience-icons/DevelopersIcon.svg',
    iconWidth: 100,
    iconHeight: 100,
  },
  {
    title: 'Founders & Startups',
    description:
      'Entrepreneurs, startups, and aspiring founders looking to validate ideas and take their next big step.',
    iconSrc: '/audience-icons/FoundersIcon.svg',
    iconWidth: 100,
    iconHeight: 100,
  },
  {
    title: 'Innovators & Tech Leaders',
    description:
      'Industry professionals and community leaders creating opportunities for the next generation.',
    iconSrc: '/audience-icons/InnovatorsIcon.svg',
    iconWidth: 100,
    iconHeight: 100,
  },
];

const audiencePhotos = [
  {
    src: '/images/homepage/image-1.png',
    alt: 'A Tech Ignite speaker sharing an idea with the audience',
    className: 'top-0 left-0 h-[252px] w-[212px] rounded-[4px] object-[50%_35%]',
  },
  {
    src: '/images/speakers/gallery-01.jpg',
    alt: 'Tech Ignite hosts speaking together on stage',
    className:
      'top-[132px] right-[95px] h-[120px] w-[160px] rounded-[4px] object-[50%_35%]',
  },
  {
    src: '/images/homepage/image-3.png',
    alt: 'Students celebrating together at Tech Ignite',
    className: 'top-[391px] left-0 h-[146px] w-[212px] rounded-[4px] object-[50%_42%]',
  },
  {
    src: '/images/homepage/image-4.png',
    alt: 'Hackathon winners presenting their prize at Tech Ignite',
    className:
      'top-[391px] right-[3px] h-[180px] w-[240px] rounded-[4px] object-[50%_42%]',
  },
] as const;

export function Audience() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="bg-paper py-20 text-ink sm:py-24 lg:py-28"
    >
      <div className="container">
        <div className="border-t border-border-light pt-7 sm:pt-8">
          <p className="flex items-center gap-2.5 align-middle text-[16.7px] font-medium text-[#000000] uppercase">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-xs bg-primary" />
            The audience
          </p>

          <h2
            id="audience-title"
            className="mt-7 align-middle font-sans text-[60px] leading-[70px] font-normal text-[#000000] sm:mt-8"
          >
            <span className="xl:block xl:whitespace-nowrap">
              Tech Ignite{' '}
              <mark className="bg-primary px-1.5 text-primary-foreground">
                brings together the people
              </mark>
            </span>{' '}
            <span className="xl:block xl:whitespace-nowrap">
              building, exploring what&apos;s next in technology.
            </span>
          </h2>
        </div>

        <div className="mt-10 grid items-stretch gap-[19px] sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {audienceGroups.map((group) => (
            <article
              key={group.title}
              className="flex min-h-[339px] w-full flex-col bg-primary p-5 text-primary-foreground sm:p-6"
            >
              <img
                src={group.iconSrc}
                alt=""
                width={group.iconWidth}
                height={group.iconHeight}
                className="h-[100px] w-[100px] object-contain object-left"
              />

              <div className="mt-auto">
                <h3 className="min-h-[80px] max-w-59.5 align-middle font-sans text-[30.8px] leading-[40px] font-normal">
                  {group.title}
                </h3>
                <p className="mt-4.5 border-t border-[#FFFFFF33] pt-4.5 text-[16px] leading-[23px] font-normal tracking-[0%] text-[#F7F5FF]">
                  <span className="block min-h-[92px]">{group.description}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 sm:mt-24 lg:mt-32">
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {audiencePhotos.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={800}
                className="aspect-[4/3] size-full rounded-[4px] object-cover grayscale"
              />
            ))}
          </div>

          <div className="relative mt-10 lg:mx-auto lg:mt-0 lg:h-[571px] lg:w-full lg:max-w-[1270px]">
            {audiencePhotos.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={800}
                className={`absolute hidden object-cover grayscale lg:block ${photo.className}`}
              />
            ))}

            <p className="mx-auto max-w-[1256px] justify-center text-center align-middle font-sans text-[100px] leading-[110px] font-normal text-[#000000] lg:absolute lg:top-[55%] lg:left-1/2 lg:flex lg:w-[72%] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-col lg:items-center">
              <span className="lg:block lg:whitespace-nowrap">Where Students,</span>{' '}
              <span className="lg:block lg:whitespace-nowrap">
                Innovation, and Technology
              </span>{' '}
              <span className="lg:block lg:whitespace-nowrap">Ignite the Future</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
