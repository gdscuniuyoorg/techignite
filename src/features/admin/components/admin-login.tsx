import { formText } from '@/lib/form';
import type { SyntheticEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LockKeyhole } from 'lucide-react';
import { login, adminErrorMessage, type AdminSessionUser } from '@/lib/admin-api';

interface AdminLoginProps {
  readonly onAuthenticated: (user: AdminSessionUser) => void;
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        return await login(credentials.email, credentials.password);
      } catch (err) {
        throw new Error(await adminErrorMessage(err), { cause: err });
      }
    },
    onSuccess: onAuthenticated,
  });

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = formText(data, 'email').trim();
    const password = formText(data, 'password');
    if (email && password) {
      mutate({ email, password });
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-md rounded-card border border-line bg-ink-raised p-6 sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img
            src="/icons/logo.png"
            alt=""
            width={80}
            height={80}
            className="h-16 w-16"
          />
          <div>
            <h1 className="text-subheading font-medium text-white">Tech Ignite Admin</h1>
            <p className="mt-1 text-sm text-muted">
              Organiser access only. Sign in with your admin credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-email" className="text-label text-white/80">
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="h-11 rounded-xs border border-line bg-ink px-4 text-paper transition-shadow outline-none placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              placeholder="info@techignite.net"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="admin-password" className="text-label text-white/80">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 rounded-xs border border-line bg-ink px-4 text-paper transition-shadow outline-none placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              placeholder="••••••••••"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xs border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-sm text-[#ff9d91]"
            >
              {error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex h-11 items-center justify-center gap-2 rounded-xs bg-brand-blue text-button text-white transition-colors hover:bg-brand-blue-strong disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockKeyhole size={16} strokeWidth={2} aria-hidden="true" />
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
