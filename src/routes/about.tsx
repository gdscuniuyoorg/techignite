import { createFileRoute } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import { AboutHero } from '@/features/about/components/about-hero';
import { AboutUs } from '@/features/about/components/about-us';
import { WhatWeDo } from '@/features/about/components/what-we-do';
import { Organizers } from '@/features/about/components/organizers';
import { CommunityLinks } from '@/features/about/components/community-links';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <main id="main-content">
      <MotionConfig reducedMotion="user">
        <AboutHero />
        <AboutUs />
        <WhatWeDo />
        <Organizers />
        <CommunityLinks />
      </MotionConfig>
    </main>
  );
}
