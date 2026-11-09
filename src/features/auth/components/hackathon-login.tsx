import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LogIn, KeyRound, Trophy } from 'lucide-react';
import { teamErrorMessage } from '@/lib/team-api';

export interface TeamLoginValues {
  readonly teamName: string;
  readonly teamPassword: string;
}

interface HackathonLoginProps {
  /** Signs the team in; rejects with an API error the form renders inline. */
  readonly onSubmit: (values: TeamLoginValues) => Promise<void>;
}

/**
 * Team sign-in for the Tech Ignite hackathon: team name + team password,
 * built on react-hook-form and the shared shadcn-style ui primitives.
 */
export function HackathonLogin({ onSubmit }: HackathonLoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamLoginValues>({
    defaultValues: { teamName: '', teamPassword: '' },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(
        await teamErrorMessage(error, 'Team name or password is incorrect.'),
      );
    }
  });

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink px-4 py-16">
      {/* Brand motifs behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, var(--color-brand-blue) 0, transparent 45%), radial-gradient(circle at 80% 70%, var(--color-brand-green-vivid) 0, transparent 40%)',
        }}
      />

      <Card className="relative w-full max-w-md border-line bg-ink-raised text-paper">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <div>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
              <Trophy size={18} className="text-brand-amber" aria-hidden="true" />
              Team sign in
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-white/60">
              Tech Ignite hackathon. Use the name and password you submitted with.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="team-name" className="text-white/80">
                Team name
              </Label>
              <Input
                id="team-name"
                autoComplete="off"
                placeholder="Session Rockets"
                aria-invalid={errors.teamName !== undefined}
                className="h-11 border-line bg-ink text-paper placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                {...register('teamName', {
                  required: 'Enter your team name.',
                  setValueAs: (value: string) => value.trim(),
                })}
              />
              {errors.teamName && (
                <p role="alert" className="text-xs text-[#ff9d91]">
                  {errors.teamName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="team-password" className="text-white/80">
                Team password
              </Label>
              <div className="relative">
                <Input
                  id="team-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  aria-invalid={errors.teamPassword !== undefined}
                  className="h-11 border-line bg-ink pr-10 text-paper placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
                  {...register('teamPassword', {
                    required: 'Enter your team password.',
                  })}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xs p-1.5 text-white/60 transition-colors hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.teamPassword && (
                <p role="alert" className="text-xs text-[#ff9d91]">
                  {errors.teamPassword.message}
                </p>
              )}
            </div>

            {submitError && (
              <p
                role="alert"
                className="rounded-xs border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-sm text-[#ff9d91]"
              >
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-brand-blue text-white hover:bg-brand-blue-strong disabled:opacity-60"
            >
              <LogIn size={16} strokeWidth={2} aria-hidden="true" />
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <KeyRound size={12} aria-hidden="true" />
              Lost your team password? Contact the organisers at gdscuniuyo@gmail.com.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
