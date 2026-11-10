import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  teamErrorMessage,
  type InviteTeamMemberInput,
  type TeamInviteRole,
} from '@/lib/team-api';

interface InviteMemberValues {
  readonly memberName: string;
  readonly memberEmail: string;
  readonly role: Extract<TeamInviteRole, 'member' | 'mentor'>;
}

interface InviteMemberDialogProps {
  readonly teamName: string;
  readonly existingEmails: readonly string[];
  readonly onClose: () => void;
  readonly onInvite: (input: InviteTeamMemberInput) => Promise<void>;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** Lead only modal for sending a team onboarding invitation. */
export function InviteMemberDialog({
  teamName,
  existingEmails,
  onClose,
  onInvite,
}: InviteMemberDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberValues>({
    defaultValues: { memberName: '', memberEmail: '', role: 'member' },
  });

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusable?.[0];
      const last = focusable?.[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    const memberName = values.memberName.trim();
    const input: InviteTeamMemberInput = {
      memberEmail: values.memberEmail.trim().toLowerCase(),
      role: values.role,
      ...(memberName.length > 0 ? { memberName } : {}),
    };

    try {
      await onInvite(input);
    } catch (error) {
      setSubmitError(
        await teamErrorMessage(error, 'Your session expired. Sign in again.', {
          forbidden: 'Only the team lead can invite members.',
          conflict: 'This email is already a member or has a pending invite.',
        }),
      );
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Close invite form"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
        aria-describedby="invite-member-description"
        tabIndex={-1}
        className="relative z-10 my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand-blue-strong uppercase">
              {teamName}
            </p>
            <h2
              id="invite-member-title"
              className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950"
            >
              Invite a team member
            </h2>
            <p
              id="invite-member-description"
              className="mt-1.5 text-sm leading-6 text-slate-500"
            >
              They will receive a secure link to join the team and open the dashboard.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={submit} noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-member-name">Name</Label>
            <Input
              id="invite-member-name"
              autoComplete="name"
              placeholder="Alice Smith"
              {...register('memberName', {
                maxLength: {
                  value: 120,
                  message: 'Name must be 120 characters or fewer.',
                },
              })}
              aria-invalid={errors.memberName !== undefined}
              aria-describedby={errors.memberName ? 'invite-name-error' : undefined}
            />
            {errors.memberName && (
              <p id="invite-name-error" role="alert" className="text-xs text-red-700">
                {errors.memberName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-member-email">Email</Label>
            <Input
              id="invite-member-email"
              type="email"
              autoComplete="email"
              placeholder="alice@example.com"
              {...register('memberEmail', {
                required: 'Enter the member email address.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address.',
                },
                validate: (value) => {
                  const normalized = value.trim().toLowerCase();
                  return (
                    !existingEmails.some(
                      (email) => email.trim().toLowerCase() === normalized,
                    ) || 'This email is already on the team.'
                  );
                },
              })}
              aria-invalid={errors.memberEmail !== undefined}
              aria-describedby={errors.memberEmail ? 'invite-email-error' : undefined}
            />
            {errors.memberEmail && (
              <p id="invite-email-error" role="alert" className="text-xs text-red-700">
                {errors.memberEmail.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-member-role">Role</Label>
            <select
              id="invite-member-role"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue/20"
              {...register('role')}
            >
              <option value="member">Member</option>
              <option value="mentor">Mentor</option>
            </select>
            <p className="text-xs leading-5 text-slate-500">
              Members build with the team. Mentors can follow the project and support the
              group.
            </p>
          </div>

          {submitError && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {submitError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 bg-slate-950 text-white hover:bg-slate-800"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={16} aria-hidden="true" />
              )}
              {isSubmitting ? 'Sending invite…' : 'Send invite'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
