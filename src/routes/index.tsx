import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import TicketPage from '@/components/molecules/TicketPage';
import Navbar from '@/components/sections/Navbar';

const getIsTicketSubdomain = createServerFn({ method: 'GET' }).handler(() => {
  const host = getRequestHeader('host') ?? '';
  return host.startsWith('tickets.');
});

export const Route = createFileRoute('/')({
  loader: () => getIsTicketSubdomain(),
  component: Home,
});

function Home() {
  // const isTicketSubdomain = Route.useLoaderData();


  return <main className="min-h-screen bg-[#F5F9FE]">
    <h2>Welcome to Tech Ignite26</h2>
  </main>
}
