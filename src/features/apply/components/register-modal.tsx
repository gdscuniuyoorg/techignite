import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Check, FileUp, X } from 'lucide-react';

/** Parsed, validated copy of what a builder entered — no file bytes kept. */
interface RegistrationDraft {
  readonly firstName: string;
  readonly email: string;
}

type RegistrationField = 'name' | 'email' | 'teamSize' | 'about' | 'deck' | 'videoUrl';

type RegistrationErrors = Partial<Record<RegistrationField, string>>;

type RegistrationParseResult =
  | { readonly ok: true; readonly draft: RegistrationDraft }
  | { readonly ok: false; readonly errors: RegistrationErrors };

const DECK_EXTENSIONS: readonly string[] = ['pdf', 'ppt', 'pptx', 'odp', 'key'];
const DECK_MAX_BYTES = 10 * 1024 * 1024;

const TEAM_SIZES: readonly { readonly value: string; readonly label: string }[] = [
  { value: '1', label: 'Solo' },
  { value: '2', label: '2 builders' },
  { value: '3', label: '3 builders' },
  { value: '4', label: '4 builders' },
  { value: '5', label: '5 builders' },
];

function getFormText(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

function isValidHttpUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Boundary parse: the form's FormData is untrusted input. Parse once,
 * narrow to typed values, and return field-level errors for inline display.
 */
function parseRegistration(form: FormData): RegistrationParseResult {
  const errors: RegistrationErrors = {};

  const name = getFormText(form, 'name');
  const email = getFormText(form, 'email');
  const teamSize = getFormText(form, 'teamSize');
  const about = getFormText(form, 'about');
  const videoUrl = getFormText(form, 'videoUrl');

  const deckEntry = form.get('deck');
  const deck = deckEntry instanceof File && deckEntry.size > 0 ? deckEntry : null;

  if (!name) {
    errors.name = 'Tell us who you are.';
  }

  if (!email) {
    errors.email = 'We need an email to reach you.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'That email doesn’t look right.';
  }

  if (!teamSize) {
    errors.teamSize = 'How many builders are shipping?';
  }

  if (about.length < 40) {
    errors.about =
      'Give us at least a couple of sentences — the product, who it serves, what it does.';
  }

  if (deck) {
    const extension = deck.name.split('.').pop()?.toLowerCase() ?? '';
    if (deck.size > DECK_MAX_BYTES) {
      errors.deck = 'That deck is over 10 MB.';
    } else if (!DECK_EXTENSIONS.includes(extension)) {
      errors.deck = `Slides only — one of ${DECK_EXTENSIONS.join(', ')}.`;
    }
  } else {
    errors.deck = 'Attach your pitch deck (10 MB max).';
  }

  if (videoUrl && !isValidHttpUrl(videoUrl)) {
    errors.videoUrl = 'Paste a full link, starting with http or https.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // Safe: every field validated above; `!name` and `!email` can't reach here.
  const firstName = name.split(' ')[0] ?? 'builder';
  return {
    ok: true,
    draft: { firstName, email },
  };
}

const fieldClass = (hasError: boolean) =>
  `w-full rounded-xs border bg-paper px-3 text-label text-ink shadow-none outline-none transition-colors placeholder:text-muted-dark/70 focus:border-brand-blue ${
    hasError ? 'border-brand-red' : 'border-line-light'
  }`;

const errorClass = 'text-xs leading-relaxed text-brand-red';

function RegisterBody({ onClose }: { readonly onClose: () => void }) {
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [captured, setCaptured] = useState<RegistrationDraft | null>(null);
  const [deckName, setDeckName] = useState<string | null>(null);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = parseRegistration(formData);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setCaptured(result.draft);
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
            {captured ? 'Details captured.' : 'Register to build'}
          </h2>
          {!captured ? (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
              Complete the form, upload your pitch deck, and share a 60-second video —
              that secures your spot in the hackathon.
            </p>
          ) : null}
        </div>

        {captured ? (
          <div className="flex flex-col items-center gap-4 px-5 py-10 text-center sm:px-8">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-pill bg-brand-green-bright text-paper"
            >
              <Check className="size-6" />
            </span>
            <p className="max-w-sm text-lg leading-relaxed text-ink/75">
              Noted, <span className="font-bold">{captured.firstName}</span> — your build
              idea and checklist live on this device only; nothing was submitted.
              Registration is still in active development. When it opens at{' '}
              <span className="font-medium">techignite.net/hackathon</span>, attach your
              pitch deck and 60-second video to lock in your spot.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 flex h-11 items-center justify-center rounded-xs bg-primary px-8 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 sm:px-8 sm:py-7"
          >
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-label font-medium text-ink">
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'register-name-error' : undefined}
                className={`${fieldClass(Boolean(errors.name))} h-11`}
              />
              <p id="register-name-error" role="alert" className={errorClass}>
                {errors.name ?? ''}
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
                htmlFor="register-team-size"
                className="text-label font-medium text-ink"
              >
                Team size
              </label>
              <select
                id="register-team-size"
                name="teamSize"
                defaultValue=""
                aria-invalid={Boolean(errors.teamSize)}
                aria-describedby={
                  errors.teamSize ? 'register-team-size-error' : undefined
                }
                className={`${fieldClass(Boolean(errors.teamSize))} h-11`}
              >
                <option value="" disabled>
                  Select team size
                </option>
                {TEAM_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
              <p id="register-team-size-error" role="alert" className={errorClass}>
                {errors.teamSize ?? ''}
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-team-name"
                className="text-label font-medium text-ink"
              >
                Team name <span className="text-muted-dark">(optional)</span>
              </label>
              <input
                id="register-team-name"
                name="teamName"
                type="text"
                placeholder="e.g. Uyo Builders"
                className={`${fieldClass(false)} h-11`}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="register-about" className="text-label font-medium text-ink">
                What are you about to build?
              </label>
              <textarea
                id="register-about"
                name="about"
                rows={3}
                placeholder="The product, who it serves, and what it will do — must solve an African problem, powered by the Paga Engine API."
                aria-invalid={Boolean(errors.about)}
                aria-describedby={errors.about ? 'register-about-error' : undefined}
                className={`${fieldClass(Boolean(errors.about))} min-h-24 py-2.5`}
              />
              <p id="register-about-error" role="alert" className={errorClass}>
                {errors.about ?? ''}
              </p>
              <p className="text-xs leading-relaxed text-muted-dark">
                One clear idea is enough — the working prototype comes over the two build
                weeks. Teams of 3–5 are recommended.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-deck" className="text-label font-medium text-ink">
                Your pitch deck
              </label>
              <label
                htmlFor="register-deck"
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed px-4 py-5 text-center transition-colors hover:border-[#FF84B3] ${
                  errors.deck
                    ? 'border-brand-red/60 bg-brand-red/5'
                    : 'border-line-light bg-mist'
                }`}
              >
                <FileUp aria-hidden="true" className="size-5 text-muted-dark" />
                <span className="text-sm font-medium text-ink">
                  {deckName ?? 'Select your deck — PDF or slides, up to 10 MB'}
                </span>
                <span className="text-xs text-muted-dark">
                  The plan in a few slides: problem, idea, team.
                </span>
                <input
                  id="register-deck"
                  name="deck"
                  type="file"
                  aria-invalid={Boolean(errors.deck)}
                  aria-describedby={errors.deck ? 'register-deck-error' : undefined}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setDeckName(file ? file.name : null);
                  }}
                  className="sr-only"
                />
              </label>
              <p id="register-deck-error" role="alert" className={errorClass}>
                {errors.deck ?? ''}
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-video" className="text-label font-medium text-ink">
                Link to your 60-second video{' '}
                <span className="text-muted-dark">(optional)</span>
              </label>
              <input
                id="register-video"
                name="videoUrl"
                type="url"
                placeholder="https://…"
                aria-invalid={Boolean(errors.videoUrl)}
                aria-describedby={errors.videoUrl ? 'register-video-error' : undefined}
                className={`${fieldClass(Boolean(errors.videoUrl))} h-11`}
              />
              <p id="register-video-error" role="alert" className={errorClass}>
                {errors.videoUrl ?? ''}
              </p>
              <p className="text-xs leading-relaxed text-muted-dark">
                YouTube, Drive, X — any public link the judges can play.
              </p>
            </div>

            <button
              type="submit"
              className="mt-2 flex h-11 w-full items-center justify-center rounded-xs bg-primary px-6 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong sm:col-span-2"
            >
              Submit registration
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
