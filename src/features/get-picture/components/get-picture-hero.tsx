import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

export function GetPictureHero() {
  return (
    <section
      aria-labelledby="get-picture-title"
      className="relative overflow-hidden bg-ink pt-16 pb-14 sm:pt-24 sm:pb-20"
    >
      <div className="container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.14, 0.1)}
          className="max-w-[46rem]"
        >
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-2 text-eyebrow font-normal text-muted uppercase"
          >
            <span aria-hidden="true" className="size-2 bg-brand-green-bright" />
            Attendee badge
          </motion.p>
          <motion.h1
            id="get-picture-title"
            variants={fadeUp}
            className="mt-5 text-heading font-bold text-paper"
          >
            Get Your Picture
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[42rem] text-lg leading-relaxed text-muted"
          >
            Drop your photo into the official Tech Ignite &lsquo;26 frame and download it
            in one click. We crop, resize and place it for you, so the result looks right
            every time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
