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
  readonly isDummy?: boolean;
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
      'https://www.linkedin.com/in/femialuko/',
    bio: "Femi Aluko is the CEO and co-founder of Chowdeck, Nigeria's number one food delivery app. Under his leadership, Chowdeck has grown into an all-in-one operational platform for Africa's food, grocery, and hospitality sectors, powering logistics, inventory management, payments, and other core operational tools for the industry.\n\nToday, the app serves millions of users, fulfils millions of monthly orders with an average delivery time of 34 minutes, and processes over $100 million in annualized order volume.\n\nPrior to co-founding Chowdeck, Femi was a Principal Engineer at Paystack, where he led the development of the payment infrastructure processing tens of millions of transactions monthly. In 2024, he was awarded the Prize for Technology at The Future Awards Africa in recognition of his contributions to tech innovation across the continent.",
  },
  {
    name: 'Tayo Oviosu',
    role: 'Founder/CEO, Paga',
    image: 'tayo-paga.png',
    width: 832,
    height: 880,
    linkedin: 'https://www.linkedin.com/in/oviosu/',
    bio: "Tayo is the Founder & Group CEO of Paga Group Ltd. He also serves as Executive Chairman of Paga Group Ltd., and Non-Executive Chairman of Pagatech Limited (Paga Nigeria). Tayo has extensive experience in fintech, high-tech, and private equity. Before founding Paga, he was Vice President at Travant Capital Partners and a Manager of Corporate Development at Cisco Systems in California.\n\n\nTayo’s work at Paga has earned global recognition, including CNBC’s Entrepreneur of the Year (West Africa) in 2014 and African Leadership Network’s Outstanding Growing Company Award in 2015. An Endeavor Entrepreneur, he is passionate about supporting startups and co-founded Kairos Angels, an angel investment club.\n\n\nTayo holds a B.S. in Electrical Engineering (cum laude) from USC and an MBA from Stanford University."
  },
  {
    name: 'Isaac Obot',
    role: 'Founder/CEO, Vistapay',
    image: 'isaac-vistapay.jpeg',
    width: 832,
    height: 880,
    linkedin: 'https://www.linkedin.com/in/Isaacobot',
    bio: ""
  },
  {
    name: 'Sodiq Akinjobi',
    role: 'Developer Ecosystem Program Manager, Africa, Google',
    image: 'sodiq-google.jpg',
    width: 832,
    height: 880,
    linkedin: 'https://linkedin.com/in/geektutor',
    bio: "Sodiq Akinjobi is a Program Manager supporting Google Developer Groups across Sub-Saharan Africa — reaching over 200,000 developers annually through events, programs, and community initiatives.\n\n\nA Systems Engineering graduate of the University of Lagos and MBA holder from Quantic School of Business and Technology, Sodiq sits at the intersection of people, programs, and products. Beyond his program management work, he founded API Conference Lagos, organizes DevFest Lagos, and builds products like MorningScroll — a daily tech digest for African builders.\n\n\nHe has spoken at TEDx, participated in Google Cloud Roadshows across African cities, and served as Digital Working Group Lead for DevFest Lagos."
  },
  {
    name: 'Chizoba Okoye',
    role: 'Senior Technical Product Manager, Paga',
    image: 'chizoba-paga.jpeg',
    width: 832,
    height: 880,
    linkedin: 'https://www.linkedin.com/in/okoye-chizoba-anthony',
    bio: "Chizoba Okoye is a Senior Technical Product Manager who seamlessly bridges the gap between engineering and business strategy to build scalable, user-focused solutions. His tech journey began with a Computer Science degree from UNN and a passion for community building at the campus Google Developer Group (GDG). Having navigated both fast-paced startups and structured tech giants, Chizoba brings a highly adaptable, full-picture perspective to software engineering and product development.\n\n\nCurrently at Paga, he drives the technical vision for critical B2B payment infrastructures. Chizoba excels at guiding cross-functional teams through the entire product lifecycle, delivering frictionless digital payment experiences that advance financial inclusion."
  },
  {
    name: 'Saviour Inyang',
    role: 'Senior Product Designer, Cowrywise',
    image: 'saviour-cowrywise.jpg',
    width: 832,
    height: 880,
    linkedin: 'http://linkedin.com/in/saviourrinyang',
    bio: "Saviour Inyang is a Product Designer at Cowrywise with a background in Computer Engineering. He has worked across fintech, enterprise software, and consumer products, contributing to teams at Cowrywise, Interswitch, PressOne Africa, Deimos Cloud, and other organisations.\n\n\nHis experience covers product design, interaction design, design systems, and prototyping. With an interest in the relationship between design and engineering, he also uses code to explore ideas and build interactive experiences.\n\n\nBeyond his professional work, Saviour leads Friends of Figma Uyo and previously served as Design Lead for Cowrywise Ambassadors, where he led a team of designers supporting a student community across Nigeria."
  },
  {
    name: 'Utibe Etim',
    role: 'Organizer, Google Developers Group, Uyo',
    image: 'utibe-gdg.jpg',
    width: 832,
    height: 880,
    linkedin: 'https://www.linkedin.com/in/utibe-etim-0a901a107/',
    bio: "Utibe is an ingenious Software Engineer and Developer Advocate with 7 years of experience in mobile and web development. From co-organizing GDG Uyo to training hundreds of developers, he pairs technical expertise in Java, Kotlin, Flutter, React, React Native with a studious approach to problem-solving. He is a firm believer that tech is accessible to all, and through consistency, nearly anything can be done with code if you can just give it a little more time."
  },
];
