import { Mail, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardPageHeader } from './dashboard-page-header';
import { MEMBERS, MOCK_TEAM } from '../data';

export function TeamMembers() {
  const confirmed = MEMBERS.filter((member) => member.confirmed).length;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        eyebrow="Team"
        title="Team Members"
        description="Everyone registered under this team. Confirmed members can submit and edit the project."
        aside={
          <Badge variant="outline" className="px-3 py-1.5 text-xs">
            {String(MEMBERS.length)} of {String(MOCK_TEAM.seats)} seats used
          </Badge>
        }
      />

      <Card className="border-violet-200 bg-violet-50/70">
        <CardHeader>
          <div>
            <CardTitle>{MOCK_TEAM.name}</CardTitle>
            <CardDescription>
              {MOCK_TEAM.code} · {MOCK_TEAM.track}
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" disabled>
            <UserPlus size={14} aria-hidden="true" />
            Team full
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-violet-600"
              style={{
                width: `${String((MEMBERS.length / MOCK_TEAM.seats) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {String(confirmed)} of {String(MEMBERS.length)} members confirmed. Seats are
            capped at {String(MOCK_TEAM.seats)} per team.
          </p>
        </CardContent>
      </Card>

      <ul className="grid gap-3 sm:grid-cols-2">
        {MEMBERS.map((member) => (
          <li key={member.email}>
            <Card className="h-full gap-0 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-semibold text-violet-700">
                  {member.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-medium text-slate-900">
                      {member.name}
                    </span>
                    <Badge variant={member.confirmed ? 'success' : 'warning'}>
                      {member.confirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{member.role}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 flex items-center gap-1 truncate text-xs text-slate-500 hover:text-violet-600"
                  >
                    <Mail size={12} aria-hidden="true" />
                    {member.email}
                  </a>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-500">
        Need to swap a member after onboarding? Contact{' '}
        <a
          href="mailto:support@techignite.net"
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          support@techignite.net
        </a>
        .
      </p>
    </div>
  );
}
