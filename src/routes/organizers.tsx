import { createFileRoute } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import { Organizers as OrganizersSection } from '@/features/about/components/organizers';
import { CoreTeamGallery } from '@/features/organizers/components/coreteam-gallery';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/organizers')({
  head: () => seoHead('/organizers'),
  component: OrganizersPage,
});

function OrganizersPage() {
  return (
    <main id="main-content">
      <MotionConfig reducedMotion="user">
        <OrganizersSection />
        <CoreTeamGallery />
      </MotionConfig>
    </main>
  );
}
