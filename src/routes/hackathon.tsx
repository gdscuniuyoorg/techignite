import { createFileRoute } from '@tanstack/react-router';
import { HackathonHero } from '@/features/hackathon/components/hero';
import { HackathonStats } from '@/features/hackathon/components/hackathon-stats';

export const Route = createFileRoute('/hackathon')({
  component: Hackathon,
});

function Hackathon() {
  return (
    <main id="main-content">
      <HackathonHero />
      <HackathonStats />
    </main>
  );
}
