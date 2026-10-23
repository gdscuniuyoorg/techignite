export interface ExpectContent {
  eyebrow: string;
  title: string;
  highlight: string;
}

export const expectContent: ExpectContent = {
  eyebrow: 'What to expect',
  title:
    'A global stage where students, innovation, and technology come together to build the future, and inspire what’s next.',
  highlight: 'build the future,',
};

export interface ExpectationCardItem {
  title: string;
  description: string;
}

export const expectationItems: readonly ExpectationCardItem[] = [
  {
    title: 'Interactive Workshops',
    description:
      'Join our interactive workshops to learn, connect, and grow with tech experts. Participate in practical sessions on the latest tools, trends, and best practices in the Tech industry.',
  },
  {
    title: 'Learn in-demand Tech skills',
    description:
      "Gain the tech skills that are driving the industry forward. Elevate your career by learning the tools and expertise that employers are looking for in today's fast-paced tech world.",
  },
  {
    title: 'Network with people',
    description:
      'Meet and connect with professionals from various tech fields. Engage with like-minded individuals, exchange ideas, and build lasting collaborations that can drive your career forward.',
  },
  {
    title: 'Discover opportunities',
    description:
      "Your next big career move could start here. Don't miss out on the chance to uncover exciting opportunities and make valuable connections.",
  },
];
