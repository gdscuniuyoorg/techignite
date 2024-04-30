import React from "react";

interface TopicsContainerProps {
  children: React.ReactNode;
  className?: string; // Corrected attribute name to className
}

const TopicsContainer: React.FC<TopicsContainerProps> = ({
  children,
  className,
}) => {
  // Conditionally apply the padding class based on the className prop
  const containerClass = className ? `pl-4 ${className}` : "";

  return (
    <div className={`bg-[#AD8100] rounded-3xl p-3 ${containerClass}`}>
      {children}
    </div>
  );
};

export default TopicsContainer;
