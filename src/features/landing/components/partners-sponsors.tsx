import { motion } from 'framer-motion';
import { slideInRight, springUp, staggerContainer, useScrollGate } from '@/lib/motion';

/** A single sponsor entry. Entries without `src` fall back to plain text,
 * which is also the placeholder until real artwork is supplied. */
interface SponsorLogo {
  readonly name: string;
  /** Path to the sponsor artwork. Omit to render the name as text. */
  readonly src?: string;
  /** Tailwind size for square icon-only artwork, which must sit at a fixed
   * size rather than stretch to the full tile width. Entries without it render
   * as a full-width lockup. */
  readonly sizeClass?: string;
  /** Brand name set beside icon-only artwork, which carries no text of its own. */
  readonly wordmark?: string;
  /** Tailwind font utility applied to the wordmark text. Scoped per-sponsor so
   * only Paga is set in BR Firma while other wordmarks keep the site face. */
  readonly wordmarkClass?: string;
}

/** Sponsor tiers shown in the partners section. */
interface SponsorTier {
  readonly label: string;
  readonly logos: readonly SponsorLogo[];
}

const sponsorTiers: readonly SponsorTier[] = [
  {
    label: 'Title Sponsor',
    logos: [{ name: 'Chowdeck', src: '/images/sponsors/chowdeck-sponsor.png' }],
  },
  {
    label: 'Diamond Sponsors',
    logos: [
      { name: 'Vistapay', src: '/images/sponsors/vistapay.png' },
      {
        name: 'Paga',
        src: '/images/sponsors/paga.png',
        sizeClass: 'size-10',
        wordmark: 'Paga',
        wordmarkClass: 'font-br-firma',
      },
    ],
  },
  {
    label: 'Silver Sponsors',
    logos: [
      {
        name: 'Jobberman',
        src: '/images/sponsors/jobberman.jpg',
        sizeClass: 'size-20',
      },
      { name: 'SwiftXr', src: '/images/sponsors/Full%20Logo.svg' },
      {
        name: 'Coincola',
        src: '/images/sponsors/coin-cola.jpg',
        sizeClass: 'size-20',
      },
      { name: 'Litehost', src: '/images/sponsors/litehost-wordmark.svg' },
    ],
  },
  {
    label: 'Hackathon Sponsor',
    logos: [
      {
        name: 'Paga',
        src: '/images/sponsors/paga.png',
        sizeClass: 'size-10',
        wordmark: 'Paga',
        wordmarkClass: 'font-br-firma',
      },
    ],
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
              <h3 className="text-2xl font-bold">{tier.label}</h3>
              <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {tier.logos.map((logo, logoIndex) => (
                  <li
                    key={`${logo.name}-${String(logoIndex)}`}
                    className="flex h-40 items-center justify-center gap-3 rounded-lg bg-mist px-6"
                  >

                    {logo.src === undefined ? (
                      <span className="text-2xl font-bold tracking-tight text-ink">
                        {logo.name}
                      </span>
                    ) : (
                      <>
                        <img
                          src={logo.src}
                          alt={logo.wordmark === undefined ? logo.name : ''}
                          loading="lazy"
                          decoding="async"
                          className={
                            logo.sizeClass === undefined
                              ? 'h-auto w-full max-w-40 object-contain'
                              : `${logo.sizeClass} shrink-0 object-contain`
                          }
                        />
                        {logo.wordmark !== undefined && (
                          <span
                            className={`text-2xl font-bold text-ink ${logo.wordmarkClass ?? 'tracking-tight'}`}
                          >
                            {logo.wordmark}
                          </span>
                        )}
                      </>

                    )}
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
