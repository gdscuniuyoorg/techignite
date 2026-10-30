/** Speaking applications inbox for Tech Ignite '26. */
const SPEAKER_EMAIL = 'gdscuniuyo@gmail.com';

const subject = encodeURIComponent("Become a Speaker — Tech Ignite '26");

const body = encodeURIComponent(
  "Hi Tech Ignite team,\n\nI'd like to speak at Tech Ignite '26.\n\nName:\nRole / Organization:\nTalk idea:\n\n",
);

/** Pre-filled mailto link the "Become a Speaker" button opens. */
export const SPEAKER_MAILTO = `mailto:${SPEAKER_EMAIL}?subject=${subject}&body=${body}`;

const sponsorSubject = encodeURIComponent("Sponsor Tech Ignite '26");

const sponsorBody = encodeURIComponent(
  "Hi Tech Ignite team,\n\nI'd like to sponsor Tech Ignite '26.\n\nCompany / Organization:\nSponsorship tier of interest:\nContact:\n\n",
);

/** Pre-filled mailto link the "Become a Sponsor" button opens. */
export const SPONSOR_MAILTO = `mailto:${SPEAKER_EMAIL}?subject=${sponsorSubject}&body=${sponsorBody}`;

export interface LineupSpeaker {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  readonly width: number;
  readonly height: number;
  readonly linkedin?: string;
  readonly bio?: string;
}

/** Keynote lineup shown in the "Our Speaker Lineup" carousel. Source data is
 * shared with the /speakers page so both stay in sync. */
export const lineupSpeakers: readonly LineupSpeaker[] = [
  {
    name: 'Femi Aluko',
    role: 'Founder/CEO, Chowdeck',
    image: 'femi-chowdeck.jpg',
    width: 675,
    height: 816,
    linkedin:
      'https://www.linkedin.com/in/femialuko?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    bio: "Femi Aluko is the CEO and co-founder of Chowdeck, Nigeria's number one food delivery app. Under his leadership, Chowdeck has grown into an all-in-one operational platform for Africa's food, grocery, and hospitality sectors, powering logistics, inventory management, payments, and other core operational tools for the industry.\n\nToday, the app serves millions of users, fulfils millions of monthly orders with an average delivery time of 34 minutes, and processes over $100 million in annualized order volume.\n\nPrior to co-founding Chowdeck, Femi was a Principal Engineer at Paystack, where he led the development of the payment infrastructure processing tens of millions of transactions monthly. In 2024, he was awarded the Prize for Technology at The Future Awards Africa in recognition of his contributions to tech innovation across the continent.",
  },
  {
    name: 'Diego Costa',
    role: 'Founder, MotionFlow',
    image: 'portrait-02.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Niyi Okeowo',
    role: 'Creative Director, Kuda',
    image: 'portrait-03.jpg',
    width: 861,
    height: 1024,
  },
  {
    name: 'Ted Oladele',
    role: 'Head of Product, Chowdeck',
    image: 'portrait-04.jpg',
    width: 882,
    height: 1024,
  },
  {
    name: 'Evana Eko (Razzo)',
    role: 'Senior Brand Designer',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Daniel Ife',
    role: 'Designer | Canvassador',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Wilfred Alfred',
    role: 'Head of Business Development',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Kachi Kalu',
    role: 'Senior Product Designer',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
  {
    name: 'Samuel Lasisi',
    role: 'Founder, Conectr',
    image: 'portrait-05.jpg',
    width: 832,
    height: 880,
  },
];
