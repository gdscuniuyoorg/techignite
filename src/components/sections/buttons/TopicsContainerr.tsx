import React from 'react';

interface TopicsContainerProps {
  children: React.ReactNode;
  className?: string; // Corrected attribute name to className
}

const TopicsContainer: React.FC<TopicsContainerProps> = ({ children, className }) => {
  const containerClass = className ? `pl-4 ${className}` : '';

  return (
    <div className={`rounded-3xl bg-[#AD8100] p-3 ${containerClass}`}>{children}</div>
  );
};

export default TopicsContainer;
