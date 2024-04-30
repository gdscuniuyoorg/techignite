import React from "react";

interface ButtonProps {
  // onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className = "", children }) => {
  return (
    <button
      className={[className, "bg-black text-white text-[16px] rounded-full p-[10px_16px] focus:outline-none"].join(" ")}
    >
      {children}
    </button>
  );
};

export default Button;
