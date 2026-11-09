import { useQuery } from '@tanstack/react-query';
import { getTeam, type TeamProfile } from '@/lib/team-api';

export const TEAM_PROFILE_KEY = ['team', 'profile'] as const;

/** Live team profile + submission fields (GET /api/team). */
export function useTeamProfile() {
  return useQuery<TeamProfile>({
    queryKey: TEAM_PROFILE_KEY,
    queryFn: getTeam,
  });
}
