import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Speakers', hash: '/speakers' },
  { label: 'Hackathon', hash: '/hackathon' },
  { label: 'Agenda', hash: '/agenda' },
] as const;

const TICKETS_URL = 'https://tickets.techignite.live';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-x-0 border-t-0 transition-all duration-300 outline-none ${
        isScrolled
          ? 'border-b border-line/60 bg-ink/75 shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-md'
          : 'border-b border-transparent bg-ink'
      }`}
    >
      <div className="relative z-20 container flex h-20 items-center justify-between gap-4 sm:h-24">
        {/* Brand lockup */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-4"
          aria-label="Tech Ignite '26 — home"
        >
          <picture>
            <source media="(min-width: 640px)" srcSet="/icons/logo.png" />
            <img
              src="/icons/banner.png"
              alt="Tech Ignite '26 — Google Developer Student Clubs, University of Uyo"
              width={800}
              height={213}
              className="h-6 w-auto sm:h-8 lg:h-9"
            />
          </picture>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="max-lg:hidden">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.hash}>
                <Link
                  to={link.hash}
                  className="text-label font-normal text-white transition-colors hover:text-brand-blue-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/"
            hash="sponsors"
            className="hidden h-11 items-center rounded-xs bg-primary-foreground px-6 text-button font-normal whitespace-nowrap text-ink shadow-none transition-colors hover:bg-mist lg:flex"
          >
            Sponsor
          </Link>
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-xs bg-primary px-3 text-button font-normal whitespace-nowrap text-primary-foreground shadow-none transition-colors hover:bg-brand-blue-strong sm:px-4"
          >
            Register Now
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
            }}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex size-11 items-center justify-center rounded-md border border-line bg-surface text-primary-foreground transition-colors hover:bg-surface-raised lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute inset-x-0 top-0 h-0.5 bg-paper transition-transform ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-paper transition-transform ${menuOpen ? '-translate-y-1 -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Primary"
          className="relative z-20 border-b border-line/60 bg-ink/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="container space-y-1 border-t border-line pt-2 pb-6">
            {navLinks.map((link) => (
              <li key={link.hash}>
                <Link
                  to="/"
                  hash={link.hash}
                  onClick={closeMenu}
                  className="block rounded-xs px-3 py-3 text-label font-normal text-foreground transition-colors hover:bg-surface"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/"
                hash="sponsors"
                onClick={closeMenu}
                className="block rounded-xs px-3 py-3 text-label font-normal text-foreground transition-colors hover:bg-surface"
              >
                Sponsor
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
