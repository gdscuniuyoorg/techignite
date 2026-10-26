import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import type { ComponentType } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import {
  REGISTER_URL,
  footerCopyright,
  footerNavLinks,
  footerSocialLinks,
  footerTagline,
  type FooterSocialItem,
} from '@/utils/footer';

const socialIcons: Record<
  FooterSocialItem['platform'],
  ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
> = {
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

export function Footer() {
  return (
    <footer className="overflow-hidden bg-[#121212] pt-16 text-paper sm:pt-20 lg:pt-24">
      <div className="container">
        {/* Main Footer Row */}
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-16">
          {/* Left: Description, Register Button & Copyright */}
          <div className="flex max-w-md flex-col items-start">
            <p className="text-sm leading-relaxed text-white/70 sm:text-base sm:leading-relaxed">
              {footerTagline}
            </p>

            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex h-11 items-center gap-2 rounded-xs bg-paper px-6 text-button font-normal text-ink shadow-none transition-colors hover:bg-mist sm:mt-7"
            >
              Register Now
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>

            <p className="mt-8 text-xs text-white/50 sm:mt-12 sm:text-sm">
              {footerCopyright}
            </p>
          </div>

          {/* Right: Links & Social Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
            {/* Links */}
            <div>
              <h3 className="text-sm font-normal text-white/50">Links</h3>
              <ul className="mt-4 space-y-3">
                {footerNavLinks.map((link) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 transition-colors hover:text-white sm:text-base"
                      >
                        {link.label}
                      </a>
                    ) : link.hash ? (
                      <Link
                        to={link.to}
                        hash={link.hash}
                        className={`text-sm transition-colors sm:text-base ${
                          link.label === 'Home'
                            ? 'text-white hover:text-brand-blue-soft'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        to={link.to}
                        className={`text-sm transition-colors sm:text-base ${
                          link.label === 'Home'
                            ? 'text-white hover:text-brand-blue-soft'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Link */}
            <div>
              <h3 className="text-sm font-normal text-white/50">Social Link</h3>
              <ul className="mt-4 space-y-3">
                {footerSocialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-white/70 transition-colors hover:text-white sm:text-base"
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0" />
                        <span>{social.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider above watermark */}
        <div className="mt-14 border-t border-line/60 sm:mt-16 lg:mt-20" />

        {/* Massive Display Watermark — past-photos strip inscribed inside the letters */}
        <div className="overflow-hidden text-center">
          <p
            aria-hidden="true"
            className="bg-[url('/past-photos/footer-container.png')] bg-cover bg-clip-text bg-center text-center font-boldonse text-[clamp(4.5rem,15vw,220px)] leading-[clamp(9.5rem,31.8vw,467px)] font-normal tracking-[0px] whitespace-nowrap text-transparent select-none"
          >
            Tech ignite&apos;26
          </p>
        </div>
      </div>
    </footer>
  );
}
