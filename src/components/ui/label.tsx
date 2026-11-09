import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Label({
  className,
  htmlFor,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn('text-sm font-medium text-slate-700', className)}
      {...props}
    >
      {children}
    </label>
  );
}
