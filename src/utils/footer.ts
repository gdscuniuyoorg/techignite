export type FooterLinkItem =
  | {
      readonly label: string;
      /** Internal route. Standalone pages link directly; sections still hosted
       * on the home page use `'/'` together with `hash`. */
      readonly to: '/' | '/about' | '/speakers' | '/memories' | '/organizers';
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
  readonly platform: 'linkedin' | 'twitter' | 'facebook';
}

/** Official registration page for Tech Ignite '26 (GDG community events). */
export const REGISTER_URL =
  'https://gdg.community.dev/events/details/google-gdg-on-campus-university-of-uyo-uyo-nigeria-presents-tech-ignite-26/';

export const footerTagline =
  "Tech Ignite '26 has wrapped — relive the talks, builds, and community moments from the GDGOC UNIUYO flagship event at the University of Uyo.";

export const footerCopyright = '® 2026 Tech Ignite All rights reserved.';

export const footerNavLinks: readonly FooterLinkItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Speakers', to: '/speakers' },
  { label: 'Memories', to: '/memories' },
  { label: 'Organizers', to: '/organizers' },
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
    href: 'https://x.com/gdgocuniuyo',
    platform: 'twitter',
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/gdscuniuyo',
    platform: 'facebook',
  },
];
