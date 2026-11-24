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
    question: "When and where did Tech Ignite '26 take place?",
    answer:
      "Tech Ignite '26 was successfully held across two days. The hackathon screening and workshop took place on 19 November at the UniPod Building, University of Uyo Main Campus. The main conference followed on 20 November at the hall with seating for 1,000 on the same campus.",
  },
  {
    id: 'free-to-attend',
    question: "Was Tech Ignite '26 free to attend?",
    answer: "Yes. Tech Ignite '26 was free for every registered participant.",
  },
  {
    id: 'tech-knowledge',
    question: 'Did attendees need prior technical knowledge?',
    answer:
      "No prior technical knowledge was required. Tech Ignite '26 welcomed curious students, beginners, designers, and developers at every skill level.",
  },
  {
    id: 'what-to-expect',
    question: "What happened at Tech Ignite '26?",
    answer:
      'Attendees met industry leaders, learned from engaging speakers and mentors, explored new ideas, and joined games and community activities.',
  },
  {
    id: 'code-of-conduct',
    question: 'Did the event have a Code of Conduct?',
    answer:
      'Yes. GDG On Campus University of Uyo provided a safe, welcoming, inclusive, and harassment free experience, with every participant expected to follow the Code of Conduct.',
  },
  {
    id: 'food-and-refreshments',
    question: 'Were food and refreshments provided?',
    answer: 'Yes. Registered participants received light refreshments and lunch.',
  },
  {
    id: 'event-highlights',
    question: "Where can I revisit Tech Ignite '26?",
    answer:
      'Photos and highlights from the event are available on the Memories and Hackathon pages.',
  },
];
