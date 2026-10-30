import React, { useState } from 'react';
import {
  Smartphone,
  LayoutGrid,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { MobileDeviceFrame } from '@/components/MobileDeviceFrame';
import { PhoneSignUpScreen } from '@/components/screens/PhoneSignUpScreen';
import { OtpVerificationScreen } from '@/components/screens/OtpVerificationScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { DishDetailScreen } from '@/components/screens/DishDetailScreen';

export default function App() {
  // Navigation state for interactive mode
  const [currentScreen, setCurrentScreen] = useState('signup');
  const [viewMode, setViewMode] = useState('all');
  const [userPhone, setUserPhone] = useState('12345 67890');

  // Handle flow transitions
  const handlePhoneSuccess = (phone) => {
    setUserPhone(phone);
    setCurrentScreen('otp');
  };

  const handleOtpSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSelectDish = () => {
    setCurrentScreen('dish');
  };

  const handleBackFromDish = () => {
    setCurrentScreen('home');
  };

  const handleBackFromOtp = () => {
    setCurrentScreen('signup');
  };

  const handleRestart = () => {
    setCurrentScreen('signup');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex flex-col font-sans">
      {/* Top Navigation Control Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5216] to-[#FA6B3A] flex items-center justify-center text-white shadow-sm shadow-orange-500/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-bold text-gray-900 tracking-tight leading-none">
                  Fastor Mobile App
                </h1>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Pure JavaScript + Tailwind CSS
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                React.js (JSX) & Tailwind CSS implementation
              </p>
            </div>
          </div>

          {/* View Mode & Screen Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#FA5A2A]" />
                All 4 Screens View
              </button>

              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'single'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-[#FA5A2A]" />
                Interactive Simulator
              </button>
            </div>

            {/* Direct Screen Selection Tabs (for interactive mode) */}
            {viewMode === 'single' && (
              <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-[12px] font-medium">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('signup')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentScreen === 'signup'
                      ? 'bg-white text-gray-900 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  1. Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('otp')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentScreen === 'otp'
                      ? 'bg-white text-gray-900 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  2. OTP Code
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('home')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentScreen === 'home'
                      ? 'bg-white text-gray-900 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  3. Home Feed
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('dish')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentScreen === 'dish'
                      ? 'bg-white text-gray-900 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  4. Dish Detail
                </button>
              </div>
            )}

            {/* Reset Flow Button */}
            <button
              type="button"
              onClick={handleRestart}
              title="Reset to Screen 1"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Showcase Canvas */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 py-8">
        {viewMode === 'all' ? (
          /* Side-by-Side 4-Screen Showcase (Replicating the original screenshot) */
          <div>
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#FA5A2A] text-[12px] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> High-Fidelity Responsive Design
              </span>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Complete 4-Screen Flow Overview
              </h2>
              <p className="text-gray-500 text-sm mt-1 max-w-xl mx-auto">
                All 4 screens are fully interactive. You can also switch to the{' '}
                <button
                  onClick={() => setViewMode('single')}
                  className="text-[#FA5A2A] font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Interactive Simulator
                </button>{' '}
                to test the complete user journey end-to-end.
              </p>
            </div>

            {/* 4 Mockup Devices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
              {/* Screen 1: Sign Up */}
              <MobileDeviceFrame label="1. Sign Up to Fastor" badge="Screen 1">
                <PhoneSignUpScreen
                  initialPhone=""
                  onSuccess={(phone) => {
                    setUserPhone(phone);
                    setViewMode('single');
                    setCurrentScreen('otp');
                  }}
                  onBack={() => {}}
                />
              </MobileDeviceFrame>

              {/* Screen 2: OTP Verification */}
              <MobileDeviceFrame label="2. 6-Digit Code" badge="Screen 2">
                <OtpVerificationScreen
                  phoneNumber="+91 12345 67890"
                  onSuccess={() => {
                    setViewMode('single');
                    setCurrentScreen('home');
                  }}
                  onBack={() => {
                    setViewMode('single');
                    setCurrentScreen('signup');
                  }}
                />
              </MobileDeviceFrame>

              {/* Screen 3: Home & Feed */}
              <MobileDeviceFrame label="3. Best Sellers & Feed" badge="Screen 3">
                <HomeScreen
                  onSelectDish={() => {
                    setViewMode('single');
                    setCurrentScreen('dish');
                  }}
                  onLogout={() => {
                    setViewMode('single');
                    setCurrentScreen('signup');
                  }}
                />
              </MobileDeviceFrame>

              {/* Screen 4: Dish Details */}
              <MobileDeviceFrame label="4. Dish Detail (Pizza)" badge="Screen 4">
                <DishDetailScreen
                  onBack={() => {
                    setViewMode('single');
                    setCurrentScreen('home');
                  }}
                />
              </MobileDeviceFrame>
            </div>
          </div>
        ) : (
          /* Single Interactive Device Simulator */
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FA5A2A]">
                  Step{' '}
                  {currentScreen === 'signup'
                    ? '1 of 4'
                    : currentScreen === 'otp'
                    ? '2 of 4'
                    : currentScreen === 'home'
                    ? '3 of 4'
                    : '4 of 4'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-[13px] font-medium text-gray-700 capitalize">
                  {currentScreen === 'signup' && 'Enter Phone Number'}
                  {currentScreen === 'otp' && 'Verify 6-digit OTP'}
                  {currentScreen === 'home' && 'Explore Restaurants & Offers'}
                  {currentScreen === 'dish' && 'Customize & Add to Cart'}
                </span>
              </div>
              <p className="text-[12px] text-gray-500">
                Tap on-screen keypad numbers, buttons, or banners to transition between screens
              </p>
            </div>

            <MobileDeviceFrame>
              {currentScreen === 'signup' && (
                <PhoneSignUpScreen
                  initialPhone=""
                  onSuccess={handlePhoneSuccess}
                  onBack={() => {}}
                />
              )}

              {currentScreen === 'otp' && (
                <OtpVerificationScreen
                  phoneNumber={userPhone}
                  onSuccess={handleOtpSuccess}
                  onBack={handleBackFromOtp}
                />
              )}

              {currentScreen === 'home' && (
                <HomeScreen
                  onSelectDish={handleSelectDish}
                  onLogout={() => setCurrentScreen('signup')}
                />
              )}

              {currentScreen === 'dish' && (
                <DishDetailScreen
                  onBack={handleBackFromDish}
                  onAddToCart={() => {}}
                />
              )}
            </MobileDeviceFrame>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-[12px] text-gray-500">
        <p>
          Fastor Food Delivery Frontend • Pure JavaScript (React.js JSX), Vite & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}

