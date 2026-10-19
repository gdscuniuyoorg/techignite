import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-[#F5F9FE]">
      <h2>Welcome to Tech Ignite26</h2>
    </main>
  );
}
