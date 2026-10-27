interface AgendaSession {
  readonly time: string;
  readonly title: string;
  readonly description: string;
}

interface AgendaDay {
  readonly id: string;
  readonly label: string;
  readonly date: string;
  readonly sessions: readonly AgendaSession[];
}

const agendaDays: readonly AgendaDay[] = [
  {
    id: 'hackathon-day',
    label: 'Hackathon Day',
    date: 'Thursday, 19th November',
    sessions: [
      {
        time: '09:00 AM – 09:45 AM',
        title: 'Networking & Sponsor Booths',
        description:
          'Meet fellow attendees, connect with industry professionals, and explore resources from brands supporting the next generation.',
      },
      {
        time: '09:00 AM – 09:45 AM',
        title: 'Opening Remarks',
        description:
          'Kick off Tech Ignite with a warm welcome, an introduction to the community, and a look at the opportunities ahead.',
      },
      {
        time: '10:00 AM – 10:45 AM',
        title: 'Hackathon Briefing',
        description:
          'Get the challenge, meet your team, and map out what you will build together.',
      },
      {
        time: '11:00 AM – 12:30 PM',
        title: 'Build Session',
        description:
          'Turn your idea into a working prototype with support from the Tech Ignite community.',
      },
    ],
  },
  {
    id: 'conference-day',
    label: 'Conference Day',
    date: 'Friday, 20th November',
    sessions: [
      {
        time: '09:00 AM – 09:45 AM',
        title: 'Doors Open & Networking',
        description:
          'Meet the community, find your seat, and explore the sponsor experience before the programme begins.',
      },
      {
        time: '10:00 AM – 10:30 AM',
        title: 'Welcome to Tech Ignite',
        description: 'Start the day together with a welcome from the organising team.',
      },
      {
        time: '10:30 AM – 12:00 PM',
        title: 'Talks & Conversations',
        description:
          'Hear fresh perspectives from people building across technology, design, and the creative community.',
      },
      {
        time: '12:00 PM – 01:00 PM',
        title: 'Community Lunch',
        description: 'Take a break, meet new people, and continue the conversation.',
      },
      {
        time: '01:00 PM – 03:00 PM',
        title: 'Afternoon Sessions',
        description:
          'More ideas and practical insights from across the technology community.',
      },
    ],
  },
];

export function AgendaProgramme() {
  return (
    <section
      aria-labelledby="programme-title"
      className="bg-ink py-16 text-paper sm:py-24"
    >
      <div className="container">
        {/* Agenda section heading */}
        <header className="border-t border-paper/20 pt-6">
          <p className="flex items-center gap-3 text-eyebrow font-normal uppercase">
            <span
              aria-hidden="true"
              className="size-3 rounded-xs bg-brand-green-bright"
            />
            Event Agenda
          </p>

          <h2
            id="programme-title"
            className="mt-12 max-w-4xl text-heading font-normal text-paper sm:mt-16 sm:text-display"
          >
            What&rsquo;s On The Event{' '}
            <span className="inline-block -rotate-1 bg-brand-green-bright px-3 py-1 text-ink sm:px-5 sm:py-2">
              Agenda
            </span>
          </h2>
        </header>

        {/* Agenda days */}
        <div className="mt-16 space-y-16 sm:mt-24 sm:space-y-24">
          {agendaDays.map((day) => (
            <section
              key={day.id}
              id={day.id}
              aria-labelledby={`${day.id}-title`}
              className="scroll-mt-24"
            >
              {/* Day and date heading */}
              <header className="grid overflow-hidden rounded-md bg-ink-raised sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <h3
                  id={`${day.id}-title`}
                  className="flex min-h-24 items-center bg-brand-green-bright px-5 py-6 text-2xl leading-tight font-normal text-ink sm:px-8 sm:text-3xl"
                >
                  {day.label}
                </h3>

                <p className="flex items-center px-5 py-6 text-xl leading-tight text-paper sm:px-8 sm:text-2xl">
                  {day.date}
                </p>
              </header>

              {/* Sessions */}
              <ol className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                {day.sessions.map((session, index) => (
                  <li
                    key={`${day.id}-${session.title}`}
                    className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-8"
                  >
                    {/* Session time */}
                    <div className="flex items-start sm:pt-7">
                      <p className="text-base leading-relaxed text-paper sm:text-xl">
                        {session.time}
                      </p>
                    </div>

                    {/* Session card */}
                    <article className="min-w-0 rounded-md bg-ink-raised px-5 py-6 sm:px-8 sm:py-8">
                      <p className="mb-3 text-eyebrow text-muted uppercase">
                        Session {String(index + 1).padStart(2, '0')}
                      </p>

                      <h4 className="text-2xl leading-tight font-normal text-paper sm:text-3xl">
                        {session.title}
                      </h4>

                      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
                        {session.description}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
