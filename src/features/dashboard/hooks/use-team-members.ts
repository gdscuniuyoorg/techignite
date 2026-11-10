import { useQuery } from '@tanstack/react-query';
import { getTeamMembers, type TeamMemberList } from '@/lib/team-api';

export function teamMembersKey(teamId: string) {
  return ['team', teamId, 'members'] as const;
}

/** Live roster from GET /api/team-members for the current team. */
export function useTeamMembers(teamId: string) {
  return useQuery<TeamMemberList>({
    queryKey: teamMembersKey(teamId),
    queryFn: () => getTeamMembers(teamId),
    enabled: teamId.length > 0,
  });
}
