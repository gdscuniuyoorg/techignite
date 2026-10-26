import { useEffect, useState } from 'react';
import { stagger, type Transition, type Variants } from 'framer-motion';

/**
 * Shared Framer Motion primitives for the Tech Ignite pages.
 * Keep every section's animations rooted here so timing stays consistent.
 * Pacing is deliberately slow and cinematic — 1s+ settles, deep staggers.
 */

/**
 * Returns `true` only after the user has actually scrolled the page.
 * Use it to gate `whileInView` animations so a reload mid-page never
 * auto-plays them — motion only begins once the user takes over.
 */
export function useScrollGate(): boolean {
  const [userScrolled, setUserScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setUserScrolled(true);
    };
    window.addEventListener('scroll', onScroll, { once: true, passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return userScrolled;
}

/** Expo-out easing — fast start, long luxurious settle. */
export const EASE_OUT_EXPO: Transition = {
  duration: 1.1,
  ease: [0.16, 1, 0.3, 1],
};

/** Heavy, unhurried spring — lands like a stage prop, no wobble. */
export const SPRING_POP: Transition = {
  type: 'spring',
  stiffness: 170,
  damping: 26,
  mass: 1.1,
};

/** Parent that staggers its children as they enter the viewport. */
export const staggerContainer = (interval = 0.18, startDelay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: stagger(interval, { startDelay }) },
  },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT_EXPO },
};

/** Rise + defocus — elements come into focus as they settle. */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: EASE_OUT_EXPO },
};

/** Springy rise — used for cards that should feel like they land. */
export const springUp: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: SPRING_POP },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -72 },
  visible: { opacity: 1, x: 0, transition: EASE_OUT_EXPO },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 72 },
  visible: { opacity: 1, x: 0, transition: EASE_OUT_EXPO },
};

/** Reveal an element downward from its top edge (clip grows to full). */
export const clipRevealDown: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Reveal an element upward from its bottom edge (clip grows to full). */
export const clipRevealUp: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Masked word reveal — pair with an `overflow-hidden` wrapper span. */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};

/** Small accent element that pops into place (bullets, badges). */
export const dotPop: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { ...SPRING_POP, delay: 0.5 } },
};

/**
 * Image focus pull — starts slightly zoomed and defocused, then settles
 * into place. Pair with an `overflow-hidden` wrapper so the zoom stays
 * cropped; add `whileHover` for a lingering scale-up on inspection.
 */
export const imageSettle: Variants = {
  hidden: { scale: 1.18, filter: 'blur(8px)' },
  visible: {
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Tumbling drop — the element falls like a stick tipping over and rocks as
 * it settles. Pass `custom={index}`: even cards lean left, odd lean right,
 * so a row looks like dominoes knocking into place.
 */
export const tumbleDrop: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    y: -110,
    rotate: index % 2 === 0 ? -14 : 14,
    transformOrigin: 'bottom center',
  }),
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 150, damping: 13, mass: 1.2 },
  },
};
