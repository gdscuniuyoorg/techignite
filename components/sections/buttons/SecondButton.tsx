import React from "react";

interface SecondButtonProps {
  // onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const SecondButton: React.FC<SecondButtonProps> = ({ className = "", children }) => {
  return (
    <button
      className={[
        className,
        "bg-white text-black text-[16px] font-semibold rounded-full p-[10px_16px] focus:outline-none",
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default SecondButton;
