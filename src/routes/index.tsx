import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/features/landing/components/hero';
import { WhatToExpect } from '@/features/landing/components/what-to-expect';
import { Faq } from '@/features/landing/components/faq';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <main id="main-content">
      <Hero />
      <WhatToExpect />
      {/* Placeholder sections backing the nav anchors until they are built. */}
      <section id="speakers" className="min-h-px bg-ink" aria-label="Speakers" />
      <section id="hackathon" className="min-h-px bg-ink" aria-label="Hackathon" />
      <section id="agenda" className="min-h-px bg-ink" aria-label="Agenda" />
      <section id="sponsors" className="min-h-px bg-ink" aria-label="Sponsors" />
      <Faq />
    </main>
  );
}
