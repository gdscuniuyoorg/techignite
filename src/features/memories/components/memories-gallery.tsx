import { motion } from 'framer-motion';
import { memoryPhotos } from '@/utils/memories';
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
    label: 'Snippets from Tech Ignite 24, first row',
    photos: memoryPhotos.slice(0, 5),
  },
  {
    label: 'Snippets from Tech Ignite 24, second row',
    photos: memoryPhotos.slice(5),
  },
] as const;

export function MemoriesGallery() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="memories-snippets"
      aria-labelledby="memories-snippets-title"
      className="overflow-hidden bg-accent py-16 text-accent-foreground sm:py-20"
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
            Memories
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="memories-snippets-title"
            className="mt-6 text-heading font-bold text-accent-foreground"
          >
            Snippets from{' '}
            <span className="bg-brand-green-bright px-1 text-paper">
              Tech Ignite&rsquo;24
            </span>
          </motion.h2>

          <motion.p
            variants={blurUp}
            className="mt-6 max-w-[850px] text-lg leading-relaxed text-accent-foreground"
          >
            A look back at the people, talks, and moments that made Tech Ignite
            &rsquo;24 — the energy that carried into &rsquo;26.
          </motion.p>
        </div>
      </motion.div>

      <div className="mt-12 space-y-12 sm:mt-14">
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
                <li key={photo.src} className="w-[min(31rem,82vw)] shrink-0">
                  <div className="overflow-hidden rounded-lg">
                    <motion.img
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
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
