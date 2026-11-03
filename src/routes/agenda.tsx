import { createFileRoute } from '@tanstack/react-router';
import { AgendaHero } from '@/features/agenda/components/agenda-hero';
import { AgendaProgramme } from '@/features/agenda/components/agenda-programme';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/agenda')({
  head: () => seoHead('/agenda'),
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
