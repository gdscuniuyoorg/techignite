import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { TECH_IGNITE_26_SNIPPETS_URL } from '@/utils/memories';
import { techIgnite26Photos } from '@/utils/tech-ignite-26-photos';
import {
  blurUp,
  dotPop,
  imageSettle,
  slideInRight,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

const snippetRows = [
  {
    label: 'Snippets from Tech Ignite 26, first row',
    photos: techIgnite26Photos.slice(0, 10),
  },
  {
    label: 'Snippets from Tech Ignite 26, second row',
    photos: techIgnite26Photos.slice(10, 20),
  },
  {
    label: 'Snippets from Tech Ignite 26, third row',
    photos: techIgnite26Photos.slice(20),
  },
] as const;

export function Memories26Snippets() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="memories-snippets-26"
      aria-labelledby="memories-snippets-26-title"
      className="overflow-hidden bg-ink py-16 text-paper sm:py-20"
    >
      <motion.div
        variants={staggerContainer(0.16)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.25 }}
        className="mx-auto max-w-[1352px] px-5 sm:px-8 lg:px-0"
      >
        <div className="border-t border-paper/15 pt-6">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 bg-brand-amber"
            />
            Photo album
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="memories-snippets-26-title"
            className="mt-6 text-heading font-bold text-paper"
          >
            Snippets from{' '}
            <span className="bg-brand-amber px-1 text-ink">
              Tech Ignite&rsquo;26
            </span>
          </motion.h2>

          <motion.p
            variants={blurUp}
            className="mt-6 max-w-[850px] text-lg leading-relaxed text-muted"
          >
            The hall, the builds, the faces — thirty frames from the Tech Ignite
            &rsquo;26 album. Every photo from the day is waiting in the folder.
          </motion.p>

          <motion.p variants={blurUp} className="mt-8">
            <a
              href={TECH_IGNITE_26_SNIPPETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-button font-normal text-brand-amber underline decoration-brand-amber/40 underline-offset-4 transition-colors hover:decoration-brand-amber"
            >
              See every Tech Ignite &rsquo;26 photo
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </motion.p>
        </div>
      </motion.div>

      <div className="mt-12 space-y-6 sm:mt-14 sm:space-y-8">
        {snippetRows.map((row) => (
          <motion.div
            key={row.label}
            variants={staggerContainer(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            role="region"
            aria-label={row.label}
            className="scrollbar-none overflow-x-auto"
          >
            <ul className="flex w-max gap-3">
              {row.photos.map((photo) => (
                <li key={photo.src} className="shrink-0">
                  <div className="overflow-hidden rounded-lg bg-ink-raised">
                    <motion.img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                      variants={imageSettle}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                      }}
                      className="h-[17rem] w-auto max-w-none object-cover sm:h-[22rem] lg:h-[25rem]"
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
