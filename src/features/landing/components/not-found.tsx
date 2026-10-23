import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <section
      id="not-found"
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-ink px-6 text-paper"
    >
      <div className="relative mx-auto w-full max-w-[600px] text-center">
        {/* Google-style illustration: friendly robot looking at a broken path */}
        <svg
          aria-hidden="true"
          className="mx-auto mb-10 h-72 w-72"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle cx="100" cy="100" r="80" fill="#171717" />

          {/* Robot head - blue */}
          <rect x="55" y="40" width="90" height="50" rx="14" fill="#4285F4" />
          {/* Robot eyes */}
          <circle cx="80" cy="60" r="6" fill="#DB4437" />
          <circle cx="120" cy="60" r="6" fill="#DB4437" />
          <circle cx="80" cy="60" r="2" fill="white" />
          <circle cx="120" cy="60" r="2" fill="white" />
          {/* Robot mouth - confused */}
          <path
            d="M80 80 Q100 85 120 80"
            stroke="#DB4437"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Robot body - green */}
          <rect x="75" y="100" width="50" height="45" rx="12" fill="#0F9D58" />
          {/* Robot arms */}
          <rect x="58" y="105" width="14" height="35" rx="7" fill="#0F9D58" />
          <rect x="128" y="105" width="14" height="35" rx="7" fill="#0F9D58" />

          {/* Map/paper behind robot - yellow */}
          <rect
            x="30"
            y="135"
            width="140"
            height="45"
            rx="10"
            fill="#F4B400"
            opacity="[0.15]"
          />
          <rect x="35" y="145" width="40" height="8" rx="4" fill="#F4B400" />
          <rect x="85" y="145" width="30" height="8" rx="4" fill="#F4B400" />
          <rect x="125" y="145" width="35" height="8" rx="4" fill="#F4B400" />

          {/* Broken path line */}
          <path
            d="M45 165 Q100 145 155 165"
            stroke="#DB4437"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <h1
          id="not-found-title"
          className="text-stat font-normal tracking-[-0.04em] text-brand-blue"
        >
          404
        </h1>
        <h2 className="mt-6 text-heading font-normal text-paper">Not Found</h2>
        <p className="mt-4 max-w-[40rem] text-label leading-relaxed text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist. Head back to the
          homepage.
        </p>

        <Link
          to="/"
          className="mt-10 flex h-11 items-center justify-center gap-2 rounded-xs bg-primary px-8 text-button font-normal text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong"
        >
          Take me home
        </Link>
      </div>
    </section>
  );
}
