/**
 * Content for the /about page. Links reuse the handles and URLs already
 * committed across the site (footer socials, past-photos album, tickets).
 */

export interface AboutParagraph {
  readonly text: string;
}

export const aboutUsParagraphs: readonly AboutParagraph[] = [
  {
    text: 'Tech Ignite is the annual flagship event of Google Developer Student Clubs, University of Uyo (GDSC UNIUYO). Every year it brings students, developers, designers, and dreamers together for hackathons, keynotes, and hands-on learning on campus.',
  },
  {
    text: 'More than a conference, Tech Ignite is a launchpad — a place where ideas find teammates, skills find direction, and the community finds its people.',
  },
];

export interface WhatWeDoItem {
  readonly title: string;
  readonly description: string;
}

export const whatWeDoItems: readonly WhatWeDoItem[] = [
  {
    title: 'Hackathons',
    description:
      'Real problems, real deadlines, real prizes. Team up, build fast, and ship a working solution — then defend it live on the main stage.',
  },
  {
    title: 'Keynotes & Sessions',
    description:
      'Learn from engineers, founders, and creative directors shaping products at companies like Kuda, Chowdeck, and MotionFlow.',
  },
  {
    title: 'Workshops & Demos',
    description:
      'Get hands-on with the tools of the trade — from AI tooling to product design — guided by people who use them every day.',
  },
  {
    title: 'Community',
    description:
      'Meet the people who will push you further: students, mentors, and organizers building the next generation of Nigerian tech.',
  },
];

export interface OrganizerPanel {
  readonly title: string;
  readonly description: string;
}

export const organizerPanels: readonly OrganizerPanel[] = [
  {
    title: 'GDSC UNIUYO',
    description:
      'Google Developer Student Clubs, University of Uyo — a student-led community helping peers grow as developers, designers, and leaders, powered by Google Developers.',
  },
  {
    title: 'GDG Uyo',
    description:
      "Google Developer Groups Uyo — the professional chapter that mentors, hosts, and co-builds Uyo's tech ecosystem alongside the student community.",
  },
];

export interface CommunityLink {
  readonly label: string;
  readonly href: string;
}

export const communityExtraLinks: readonly CommunityLink[] = [
  {
    label: 'Past Photos',
    href: 'https://photos.app.goo.gl/9y5H4u4u7N5bF3Y38',
  },
  {
    label: 'Get Tickets',
    href: 'https://tickets.techignite.live',
  },
  {
    label: 'Email Us',
    href: 'mailto:gdscuniuyo@gmail.com',
  },
];
