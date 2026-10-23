import { createFileRoute } from '@tanstack/react-router';
import { AgendaHero } from '@/features/agenda/components/agenda-hero';

export const Route = createFileRoute('/agenda')({
  component: Agenda,
});

function Agenda() {
  return (
    <main id="main-content">
      <AgendaHero />
    </main>
  );
}
