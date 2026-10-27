import { createFileRoute } from '@tanstack/react-router';
import { Audience } from '@/features/landing/components/audience';
import { Hero } from '@/features/landing/components/hero';
import { KeynoteSpeakers } from '@/features/landing/components/keynote-speakers';
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
      <Audience />
      <KeynoteSpeakers />
      {/* Placeholder sections backing the nav anchors until they are built. */}
      <section id="hackathon" className="min-h-px bg-ink" aria-label="Hackathon" />
      <section id="agenda" className="min-h-px bg-ink" aria-label="Agenda" />
      <section id="sponsors" className="min-h-px bg-ink" aria-label="Sponsors" />
      <Faq />
    </main>
  );
}
