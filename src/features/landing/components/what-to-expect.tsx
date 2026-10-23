import { stats } from '@/utils/stats';

export function WhatToExpect() {
  return (
    <section
      id="what-to-expect"
      aria-labelledby="what-to-expect-title"
      className="bg-ink py-20 sm:py-24"
    >
      <div className="container">
        <div className="border-t border-border pt-8">
          <p className="flex items-center gap-2.5 text-sm font-medium tracking-wider text-white uppercase sm:text-base">
            <span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
            What to expect
          </p>

          <h2
            id="what-to-expect-title"
            className="mt-8 w-full align-middle font-sans text-[28px] leading-[36px] font-normal tracking-[0px] text-foreground not-italic sm:text-[36px] sm:leading-[46px] lg:text-[42px] lg:leading-[52px] xl:mt-10 xl:text-[60px] xl:leading-[70px]"
          >
            A global stage where students, innovation, and technology come together to{' '}
            <mark className="rounded-xs bg-primary px-1.5 whitespace-nowrap text-primary-foreground">
              build the future,
            </mark>{' '}
            and inspire what’s next.
          </h2>
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:mt-12 sm:grid-cols-3 sm:gap-x-12 lg:mt-12 lg:gap-x-14 xl:mt-14 xl:gap-x-20 xl:gap-y-12">
          {stats.map((stat) => (
            <div key={stat.value} className="group">
              <dt className="text-[clamp(2.5rem,4vw,3.75rem)] font-normal text-foreground tabular-nums xl:text-stat">
                {stat.value}
              </dt>
              <dd className="mt-6 max-w-[20rem] border-t border-border pt-5 text-sm leading-relaxed text-white/85 transition-colors group-hover:border-brand-blue-soft/50 group-hover:text-white">
                {stat.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
