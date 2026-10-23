import { createFileRoute } from '@tanstack/react-router';
import { SpeakerHero } from '@/features/speakers/components/speaker-hero';

export const Route = createFileRoute('/speakers')({
  component: Speakers,
});

function Speakers() {
  return (
    <main id="main-content">
      <SpeakerHero />
    </main>
  );
}
