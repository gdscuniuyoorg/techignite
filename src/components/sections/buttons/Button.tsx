import type { MouseEvent, ReactNode } from 'react';

interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: ReactNode;
}

const Button = ({ className = '', onClick, children }: ButtonProps) => {
  return (
    <button
      className={[
        className,
        'rounded-full bg-black p-[10px_16px] text-[16px] text-white focus:outline-none',
      ].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
