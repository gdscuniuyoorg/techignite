const galleryRows = [
  {
    label: 'First row of Tech Ignite event photographs',
    photos: [
      {
        image: 'gallery-01.jpg',
        alt: 'Tech Ignite speakers addressing the audience at a podium',
      },
      {
        image: 'gallery-02.jpg',
        alt: 'Three Tech Ignite volunteers posing outdoors',
      },
      {
        image: 'gallery-03.jpg',
        alt: 'Tech Ignite attendees celebrating together outdoors',
      },
      {
        image: 'gallery-04.jpg',
        alt: 'Two Tech Ignite volunteers at the event',
      },
      {
        image: 'gallery-05.jpg',
        alt: 'Tech Ignite attendee meeting fellow participants',
      },
    ],
  },
  {
    label: 'Second row of Tech Ignite event photographs',
    photos: [
      {
        image: 'gallery-08.jpg',
        alt: 'Two participants wearing Tech Ignite shirts',
      },
      {
        image: 'gallery-09.jpg',
        alt: 'Students presenting a hackathon prize',
      },
      {
        image: 'gallery-06.jpg',
        alt: 'Speaker holding a microphone at Tech Ignite',
      },
      {
        image: 'gallery-07.jpg',
        alt: 'Tech Ignite participants posing for a group photo',
      },
    ],
  },
] as const;

export function SpeakerSponsorPanel() {
  return (
    <section
      id="sponsors"
      aria-labelledby="speaker-sponsor-title"
      className="overflow-hidden bg-accent py-16 text-accent-foreground sm:py-20 lg:py-20"
    >
      <div className="mx-auto max-w-[1352px] px-5 sm:px-8 lg:px-0">
        <div className="border-t border-ink/10 pt-6">
          <p className="flex items-center gap-3 text-eyebrow font-normal text-accent-foreground">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand-green" />
            Become a sponsor
          </p>

          <h2
            id="speaker-sponsor-title"
            className="mt-6 text-heading font-bold text-accent-foreground"
          >
            Why Sponsor{' '}
            <span className="bg-brand-green-bright px-1 text-paper">
              Tech Ignite&rsquo;26?
            </span>
          </h2>

          <p className="mt-6 max-w-[850px] text-lg leading-relaxed text-accent-foreground">
            Tech Ignite by GDG Uyo goes beyond a single event. It brings students,
            developers, and tech enthusiasts together to share ideas, build meaningful
            connections, explore new opportunities, and grow within a community shaping
            the future of technology.
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-12 sm:mt-14">
        {galleryRows.map((row) => (
          <div
            key={row.label}
            role="region"
            aria-label={row.label}
            className="scrollbar-none overflow-x-auto"
          >
            <ul className="flex w-max gap-3">
              {row.photos.map((photo) => (
                <li key={photo.image} className="w-[min(31rem,82vw)] shrink-0">
                  <img
                    src={`/images/speakers/${photo.image}`}
                    alt={photo.alt}
                    width={1200}
                    height={800}
                    className="aspect-[3/2] w-full rounded-lg object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
