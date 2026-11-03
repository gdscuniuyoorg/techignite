import { createFileRoute } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';
import { ApplyHero } from '@/features/apply/components/apply-hero';
import { ShipathonStats } from '@/features/apply/components/shipathon-stats';
import { WhoCanParticipate } from '@/features/apply/components/who-can-participate';
import { ShipathonTimeline } from '@/features/apply/components/shipathon-timeline';
import { TheChallenge } from '@/features/apply/components/the-challenge';
import { JudgingCriteria } from '@/features/apply/components/judging-criteria';
import { ShipathonJudges } from '@/features/apply/components/shipathon-judges';
import { ShipathonPrizes } from '@/features/apply/components/shipathon-prizes';
import { AiEncouraged } from '@/features/apply/components/ai-encouraged';
import { ShipathonHashtags } from '@/features/apply/components/shipathon-hashtags';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/apply')({
  head: () => seoHead('/apply'),
  component: Apply,
});

function Apply() {
  return (
    <main id="main-content">
      <MotionConfig reducedMotion="user">
        <ApplyHero />
        <ShipathonStats />
        <WhoCanParticipate />
        <ShipathonTimeline />
        <TheChallenge />
        <JudgingCriteria />
        <ShipathonJudges />
        <ShipathonPrizes />
        <AiEncouraged />
        <ShipathonHashtags />
      </MotionConfig>
    </main>
  );
}
