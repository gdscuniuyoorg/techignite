import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/speakers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/speakers"!</div>
}
