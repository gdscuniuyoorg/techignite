import { createFileRoute } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import { GetPictureHero } from '@/features/get-picture/components/get-picture-hero';
import { PhotoFrameStudio } from '@/features/get-picture/components/photo-frame-studio';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/get-your-picture')({
  head: () => seoHead('/get-your-picture'),
  component: GetYourPicture,
});

function GetYourPicture() {
  return (
    <main id="main-content">
      <MotionConfig reducedMotion="user">
        <GetPictureHero />
        <section aria-label="Upload your photo" className="bg-ink pb-24 sm:pb-32">
          <div className="container">
            <PhotoFrameStudio />
          </div>
        </section>
      </MotionConfig>
    </main>
  );
}
