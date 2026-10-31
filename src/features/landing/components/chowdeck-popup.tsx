import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

const CHOWDECK_LOGO = '/images/sponsors/chowdeck-sponsor.png';

/** The sponsor artwork ships black-on-transparent; invert it to white so it
 * reads on the ink canvas used by the popup and the side dock. */
const WHITE_LOGO = 'brightness-0 invert';

const popupVariants: Variants = {
  hidden: { y: 120, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 28 },
  },
  exit: {
    y: 40,
    opacity: 0,
    transition: { duration: 0.35, ease: 'easeIn' },
  },
};

/** The dock drifts in from off-screen and settles against the right edge. */
const dockVariants: Variants = {
  hidden: { x: 140, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 180, damping: 24 },
  },
  exit: { x: 140, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

/** Gentle idle float so the docked mark feels alive without distracting. */
const driftVariants: Variants = {
  rest: { y: 0 },
  drift: {
    y: [0, -10, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
};

const POPUP_MS = 6000;

/**
 * Chowdeck co-branding notice.
 *
 * Announces that the event is **GDG × Chowdeck**, then after 6s (or on
 * dismiss) the card retreats and hands off to a white Chowdeck mark docked to
 * the right edge of the viewport, which drifts gently in place so the
 * partnership stays visible while browsing. Honours reduced-motion by skipping
 * every animation and showing the dock immediately.
 */
export function ChowdeckPopup() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [showPopup, setShowPopup] = React.useState(true);
  const [showDock, setShowDock] = React.useState(false);
  const [dockedDismissed, setDockedDismissed] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
      setTimeout(() => {
        setShowDock(true);
      }, 300);
    }, POPUP_MS);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    setTimeout(() => {
      setShowDock(true);
    }, 300);
  };

  const dismissDock = () => {
    setDockedDismissed(true);
  };

  return (
    <AnimatePresence initial={false}>
      {showPopup && (
        <motion.aside
          key="popup"
          role="status"
          aria-live="polite"
          aria-label="Event partnership announcement"
          variants={popupVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          exit="exit"
          className="fixed right-4 bottom-4 z-50 flex w-[min(26rem,calc(100vw-2rem))] items-center gap-4 rounded-xl border border-line bg-ink-raised px-5 py-5 text-paper shadow-[0_20px_40px_-10px_rgba(5,5,5,0.6)] sm:right-6 sm:bottom-6"
        >
          <img
            src={CHOWDECK_LOGO}
            alt=""
            width={201}
            height={74}
            decoding="async"
            className={`h-10 w-auto shrink-0 object-contain ${WHITE_LOGO}`}
          />

          <div className="min-w-0 text-[15px] leading-tight">
            <p className="text-muted">This event is</p>
            <p className="text-base font-bold">
              GDG <span aria-hidden="true">×</span>
              <span className="sr-only">x</span> Chowdeck
            </p>
          </div>

          <button
            type="button"
            onClick={dismissPopup}
            className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-soft text-muted transition-colors hover:text-paper"
          >
            <span className="sr-only">Dismiss announcement</span>
            <X aria-hidden="true" className="size-5" />
          </button>
        </motion.aside>
      )}

      {showDock && !dockedDismissed && (
        <motion.aside
          key="dock"
          aria-label="GDG x Chowdeck"
          variants={dockVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          exit="exit"
          className="fixed top-1/2 right-0 z-50 -translate-y-1/2"
        >
          <motion.div
            variants={driftVariants}
            initial={shouldReduceMotion ? 'rest' : 'rest'}
            animate={shouldReduceMotion ? 'rest' : 'drift'}
            className="relative flex flex-col items-center gap-4 rounded-l-full border border-r-0 border-line bg-ink-raised px-3 py-5 shadow-[0_10px_30px_-8px_rgba(5,5,5,0.6)]"
          >
            <img
              src={CHOWDECK_LOGO}
              alt=""
              width={201}
              height={74}
              decoding="async"
              className={`h-4 w-auto shrink-0 object-contain ${WHITE_LOGO}`}
            />

            <span
              className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase"
              style={{ writingMode: 'vertical-rl' }}
            >
              GDG <span aria-hidden="true">×</span>
              <span className="sr-only">x</span> Chowdeck
            </span>

            <button
              type="button"
              onClick={dismissDock}
              className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-paper"
            >
              <span className="sr-only">Hide partnership mark</span>
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
