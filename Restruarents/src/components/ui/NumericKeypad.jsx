import React from 'react';
import { Delete } from 'lucide-react';

const KEYS = [
  { digit: '1', sub: '' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '', type: 'empty' },
  { digit: '0', sub: '' },
  { digit: 'del', type: 'backspace' },
];

export const NumericKeypad = ({ onDigitPress, onBackspace, className = '' }) => {
  return (
    <div className={`w-full bg-[#E4E6EA]/90 backdrop-blur-md px-3 pt-3 pb-4 ${className}`}>
      <div className="grid grid-cols-3 gap-2 max-w-[340px] mx-auto">
        {KEYS.map((key, index) => {
          if (key.type === 'empty') {
            return <div key={`empty-${index}`} className="h-12" />;
          }

          if (key.type === 'backspace') {
            return (
              <button
                key="backspace"
                type="button"
                onClick={onBackspace}
                aria-label="Delete"
                className="h-12 flex items-center justify-center rounded-[6px] transition-all active:bg-gray-300 active:scale-95 text-gray-800"
              >
                <div className="relative flex items-center justify-center">
                  <Delete className="w-6 h-6 stroke-[1.75]" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={key.digit}
              type="button"
              onClick={() => onDigitPress(key.digit)}
              className="h-12 bg-white rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center active:bg-[#D1D5DB] active:scale-98 transition-all"
            >
              <span className="text-[22px] font-normal leading-tight text-gray-900">
                {key.digit}
              </span>
              {key.sub ? (
                <span className="text-[9px] tracking-widest font-semibold text-gray-500 uppercase -mt-0.5">
                  {key.sub}
                </span>
              ) : (
                <span className="h-[9px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

