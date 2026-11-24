import { createFileRoute } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import { MemoriesHero } from '@/features/memories/components/memories-hero';
import { MemoriesGallery } from '@/features/memories/components/memories-gallery';
import { Memories26Snippets } from '@/features/memories/components/memories-26-snippets';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/memories')({
  head: () => seoHead('/memories'),
  component: MemoriesPage,
});

function MemoriesPage() {
  return (
    <main id="main-content">
      <MotionConfig reducedMotion="user">
        <MemoriesHero />
        <MemoriesGallery />
        <Memories26Snippets />
      </MotionConfig>
    </main>
  );
}
