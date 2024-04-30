import React from "react";

interface ButtonProps {
  // onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className = "", children }) => {
  return (
    <button
      // onClick={onClick}
      className={
        "bg-black text-white text-[16px] rounded-full p-3 focus:outline-none"
      }
    >
      {children}
    </button>
  );
};

export default Button;
