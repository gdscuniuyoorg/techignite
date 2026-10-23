import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/photos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/photos"!</div>
}
