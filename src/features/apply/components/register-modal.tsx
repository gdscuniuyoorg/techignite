import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Check, X } from 'lucide-react';
import {
  getApplicationErrorMessage,
  submitApplication,
  type HackathonApplication,
} from '@/lib/api';
import { SuccessConfetti } from '@/features/apply/components/success-confetti';

/** Parsed copy of what a builder entered; only feeds the success screen. */
interface RegistrationDraft {
  readonly firstName: string;
  readonly teamName: string;
  readonly email: string;
}

type RegistrationField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'teamName'
  | 'teamDescription'
  | 'projectIdea'
  | 'agreedToRules';

type RegistrationErrors = Partial<Record<RegistrationField, string>>;

type RegistrationParseResult =
  | {
      readonly ok: true;
      readonly draft: RegistrationDraft;
      readonly payload: HackathonApplication;
    }
  | { readonly ok: false; readonly errors: RegistrationErrors };

function getFormText(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Boundary parse: the form's FormData is untrusted input. Parse once,
 * narrow to typed values, and return field-level errors for inline display.
 */
function parseRegistration(form: FormData): RegistrationParseResult {
  const errors: RegistrationErrors = {};

  const firstName = getFormText(form, 'firstName');
  const lastName = getFormText(form, 'lastName');
  const email = getFormText(form, 'email');
  const teamName = getFormText(form, 'teamName');
  const teamDescription = getFormText(form, 'teamDescription');
  const projectIdea = getFormText(form, 'projectIdea');
  const agreedToRules = form.get('agreedToRules') === 'on';

  if (!firstName) {
    errors.firstName = 'Tell us your first name.';
  }

  if (!lastName) {
    errors.lastName = 'Tell us your last name.';
  }

  if (!email) {
    errors.email = 'We need an email to reach you.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'That email doesn’t look right.';
  }

  if (!teamName) {
    errors.teamName = 'Give your team a name.';
  }

  if (!teamDescription) {
    errors.teamDescription = 'A line or two about the team helps the judges.';
  }

  if (!projectIdea) {
    errors.projectIdea = 'Tell us the idea you are bringing.';
  }

  if (!agreedToRules) {
    errors.agreedToRules = 'You need to agree to the rules to enter.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // Safe: every required field was validated above.
  const payload: HackathonApplication = {
    teamName,
    projectIdea,
    agreedToRules,
    applicantEmail: email,
    teamDescription,
    applicantLastName: lastName,
    applicantFirstName: firstName,
  };

  return {
    ok: true,
    draft: { firstName, teamName, email },
    payload,
  };
}

const fieldClass = (hasError: boolean) =>
  `w-full rounded-xs border bg-paper px-3 text-label text-ink shadow-none outline-none transition-colors placeholder:text-muted-dark/70 focus:border-brand-blue ${
    hasError ? 'border-brand-red' : 'border-line-light'
  }`;

const errorClass = 'text-xs leading-relaxed text-brand-red';

function RegisterBody({ onClose }: { readonly onClose: () => void }) {
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<RegistrationDraft | null>(null);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = parseRegistration(formData);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    void (async () => {
      try {
        await submitApplication(result.payload);
        setSubmitted(result.draft);
      } catch (error: unknown) {
        setSubmitError(await getApplicationErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    })();
  };

  // Invisible, full-viewport safety close: clicking anywhere outside the
  // panel (including the native ::backdrop area) hits this button first.
  return (
    <>
      <button
        type="button"
        aria-label="Close registration form"
        onClick={onClose}
        tabIndex={-1}
        className="fixed inset-0 z-0 cursor-default bg-transparent"
      />

      <div className="relative z-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close registration form"
          className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-pill bg-mist text-ink transition-colors hover:bg-brand-blue-pale sm:top-6 sm:right-6"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="border-b border-line-light px-5 pt-5 pb-4 sm:px-8 sm:pt-6 sm:pb-5">
          <p className="text-eyebrow font-normal text-muted-dark uppercase">
            Build with Paga Shipathon
          </p>
          <h2
            id="register-modal-title"
            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {submitted ? 'Application received.' : 'Register to build'}
          </h2>
          {!submitted ? (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
              Complete the form below and that secures your spot in the hackathon.
            </p>
          ) : null}
        </div>

        {submitted ? (
          <>
            <SuccessConfetti />
            <div className="flex flex-col items-center gap-4 px-5 py-10 text-center sm:px-8">
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-pill bg-brand-green-bright text-paper"
              >
                <Check className="size-6" />
              </span>
              <p className="max-w-sm text-lg leading-relaxed text-ink/75">
                Noted, <span className="font-bold">{submitted.firstName}</span> — your
                application for <span className="font-bold">{submitted.teamName}</span>{' '}
                was received. We will review it and reach out at{' '}
                <span className="font-medium">{submitted.email}</span> if you are
                shortlisted.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 flex h-11 items-center justify-center rounded-xs bg-primary px-8 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 sm:px-8 sm:py-7"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="register-first-name"
                className="text-label font-medium text-ink"
              >
                First name
              </label>
              <input
                id="register-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="John"
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={
                  errors.firstName ? 'register-first-name-error' : undefined
                }
                className={`${fieldClass(Boolean(errors.firstName))} h-11`}
              />
              <p id="register-first-name-error" role="alert" className={errorClass}>
                {errors.firstName ?? ''}
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-last-name"
                className="text-label font-medium text-ink"
              >
                Last name
              </label>
              <input
                id="register-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={
                  errors.lastName ? 'register-last-name-error' : undefined
                }
                className={`${fieldClass(Boolean(errors.lastName))} h-11`}
              />
              <p id="register-last-name-error" role="alert" className={errorClass}>
                {errors.lastName ?? ''}
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-label font-medium text-ink">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                className={`${fieldClass(Boolean(errors.email))} h-11`}
              />
              <p id="register-email-error" role="alert" className={errorClass}>
                {errors.email ?? ''}
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-team-name"
                className="text-label font-medium text-ink"
              >
                Team name
              </label>
              <input
                id="register-team-name"
                name="teamName"
                type="text"
                placeholder="e.g. Code Warriors"
                aria-invalid={Boolean(errors.teamName)}
                aria-describedby={
                  errors.teamName ? 'register-team-name-error' : undefined
                }
                className={`${fieldClass(Boolean(errors.teamName))} h-11`}
              />
              <p id="register-team-name-error" role="alert" className={errorClass}>
                {errors.teamName ?? ''}
              </p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="register-team-desc"
                className="text-label font-medium text-ink"
              >
                Team description
              </label>
              <textarea
                id="register-team-desc"
                name="teamDescription"
                rows={2}
                placeholder="We build AI-powered tools"
                aria-invalid={Boolean(errors.teamDescription)}
                aria-describedby={
                  errors.teamDescription ? 'register-team-desc-error' : undefined
                }
                className={`${fieldClass(Boolean(errors.teamDescription))} min-h-16 py-2.5`}
              />
              <p id="register-team-desc-error" role="alert" className={errorClass}>
                {errors.teamDescription ?? ''}
              </p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="register-project-idea"
                className="text-label font-medium text-ink"
              >
                What are you about to build?
              </label>
              <textarea
                id="register-project-idea"
                name="projectIdea"
                rows={3}
                placeholder="The product, who it serves, and what it will do — must solve an African problem, powered by the Paga Engine API."
                aria-invalid={Boolean(errors.projectIdea)}
                aria-describedby={
                  errors.projectIdea ? 'register-project-idea-error' : undefined
                }
                className={`${fieldClass(Boolean(errors.projectIdea))} min-h-24 py-2.5`}
              />
              <p id="register-project-idea-error" role="alert" className={errorClass}>
                {errors.projectIdea ?? ''}
              </p>
              <p className="text-xs leading-relaxed text-muted-dark">
                One clear idea is enough — the working prototype comes over the two build
                weeks. You must apply as a team of 3–5 persons.
              </p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="register-rules"
                className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors ${
                  errors.agreedToRules
                    ? 'border-brand-red/60 bg-brand-red/5'
                    : 'border-line-light bg-mist hover:border-brand-blue'
                }`}
              >
                <input
                  id="register-rules"
                  name="agreedToRules"
                  type="checkbox"
                  aria-invalid={Boolean(errors.agreedToRules)}
                  aria-describedby={
                    errors.agreedToRules ? 'register-rules-error' : undefined
                  }
                  className="mt-0.5 size-4 shrink-0 accent-brand-blue"
                />
                <span className="text-sm leading-relaxed text-ink/80">
                  I agree to the hackathon rules and judging criteria, and I confirm that
                  my project will be built with the Paga Engine API during the build
                  weeks.
                </span>
              </label>
              <p id="register-rules-error" role="alert" className={errorClass}>
                {errors.agreedToRules ?? ''}
              </p>
            </div>

            {submitError ? (
              <div
                role="alert"
                className="rounded-md border border-brand-red/40 bg-brand-red/5 px-4 py-3 text-sm leading-relaxed text-brand-red sm:col-span-2"
              >
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xs bg-primary px-6 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
            >
              {submitting ? 'Submitting…' : 'Submit registration'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

interface RegisterModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Bridge the declarative `open` prop to the imperative dialog element.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="register-modal-title"
      onClose={() => {
        onOpenChange(false);
      }}
      className="fixed m-auto max-h-[min(85svh,640px)] w-[calc(100vw-1.5rem)] max-w-2xl animate-in overflow-y-auto rounded-2xl bg-paper p-0 text-ink shadow-[0_24px_64px_rgba(0,0,0,0.45)] duration-200 fade-in-0 zoom-in-95 backdrop:animate-in backdrop:bg-ink/70 backdrop:backdrop-blur-sm backdrop:fade-in-0 sm:max-w-3xl"
    >
      {/* Mount-fresh per open: state resets without a reset effect. */}
      {open ? (
        <RegisterBody
          onClose={() => {
            onOpenChange(false);
          }}
        />
      ) : null}
    </dialog>
  );
}
