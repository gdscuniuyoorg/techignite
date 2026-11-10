import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  activateOnboarding,
  teamErrorMessage,
  verifyOnboardingToken,
  type OnboardingVerification,
  type TeamMemberRole,
} from '@/lib/team-api';

interface TeamOnboardingProps {
  readonly teamId: string;
  readonly token: string;
  readonly onActivated: () => Promise<void>;
}

type VerificationState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly invite: OnboardingVerification }
  | { readonly status: 'error'; readonly message: string };

function roleLabel(role: TeamMemberRole): string {
  switch (role) {
    case 'LEAD':
      return 'Team lead';
    case 'MENTOR':
      return 'Mentor';
    case 'MEMBER':
      return 'Member';
    default: {
      const exhaustiveCheck: never = role;
      return exhaustiveCheck;
    }
  }
}

async function inviteErrorMessage(error: unknown): Promise<string> {
  return teamErrorMessage(error, 'This invite is invalid or has expired.', {
    forbidden: 'This invite cannot be used for this team.',
    conflict: 'This invite has already been used.',
    gone: 'This invite has expired. Ask your team lead for a new one.',
    notFound: 'This invite could not be found. Check the link and try again.',
  });
}

/** Public invite verification and activation screen. */
export function TeamOnboarding({ teamId, token, onActivated }: TeamOnboardingProps) {
  const hasToken = token.trim().length > 0;
  const [verification, setVerification] = useState<VerificationState>(() =>
    hasToken
      ? { status: 'loading' }
      : {
          status: 'error',
          message: 'This invite link is missing its access token.',
        },
  );
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!hasToken) return;

    void verifyOnboardingToken(token)
      .then((invite) => {
        if (!active) return;
        if (invite.teamId.length > 0 && invite.teamId !== teamId) {
          setVerification({
            status: 'error',
            message: 'This invite does not belong to the team in this link.',
          });
          return;
        }
        setVerification({ status: 'ready', invite });
      })
      .catch(async (error: unknown) => {
        const message = await inviteErrorMessage(error);
        if (active) setVerification({ status: 'error', message });
      });

    return () => {
      active = false;
    };
  }, [hasToken, teamId, token]);

  const activate = async (invite: OnboardingVerification): Promise<void> => {
    setActivationError(null);
    setActivating(true);
    try {
      await activateOnboarding(token, invite.memberEmail);
      await onActivated();
    } catch (error) {
      setActivationError(await inviteErrorMessage(error));
      setActivating(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full border border-brand-blue/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full border border-brand-green-vivid/20"
      />

      <div className="relative container grid min-h-dvh items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-16">
        <section className="max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-sm font-semibold text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-cream text-ink">
              <Zap size={18} aria-hidden="true" />
            </span>
            Tech Ignite Team Portal
          </Link>

          <p className="mt-12 text-xs font-semibold tracking-widest text-brand-blue-soft uppercase">
            Team invitation
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Build together, from one workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
            Accept your invitation to join the project team, view the roster, and follow
            the submission from the shared dashboard.
          </p>

          <ol className="mt-9 grid gap-4 sm:grid-cols-3 lg:max-w-xl">
            {[
              ['1', 'Verify invite'],
              ['2', 'Join the team'],
              ['3', 'Open dashboard'],
            ].map(([number, label]) => (
              <li key={number} className="border-t border-white/15 pt-3">
                <span className="text-xs text-brand-cream">{number}</span>
                <span className="mt-1 block text-sm text-white/75">{label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-ink-raised p-5 shadow-2xl shadow-black/20 sm:p-7">
          {verification.status === 'loading' && (
            <div
              role="status"
              aria-busy="true"
              className="flex min-h-72 flex-col items-center justify-center text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue-soft">
                <Loader2 size={21} className="animate-spin" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-white">
                Checking your invite
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                This should only take a moment.
              </p>
            </div>
          )}

          {verification.status === 'error' && (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/15 text-brand-red">
                <AlertCircle size={21} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-white">
                Invite unavailable
              </h2>
              <p role="alert" className="mt-2 max-w-sm text-sm leading-6 text-white/60">
                {verification.message}
              </p>
              <Link
                to="/auth"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                Go to sign in
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          )}

          {verification.status === 'ready' && (
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-vivid/15 text-brand-green-bright">
                <Users size={21} aria-hidden="true" />
              </span>
              <p className="mt-6 text-xs font-semibold tracking-wide text-brand-blue-soft uppercase">
                You are invited
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Join {verification.invite.teamName}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Confirm the invitation to open the team dashboard.
              </p>

              <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                <div className="grid grid-cols-[6rem_1fr] gap-3 py-3 text-sm">
                  <dt className="text-white/45">Name</dt>
                  <dd className="min-w-0 truncate text-white/85">
                    {verification.invite.memberName || 'Team member'}
                  </dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-3 py-3 text-sm">
                  <dt className="text-white/45">Email</dt>
                  <dd className="min-w-0 truncate text-white/85">
                    {verification.invite.memberEmail || 'Confirmed by invite'}
                  </dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-3 py-3 text-sm">
                  <dt className="text-white/45">Role</dt>
                  <dd className="text-white/85">{roleLabel(verification.invite.role)}</dd>
                </div>
              </dl>

              {activationError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-brand-red/30 bg-brand-red/10 px-3 py-2 text-sm text-red-200"
                >
                  {activationError}
                </p>
              )}

              <Button
                type="button"
                disabled={activating}
                onClick={() => void activate(verification.invite)}
                className="mt-6 h-11 w-full bg-brand-blue text-white hover:bg-brand-blue-strong"
              >
                {activating ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Check size={16} aria-hidden="true" />
                )}
                {activating ? 'Joining team…' : 'Join team'}
              </Button>

              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-white/45">
                <ShieldCheck
                  size={14}
                  className="mt-0.5 shrink-0 text-brand-green-bright"
                  aria-hidden="true"
                />
                This link is private and can only be used once.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
