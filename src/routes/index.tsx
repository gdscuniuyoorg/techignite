import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/features/landing/components/hero';
import { WhatToExpect } from '@/features/landing/components/what-to-expect';
import { Audience } from '@/features/landing/components/audience';
import { IgniteStatement } from '@/features/landing/components/ignite-statement';
import { KeynoteSpeakers } from '@/features/landing/components/keynote-speakers';
import { SpeakerSponsorPanel } from '@/features/speakers/components/speaker-sponsor-panel';
import { Schedule } from '@/features/landing/components/schedule';
import { PartnersSponsors } from '@/features/landing/components/partners-sponsors';
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
      <IgniteStatement />
      <KeynoteSpeakers />
      <Schedule />
      {/* Invisible-spacing nav anchor until this section is built. */}
      <section id="hackathon" className="min-h-px bg-paper" aria-label="Hackathon" />
      <PartnersSponsors />
      {/* Sponsors anchor — the "Become a Sponsor" panel from /speakers. */}
      <SpeakerSponsorPanel />
      <Faq />
    </main>
  );
}
