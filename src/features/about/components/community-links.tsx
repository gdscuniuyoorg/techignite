import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { ArrowUpRight, Image as ImageIcon, Mail, Ticket } from 'lucide-react';
import type { ComponentType } from 'react';
import { footerSocialLinks } from '@/utils/footer';
import { communityExtraLinks } from '@/utils/about';
import {
  dotPop,
  slideInRight,
  springUp,
  staggerContainer,
  useScrollGate,
} from '@/lib/motion';

type PlatformIcon = ComponentType<{ className?: string }>;

const socialIcons: Record<string, PlatformIcon> = {
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebook,
};

const extraIcons: Record<string, PlatformIcon> = {
  'Past Photos': ImageIcon,
  'Get Tickets': Ticket,
  'Email Us': Mail,
};

interface LinkRow {
  readonly label: string;
  readonly href: string;
  readonly Icon: PlatformIcon;
}

const linkRows: readonly LinkRow[] = [
  ...footerSocialLinks.map((social) => ({
    label: social.label,
    href: social.href,
    Icon: socialIcons[social.platform] ?? FaLinkedin,
  })),
  ...communityExtraLinks.map((link) => ({
    label: link.label,
    href: link.href,
    Icon: extraIcons[link.label] ?? ArrowUpRight,
  })),
];

export function CommunityLinks() {
  const userScrolled = useScrollGate();

  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="border-t border-line bg-ink py-20 text-paper sm:py-24"
    >
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView={userScrolled ? 'visible' : 'hidden'}
        viewport={{ once: false, amount: 0.2 }}
        className="container"
      >
        <div className="border-t border-line pt-10 sm:pt-14">
          <motion.p
            variants={slideInRight}
            className="flex items-center gap-2 text-eyebrow font-normal text-paper uppercase"
          >
            <motion.span
              variants={dotPop}
              aria-hidden="true"
              className="size-2 bg-brand-green-bright"
            />
            Our Socials & Community
          </motion.p>

          <motion.h2
            variants={slideInRight}
            id="community-title"
            className="mt-6 max-w-[60rem] text-heading font-bold text-paper"
          >
            Find Us{' '}
            <span className="bg-brand-green-bright px-1.5 text-ink">Everywhere</span>
          </motion.h2>

          <ul className="mt-12 border-t border-line">
            {linkRows.map((row) => (
              <motion.li
                key={row.label}
                variants={springUp}
                className="border-b border-line"
              >
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-5 transition-colors sm:py-6"
                >
                  <span className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-10 items-center justify-center rounded-xs bg-ink-raised text-paper transition-colors group-hover:bg-ink-soft"
                    >
                      <row.Icon className="size-4.5" />
                    </span>
                    <span className="text-lg text-white/70 transition-colors group-hover:text-brand-blue-soft sm:text-xl">
                      {row.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-white/40 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brand-blue-soft"
                  />
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
