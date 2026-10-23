export type FooterLinkItem =
  | {
      readonly label: string;
      readonly to: '/';
      readonly hash?: string;
      readonly isExternal?: false;
    }
  | {
      readonly label: string;
      readonly href: string;
      readonly isExternal: true;
    };

export interface FooterSocialItem {
  readonly label: string;
  readonly href: string;
  readonly platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
}

export const TICKETS_URL = 'https://tickets.techignite.live';

export const footerTagline =
  'Get your pass today and immerse yourself in a groundbreaking experience where the worlds of art, design, and cutting-edge technology come together to shape the future.';

export const footerCopyright = '® 2026 Tech Ignite All rights reserved.';

export const footerNavLinks: readonly FooterLinkItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/', hash: 'about' },
  { label: 'Agenda', to: '/', hash: 'agenda' },
  { label: 'Speakers', to: '/', hash: 'speakers' },
  {
    label: 'Past Photos',
    href: 'https://photos.app.goo.gl/9y5H4u4u7N5bF3Y38',
    isExternal: true,
  },
];

export const footerSocialLinks: readonly FooterSocialItem[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gdscuniuyo',
    platform: 'linkedin',
  },
  {
    label: 'Twitter (X)',
    href: 'https://www.twitter.com/gdscuniuyo',
    platform: 'twitter',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/gdscuniuyo',
    platform: 'instagram',
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/gdscuniuyo',
    platform: 'facebook',
  },
];
