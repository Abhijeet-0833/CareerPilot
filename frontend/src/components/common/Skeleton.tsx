import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height }) => {
  return (
    <div
      className={`shimmer rounded-xl bg-slate-800/50 border border-white/5 ${className}`}
      style={{ width, height }}
    />
  );
};
