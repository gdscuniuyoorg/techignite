import { createFileRoute } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import { HackathonHero } from '@/features/hackathon/components/hero';
import { HackathonStats } from '@/features/hackathon/components/hackathon-stats';
import { WhyApply } from '@/features/hackathon/components/why-apply';
import { Prizes } from '@/features/hackathon/components/prizes';
import { HowItWorks } from '@/features/hackathon/components/how-it-works';
import { HackathonFaq } from '@/features/hackathon/components/faq';

export const Route = createFileRoute('/hackathon')({
  component: Hackathon,
});

function Hackathon() {
  return (
    <main id="main-content">
      <MotionConfig reducedMotion="user">
        <HackathonHero />
        <HackathonStats />
        <WhyApply />
        <Prizes />
        <HowItWorks />
        <HackathonFaq />
      </MotionConfig>
    </main>
  );
}
