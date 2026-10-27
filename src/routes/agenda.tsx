import { createFileRoute } from '@tanstack/react-router';
import { AgendaHero } from '@/features/agenda/components/agenda-hero';
import { AgendaProgramme } from '@/features/agenda/components/agenda-programme';

export const Route = createFileRoute('/agenda')({
  component: Agenda,
});

function Agenda() {
  return (
    <main id="main-content">
      <AgendaHero />
      <AgendaProgramme />
    </main>
  );
}
