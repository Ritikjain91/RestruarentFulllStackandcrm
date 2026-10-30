import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { StatusBar } from '@/components/ui/StatusBar';
import { NumericKeypad } from '@/components/ui/NumericKeypad';
import { HomeIndicator } from '@/components/ui/HomeIndicator';

export const OtpVerificationScreen = ({
  phoneNumber = '+91 12345 67890',
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Timer countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleDigit = (digit) => {
    if (otp.length < 6) {
      const nextOtp = otp + digit;
      setOtp(nextOtp);
      // Auto-submit when 6th digit entered
      if (nextOtp.length === 6) {
        setTimeout(() => {
          onSuccess();
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    setOtp((prev) => prev.slice(0, -1));
  };

  const handleResend = () => {
    setSecondsLeft(30);
    setOtp('');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Header & Content */}
      <div>
        <StatusBar theme="dark" />

        <div className="px-6 pt-2 pb-4">
          {/* Back Arrow */}
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 -ml-1.5 flex items-center justify-center text-[#FA5A2A] hover:opacity-80 transition-opacity"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Heading */}
          <h1 className="mt-5 text-[26px] font-bold text-gray-900 tracking-tight leading-snug">
            6-digit code
          </h1>

          {/* Subtitle with Phone Number */}
          <p className="mt-2 text-[14px] text-gray-500 leading-relaxed">
            Please enter the code we&apos;ve sent to
            <br />
            <span className="font-semibold text-gray-800">
              {phoneNumber.startsWith('+91') ? phoneNumber : `+91 ${phoneNumber}`}
            </span>
          </p>

          {/* 6 OTP Boxes: 3 boxes, hyphen, 3 boxes */}
          <div className="mt-9 flex items-center justify-between gap-1.5 max-w-[340px]">
            {/* First group of 3 */}
            <div className="flex gap-2">
              {[0, 1, 2].map((idx) => {
                const char = otp[idx] || '';
                const isCurrent = otp.length === idx;
                return (
                  <div
                    key={idx}
                    className={`w-[42px] h-[50px] rounded-xl border flex items-center justify-center text-[22px] font-medium transition-all ${
                      char
                        ? 'border-gray-300 bg-white text-gray-900'
                        : isCurrent
                        ? 'border-[#FA5A2A] bg-white ring-1 ring-[#FA5A2A]/30'
                        : 'border-gray-200 bg-[#FAFAFA]'
                    }`}
                  >
                    {char ? (
                      char
                    ) : isCurrent ? (
                      <span className="w-[1.5px] h-6 bg-[#FA5A2A] animate-pulse" />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Separator hyphen */}
            <span className="text-gray-400 font-bold text-lg select-none px-0.5">-</span>

            {/* Second group of 3 */}
            <div className="flex gap-2">
              {[3, 4, 5].map((idx) => {
                const char = otp[idx] || '';
                const isCurrent = otp.length === idx;
                return (
                  <div
                    key={idx}
                    className={`w-[42px] h-[50px] rounded-xl border flex items-center justify-center text-[22px] font-medium transition-all ${
                      char
                        ? 'border-gray-300 bg-white text-gray-900'
                        : isCurrent
                        ? 'border-[#FA5A2A] bg-white ring-1 ring-[#FA5A2A]/30'
                        : 'border-gray-200 bg-[#FAFAFA]'
                    }`}
                  >
                    {char ? (
                      char
                    ) : isCurrent ? (
                      <span className="w-[1.5px] h-6 bg-[#FA5A2A] animate-pulse" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resend Timer Text */}
          <div className="mt-4">
            {secondsLeft > 0 ? (
              <p className="text-[13px] text-gray-400 font-normal">
                I didn&apos;t receive a code{' '}
                <span className="text-[#FA5A2A] font-medium">({formatTime(secondsLeft)})</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-[13px] text-[#FA5A2A] font-semibold hover:underline"
              >
                Resend code now
              </button>
            )}
          </div>

          {/* Continue CTA Button */}
          <div className="mt-24">
            <button
              type="button"
              onClick={() => onSuccess()}
              disabled={otp.length < 4}
              className={`w-full h-[52px] rounded-xl font-medium text-[16px] text-white shadow-md transition-all active:scale-[0.99] flex items-center justify-center ${
                otp.length >= 4
                  ? 'bg-[#FA5A2A] hover:bg-[#E84E20] shadow-orange-500/25 cursor-pointer'
                  : 'bg-[#FA5A2A]/70 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Numeric Keypad & Bottom Bar */}
      <div>
        <NumericKeypad onDigitPress={handleDigit} onBackspace={handleBackspace} />
        <HomeIndicator theme="dark" />
      </div>
    </div>
  );
};

