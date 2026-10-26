import { FaLinkedin } from 'react-icons/fa6';

const speakers = [
  {
    name: 'Temitope Omolere',
    role: 'VP, Quality Engineering',
    image: 'portrait-01.jpg',
    width: 683,
    height: 1024,
  },
  {
    name: 'Diego Costa',
    role: 'Founder, MotionFlow',
    image: 'portrait-02.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Niyi Okeowo',
    role: 'Creative Director, Kuda',
    image: 'portrait-03.jpg',
    width: 861,
    height: 1024,
  },
  {
    name: 'Ted Oladele',
    role: 'Head of Product, Chowdeck',
    image: 'portrait-04.jpg',
    width: 882,
    height: 1024,
  },
  {
    name: 'Evana Eko (Razzo)',
    role: 'Senior Brand Designer',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Daniel Ife',
    role: 'Designer | Canvassador',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Wilfred Alfred',
    role: 'Head of Business Development',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Kachi Kalu',
    role: 'Senior Product Designer',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Samuel Lasisi',
    role: 'Founder, Conectr',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
] as const;

export function SpeakerLineup() {
  return (
    <section
      aria-labelledby="keynote-speakers-title"
      className="border-t border-foreground/20 bg-ink py-10 sm:py-12 lg:pb-[4.1875rem]"
    >
      <div className="mx-auto max-w-[1352px] px-5 sm:px-8 lg:px-0">
        <h2
          id="keynote-speakers-title"
          className="flex items-center gap-3 text-eyebrow font-normal text-paper"
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-brand-amber" />
          Keynote Speakers
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-13 lg:gap-y-18">
          {speakers.map((speaker) => (
            <li key={speaker.name} className="min-w-0">
              <img
                src={`/images/speakers/${speaker.image}`}
                alt={`Portrait of ${speaker.name}`}
                width={speaker.width}
                height={speaker.height}
                className="aspect-square w-full rounded-xs object-cover"
              />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg leading-tight font-normal text-paper">
                    {speaker.name}
                  </h3>
                  <p className="mt-1 text-base text-foreground/65">{speaker.role}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-foreground/20 text-paper"
                >
                  <FaLinkedin className="size-4" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
