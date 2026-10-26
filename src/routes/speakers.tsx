import { createFileRoute } from '@tanstack/react-router';
import { SpeakerHero } from '@/features/speakers/components/speaker-hero';
import { SpeakerLineup } from '@/features/speakers/components/speaker-lineup';
import { SpeakerSponsorPanel } from '@/features/speakers/components/speaker-sponsor-panel';

export const Route = createFileRoute('/speakers')({
  component: Speakers,
});

function Speakers() {
  return (
    <main id="main-content">
      <SpeakerHero />
      <SpeakerLineup />
      <SpeakerSponsorPanel />
    </main>
  );
}
