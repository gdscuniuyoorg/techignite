export function IgniteStatement() {
  return (
    <section aria-labelledby="ignite-statement-title" className="bg-paper text-ink">
      <div className="container py-16 sm:py-20">
        {/* Figma spec: Google Sans 400 / 100px (fluid) / 110px line-height /
            no tracking / centered. Every offset and photo size below is in
            `em`, taken from the 1506px Figma frame, so the composition scales
            as one piece with the type at any viewport width. */}
        <h2
          id="ignite-statement-title"
          className="relative mx-auto max-w-[12.7em] pt-[1.75em] pb-[0.65em] text-center font-sans text-[clamp(2.6rem,5.2vw,6.25rem)] leading-[1.1] font-normal tracking-normal text-ink"
        >
          <img
            aria-hidden="true"
            src="/images/speakers/gallery-01.jpg"
            alt=""
            width={1200}
            height={800}
            className="absolute top-0 left-0 hidden aspect-[211/250] w-[2.11em] object-cover grayscale md:block"
          />
          <img
            aria-hidden="true"
            src="/images/speakers/gallery-06.jpg"
            alt=""
            width={1200}
            height={800}
            className="absolute top-[1.34em] right-[0.65em] hidden aspect-[31/20] w-[1.8em] object-cover grayscale md:block"
          />
          <img
            aria-hidden="true"
            src="/images/speakers/gallery-05.jpg"
            alt=""
            width={1200}
            height={800}
            className="absolute top-[3.92em] left-0 hidden aspect-[3/2] w-[2.11em] object-cover grayscale md:block"
          />
          <img
            aria-hidden="true"
            src="/images/speakers/gallery-02.jpg"
            alt=""
            width={1200}
            height={800}
            className="absolute top-[3.93em] right-0 hidden aspect-[34/25] w-[2.38em] object-cover grayscale md:block"
          />

          <span className="block">Where Students,</span>
          <span className="block">Innovation, and Technology</span>
          <span className="block">Ignite the Future</span>
        </h2>
      </div>
    </section>
  );
}
