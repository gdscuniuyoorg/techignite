import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import About from '@/components/sections/About';
import Expectations from '@/components/sections/Expectations';
import Navbar from '@/components/sections/Navbar';
import Speakers from '@/components/sections/Speakers';
import Topics from '@/components/sections/Topics';
import Hero from '@/components/sections/Hero';
import Sponsors from '@/components/sections/Sponsors';
import Partners from '@/components/sections/Partners';
import TicketPage from '@/components/molecules/TicketPage';

const getIsTicketSubdomain = createServerFn({ method: 'GET' }).handler(() => {
  const host = getRequestHeader('host') ?? '';
  return host.startsWith('tickets.');
});

export const Route = createFileRoute('/')({
  loader: () => getIsTicketSubdomain(),
  component: Home,
});

function Home() {
  const isTicketSubdomain = Route.useLoaderData();

  if (isTicketSubdomain) {
    return (
      <main className="h-full">
        <Navbar isTicketSubdomain />
        <TicketPage />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F9FE]">
      <Navbar />
      <Hero />
      <Topics />
      <Expectations />
      <Speakers />
      <Sponsors />
      <Partners />
      <About />
    </main>
  );
}
