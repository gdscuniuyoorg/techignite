import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/linkedin-icon';
import { featuredSpeakers } from '@/constants/featured-speakers';

const mosaicTiles = [
  { id: 'cream-start', className: 'w-[12%] bg-accent' },
  { id: 'amber-soft-start', className: 'w-[6%] bg-brand-amber-soft' },
  { id: 'ink-wide', className: 'w-[19%] bg-ink' },
  { id: 'cream-center', className: 'w-[19%] bg-accent' },
  { id: 'amber-highlight-wide', className: 'w-[19%] bg-brand-amber-highlight' },
  { id: 'amber-soft-right', className: 'w-[13%] bg-brand-amber-soft' },
  { id: 'amber-highlight-small', className: 'w-[6%] bg-brand-amber-highlight' },
  { id: 'cream-end', className: 'w-[6%] bg-accent' },
] as const;

export function KeynoteSpeakers() {
  return (
    <section
      id="speakers"
      aria-labelledby="home-speakers-title"
      className="overflow-hidden bg-ink pt-20 text-paper sm:pt-24 lg:pt-28"
    >
      <div className="container">
        <div className="border-t border-border pt-6">
          <p className="flex items-center gap-2.5 text-[16.26px] leading-[26px] font-normal text-[#F7F5FF] uppercase">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-xs bg-brand-amber"
            />
            Keynote speakers
          </p>

          <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:items-end lg:gap-16">
            <h2
              id="home-speakers-title"
              className="max-w-[32rem] font-sans text-[64px] leading-[77px] font-normal -tracking-[1.28px] text-[#F7F5FF]"
            >
              Our{' '}
              <mark className="relative top-[2px] inline-flex h-[68px] w-[259.072px] rotate-1 items-center justify-center rounded-xs bg-brand-amber text-paper">
                Speaker
              </mark>
              <br />
              Lineup
            </h2>

            <p className="max-w-[414px] text-[18px] leading-[26px] text-[#F7F5FF] lg:justify-self-end lg:pb-2">
              World-class creators, innovators, and tech leaders sharing their stories and
              insights.
            </p>
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-16 w-screen -translate-x-1/2 sm:mt-20">
        <ul className="flex snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:justify-center lg:px-0">
          {featuredSpeakers.map((speaker, index) => (
            <li
              key={speaker.name}
              className={`w-[308px] shrink-0 snap-center ${index % 2 === 1 ? 'mt-12' : ''}`}
            >
              <img
                src={speaker.image}
                alt={`Portrait of ${speaker.name}`}
                width={speaker.width}
                height={speaker.height}
                className="h-[400px] w-[308px] rounded-[6px] object-cover grayscale"
              />

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg leading-tight font-normal text-paper">
                    {speaker.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{speaker.role}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-surface-raised text-paper"
                >
                  <LinkedinIcon className="size-[18px]" />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 flex justify-center px-5 sm:mt-16">
        <Link
          to="/speakers"
          className="flex h-11 items-center justify-center gap-2 rounded-xs bg-brand-amber px-6 text-button font-normal text-ink shadow-none transition-colors hover:bg-brand-amber/90"
        >
          See All Speakers
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div aria-hidden="true" className="mt-16 flex h-12 w-full sm:mt-20">
        {mosaicTiles.map((tile) => (
          <span key={tile.id} className={tile.className} />
        ))}
      </div>
    </section>
  );
}
