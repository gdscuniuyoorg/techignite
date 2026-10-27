export function AgendaHero() {
  return (
    <section
      id="agenda"
      aria-labelledby="agenda-title"
      className="relative isolate h-[22rem] overflow-hidden bg-ink sm:h-[25rem]"
    >
      {/* Decorative green geometric background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Upper-left blocks */}
        <span className="absolute top-0 left-0 h-12 w-[23%] bg-brand-green-bright sm:h-16 sm:w-[23%]" />

        <span className="absolute top-0 left-[23%] h-16 w-[13%] bg-brand-green sm:h-20 sm:w-[12%]" />

        {/* Upper-right blocks */}
        <span className="absolute top-0 right-0 h-16 w-[11%] bg-brand-green sm:h-20 sm:w-[10%]" />

        <span className="absolute top-16 right-[11%] h-12 w-[10%] bg-brand-green-bright sm:top-20 sm:h-16 sm:w-[10%]" />

        {/* Middle-left blocks */}
        <span className="absolute top-[30%] left-[11%] h-16 w-[11%] bg-brand-green sm:h-20 sm:w-[10%]" />

        <span className="absolute top-[30%] left-0 h-16 w-[11%] bg-brand-green-bright sm:h-20 sm:w-[11%]" />

        {/* Lower-left block */}
        <span className="absolute bottom-0 left-[3%] h-16 w-[19%] bg-brand-green-bright sm:h-20 sm:w-[20%]" />

        {/* Lower-right blocks */}
        <span className="absolute right-0 bottom-0 h-20 w-[13%] bg-brand-green-bright sm:h-24 sm:w-[13%]" />

        <span className="absolute right-[13%] bottom-20 h-16 w-[10%] bg-brand-green sm:bottom-24 sm:h-20 sm:w-[10%]" />
      </div>

      {/* Central white dome */}
      <div className="absolute inset-x-0 top-0 mx-auto h-full w-[94%] max-w-[58rem] overflow-hidden rounded-t-[50%] bg-paper text-ink sm:w-[82%]">
        {/* Subtle background texture */}
        <img
          aria-hidden="true"
          src="/icons/transparent-background.png"
          alt=""
          width={1124}
          height={705}
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.12]"
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-5 pt-10 pb-2 text-center sm:px-10 sm:pt-12">
          <h1
            id="agenda-title"
            className="max-w-[14ch] text-3xl leading-[0.95] font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Here&rsquo;s What&rsquo;s
            <br />
            Going Down
          </h1>

          <p className="mt-4 max-w-lg text-xs leading-relaxed text-ink sm:mt-5 sm:text-sm">
            Hackathons, hot takes, big ideas, and the next wave of tech talent. Your guide
            to everything happening at Tech Ignite starts here.
          </p>
        </div>
      </div>
    </section>
  );
}
