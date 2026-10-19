import { speakers } from '@/constants';

export default function Speakers() {
  return (
    <section className="my-16 py-12" id="Speakers">
      <h2 className="mb-3 text-center text-2xl font-bold text-[#101828] lg:text-5xl">
        Speakers
      </h2>
      <p className="mx-auto mb-1 text-center text-[1rem] text-[#475467] lg:text-xl">
        Our lineup features seasoned experts who will share their extensive knowledge on
        careers, tech, and education.
        <br className="hidden lg:block" />
        Get ready to gain valuable insights from the best in the field.
      </p>
      <div
        className="hide-scrollbar !mr-0 flex flex-col overflow-x-auto !pr-0 lg:!ml-[130px]"
        role="list"
        aria-label="Speakers"
      >
        <div className="mt-7 flex flex-row gap-10">
          {speakers.map((speaker, i) => {
            return (
              <article
                className="w-full transition duration-300 hover:shadow-lg lg:w-[379px]"
                key={i}
                role="listitem"
              >
                <div className="flex h-[293px] w-[331px] items-center justify-center overflow-hidden rounded-3xl bg-white object-contain p-5">
                  <img
                    src={speaker.image}
                    alt={speaker.speaker}
                    width={400}
                    height={243}
                    className="h-[243px] w-[331px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-center font-product-sans">
                  <p className="mb-3 text-xl font-bold text-[#130E09] lg:text-2xl">
                    {speaker.speaker}
                  </p>
                  <p className="text-sm text-[#212529] lg:text-base">{speaker.title}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
