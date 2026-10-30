import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { StatusBar } from '@/components/ui/StatusBar';
import { NumericKeypad } from '@/components/ui/NumericKeypad';
import { HomeIndicator } from '@/components/ui/HomeIndicator';

export const PhoneSignUpScreen = ({
  onSuccess,
  onBack,
  initialPhone = '',
}) => {
  const [phone, setPhone] = useState(initialPhone);

  const handleDigit = (digit) => {
    if (phone.length < 10) {
      setPhone((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPhone((prev) => prev.slice(0, -1));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (phone.length >= 4) {
      onSuccess(phone || '12345 67890');
    }
  };

  const formatPhone = () => {
    if (!phone) return '- 00000';
    if (phone.length <= 5) return phone;
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  const isValid = phone.length >= 4;

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Status Bar */}
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
            Sign Up to Fastor
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-[14px] text-gray-500 leading-relaxed max-w-[300px]">
            Let us know your mobile number and we will send you an OTP for verification.
          </p>

          {/* Phone Input Box */}
          <div className="mt-8">
            <div className="w-full h-[54px] rounded-xl border border-gray-200 bg-[#FBFBFC] px-4 flex items-center gap-3 shadow-inner">
              <span className="text-[17px] font-semibold text-gray-900 tracking-tight">
                +91
              </span>
              <span className="text-gray-300 font-light text-xl select-none">|</span>
              <div className="flex-1 text-[17px] tracking-wide font-normal">
                {phone ? (
                  <span className="text-gray-900 font-medium">{formatPhone()}</span>
                ) : (
                  <span className="text-gray-400 font-normal">{formatPhone()}</span>
                )}
                {/* Blinking cursor */}
                <span className="inline-block w-[1.5px] h-5 bg-[#FA5A2A] ml-1 align-middle animate-pulse" />
              </div>
            </div>
          </div>

          {/* Get OTP Button */}
          <div className="mt-20">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!isValid}
              className={`w-full h-[52px] rounded-xl font-medium text-[16px] text-white shadow-md transition-all active:scale-[0.99] flex items-center justify-center ${
                isValid
                  ? 'bg-[#FA5A2A] hover:bg-[#E84E20] shadow-orange-500/25 cursor-pointer'
                  : 'bg-[#FA5A2A]/70 cursor-not-allowed'
              }`}
            >
              Get OTP
            </button>
          </div>

          {/* Legal / Policy */}
          <p className="mt-4 text-center text-[11px] text-gray-400 font-normal leading-relaxed px-4">
            By clicking, I accept the{' '}
            <span className="text-gray-600 font-medium cursor-pointer hover:underline">
              Terms & Conditions
            </span>{' '}
            and{' '}
            <span className="text-gray-600 font-medium cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
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

