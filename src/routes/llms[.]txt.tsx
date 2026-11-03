import { createFileRoute } from '@tanstack/react-router';
import { llmsTxt } from '@/lib/seo';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(llmsTxt(), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    },
  },
});
