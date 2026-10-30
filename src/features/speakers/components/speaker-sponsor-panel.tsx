import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SPONSOR_MAILTO } from '@/utils/speakers';
import {
  blurUp,
  dotPop,
  imageSettle,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

const MotionAnchor = motion.create('a');

interface GalleryPhoto {
  readonly image: string;
  readonly alt: string;
}

interface GalleryRow {
  readonly label: string;
  readonly photos: readonly GalleryPhoto[];
}

const galleryRows: readonly GalleryRow[] = [
  {
    label: 'First row of Tech Ignite event photographs',
    photos: [
      {
        image: 'gallery-01.jpg',
        alt: 'Tech Ignite speakers addressing the audience at a podium',
      },
      {
        image: 'gallery-02.jpg',
        alt: 'Three Tech Ignite volunteers posing outdoors',
      },
      {
        image: 'gallery-03.jpg',
        alt: 'Tech Ignite attendees celebrating together outdoors',
      },
      {
        image: 'gallery-04.jpg',
        alt: 'Two Tech Ignite volunteers at the event',
      },
      {
        image: 'gallery-05.jpg',
        alt: 'Tech Ignite attendee meeting fellow participants',
      },
    ],
  },
  {
    label: 'Second row of Tech Ignite event photographs',
    photos: [
      {
        image: 'gallery-08.jpg',
        alt: 'Two participants wearing Tech Ignite shirts',
      },
      {
        image: 'gallery-09.jpg',
        alt: 'Students presenting a hackathon prize',
      },
      {
        image: 'gallery-06.jpg',
        alt: 'Speaker holding a microphone at Tech Ignite',
      },
      {
        image: 'gallery-07.jpg',
        alt: 'Tech Ignite participants posing for a group photo',
      },
    ],
  },
];

export function SpeakerSponsorPanel() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="sponsors"
      aria-labelledby="speaker-sponsor-title"
      className="overflow-hidden bg-accent py-16 text-accent-foreground sm:py-20 lg:py-20"
    >
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="mx-auto max-w-[1352px] px-5 sm:px-8 lg:px-0"
      >
        <div className="border-t border-ink/10 pt-6">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-accent-foreground uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 bg-brand-green"
            />
            Become a sponsor
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="speaker-sponsor-title"
            className="mt-6 text-heading font-bold text-accent-foreground"
          >
            Why Sponsor{' '}
            <span className="bg-brand-green-bright px-1 text-paper">
              Tech Ignite&rsquo;26?
            </span>
          </motion.h2>

          <motion.p
            variants={blurUp}
            className="mt-6 max-w-[850px] text-lg leading-relaxed text-accent-foreground"
          >
            Tech Ignite by GDG Uyo goes beyond a single event. It brings students,
            developers, and tech enthusiasts together to share ideas, build meaningful
            connections, explore new opportunities, and grow within a community shaping
            the future of technology.
          </motion.p>

          <MotionAnchor
            variants={springUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={SPONSOR_MAILTO}
            className="mt-8 flex h-11 w-fit items-center gap-2 rounded-xs bg-ink px-6 text-button font-normal text-paper transition-colors hover:bg-ink-soft sm:h-12 sm:px-8"
          >
            Become a Sponsor
            <ArrowRight aria-hidden="true" className="size-4" />
          </MotionAnchor>

          <MotionAnchor
            variants={springUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="/tech-ignite-pitchdeck.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-11 w-fit items-center gap-2 rounded-xs border border-ink px-6 text-button font-normal text-paper transition-colors hover:bg-ink sm:h-12 sm:px-8"
          >
            Check our Pitchdeck
            <ArrowRight aria-hidden="true" className="size-4" />
          </MotionAnchor>
        </div>
      </motion.div>

      <div className="mt-12 space-y-12 sm:mt-14">
        {galleryRows.map((row) => (
          <motion.div
            key={row.label}
            variants={staggerContainer(0.09)}
            initial="hidden"
            whileInView={userScrolled ? 'visible' : 'hidden'}
            viewport={{ once: false, amount: 0.3 }}
            role="region"
            aria-label={row.label}
            className="scrollbar-none overflow-x-auto"
          >
            <ul className="flex w-max gap-3">
              {row.photos.map((photo) => (
                <li key={photo.image} className="w-[min(31rem,82vw)] shrink-0">
                  <div className="overflow-hidden rounded-lg">
                    <motion.img
                      src={`/images/speakers/${photo.image}`}
                      alt={photo.alt}
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      variants={imageSettle}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                      }}
                      className="aspect-[3/2] w-full object-cover brightness-110 saturate-[0.85]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
