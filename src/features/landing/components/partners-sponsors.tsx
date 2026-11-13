import { motion } from 'framer-motion';
import { slideInRight, springUp, staggerContainer, useScrollGate } from '@/lib/motion';

/** A single sponsor entry. Entries without `src` render the name as text. */
interface SponsorLogo {
  readonly name: string;
  /** Path to the sponsor artwork. Omit to render the name as text. */
  readonly src?: string;
  readonly url?: string;
  readonly bg?: string;
  /** Tailwind size for square icon-only artwork. Entries without it render as
   * a full-width lockup. */
  readonly sizeClass?: string;
}

/** Sponsor tiers shown in the partners section. */
interface SponsorTier {
  readonly label: string;
  readonly logos: readonly SponsorLogo[];
}

const sponsorTiers: readonly SponsorTier[] = [
  {
    label: 'Title Sponsor',
    logos: [{ name: 'Chowdeck', src: '/images/sponsors/chowdeck-sponsor.png', url: 'https://www.chowdeck.com' }],
  },
  {
    label: 'Diamond Sponsors',
    logos: [
      { name: 'Vistapay', src: '/images/sponsors/vistapay.png', url: 'https://vistapayhq.com/'   },
      { name: 'Paga', src: '/images/sponsors/paga-full.png', url: 'https://www.paga.com' },
      { name: 'Google for Developers', src: '/images/sponsors/google-for-developers.png', url: 'https://developers.google.com/' },
    ],
  },
  {
    label: 'Silver Sponsors',
    logos: [
      { name: 'Litehost', src: '/images/sponsors/litehost-wordmark.svg', url: 'https://www.getlitehost.com' },
      { name: 'Unwritten Empires', src: '/images/sponsors/unwritten-empires-emblem.png', sizeClass: 'h-22', url: 'https://play.unwrittenempires.com' },
      { name: 'Coincola', src: '/images/sponsors/coin-cola.jpg', sizeClass: 'h-22', url: 'https://www.coincola.com' },
    ],
  },
  {
    label: 'Hackathon Sponsor',
    logos: [{ name: 'Paga Engine', src: '/images/sponsors/paga-engine.png' , url: 'https://pagaengine.com' }],
  },
  {
    label: 'Career Partner',
    logos: [{ name: 'Jobberman', src: '/images/sponsors/jobberman.jpg', url: 'https://www.jobberman.com' }],
  },
  {
    label: 'Education Partner',
    logos: [{ name: 'Roothub', src: '/images/sponsors/roothub.png' , url: 'https://theroothub.com' }],
  },
  {
    label: 'Media Partner',
    logos: [{ name: 'Wckd Studio', src: '/images/sponsors/wckdstudio.png' , url: 'https://www.wckd.studio/', bg: 'bg-black' }],
  },
];

/** Community partners displayed in the unending marquee carousel. */
const communityPartners: readonly SponsorLogo[] = [
  { name: 'GDG on Campus, Aksu', src: '/images/sponsors/gdgoc-aksu.png', sizeClass: 'h-30' },
  { name: 'AWS Student builders', src: '/images/sponsors/aws.png' },
  { name: 'Event Sparks', src: '/images/sponsors/event-sparks.jpg' },
  { name: 'SheFi', src: '/images/sponsors/shefi.png', sizeClass: 'h-30' },
  { name: 'Notion uniuyo', src: '/images/sponsors/notion-uniuyo.png' },
  { name: 'Square One', src: '/images/sponsors/square-one.png', sizeClass: 'h-30' },
  { name: 'Interswitch Developer Community', src: '/images/sponsors/interswitch.png' },
  { name: 'PIFOSA Creative Africa', src: '/images/sponsors/pifosa.png', sizeClass: 'h-30' },
  // { name: 'The Builders Network', src: '/images/sponsors/tbn.png' },
];

const marqueeCommunityPartners: readonly SponsorLogo[] = [
  ...communityPartners,
  ...communityPartners,
  ...communityPartners,
  ...communityPartners,
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
              <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {tier.logos.map((logo, logoIndex) => (
                  <li
                    key={`${logo.name}-${String(logoIndex)}`}
                    className="flex h-20 items-center justify-center gap-3 sm:h-24"
                  >
                    <a href={logo.url} target="_blank" rel="noopener noreferrer">
                      {logo.src === undefined ? (
                        <span className="text-2xl font-bold tracking-tight text-ink">
                          {logo.name}
                        </span>
                      ) : (
                        <img
                          src={logo.src}
                          alt={logo.name}
                          loading="lazy"
                          decoding="async"
                          className={
                            logo.sizeClass === undefined && logo.bg === undefined
                              ? `h-auto w-full max-w-40 object-contain`
                              : `${logo.sizeClass} shrink-0 object-contain ${logo.bg} p-3`
                          }
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div variants={springUp} className="mt-16 sm:mt-20">
          <h3 className="text-2xl font-bold">Community Partners</h3>
          <div
            tabIndex={0}
            aria-label="Community partners marquee"
            className="relative mt-8 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          >
            <motion.div
              className="flex w-max items-center gap-6 py-4 sm:gap-8"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 40,
              }}
            >
              {marqueeCommunityPartners.map((partner, index) => (
                <div
                  key={`${partner.name}-${String(index)}`}
                  className="flex h-24 shrink-0 items-center justify-center rounded-2xl border border-border-light/80 bg-paper px-8 py-3 shadow-xs transition-colors hover:border-brand-green-vivid sm:h-28 sm:px-10"
                >
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-semibold text-ink transition-colors hover:text-brand-green-vivid"
                    >
                      {partner.src ? (
                        <img
                          src={partner.src}
                          alt={partner.name}
                          loading="lazy"
                          decoding="async"
                          className={
                            partner.sizeClass === undefined && partner.bg === undefined
                              ? 'h-14 w-auto max-w-48 object-contain sm:h-18 sm:max-w-60'
                              : `${partner.sizeClass ?? 'h-14 sm:h-18'} shrink-0 object-contain ${partner.bg ?? ''} p-2`
                          }
                        />
                      ) : (
                        <span className="whitespace-nowrap text-lg font-bold tracking-tight text-ink sm:text-xl">
                          {partner.name}
                        </span>
                      )}
                    </a>
                  ) : partner.src ? (
                    <img
                      src={partner.src}
                      alt={partner.name}
                      loading="lazy"
                      decoding="async"
                      className={
                        partner.sizeClass === undefined && partner.bg === undefined
                          ? 'h-14 w-auto max-w-48 object-contain sm:h-18 sm:max-w-60'
                          : `${partner.sizeClass ?? 'h-14 sm:h-18'} shrink-0 object-contain ${partner.bg ?? ''} p-2`
                      }
                    />
                  ) : (
                    <span className="whitespace-nowrap text-lg font-bold tracking-tight text-ink sm:text-xl">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
