import { useState } from 'react';
import { motion } from 'framer-motion';
import { hackathonPhotos } from '@/utils/hackathon-photos';

export function HackathonGallery() {
  /** Remote CDN sources that failed to load; each renders its local fallback. */
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());

  const handleError = (src: string) => {
    setFailed((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  return (
    <section
      id="hackathon-gallery"
      aria-labelledby="hackathon-gallery-title"
      className="bg-ink pt-16 pb-20 text-paper sm:pt-20 sm:pb-24"
    >
      <div className="container">
        <p className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase">
          <span aria-hidden="true" className="size-2 shrink-0 bg-brand-amber" />
          Tech Ignite &rsquo;26 &middot; Hackathon
        </p>

        <h1
          id="hackathon-gallery-title"
          className="mt-6 max-w-[70rem] text-heading font-bold text-paper uppercase"
        >
          Our Hacks
          <span className="mt-2 block">
            <span className="bg-brand-amber px-2 text-ink">People Shipped</span>
          </span>
        </h1>

        <p className="mt-8 max-w-[52rem] text-lg leading-relaxed text-muted">
          Every team, every build, every late-night push — {hackathonPhotos.length} frames
          from the Tech Ignite &rsquo;26 Hackathon.
        </p>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {hackathonPhotos.map((photo) => (
            <motion.li
              key={photo.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-w-0"
            >
              <div className="overflow-hidden rounded-xs bg-ink-raised">
                <img
                  src={failed.has(photo.src) ? photo.fallback : photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    handleError(photo.src);
                  }}
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
