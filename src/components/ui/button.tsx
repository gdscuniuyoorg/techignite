import type { ButtonHTMLAttributes } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button-variants';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

/** shadcn-style button, themed for the light dashboard surface. */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
