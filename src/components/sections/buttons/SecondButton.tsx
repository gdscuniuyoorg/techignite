import React from 'react';

interface SecondButtonProps {
  // onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const SecondButton: React.FC<SecondButtonProps> = ({ className = '', children }) => {
  return (
    <button
      className={[
        className,
        'rounded-full bg-white p-[10px_16px] text-[16px] font-semibold text-black focus:outline-none',
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export default SecondButton;
