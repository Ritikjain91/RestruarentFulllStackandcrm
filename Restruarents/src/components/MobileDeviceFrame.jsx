import React from 'react';

export const MobileDeviceFrame = ({
  children,
  label,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Header title for multi-screen view */}
      {label && (
        <div className="mb-2.5 flex items-center gap-2">
          <span className="text-[13px] font-semibold text-gray-700 tracking-tight">
            {label}
          </span>
          {badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#FA5A2A]">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Device Outer Chassis */}
      <div className="relative w-[360px] sm:w-[375px] h-[760px] bg-black rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
        {/* Device Side Buttons */}
        <div className="absolute -left-[12px] top-[105px] w-[3px] h-[26px] bg-gray-600 rounded-l-sm" />
        <div className="absolute -left-[12px] top-[145px] w-[3px] h-[48px] bg-gray-600 rounded-l-sm" />
        <div className="absolute -left-[12px] top-[205px] w-[3px] h-[48px] bg-gray-600 rounded-l-sm" />
        <div className="absolute -right-[12px] top-[160px] w-[3px] h-[64px] bg-gray-600 rounded-r-sm" />

        {/* Screen Display Area */}
        <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col relative shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

