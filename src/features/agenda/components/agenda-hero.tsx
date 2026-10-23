export function AgendaHero() {
  return (
    <section
      id="agenda"
      aria-labelledby="agenda-title"
      className="relative flex flex-col overflow-hidden bg-ink"
    >
      {/* Checker mosaic — transparent-backed artwork, ink shows through the gaps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          src="/icons/agenda-hero-section.png"
          alt=""
          width={1512}
          height={712}
          className="size-full object-cover object-top"
        />
      </div>

      {/* Cream arch */}
      <div
        className="relative mx-auto mt-32 flex w-full max-w-[1124px] flex-col items-center justify-center bg-[#FFFFFF] px-6 pt-24 pb-8 text-center min-[1124px]:w-[1124px] sm:h-[800px]"
        style={{
          borderTopLeftRadius: '500px',
          borderTopRightRadius: '500px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {/* Topographic contour texture */}
        <img
          aria-hidden="true"
          src="/icons/transparent-background.png"
          alt=""
          width={1124}
          height={705}
          className="absolute inset-0 object-cover opacity-20"
        />

        <h1 id="agenda-title" className="relative z-10 text-heading font-bold text-ink">
          Here’s What’s Going Down
        </h1>
        <p className="relative z-10 mt-4 max-w-[40rem] text-subheading leading-relaxed text-ink">
          Hackathons, hot takes, big ideas, and the next wave of tech talent. <br />
          Your guide to everything happening at Tech Ignite starts here.
        </p>
      </div>
    </section>
  );
}
