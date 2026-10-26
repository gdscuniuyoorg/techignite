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
