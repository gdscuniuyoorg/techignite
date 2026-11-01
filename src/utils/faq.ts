export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: readonly FaqItem[] = [
  {
    id: 'what-is-tech-ignite',
    question: 'What is Tech Ignite?',
    answer:
      'Tech Ignite is an annual decentralised tech conference hosted by Google Developer Groups (GDG) On-Campus, University of Uyo Chapter. It features keynotes, hands-on workshops, technical sessions, product showcases, and networking opportunities for builders, industry experts, students, and developers of all skill levels.',
  },
  {
    id: 'when-and-where',
    question: "When and where will Tech Ignite '26 take place?",
    answer:
      "Tech Ignite '26 will take place on November 19 (Hackathon screening and Workshop day) at UniPod Building, University of Uyo, Main Campus, and on November 20 (Main conference day) at the 1000-capacity hall, University of Uyo, Main Campus (Perm site).",
  },
  {
    id: 'free-to-attend',
    question: "Is Tech Ignite '26 free to attend?",
    answer:
      "Yes! Tech Ignite '26 is 100% free to attend for all participants. All you need to do is register online to secure your spot.",
  },
  {
    id: 'tech-knowledge',
    question: 'Do I need technical knowledge to attend?',
    answer:
      "No prior technical knowledge is required. Tech Ignite '26 is open to curious students, beginners, designers, and developers at any skill level.",
  },
  {
    id: 'what-to-expect',
    question: "What should I expect at Tech Ignite '26?",
    answer:
      'You will have the opportunity to meet CEOs and top executives from established companies, enjoy games, and learn from engaging speakers and mentors.',
  },
  {
    id: 'code-of-conduct',
    question: 'Is there a Code of Conduct?',
    answer:
      'Yes. GDG On-Campus University of Uyo is dedicated to providing a safe, welcoming, inclusive, and harassment-free experience for everyone. All participants must follow our Code of Conduct at all times.',
  },
  {
    id: 'food-and-refreshments',
    question: 'Will food and refreshments be provided?',
    answer:
      'Yes! Registered participants receive light refreshments and lunch during the conference hours.',
  },
  {
    id: 'recorded-sessions',
    question: 'Will sessions be recorded?',
    answer:
      'Yes, recordings of main sessions and keynotes will be made available to all registered attendees following the conference.',
  },
];
