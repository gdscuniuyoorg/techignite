import { useQuery } from '@tanstack/react-query';
import { getSession, getTeam, type TeamProfile } from '@/lib/team-api';

export const TEAM_PROFILE_KEY = ['team', 'profile'] as const;

/**
 * Live team profile + submission fields (GET /api/teams). When that call
 * fails, fall back to the team embedded in GET /api/auth/me so the dashboard
 * still shows the signed-in user's team; if neither source yields a team the
 * original error is rethrown so routes render their error state.
 */
export function useTeamProfile() {
  return useQuery<TeamProfile>({
    queryKey: TEAM_PROFILE_KEY,
    queryFn: async () => {
      try {
        return await getTeam();
      } catch (error) {
        const session = await getSession().catch(() => undefined);
        if (session) return session;
        throw error;
      }
    },
  });
}
