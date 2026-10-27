import { audience } from '@/utils/audience';

export function Audience() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-title"
      className="bg-paper py-16 text-ink sm:py-20"
    >
      <div className="container">
        <div className="border-t border-border-light pt-8">
          <p className="flex items-center gap-2.5 text-sm font-medium tracking-wider text-ink uppercase sm:text-base">
            <span aria-hidden="true" className="size-2.5 shrink-0 bg-primary" />
            The audience
          </p>

          <h2
            id="audience-title"
            className="mt-8 w-full align-middle font-sans text-[28px] leading-[36px] font-normal tracking-[0px] text-ink not-italic sm:text-[36px] sm:leading-[46px] lg:text-[42px] lg:leading-[52px] xl:text-[60px] xl:leading-[70px]"
          >
            Tech Ignite{' '}
            <mark className="bg-primary px-2 text-primary-foreground">
              brings together the people
            </mark>{' '}
            building, exploring what’s next in technology.
          </h2>

          <ul className="mt-[4.5rem] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audience.map((item) => (
              <li
                key={item.name}
                className="group flex flex-col rounded-[4px] bg-brand-blue p-9 text-white transition-colors hover:bg-brand-blue-strong"
              >
                <item.icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-[4.5rem]"
                />

                <h3 className="mt-16 font-sans text-[1.875rem] leading-[1.15] font-normal">
                  {item.name}
                </h3>

                <div aria-hidden="true" className="mt-5 h-px w-full bg-white/25" />

                <p className="mt-5 text-[15px] leading-[22px] text-white/90">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
