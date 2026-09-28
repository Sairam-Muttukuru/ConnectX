import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-purple-500/20 border-t-purple-500 animate-spin`}
      />
      {text && <p className="text-xs font-medium text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
}
