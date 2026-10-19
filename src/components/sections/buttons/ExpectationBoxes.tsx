import type { ReactNode } from 'react';

interface ExpectationBoxesProps {
  children: ReactNode;
  className?: string;
}

const ExpectationBoxes = ({ children, className }: ExpectationBoxesProps) => {
  return (
    <div
      className={`h-auto w-[100%] rounded-[32px] bg-[#D4E4FF]/60 bg-[url('/icons/background.svg')] p-5 ${className ?? ''}`}
    >
      {children}
    </div>
  );
};

export default ExpectationBoxes;
