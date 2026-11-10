import type { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly body: ReactNode;
  readonly confirmLabel: string;
  /** When set, the user must type this exact text before confirming. */
  readonly requireText?: string | undefined;
  readonly confirmValue?: string;
  readonly onConfirmValueChange?: (value: string) => void;
  readonly destructive?: boolean;
  readonly confirming: boolean;
  readonly error?: string | undefined;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

/**
 * Modal confirmation. Uses a native modal <dialog> (showModal via ref
 * callback), so Escape fires `cancel` for free and focus stays trapped. The
 * dimmed backdrop is a real button so clicking it dismisses the dialog.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  requireText,
  confirmValue = '',
  onConfirmValueChange,
  destructive = false,
  confirming,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const textSatisfied = !requireText || confirmValue === requireText;

  return (
    <dialog
      ref={(element) => {
        if (element && !element.open) {
          element.showModal();
        }
      }}
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-0 flex h-full max-h-none w-full max-w-none items-end justify-center border-0 bg-transparent p-4 backdrop:bg-black/60 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative w-full max-w-md rounded-card border border-line bg-ink-raised p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div className="flex items-start gap-3">
          <TriangleAlert
            size={20}
            strokeWidth={2}
            className={
              destructive ? 'mt-0.5 text-brand-amber' : 'mt-0.5 text-brand-blue-soft'
            }
            aria-hidden="true"
          />
          <div>
            <h2
              id="confirm-dialog-title"
              className="text-subheading font-medium text-white"
            >
              {title}
            </h2>
            <div className="mt-2 text-sm leading-relaxed text-white/75">{body}</div>
          </div>
        </div>

        {requireText && (
          <label className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            Type <span className="font-mono text-white">{requireText}</span> to confirm
            <input
              value={confirmValue}
              onChange={(event) => onConfirmValueChange?.(event.target.value)}
              className="h-11 rounded-xs border border-line bg-ink px-4 font-mono text-paper outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xs border border-brand-red/40 bg-brand-red/10 px-3 py-2 text-sm text-white/80"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="flex h-11 items-center justify-center rounded-xs border border-line bg-ink px-5 text-button text-white/80 transition-colors hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming || !textSatisfied}
            className={`flex h-11 items-center justify-center rounded-xs px-5 text-button text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              destructive
                ? 'bg-brand-red hover:bg-[#c93a2f]'
                : 'bg-brand-blue hover:bg-brand-blue-strong'
            }`}
          >
            {confirming ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
