import React from 'react';

export const StatusBar = ({ theme = 'dark', className = '' }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-gray-900' : 'text-white';
  const fillColor = isDark ? '#111827' : '#FFFFFF';

  return (
    <div
      className={`w-full flex items-center justify-between px-7 pt-3 pb-2 text-[14px] font-semibold tracking-tight select-none ${textColor} ${className}`}
    >
      <span className="font-semibold text-[14px] tracking-tight">9:41</span>

      <div className="flex items-center gap-1.5">
        {/* Cellular 4 bars */}
        <svg className="w-4 h-3.5" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.8" fill={fillColor} />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill={fillColor} />
          <rect x="9" y="3" width="3" height="9" rx="0.8" fill={fillColor} />
          <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.8" fill={fillColor} />
        </svg>

        {/* Wifi Icon */}
        <svg className="w-4 h-3.5" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 11.5C8.82843 11.5 9.5 10.8284 9.5 10C9.5 9.17157 8.82843 8.5 8 8.5C7.17157 8.5 6.5 9.17157 6.5 10C6.5 10.8284 7.17157 11.5 8 11.5Z"
            fill={fillColor}
          />
          <path
            d="M4.6 6.8C5.55 5.85 6.75 5.3 8 5.3C9.25 5.3 10.45 5.85 11.4 6.8L12.5 5.7C11.3 4.5 9.7 3.8 8 3.8C6.3 3.8 4.7 4.5 3.5 5.7L4.6 6.8Z"
            fill={fillColor}
          />
          <path
            d="M2.2 4.4C3.75 2.85 5.8 2 8 2C10.2 2 12.25 2.85 13.8 4.4L14.9 3.3C13.05 1.45 10.6 0.5 8 0.5C5.4 0.5 2.95 1.45 1.1 3.3L2.2 4.4Z"
            fill={fillColor}
          />
        </svg>

        {/* Battery */}
        <div className="flex items-center">
          <div
            className={`w-[22px] h-[11px] rounded-[3px] border px-[1.5px] py-[1.5px] flex items-center ${
              isDark ? 'border-gray-900' : 'border-white'
            }`}
          >
            <div className={`w-full h-full rounded-[1px] ${isDark ? 'bg-gray-900' : 'bg-white'}`} />
          </div>
          <div
            className={`w-[1px] h-[4px] rounded-r-[1px] ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          />
        </div>
      </div>
    </div>
  );
};

