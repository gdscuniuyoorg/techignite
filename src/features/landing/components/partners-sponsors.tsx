import { motion } from 'framer-motion';
import { slideInRight, springUp, staggerContainer, useScrollGate } from '@/lib/motion';

/** Sponsor tiers shown in the partners section. Logo entries are placeholder
 * names until real sponsor artwork is provided. */
interface SponsorTier {
  readonly label: string;
  readonly logos: readonly string[];
}

const sponsorTiers: readonly SponsorTier[] = [
  { label: 'Titled Sponsors', logos: ['Chowdeck', 'Chowdeck', 'Chowdeck', 'Chowdeck'] },
  { label: 'Diamond Sponsors', logos: ['Chowdeck', 'Chowdeck', 'Chowdeck', 'Chowdeck'] },
  { label: 'Gold Sponsors', logos: ['Chowdeck', 'Chowdeck', 'Chowdeck', 'Chowdeck'] },
  { label: 'Silver Sponsors', logos: ['Chowdeck', 'Chowdeck', 'Chowdeck', 'Chowdeck'] },
  {
    label: 'Hackathon Sponsors',
    logos: ['Chowdeck', 'Chowdeck', 'Chowdeck', 'Chowdeck'],
  },
];

export function PartnersSponsors() {
  const userScrolled = useScrollGate();

  return (
    <section aria-labelledby="partners-title" className="bg-paper text-ink">
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
        className="container pt-16 pb-16 sm:pt-20 sm:pb-24"
      >
        <div className="border-t border-border-light pt-6">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-[13px] font-medium tracking-[0.02em] uppercase"
          >
            <span aria-hidden="true" className="size-2 shrink-0 bg-brand-green-vivid" />
            Our Partners &amp; Sponsors
          </motion.p>

          <motion.h2
            id="partners-title"
            variants={slideInRight}
            className="mt-7 font-sans text-[36px] leading-[1.22] font-medium not-italic lg:text-[52px]"
          >
            <span className="max-lg:hidden lg:block">
              Tech Ignite is made possible with the{' '}
            </span>
            <span className="max-lg:hidden lg:block">
              support of{' '}
              <mark className="bg-brand-green-vivid px-2 text-paper">
                leading brands, organizations,
              </mark>{' '}
              and
            </span>
            <span className="max-lg:hidden lg:block">creative communities.</span>
            <span className="lg:hidden">
              Tech Ignite is made possible with the support of{' '}
              <mark className="bg-brand-green-vivid px-2 text-paper">
                leading brands, organizations,
              </mark>{' '}
              and creative communities.
            </span>
          </motion.h2>
        </div>

        <div className="mt-[4.5rem]">
          {sponsorTiers.map((tier, tierIndex) => (
            <motion.div
              key={tier.label}
              variants={springUp}
              className={tierIndex === 0 ? '' : 'mt-14'}
            >
              <h3 className="text-[21px] font-medium">{tier.label}</h3>
              <ul className="mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {tier.logos.map((logo, logoIndex) => (
                  <li
                    key={`${logo}-${String(logoIndex)}`}
                    className="flex h-40 items-center justify-center rounded-lg bg-mist px-6"
                  >
                    <span
                      aria-hidden="true"
                      className="text-2xl font-bold tracking-tight text-ink"
                    >
                      {logo}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
