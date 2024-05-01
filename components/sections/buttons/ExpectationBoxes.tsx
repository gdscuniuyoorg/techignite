import React from "react";

interface ExpectationBoxesProps {
  children: React.ReactNode;
  className?: string; // Corrected attribute name to className
}

const ExpectationBoxes: React.FC<ExpectationBoxesProps> = ({
  children,
  className,
}) => {
  const containerClass = className ? `pl-4 ${className}` : "";

  return (
    <div
      className={`bg-[#D4E4FF]/60 bg-expectationsPattern w-[100%] h-[295px] rounded-[32px] p-5 ${className}`}
    >
      {children}
    </div>
  );
};

export default ExpectationBoxes;
