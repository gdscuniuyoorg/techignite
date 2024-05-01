import React, { FC, MouseEvent, ReactNode } from 'react';

interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  onClick,
  children
}) => {
  return (
    <button
      className={[
        className,
        'bg-black text-white text-[16px] rounded-full p-[10px_16px] focus:outline-none'
      ].join(' ')}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
