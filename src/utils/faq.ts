export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: readonly FaqItem[] = [
  {
    id: 'vip-seating',
    question: 'VIP seating at main sessions and panel discussions.',
    answer:
      'The event will be held at the Jakarta Convention Center, with hybrid access for online participants.',
  },
  {
    id: 'recorded-sessions',
    question: 'Will sessions be recorded?',
    answer:
      'Yes, recordings of main sessions and keynotes will be made available to all registered attendees following the conference.',
  },
  {
    id: 'speaker-count',
    question: 'How many speakers would we have',
    answer:
      'We have 20+ global innovators, community builders, and industry leaders joining us to share insights and practical workshops.',
  },
  {
    id: 'tech-knowledge',
    question: 'Do I need technical knowledge to attend?',
    answer:
      'No prior technical knowledge is required. Tech Ignite is open to curious students, beginners, designers, and developers at any skill level.',
  },
  {
    id: 'online-access',
    question: 'How do I access the online sessions?',
    answer:
      'Registered virtual attendees will receive direct stream links, schedule reminders, and platform access instructions via email.',
  },
];
