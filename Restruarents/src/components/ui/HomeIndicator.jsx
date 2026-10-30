import React from 'react';

export const HomeIndicator = ({ className = '', theme = 'dark' }) => {
  return (
    <div className={`w-full flex justify-center py-2.5 ${className}`}>
      <div
        className={`w-32 h-1 rounded-full ${
          theme === 'dark' ? 'bg-black/90' : 'bg-white/80'
        }`}
      />
    </div>
  );
};

